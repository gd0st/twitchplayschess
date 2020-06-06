const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolve = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
	packages: resolve('../'),
	root: resolve('.'),
	src: resolve('src'),
	index: resolve('src/index.ts'),
	node_modules: resolve('node_modules'),
	package_json: resolve('package.json'),
	tsconfig: resolve('tsconfig.json'),
	build: resolve('build'),
	public: resolve('public'),
	template: resolve('public/template.html'),
};

module.exports = paths;
