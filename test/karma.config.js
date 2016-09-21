var webpackConfig = require('../config/webpack.config.js');
webpackConfig.entry = {};

// Karma configuration
module.exports = function(config) {
  config.set({
    // ... normal karma configuration
    files: [
      // all files ending in ".spec"
      {pattern: '*.spec.js', watched: false},
      // each file acts as entry point for the webpack configuration
    ],
    frameworks: ["mocha"],
    browsers: ["Chrome"],

    preprocessors: {
      // add webpack as preprocessor
      '*.spec.js': ['webpack'],
    },
    reporters: [ 'mocha'],
    webpack: webpackConfig,

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    }
  });
};
