const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const resolve = require('resolve');

module.exports = {
	mode: 'development',
	entry: paths.index,
	devtool: 'inline-source-map',
	devServer: {
		contentBase: paths.build,
		hot: true,
	},
	module: {
		rules: [
			// First, run the linter.
			// It's important to do this before Babel processes the JS.
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				enforce: 'pre',
				use: [
					{
						loader: require.resolve('eslint-loader'),
						options: {
							cache: true,
							eslintPath: require.resolve('eslint'),
							// resolvePluginsRelativeTo: __dirname,
						},
					},
				],
				include: paths.src,
			},
			{
				// "oneOf" will traverse all following loaders until one will
				// match the requirements. When no loader matches it will fall
				// back to the "file" loader at the end of the loader list.
				oneOf: [
					// Process application JS with Babel.
					// The preset includes JSX, Flow, TypeScript, and some ESnext features.
					{
						test: /\.(js|mjs|jsx|ts|tsx)$/,
						include: paths.src,
						loader: require.resolve('babel-loader'),
					},
					// Process any JS outside of the app with Babel.
					// Unlike the application JS, we only compile the standard ES features.
					{
						test: /\.(js|mjs)$/,
						exclude: /@babel(?:\/|\\{1,2})runtime/,
						loader: require.resolve('babel-loader'),
						options: {
							babelrc: false,
							configFile: false,
							compact: false,
							cacheDirectory: true,
							// See #6846 for context on why cacheCompression is disabled
							cacheCompression: false,
							// Babel sourcemaps are needed for debugging into node_modules
							// code.  Without the options below, debuggers like VSCode
							// show incorrect code and set breakpoints on the wrong lines.
							sourceMaps: true,
							inputSourceMap: true,
						},
					},
					// css loader
					{
						test: /\.css$/i,
						use: [
							require.resolve('style-loader'),
							require.resolve('css-loader'),
						],
					},
					// raw file loader
					// This imports the contents of the file as a string.
					// If you add new extensions here, make sure to also add
					// them to file loader exclude list below.
					{
						test: /\.(frag|vert)$/,
						loader: require.resolve('raw-loader'),
					},
					// "file" loader makes sure those assets get served by WebpackDevServer.
					// When you `import` an asset, you get its (virtual) filename.
					// In production, they would get copied to the `build` folder.
					// This loader doesn't use a "test" so it will catch all modules
					// that fall through the other loaders.
					{
						loader: require.resolve('file-loader'),
						// Exclude `js` files to keep "css" loader working as it injects
						// its runtime that would otherwise be processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpack's internal loaders.
						exclude: [
							/\.(js|mjs|jsx|ts|tsx)$/,
							/\.(frag|vert)$/,
							/\.html$/,
							/\.json$/,
							/\.ejs$/,
						],
						options: {
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: '[name].bundle.js',
		path: paths.build,
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
		}),
		new ForkTsCheckerWebpackPlugin({
			typescript: resolve.sync('typescript', {
				basedir: paths.node_modules,
			}),
			async: process.env.NODE_ENV === 'development',
			useTypescriptIncrementalApi: true,
			checkSyntacticErrors: true,
			tsconfig: paths.tsconfig,
			reportFiles: [
				'**',
				'!**/__tests__/**',
				'!**/?(*.)(spec|test).*',
				'!**/src/setupProxy.*',
				'!**/src/setupTests.*',
			],
			silent: true,
		}),
	],
	performance: false,
	stats: 'minimal',
};
