import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import {uglify} from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

const {
    ENV: env = 'node',
    FORMAT: format = 'cjs',
    TEST_ENV = 'dev',
} = process.env;

const isBrowser = env === 'browser';
const isModule = format === 'cjs' || format === 'esm';

const dest = {
    node: {
        cjs: pkg.main,
        esm: pkg.module,
    },
    browser: {
        cjs: 'dist/tokenio.browser.js',
        esm: 'dist/tokenio.browser.esm.js',
        iife: 'dist/tokenio.iife.min.js',
    },
};

const config = {
    input: 'src/index.js',
    output: {
        format,
        file: dest[env][format],
        indent: false,
    },
    plugins: [
        json(),
        babel({
            exclude: ['package.json', 'node_modules/**'],
            runtimeHelpers: true,
        }),
        replace({
            BROWSER: isBrowser,
            TEST_ENV,
            TOKEN_VERSION: JSON.stringify(pkg.version),
        }),
        filesize(),
    ],
};

if (isModule) {
    config.external = id => [...Object.keys(pkg.dependencies), 'core-js', 'regenerator']
        .some(dep => id.includes(dep));
} else {
    config.output.name = 'TokenIO';
    config.plugins.push(
        resolve({
            preferBuiltins: false,
            browser: true,
        }),
        commonjs({
            namedExports: {
                'protobufjs/minimal': ['roots', 'util'],
            },
        }),
        uglify({
            compress: {
                warnings: false,
            },
        }));
    config.onwarn = (warning, next) => {
        if (warning.code === 'EVAL' && /protobufjs/.test(warning.loc.file) ||
            warning.code === 'CIRCULAR_DEPENDENCY' && /protobufjs/.test(warning.importer)) {
            return;
        }
        next(warning);
    };
}

export default config;
