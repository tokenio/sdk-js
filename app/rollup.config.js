import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import {uglify} from 'rollup-plugin-uglify';
const path = require('path');

import pkg from './package.json';

const {
    FORMAT = 'cjs',
} = process.env;

const isModule = FORMAT === 'cjs' || FORMAT === 'esm';

const dest = {
    cjs: pkg.main,
    esm: pkg.module,
    iife: 'dist/tokenio.iife.min.js',
};

const config = {
    input: 'src/index.js',
    external: ['buffer'],
    output: {
        format: FORMAT,
        file: dest[FORMAT],
        indent: false,
        globals: {
            'buffer': 'buffer',
        },
    },
    plugins: [
        json(),
        babel({
            exclude: /node_modules\/(?!(@token-io\/core)\/).*/,
            runtimeHelpers: true,
        }),
        replace({
            TOKEN_VERSION: JSON.stringify(pkg.version),
            TOKEN_MEMBER: JSON.stringify('js-user'),
        }),
        filesize(),
    ],
};

if (isModule) {
    config.plugins.push(resolve());
    config.external = id => [...Object.keys(pkg.dependencies), 'core-js', 'regenerator']
        .some(dep => dep !== '@token-io/core' && id.includes(dep));
} else {
    config.output.name = 'TokenClient';
    config.plugins.push(
        resolve({
            preferBuiltins: false,
            browser: true,
            customResolveOptions: {
                moduleDirectory: path.resolve(__dirname, 'node_modules'),
            },
        }),
        globals(),
        builtins(),
        commonjs(),
        uglify({
            warnings: false,
        }));
}

export default config;
