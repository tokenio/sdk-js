const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const {resolve, dirname} = require('path');

const {ENV: testEnv = 'dev'} = process.env;

module.exports = (env = 'node') => {
    const envConfig = {
        node: {
            target: 'node',
            context: resolve(dirname(__dirname)),
            externals: [nodeExternals()],
            node: {
                __dirname: true,
            },
        },
        browser: {
            externals: 'fs-extra',
        },
    };
    return {
        ...envConfig[env],
        mode: 'development',
        plugins: [
            new webpack.DefinePlugin({
                BROWSER: JSON.stringify(env === 'browser'),
                TEST_ENV: JSON.stringify(testEnv),
                TOKEN_VERSION: JSON.stringify(require('../package.json').version),
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
    };
};
