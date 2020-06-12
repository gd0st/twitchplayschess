const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');
const chalk = require('chalk');
const { execSync } = require('child_process');

const outputDirName = 'certs';
const outputFileName = 'server';
const outputDir = path.resolve(__dirname, '../' + outputDirName);

const install_script = {
	// linux
	linux: [
		// this should work on ubuntu
		`sudo cp ${outputDirName}/${outputFileName}.crt /usr/local/share/ca-certificates/${outputFileName}.crt`,
		'sudo update-ca-certificates',
	],
	// mac
	darwin: [
		`sudo security add-trusted-cert -d -p ssl -r trustRoot -k "/Library/Keychains/System.keychain" "${outputDirName}/${outputFileName}.crt"`,
	],
}[process.platform];

console.log(
	'THIS SHOULD ONLY BE USED FOR LOCAL DEVELOPMENT AND NOT IN A PRODUCTION ENVIRONMENT'
);
console.log();
console.log('Generating SSL certificate...');

const { private, cert } = selfsigned.generate(null, {
	keySize: 4096,
	countryName: 'US',
});

fs.writeFileSync(path.resolve(outputDir, `${outputFileName}.key`), private);
fs.writeFileSync(path.resolve(outputDir, `${outputFileName}.crt`), cert);

console.log(
	chalk.green(
		`✔️ Generated ${outputFileName}.key and ${outputFileName}.crt in ${outputDirName}/`
	)
);
console.log();

const fail_message = chalk.yellow(
	`*** You need to manually install and trust ${outputDirName}/${outputFileName}.crt ***`
);

if (install_script) {
	console.log('Installing SSL certificate...');
	console.log('');
	try {
		for (let i = 0; i < install_script.length; i++) {
			const cur = install_script[i];
			console.log(chalk.grey('$ ' + cur));
			execSync(cur, { stdio: 'inherit' });
			console.log();
		}
		console.log(chalk.green(`✔️ Installed SSL certificate`));
	} catch (e) {
		console.log();
		console.log(chalk.red('✖️ Install script failed'));
		console.log();
		console.log(fail_message);
	}
} else {
	console.log();
	console.log(fail_message);
}

console.log();
