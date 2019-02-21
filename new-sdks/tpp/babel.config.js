module.exports = api => {
    api.cache.forever();
    const presets = [
        [
            '@babel/env',
            {
                targets: {node: 8},
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
