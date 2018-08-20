const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const {resolve, dirname} = require('path');

const {ENV: TEST_ENV = 'dev'} = process.env;

const targetConfig = {
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

module.exports = (target = 'node') => {
    return {
        ...targetConfig[target],
        mode: 'development',
        plugins: [
            new webpack.DefinePlugin({
                BROWSER: JSON.stringify(target === 'browser'),
                TEST_ENV: JSON.stringify(TEST_ENV),
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
