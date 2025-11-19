import { describe, it } from 'bun:test';
import { strict as assert } from 'bun:assert';
import { LocationConflation } from '../src/location-conflation.ts';

const features = await Bun.file('test/fixtures/features.json').json();
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features);
locoNS.strict = false;


describe('resolveLocation', () => {

  describe('points', () => {
    it('a valid [lon, lat] Array returns a feature match', () => {
      const location = [0, 0];
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'point');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);               // result includes a `feature`
      assert.equal(result.feature.id, '[0,0]');                  // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);    // feature has `properties`
      assert.equal(result.feature.properties.id, '[0,0]');       // properties has an `id` property
      assert.equal(result.feature.properties.area, 1963.5);      // area = Pi * 25 * 25
    });

    it('a valid [lon, lat, radius] Array returns a feature match', () => {
      const location = [0, 0, 100];
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'point');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);               // result includes a `feature`
      assert.equal(result.feature.id, '[0,0,100]');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);    // feature has `properties`
      assert.equal(result.feature.properties.id, '[0,0,100]');   // properties has an `id` property
      assert.equal(result.feature.properties.area, 31415.93);    // area = Pi * 100 * 100
    });

    it('(strict mode) an invalid [lon, lat] Array throws an error', () => {
      const location = [];
      assert.throws(() => loco.resolveLocation(location));
    });

    it('(non strict mode) an invalid [lon, lat] Array returns null', () => {
      const location = [];
      assert.equal(locoNS.resolveLocation(location), null);
    });
  });


  describe('`.geojson` filenames', () => {
    it('a known `.geojson` filename with id returns a feature match', () => {
      const location = 'dc_metro.geojson';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                      // result includes a `feature`
      assert.equal(result.feature.id, 'dc_metro.geojson');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);           // feature has `properties`
      assert.equal(result.feature.properties.id, 'dc_metro.geojson');   // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');    // properties has a numeric `area` property
    });

    it('a known `.geojson` filename with id property returns a feature match', () => {
      const location = 'philly_metro.geojson';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                          // result includes a `feature`
      assert.equal(result.feature.id, 'philly_metro.geojson');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);               // feature has `properties`
      assert.equal(result.feature.properties.id, 'philly_metro.geojson');   // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');        // properties has a numeric `area` property
    });

    it('`.geojson` identifiers compare as lowercase', () => {
      const location = 'PHiLLy_MeTRo.GeoJSoN';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                          // result includes a `feature`
      assert.equal(result.feature.id, 'philly_metro.geojson');              // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);               // feature has `properties`
      assert.equal(result.feature.properties.id, 'philly_metro.geojson');   // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');        // properties has a numeric `area` property
    });

    it('(strict mode) an invalid `.geojson` filename throws an error', () => {
      const location = 'fake.geojson';
      assert.throws(() => loco.resolveLocation(location));
    });

    it('(non strict mode) an invalid `.geojson` filename returns null', () => {
      const location = 'fake.geojson';
      assert.equal(locoNS.resolveLocation(location), null);
    });
  });


  describe('country coder feature identifiers', () => {
    it('a valid country coder feature identifier returns a feature match', () => {
      const location = 'gb';
      const result = loco.resolveLocation(location);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'countrycoder');
      assert.equal(result.location, location);
      assert.ok(result.feature instanceof Object);                     // result includes a `feature`
      assert.equal(result.feature.id, 'Q145');                         // feature has an `id`
      assert.ok(result.feature.properties instanceof Object);          // feature has `properties`
      assert.equal(result.feature.properties.id, 'Q145');              // properties has an `id` property
      assert.equal(typeof result.feature.properties.area, 'number');   // properties has a numeric `area` property
    });

    it('(strict mode) an invalid country coder feature identifier throws an error', () => {
      const location = 'fake';
      assert.throws(() => loco.resolveLocation(location));
    });

    it('(non strict mode) an invalid country coder feature identifier returns null', () => {
      const location = 'fake';
      assert.equal(locoNS.resolveLocation(location), null);
    });
  });

});
