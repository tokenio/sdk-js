const {resolve, dirname} = require('path');
const webpack = require('webpack');

const libraryName = 'token-io';

const plugins = [];
var outputFile;
const env = process.env.WEBPACK_ENV;

if (env === 'build') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}
plugins.push(new webpack.DefinePlugin({
  BROWSER: JSON.stringify(true)
}));

module.exports = {
  entry: resolve(dirname(__dirname), 'src/index.js'),
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
