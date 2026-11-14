# Decisions

## Ship ESM only (2026-11, v4)

v4 dropped the CommonJS build. The `require` condition in `exports` points at the same `.mjs` as `import`, and `require()` loads it on Node 20.19+ and 22.12+.

- **Why**: Node 18 and 20 are past end of life, and one build means one set of output with no dual-package hazards. country-coder 6 went ESM-only at the same time, so a CommonJS build would have had to `require()` an ES module anyway.
- **No `engines.node`**: Yarn 1 fails the install on a mismatch, even for a devDependency. The minimum Node version is in the README instead.
- **Keep it loadable by `require()`**: no top-level `await` in `src/`, and `require` must stay before `browser` in `exports`, or bundlers targeting browsers pick the IIFE, which has no exports.
- **IIFE bundle unchanged**: `dist/js/location-conflation.iife.js` keeps its path, because CDN users and the demo site load it by URL.

## World locationSet is always registered (2026-04)

LocationConflation pre-registers the world location (`Q2`) and the locationSet `+[Q2]` on construction, and again after `clearFeatures()`, so the index never starts empty. `locationSetsAt()` returns `+[Q2]` for any valid point, even before callers register anything.

- **Why**: our world means any valid WGS84 coordinate (±180° lon, ±90° lat). CountryCoder's world is an aggregation of administrative boundaries, so it has gaps in open ocean and at the poles. We guarantee coverage for every valid point.
- **How**: `_setupWorld()` puts our own world polygon in `_resolved` for `Q2`, which replaces CountryCoder's. `locationSetsAt()` checks the point with `_isValidPoint()`, then adds `+[Q2]` unless that locationSet was explicitly excluded. Out-of-range coordinates match nothing.
- **Defensive lookup**: `CountryCoder.featuresContaining()` returns `[]` for unmapped areas rather than throwing, but `locationSetsAt()` wraps it in try/catch anyway because the check is cheap.
- **Accepted edge case**: a locationSet like `+[Q2]-[Q2]` validates and is indexed, but never matches any point. It's semantically valid, just useless, so we don't reject it.
