import { defineConfig } from 'rollup'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'

const projectRootDir = path.resolve(__dirname)

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: isProd ? 'dist/index.js' : 'example/dist/index.js',
    format: 'umd',
    name: 'wxapp-pro'
  },
  plugins: [
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(projectRootDir, 'src'),
        },
      ],
    }),
    resolve({
      extensions: ['.ts', '.js'],
    }),
    commonjs(),
    typescript(),
    babel({ babelHelpers: 'bundled' }),
    isProd && terser()
  ],
})
