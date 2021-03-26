const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
    context: __dirname,
    entry: ['./built/index.js'],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    devtool: debug ? 'source-map' : false,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true,
                        compact: !debug
                    }
                }
            }
        ],
    },
    target: 'node',
    plugins: [
        new webpack.DefinePlugin({'global.GENTLY': false}),
        new CopyPlugin({
            patterns: [
                { from: "tunnelhub.yml", to: "tunnelhub.yml" },
                { from: "Dockerfile", to: "." },
            ],
        }),
    ]
};