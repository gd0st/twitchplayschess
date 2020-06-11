const path = require('path');
const resolve = require('resolve');
const paths = require('./paths.js');
const webpack = require('webpack');
const entryPoints = require('./entrypoints.js');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_env, argv) => {
	let entry = {};

	const isDev = argv.mode === 'development';

	// edit webpack plugins here!
	let plugins = [
		new CleanWebpackPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			filename: isDev ? '[name].css' : '[name].[hash].css',
			chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
		}),
		new ForkTsCheckerWebpackPlugin({
			typescript: resolve.sync('typescript', {
				basedir: paths.node_modules,
			}),
			async: isDev,
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
			// silent: true,
			eslint: true,
			eslintOptions: require(paths.package_json).eslintConfig,
		}),
	];

	for (name in entryPoints) {
		if (entryPoints[name].build) {
			entry[name] = path.resolve(paths.src, entryPoints[name].path);
			// if (argv.mode === 'production') {
			plugins.push(
				new HtmlWebpackPlugin({
					inject: true,
					chunks: [name],
					template: path.resolve(
						paths.public,
						entryPoints[name].template
					),
					filename: entryPoints[name].outputHtml,
				})
			);
			// }
		}
	}

	const rules = [
		// First, run the linter.
		// It's important to do this before Babel processes the JS.
		// {
		// 	test: /\.(js|mjs|jsx|ts|tsx)$/,
		// 	enforce: 'pre',
		// 	use: [
		// 		{
		// 			loader: require.resolve('eslint-loader'),
		// 			options: {
		// 				cache: true,
		// 				eslintPath: require.resolve('eslint'),
		// 				// resolvePluginsRelativeTo: __dirname,
		// 			},
		// 		},
		// 	],
		// 	include: paths.src,
		// },
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
				// sass module loader
				{
					test: /\.module\.s(a|c)ss$/,
					loader: [
						isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								modules: true,
								sourceMap: isDev,
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isDev,
							},
						},
					],
				},
				// sass loader
				{
					test: /\.s(a|c)ss$/,
					exclude: /\.module.(s(a|c)ss)$/,
					loader: [
						isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isDev,
							},
						},
					],
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
	];

	let config = {
		//entry points for webpack- remove if not used/needed
		entry,
		optimization: {
			minimize: false, // this setting is default to false to pass review more easily. you can opt to set this to true to compress the bundles, but also expect an email from the review team to get the full source otherwise.
		},
		module: {
			rules,
		},
		resolve: { extensions: ['*', '.js', '.ts', '.tsx', '.scss'] },
		output: {
			filename: '[name].bundle.js',
			path: paths.build,
		},
		plugins,
	};

	if (isDev) {
		config.devServer = {
			contentBase: paths.public,
			host: argv.devrig ? 'localhost.rig.twitch.tv' : 'localhost',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			port: 8080,
		};
		config.devServer.https = true;
		config.stats = 'minimal';
	}
	if (argv.mode === 'production') {
		config.optimization.splitChunks = {
			cacheGroups: {
				default: false,
				vendors: false,
				vendor: {
					chunks: 'all',
					test: /node_modules/,
					name: false,
				},
			},
			name: false,
		};
	}

	return config;
};
