const {resolve, dirname} = require('path');
const webpack = require('webpack');
const fs = require('fs');
const nodeModules = {};

const libraryName = 'token-io.node';
const plugins = [];
var outputFile;
const env = process.env.WEBPACK_ENV;
const apiEnv = process.env.API_ENV === undefined ? 'local' : process.env.API_ENV;
let uriHost = '';
let uriHostBank = '';
switch (apiEnv) {
    case 'dev':
        uriHost = 'http://dev.api.token.io';
        uriHostBank = 'http://dev.api.token.io:81';
        break;
    case 'stg':
        uriHost = 'http://stg.api.token.io';
        uriHostBank = 'http://stg.api.token.io:81';
        break;
    case 'prd':
        uriHost = 'http://prd.api.token.io';
        uriHostBank = 'http://prd.api.token.io:81';
        break;
    case 'local':
    default:
        uriHost = 'http://localhost:8000';
        uriHostBank = 'http://localhost:8100';
        break;
}
if (env === 'build') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}
plugins.push(new webpack.DefinePlugin({
    BROWSER: JSON.stringify(false),
    URI_HOST: JSON.stringify(uriHost),
    URI_HOST_BANK: JSON.stringify(uriHostBank)
}));

fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    target: 'node',
    entry: resolve(dirname(__dirname), 'src/index.js'),
    output: {
        path: resolve(dirname(__dirname), 'dist'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: nodeModules,
    plugins,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|dist)/,
                loader: 'babel', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.proto$/,
                loader: 'proto-loader'
            }
        ]
    }
};
