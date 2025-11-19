
await Promise.all([
   Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'browser',
    format: 'iife',
    sourcemap: 'linked',
    naming: 'location-conflation.iife.[ext]'  // .iife.js
  }),

  Bun.build({
    entrypoints: ['./src/location-conflation.ts'],
    outdir: './dist',
    target: 'node',
    format: 'cjs',
    external: ['*'],
    sourcemap: 'linked',
    naming: 'location-conflation.c[ext]'  // .cjs
  }),

  Bun.build({
    entrypoints: ['./src/location-conflation.ts'],
    outdir: './dist',
    target: 'node',
    format: 'esm',
    external: ['*'],
    sourcemap: 'linked',
    naming: 'location-conflation.m[ext]'  // .mjs
  })
]);
