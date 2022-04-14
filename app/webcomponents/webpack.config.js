const path = require('path');

module.exports = {
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.(ts|js)$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-typescript"
						]
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.css$/i,
				use: [
					"to-string-loader",
					{
						loader: "css-loader",
						options: {
							esModule: false
						}
					}
				],
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		publicPath: '/dist/',
		port: 9000
	}
};