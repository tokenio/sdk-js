var webpackConfig = require('../config/webpack.config.js');
webpackConfig.entry = {};

// Karma configuration
module.exports = function (config) {
    config.set({
        client: {
            mocha: {
                timeout : 6000 // 6 seconds - upped from 2 seconds
            }
        },
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
            'src/**/*.js': ['webpack'],
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
