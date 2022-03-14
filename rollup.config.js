// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const isProduction = process.env.NODE_ENV === 'production';
const packageJson = require('./package.json');

const plugins = [
	peerDepsExternal(),
	resolve({
		preferBuiltins: true,
	}),
	commonjs(),
	typescript({
		useTsconfigDeclarationDir: true,
	}),
	json(),
];

if (isProduction) {
	plugins.push(
		terser({
			output: {
				comments: isProduction ? false : undefined,
			},
		}),
	);
}

export default {
	input: 'src/index.ts',
	output: [
		{
			file: packageJson.main,
			format: 'cjs',
			sourcemap: isProduction,
		},
		{
			file: packageJson.module,
			format: 'esm',
			sourcemap: isProduction,
		},
	],
	plugins,
};
