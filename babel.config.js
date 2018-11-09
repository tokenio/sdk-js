const {TARGET = 'node'} = process.env;

const targets = {
    node: {
        node: 8, // LTS
    },
    browser: {
        ie: 11,
        edge: 16,
        chrome: 64,
        firefox: 59,
        safari: 11,
    },
};

module.exports = api => {
    api && api.cache(true);
    const presets = [
        [
            '@babel/env',
            {
                targets: targets[TARGET],
                useBuiltIns: 'usage',
                modules: false,
            },
        ],
        '@babel/flow',
    ];
    const plugins = [
        ['@babel/plugin-transform-runtime', {corejs: 2}],
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-object-rest-spread',
    ];

    return {
        presets,
        plugins,
    };
};
