# Decisions

## World locationSet is always registered (2026-04)

LocationConflation pre-registers the world location (`Q2`) and the locationSet `+[Q2]` on construction, and again after `clearFeatures()`, so the index never starts empty. `locationSetsAt()` returns `+[Q2]` for any valid point, even before callers register anything.

- **Why**: our world means any valid WGS84 coordinate (±180° lon, ±90° lat). CountryCoder's world is an aggregation of administrative boundaries, so it has gaps in open ocean and at the poles. We guarantee coverage for every valid point.
- **How**: `_setupWorld()` puts our own world polygon in `_resolved` for `Q2`, which replaces CountryCoder's. `locationSetsAt()` checks the point with `_isValidPoint()`, then adds `+[Q2]` unless that locationSet was explicitly excluded. Out-of-range coordinates match nothing.
- **Defensive lookup**: `CountryCoder.featuresContaining()` returns `[]` for unmapped areas rather than throwing, but `locationSetsAt()` wraps it in try/catch anyway because the check is cheap.
- **Accepted edge case**: a locationSet like `+[Q2]-[Q2]` validates and is indexed, but never matches any point. It's semantically valid, just useless, so we don't reject it.
