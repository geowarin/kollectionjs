import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

export default [
    {
        input: 'src/index.ts',
        output: {file: pkg.browser, format: 'umd'},
        name: 'Kollection',
        plugins: [
            typescript()
        ]
    },
    {
        input: 'src/index.ts',
        output: [
            { file: pkg.main, format: 'cjs' },
        ],
        plugins: [
            typescript({
                target: "es6"
            })
        ]
    },
    {
        input: 'src/index.ts',
        output: [
            {file: pkg.module, format: 'es'}
        ],
        plugins: [
            typescript()
        ]
    }
];
