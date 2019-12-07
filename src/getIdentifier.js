const isValidLocation = require('./isValidLocation.js');

// getIdentifier()
// generates a stable identifier for a location set
//
// pass a locations Object like:
// {
//   include: [ Array ],
//   exclude: [ Array ]
// }
//
function getIdentifier(locations, features) {
  locations = locations || {};
  let include = (locations.include || []).filter(l => isValidLocation(l, features));
  let exclude = (locations.exclude || []).filter(l => isValidLocation(l, features));

  if (include.length) {
    include.sort(compare);
  } else {
    include = ['001'];   // default to 'the world'
  }

  let id = '+' + JSON.stringify(include).toLowerCase();

  if (exclude.length) {
    exclude.sort(compare);
    id += '-' + JSON.stringify(exclude).toLowerCase();
  }

  return id;


  // it's ok to sort these lists because they all end up unioned together.
  function compare(a, b) {
    const rank = { countrycoder: 1, geojson: 2, point: 3 };
    const aRank = rank[isValidLocation(a, features)] || 4;
    const bRank = rank[isValidLocation(b, features)] || 4;

    if (aRank > bRank) return 1;
    if (aRank < bRank) return -1;

    // numeric sort point [lon,lat] locations
    if (aRank === 3 && bRank === 3) {
      return (a[0] - b[0] > 0) ? 1
        : (a[0] - b[0] < 0) ? -1
        : (a[1] - b[1]);
    }

    // lexical sort other identifiers
    return a.localeCompare(b);
  }
}

module.exports = getIdentifier;
