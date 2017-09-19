const {resolve, dirname} = require('path');
const webpack = require('webpack');

const libraryName = 'token-io';

const plugins = [];
var outputFile;
const env = process.env.WEBPACK_ENV;
const testEnv = process.env.TEST_ENV === undefined ? 'local' : process.env.TEST_ENV;

if (env === 'build') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}
plugins.push(new webpack.DefinePlugin({
    BROWSER: JSON.stringify(true),
    TEST_ENV: JSON.stringify(testEnv),
    TOKEN_VERSION: JSON.stringify(require("../package.json").version)
}));

module.exports = {
    entry: ['babel-regenerator-runtime', resolve(dirname(__dirname), 'src/index.js')],
    output: {
        path: resolve(dirname(__dirname), 'dist'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins,
    debug: true,
    node: {
        fs: 'empty'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|dist)/,
                loader: 'babel', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: ['es2015'],
                    plugins: ['babel-plugin-transform-regenerator']
                }
            },
            {test: /\.json$/, loader: 'json-loader'}
        ]
    }
};
