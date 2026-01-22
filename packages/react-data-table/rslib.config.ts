import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: true,
      output: {
        distPath: './dist',
      },
    },
    {
      format: 'cjs',
      output: {
        distPath: './dist',
      },
    },
  ],
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  output: {
    target: 'web',
  },
});
