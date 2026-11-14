# Lessons

## `skipLibCheck` doesn't check `src/ambient.d.ts`

`skipLibCheck: true` skips every `.d.ts` file, including our own, not just the ones in `node_modules`. `src/ambient.d.ts` once imported `Vec2` from `'types.ts'`, a module name that never resolved, so `circle-to-polygon` and `which-polygon` silently took `any` for their coordinates, and `tsc` stayed green.

After editing `src/ambient.d.ts`, check it with `bunx tsc --noEmit --skipLibCheck false` and ignore the errors from `node_modules` (`bun-types` and `@types/node` conflict with each other).

## Ambient module declarations can't use relative imports

Inside `declare module 'x' { … }`, `import type { Vec2 } from './types.ts'` is an error (TS2439). Define small types like coordinate tuples inline in each block instead. Imports from packages (`'geojson'`) are fine.

## Published types must import what they use

The published `.d.ts` files once used the global `GeoJSON` namespace without importing it. That only resolves when `@types/geojson` is loaded automatically, which TypeScript 7 consumers no longer do. Having `@types/geojson` in `dependencies` isn't enough on its own: write `import type * as GeoJSON from 'geojson'` in any source file whose exported types use it. Our own build doesn't catch this, because `src/ambient.d.ts` loads `@types/geojson` for every file. To check, type-check a scratch consumer with `"types": []` and `skipLibCheck: false`.
