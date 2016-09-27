var webpackConfig = require('../config/webpack.config.js');
webpackConfig.entry = {};

// Karma configuration
module.exports = function(config) {
  config.set({

    // ... normal karma configuration
    files: [

      // all files ending in ".spec"
      {pattern: 'src/**/*.js', watched: true},
      {pattern: '**/*.spec.js', watched: false}

      // each file acts as entry point for the webpack configuration
    ],
    frameworks: ['mocha'],
    browsers: ['Chrome'],
    autoWatchBatchDelay: 2000,

    preprocessors: {
      // add webpack as preprocessor
      '**/*.js': ['webpack'],
      '**/*.spec.js': ['webpack']
    },
    reporters: ['mocha'],
    webpack: webpackConfig,

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    }
  });
};
