const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const {resolve, dirname} = require('path');

const {ENV: TEST_ENV = 'dev'} = process.env;

module.exports = {
    target: 'node',
    context: resolve(dirname(__dirname)),
    externals: [nodeExternals({
        whitelist: ['@token-io/core'],
    })],
    node: {
        __dirname: true,
    },
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            TEST_ENV: JSON.stringify(TEST_ENV),
            TOKEN_VERSION: JSON.stringify(require('../package.json').version),
            TOKEN_MEMBER: JSON.stringify('js-tpp'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(@token-io\/core)\/).*/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};
