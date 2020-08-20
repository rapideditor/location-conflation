# What's New

**location-conflation** is an open source project. You can submit bug reports, help out,
or learn more by visiting our project page on GitHub:  :octocat: https://github.com/ideditor/location-conflation

Please star our project on GitHub to show your support! :star:

_Breaking changes, which may affect downstream projects, are marked with a_ :warning:


<!--
# A.B.C
##### YYYY-MMM-DD
*

[#xxx]: https://github.com/ideditor/location-conflation/issues/xxx
-->

# 0.4.0
##### 2020-Aug-20
* Replace turf with mfogel/polygon-clipping ([#1], [#2], [#20])
* Include `stringify` convenience method
* Update country-coder and other dependencies

[#20]: https://github.com/ideditor/location-conflation/issues/20
[#2]: https://github.com/ideditor/location-conflation/issues/2
[#1]: https://github.com/ideditor/location-conflation/issues/1


## 0.3.0
##### 2020-Feb-13
* Use uppercase Wikidata identifiers, lowercase geojson filenames
* Handle cases like UK which have both members _and_ geometry ([#4])
* :warning: Breaking changes: several function renames and changes to internals
  * `locationToFeature()` -> `resolveLoation()`
  * `isValidLocation()` -> `validateLocation()`
  * Copy country-coder features rather than modifying inplace (less hacky)
  * Use wikidata identifiers as the country coder feature ids and cache keys now
* Update country-coder dependency

[#4]: https://github.com/ideditor/location-conflation/issues/4


## 0.2.0
##### 2020-Jan-15
* Ensure that feature results always have both `id` and `properties.id`


## 0.1.0
##### 2020-Jan-13
* Initial release
