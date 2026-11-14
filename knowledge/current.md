# Current work

## v4.0.0 release

Everything for v4 has landed on `main` (see `completed.md`); what's left is `/release 4.0.0`. Breaking changes for the changelog:

- ⚠️ The CommonJS build is removed. `require()` loads the ES module instead, which needs Node 20.19+ or 22.12+.
- ⚠️ `addFeatures()` skips features without `Polygon`/`MultiPolygon` geometry. Point features used to be accepted, and a `null` geometry threw.
- ⚠️ An empty clip result (e.g. `include: ['de'], exclude: ['de']`) is now an empty `MultiPolygon`, not an empty `Polygon`.
- country-coder 6, which fixes invalid codes like `de-by` resolving to a real feature.
- The published types work for TypeScript 7 consumers, which don't load `@types/*` automatically.
