const spawn = require('cross-spawn');
const chalk = require('chalk');
const path = require('path');

const script_name = process.argv.slice(2).join(' ').trim();

if (script_name.length === 0) {
	console.error('no script name was provided');
	return;
}

const colors = [chalk.green, chalk.cyan, chalk.blue];

var workspacesFound = false;

var processes = [];

function killAll() {
	processes.forEach((proc) => proc.kill());
}

function exit() {
	killAll();
	process.exit();
}

// get workspaces info from yarn
const yarncmd = spawn('yarn', ['workspaces', 'info']);

yarncmd.stdout.on('data', (data) => {
	// start of the json
	if (data[0] === 0x7b) {
		workspacesFound = true;

		let workspaces;

		try {
			workspaces = JSON.parse(data.toString());
		} catch (error) {
			console.error(error);
		}

		try {
			process.on('exit', () => killAll());
			process.on('SIGINT', () => exit());
			process.on('SIGTERM', () => exit());

			start(workspaces);
		} catch (error) {
			console.error(error);

			killAll();
		}
	}
});

yarncmd.on('close', () => {
	if (!workspacesFound) {
		console.error("'yarn workspaces info' did not return json");
	}
});

function start(workspaces) {
	let maxNameLength = 0;

	const shortNames = Object.keys(workspaces).map((ws) => {
		const splitName = ws.split('/');
		const shortName = splitName[splitName.length - 1];
		maxNameLength = Math.max(maxNameLength, shortName.length);
		return shortName;
	});

	let previousOutput = '';
	let previousColor = null;

	Object.keys(workspaces).forEach((ws, i) => {
		const packagejson = require(path.resolve(
			process.cwd(),
			workspaces[ws].location,
			'package.json'
		));

		const script = packagejson.scripts[script_name];

		if (!script) {
			console.log(
				chalk.red(
					`${workspaces[ws].location} does not have a script named "${script_name}" in package.json`
				)
			);
			return;
		}

		let proc;

		if (script.startsWith('python')) {
			const split = script.split(' ');

			proc = spawn(split[0], split.slice(1), {
				cwd: workspaces[ws].location,
				env: Object.assign(process.env, {
					PYTHONUNBUFFERED: true,
				}),
			});

			console.log(chalk.gray(`${workspaces[ws].location} > ${script}`));
		} else {
			proc = spawn('yarn', ['run', script_name], {
				cwd: workspaces[ws].location,
				env: Object.assign(process.env, {
					FORCE_COLOR: chalk.level,
				}),
			});

			console.log(
				chalk.gray(
					`${workspaces[ws].location} > yarn run ${script_name}`
				)
			);
		}

		processes.push(proc);

		const shortname = shortNames[i];
		const color = colors[i % colors.length];

		// const prefix = color(
		// 	`  ${shortname} ${' '.repeat(maxNameLength - shortname.length + 3)}`
		// );
		// const prefixbg = color(' ') + ' ';
		// const prefixend = '';

		// const prefix = color(
		// 	`┌- ${shortname} ${'-'.repeat(
		// 		maxNameLength - shortname.length + 3
		// 	)}`
		// );
		// const prefixbg = color('|') + ' ';
		// const prefixend = `└${'-'.repeat(maxNameLength + 6)}`;

		// const handle = (data) => {
		// 	let lines = data.toString().split('\n');

		// 	for (let i = 0; i < lines.length; i++) {
		// 		if (previousOutput !== shortname) {
		// 			previousOutput = shortname;
		// 			if (previousColor)
		// 				// process.stdout.write(previousColor(prefixend));
		// 				previousColor = color;
		// 			process.stdout.write('\n');
		// 			process.stdout.write(prefix);
		// 			process.stdout.write('\n');
		// 		}
		// 		if (lines[i].length === 0) continue;

		// 		process.stdout.write(prefixbg);
		// 		process.stdout.write(lines[i]);
		// 		process.stdout.write('\n');
		// 	}
		// };

		const prefix = '';

		const prefixbg =
			color(
				`${shortname} ${' '.repeat(maxNameLength - shortname.length)}`
			) + '| ';
		// const prefixbg = color(shortname) + ': ';
		const prefixend = '';

		const handle = (data) => {
			let lines = data.toString().split('\n');

			for (let i = 0; i < lines.length; i++) {
				// if (previousOutput !== shortname) {
				// 	previousOutput = shortname;
				// 	if (previousColor)
				// 		// process.stdout.write(previousColor(prefixend));
				// 		previousColor = color;
				// 	process.stdout.write('\n');
				// 	process.stdout.write(prefix);
				// 	process.stdout.write('\n');
				// }
				if (lines[i].length === 0) continue;

				process.stdout.write(prefixbg);
				process.stdout.write(lines[i]);
				process.stdout.write('\n');
			}
		};

		if (proc.stdout && proc.stderr) {
			proc.stdout.setEncoding('utf8');
			proc.stderr.setEncoding('utf8');
			proc.stdout.on('data', handle);
			proc.stderr.on('data', handle);
		}
	});
}
