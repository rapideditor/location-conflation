# Completed

## November 2026

- **Modernized the tooling for v4.** Switched from ESLint to oxlint (#84), which cut the dev dependency tree by more than half and cleared every `bun audit` advisory. Upgraded to TypeScript 7 (#85). Agent prompts moved to `.claude/skills/`, and project notes moved to `knowledge/`, via the agent-practices sync.
- **Fixed the published types** (#85). The `.d.ts` files used the global `GeoJSON` namespace without importing it, which breaks for TypeScript 7 consumers. Separately, `src/ambient.d.ts` had an import that never resolved, so some internal types were silently `any`. See `lessons.md`.
- **Made internal types match runtime behavior** (#85). `addFeatures()` now skips features without polygon geometry instead of mistyping or crashing on them, and `_clip()` returns a plain `MultiPolygon`.
- **Ship ESM only and check the package** (#86). Dropped the CommonJS build (see `decisions.md`), upgraded to country-coder 6 (also ESM-only), and added publint and arethetypeswrong to `bun run all`.
