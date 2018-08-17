module.exports = (api) => {
    api && api.cache(true);
    const presets = [
        [
            '@babel/env',
            {
                targets: {
                    ie: 11,
                    edge: 16,
                    chrome: 64,
                    firefox: 59,
                    safari: 11,
                },
                useBuiltIns: 'usage',
                modules: false,
            },
        ],
        '@babel/flow',
    ];
    const plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-object-rest-spread',
    ];

    return {
        presets,
        plugins,
    };
};
