// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    './src',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*.mock.*',
    '!src/tests',
  ],
  outDir: './dist',
})
