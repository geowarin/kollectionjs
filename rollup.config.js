import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: "dist/kollection-js.umd.es6.js",
            format: 'umd'
        },
        name: 'Kollection',
        plugins: [
            typescript({
                target: "esnext"
            })
        ]
    }
];
