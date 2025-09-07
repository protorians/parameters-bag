import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  entry: ['source/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  target: 'node22',
  outDir: 'build',
  splitting: false,
  shims: false,
  sourcemap: false,
  minify: false,
  outExtension: ({ format }) => {
    if (format === 'cjs') return { cjs: '.cjs' } as any;
    return { js: '.mjs' } as any;
  },
  watch,
}))
