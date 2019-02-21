const targets = {
    ie: 11,
    edge: 16,
    chrome: 64,
    firefox: 59,
    safari: 11,
};

module.exports = api => {
    api.cache.forever();
    const presets = [
        [
            '@babel/env',
            {
                targets,
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
