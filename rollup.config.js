import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import {uglify} from 'rollup-plugin-uglify';

import pkg from './package.json';

const {TEST_ENV = 'dev', NODE_ENV: env = 'development'} = process.env;

const isEsm = env === 'esm';
const isCjs = env === 'cjs';
const isDev = env === 'development';
const isPrd = env === 'production';

const config = {
    input: 'src/index.js',
    external: [],
    plugins: [
        json(),
        babel({
            exclude: ['package.json', 'node_modules/**'],
            runtimeHelpers: true,
        }),
        replace({
            BROWSER: isDev || isPrd,
            TEST_ENV,
            TOKEN_VERSION: JSON.stringify(pkg.version),
        }),
        filesize(),
    ],
    onwarn: warning => {
        // Silence circular dependency warning for protobufjs
        if (warning.code !== 'CIRCULAR_DEPENDENCY' || !warning.importer.indexOf('node_modules\\protobufjs\\')) {
            console.warn(`(!) ${warning.message}`); // eslint-disable-line
        }
    },
};

if (isEsm || isCjs) {
    config.output = {
        format: env,
        file: isEsm ? pkg.module : pkg.main,
        indent: false,
    };
    config.external = id =>
        [...Object.keys(pkg.dependencies), 'core-js', 'regenerator'].some(dep => id.includes(dep));
}

if (isDev || isPrd) {
    config.output = {
        format: 'umd',
        file: isDev ? pkg.browser : `${pkg.browser.slice(0, -3)}.min.js`,
        name: 'tokenio',
        indent: false,
    };
    config.external.push('es6-promise');
    const umdPlugins = [
        resolve({
            preferBuiltins: false,
            browser: true,
        }),
        commonjs({
            namedExports: {
                'node_modules/protobufjs/minimal.js': ['util', 'roots'],
            },
        }),
        isPrd && uglify({
            compress: {
                warnings: false,
            },
        }),
    ].filter(Boolean);
    config.plugins.push(...umdPlugins);
}

export default config;
