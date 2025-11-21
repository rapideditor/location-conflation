# What's New

**location-conflation** is an open source project. You can submit bug reports, help out,
or learn more by visiting our project page on GitHub:  :octocat: https://github.com/rapideditor/location-conflation

Please star our project on GitHub to show your support! ⭐️

_Breaking changes, which may affect downstream projects, are marked with a_ ⚠️


<!--
# A.B.C
##### YYYY-MMM-DD
*

[#xxx]: https://github.com/rapideditor/location-conflation/issues/xxx
-->

# 2.0.0
##### 2025-Nov-21
* Switch the project code to TypeScript
* ⚠️  While everything should backward compatible, generated files have moved:
  * `dist/js/*` - Built JavaScript files
  * `dist/ts/*` - Built TypeScript declaration file
* Update all dependencies


# 1.7.0
##### 2025-Oct-21
* This project uses [`bun`](https://bun.com/) now, for simpler developer tooling ([#71])
* ⚠️  This also restores the previous named export - shouldn't need `.default` anymore ([#68])
* Update country-coder to v5.6.0

[#71]: https://github.com/rapideditor/location-conflation/issues/71


# 1.6.0
##### 2025-Jul-18
* Test against Node 24
* Update country-coder to v5.5.1


# 1.5.0
##### 2025-Apr-28
* Drop support for Node 18
* Update country-coder to v5.4.0


# 1.4.1
##### 2024-Dec-13
* Update country-coder to v5.3.1


# 1.4.0
##### 2024-Jul-17
* Update country-coder to v5.3.0


# 1.3.0
##### 2023-Sep-18
* ⚠️  Use a named export for ESM, 'default' export for CJS/IIFE ([#68])
* ⚠️  Change `.strict()` to a normal class property.  Also remove `.cache()` accessor
* Replace mfogel/polygon-clipping with luizbarboza/polyclip-ts ([#67])
* Fix map on https://location-conflation.com ([#66])
* Bump dependency versions
* Supported engines now `"node": ">=18"`

[#68]: https://github.com/rapideditor/location-conflation/issues/68
[#67]: https://github.com/rapideditor/location-conflation/issues/67
[#66]: https://github.com/rapideditor/location-conflation/issues/66


# 1.2.1
##### 2023-Jul-12
* Update country-coder to v5.2.1


# 1.2.0
##### 2023-Mar-12
* Bump dependency versions
* Switch location-conflation to a scoped package under the rapideditor org: `@rapideditor/location-conflation`
  * ⚠️ Note: projects that depend on location-conflation may need to update their code


# 1.1.0
##### 2022-Dec-09
* Update country-coder to v5.1


# 1.0.2
##### 2021-Jun-24
* Remove "browser" from the export map


# 1.0.1
##### 2021-Jun-17
* Add an export map to `package.json`, fix file extensions again


# 1.0.0
##### 2021-Jun-17
* ⚠️  Initial stable release
  * Note: Built files will no longer be checked into GitHub
* ⚠️  Replace microbundle with [esbuild](https://esbuild.github.io/) for super fast build speed. Package outputs are now:
  * `"module": "./index.mjs"` - ESM, modern JavaScript, works with `import`
  * `"main": "./dist/location-conflation.cjs"` - CJS bundle, modern JavaScript, works with `require()`
  * `"browser": "./dist/location-conflation.iife.js"` - IIFE bundle, modern JavaScript, works in browser `<script>` tag
  * No longer distributing ES5 builds
* ⚠️  location-conflation is marked as `"type": "module"` now
* ⚠️  Dropped support for old browsers like Internet Explorer on https://ideditor.codes
* Update to country-coder v5.0


# 0.9.0
##### 2021-Jun-05
* Update to country-coder v4.1


# 0.8.0
##### 2021-Mar-27
* Add support for optional `radius` value for point locations.
  * Radius is specified in kilometers and is optional. If not specified, it will default to a 25km radius.


# 0.7.0
##### 2020-Dec-30
* Perf improvement: Don't union features iteratively with locationReducer ([#26])

[#26]: https://github.com/rapideditor/location-conflation/issues/26


# 0.6.0
##### 2020-Oct-26
* Update to country-coder v4


# 0.5.0
##### 2020-Aug-25
* ⚠️  Refactor - API now has:
  * `validateLocation` / `validateLocationSet` - fast, return stable ids
  * `resolveLocation` / `resolveLocationSet` - slower, resolve GeoJSON features
  * All functions now return similar result objects
* :warning: Introduce strict / non-strict modes.  Location-conflation defaults to "strict" mode now.
  * In strict mode, any invalid location or locationSet throws an error.
  * In non strict mode, invalid locations are ignored, and locationSets that include nothing are assumed to include the entire world.
  * Can change modes by calling `.strict(val)`, for example:<br/>
    `const loco = new LocationConflation(features).strict(false);    // not strict`
* Add tests and document everything


# 0.4.0
##### 2020-Aug-20
* Replace turf with mfogel/polygon-clipping ([#1], [#2], [#20])
* Include `stringify` convenience method
* Update country-coder and other dependencies

[#20]: https://github.com/rapideditor/location-conflation/issues/20
[#2]: https://github.com/rapideditor/location-conflation/issues/2
[#1]: https://github.com/rapideditor/location-conflation/issues/1


# 0.3.0
##### 2020-Feb-13
* Use uppercase Wikidata identifiers, lowercase geojson filenames
* Handle cases like UK which have both members _and_ geometry ([#4])
* :warning: Breaking changes: several function renames and changes to internals
  * `locationToFeature()` -> `resolveLoation()`
  * `isValidLocation()` -> `validateLocation()`
  * Copy country-coder features rather than modifying inplace (less hacky)
  * Use wikidata identifiers as the country coder feature ids and cache keys now
* Update country-coder dependency

[#4]: https://github.com/rapideditor/location-conflation/issues/4


# 0.2.0
##### 2020-Jan-15
* Ensure that feature results always have both `id` and `properties.id`


# 0.1.0
##### 2020-Jan-13
* Initial release
