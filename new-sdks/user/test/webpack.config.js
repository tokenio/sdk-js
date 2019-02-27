const {resolve, dirname} = require('path');
const webpack = require('webpack');
const {ENV: TEST_ENV = 'dev'} = process.env;

module.exports = {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            TEST_ENV: JSON.stringify(TEST_ENV),
            TOKEN_VERSION: JSON.stringify('1.0.0'),
        }),
    ],
    resolve: {
        modules: [
            resolve(dirname(__dirname), 'node_modules'),
        ],
        symlinks: false,
    },
    node: {
        fs: 'empty',
    },
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
