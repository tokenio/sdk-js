module.exports = config => {
    config.set({
        client: {
            mocha: {
                timeout: 30000,
            },
        },
        files: [
            {pattern: '**/*.browserspec.js', watched: false},
            {pattern: '**/*.spec.js', watched: false},
        ],
        frameworks: ['mocha'],
        browsers: ['Chrome'],
        autoWatchBatchDelay: 2000,
        browserNoActivityTimeout: 30000,
        preprocessors: {
            '**/*.browserspec.js': ['webpack'],
            '**/*.spec.js': ['webpack'],
        },
        reporters: ['mocha'],
        webpack: require('./webpack.config')('browser'),
        logLevel: config.LOG_INFO,
        browserConsoleLogOptions: {
            level: 'log',
            terminal: true,
        },
    });
};
