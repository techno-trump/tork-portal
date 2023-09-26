import fs from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FileIncludeWebpackPlugin from 'file-include-webpack-plugin-replace';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";
import getEntryPoints from "./entry.js";

import * as path from 'path';

const srcFolder = "src";
const builFolder = "dist";
const rootFolder = path.basename(path.resolve());

let pugPages = fs.readdirSync(srcFolder).filter(fileName => fileName.endsWith('.pug'))
let htmlPages = [];

if (!pugPages.length) {
	htmlPages = [new FileIncludeWebpackPlugin({
		source: srcFolder,
		htmlBeautifyOptions: {
			"indent-with-tabs": true,
			'indent_size': 3
		},
		replace: [
			{ regex: /\<link rel=\"stylesheet\" href=\"css\/.*\.min\.css\"\>/, to: '' },
			{ regex: "undefined", to: '' },
			{ regex: "undefined_", to: '' },
			{ regex: '../img', to: 'img' },
			{ regex: '@img', to: 'img' },
			{ regex: 'NEW_PROJECT_NAME', to: rootFolder }
		],
	})];
}

const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(builFolder)
}
const config = {
	mode: "development",
	devtool: 'inline-source-map',
	optimization: {
		minimize: false
	},
	entry: getEntryPoints(paths.src, "dev"),
	output: {
		path: `${paths.build}`,
		filename: 'js/[name].js',
		publicPath: '/'
	},
	devServer: {
		historyApiFallback: true,
		static: paths.build,
		open: true,
		compress: true,
		port: 'auto',
		hot: true,
		host: 'local-ip', // localhost

		// Расскоментировать на слабом ПК
		// (в режиме разработчика, папка с результаттом будет создаваться на диске)
		///*
		devMiddleware: {
			writeToDisk: true,
			publicPath: path.build,
		},
		//*/

		watchFiles: [
			`${paths.src}/**/*.html`,
			`${paths.src}/**/*.pug`,
			`${paths.src}/**/*.htm`,
			`${paths.src}/img/**/*.*`
		],
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', { targets: "> 0.25%, not dead" }]
						]
					}
				}
			},
			{
				test: /\.(scss|css)$/,
				exclude: `${paths.src}/fonts`,
				use: [
					'style-loader',
					//MiniCssExtractPlugin.loader,
					{
						loader: 'string-replace-loader',
						options: {
							search: '@img',
							replace: '../img',
							flags: 'g'
						}
					}, {
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1,
							modules: false,
							url: {
								filter: (url, resourcePath) => {
									if (url.includes("img/") || url.includes("fonts/")) {
										return false;
									}
									return true;
								},
							},
						},
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						}
					}
				],
			}, {
				test: /\.pug$/,
				use: [
					{
						loader: 'pug-loader'
					}, {
						loader: 'string-replace-loader',
						options: {
							search: '@img',
							replace: 'img',
							flags: 'g'
						}
					}
				]
			}
		],
	},
	plugins: [
		...htmlPages,
		...pugPages.map(pugPage => new HtmlWebpackPlugin({
			minify: false,
			template: `${srcFolder}/${pugPage}`,
			filename: `${pugPage.replace(/\.pug/, '.html')}`
		})),
		new MiniCssExtractPlugin({
			filename: 'css/[name].min.css',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: `${srcFolder}/img`, to: `img`,
					noErrorOnMissing: true,
					force: true
				}, {
					from: `${srcFolder}/files`, to: `files`,
					noErrorOnMissing: true,
					force: true
				}, {
					from: `${paths.src}/favicon.ico`, to: `./`,
					noErrorOnMissing: true
				},
				{
					from: `${srcFolder}/libs`, to: `./libs`,
					noErrorOnMissing: true,
					force: true
				}
			],
		}),
	],
	resolve: {
		alias: {
			"@scss": `${paths.src}/scss`,
			"@js": `${paths.src}/js`,
			"@img": `${paths.src}/img`
		},
	},
}
export default config;