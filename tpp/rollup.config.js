import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

const {
    FORMAT = 'cjs',
} = process.env;

const dest = {
    cjs: pkg.main,
    esm: pkg.module,
};

const config = {
    input: 'src/index.js',
    output: {
        format: FORMAT,
        file: dest[FORMAT],
        indent: false,
    },
    plugins: [
        json(),
        babel({
            exclude: /node_modules\/(?!(@token-io\/core)\/).*/,
            runtimeHelpers: true,
        }),
        replace({
            TOKEN_VERSION: JSON.stringify(pkg.version),
            TOKEN_MEMBER: JSON.stringify('js-tpp'),
        }),
        resolve({preferBuiltins: false}),
        filesize(),
    ],
    external: id => [...Object.keys(pkg.dependencies), 'core-js', 'regenerator']
        .some(dep => dep !== '@token-io/core' && id.includes(dep)),
};

export default config;
