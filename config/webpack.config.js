const { resolve, dirname } = require('path')

module.exports = {
    entry: resolve(dirname(__dirname), "src/index.js"),
    output: {
        path: resolve(dirname(__dirname), "dist"),
        filename: "token.js"
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel', // 'babel-loader' is also a valid name to reference
              query: {
                presets: ['es2015']
              }
            }
        ]
    }
};
