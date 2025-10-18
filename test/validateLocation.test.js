import { describe, it } from 'bun:test';
import { strict as assert } from 'bun:assert';
import { LocationConflation } from '../src/location-conflation.mjs';

const features = await Bun.file('test/fixtures/features.json').json();
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features);
locoNS.strict = false;


describe('validateLocation', () => {

  describe('points', () => {
    it('a valid [lon, lat] array returns a "point" result', () => {
      [[0, 0], [-180, -90], [180, -90], [180, 90]].forEach(val => {
        const result = loco.validateLocation(val);
        assert.ok(result instanceof Object);
        assert.equal(result.type, 'point');
        assert.equal(result.location, val);
        assert.equal(result.id, '[' + val.toString() + ']');
      });
    });

    it('a valid [lon, lat, radius] array returns a "point" result', () => {
      [[0, 0, 20], [-180, -90, 20], [180, -90, 20], [180, 90, 20]].forEach(val => {
        const result = loco.validateLocation(val);
        assert.ok(result instanceof Object);
        assert.equal(result.type, 'point');
        assert.equal(result.location, val);
        assert.equal(result.id, '[' + val.toString() + ']');
      });
    });

    it('(strict mode) an invalid [lon, lat, radius?] Array throws an error', () => {
      assert.throws(() => loco.validateLocation([]));
      assert.throws(() => loco.validateLocation(['a']));
      assert.throws(() => loco.validateLocation([0]));
      assert.throws(() => loco.validateLocation([-181, -90]));
      assert.throws(() => loco.validateLocation([-180, 91]));
      assert.throws(() => loco.validateLocation([181, -90]));
      assert.throws(() => loco.validateLocation([180, 91]));
      assert.throws(() => loco.validateLocation([10, 10, null]));
      assert.throws(() => loco.validateLocation([10, 10, -10]));
      assert.throws(() => loco.validateLocation([10, 10, 0]));
      assert.throws(() => loco.validateLocation([10, 10, 10, 10]));
    });

    it('(non strict mode) an invalid [lon, lat, radius?] Array returns null', () => {
      assert.equal(locoNS.validateLocation([]), null);
      assert.equal(locoNS.validateLocation(['a']), null);
      assert.equal(locoNS.validateLocation([0]), null);
      assert.equal(locoNS.validateLocation([-181, -90]), null);
      assert.equal(locoNS.validateLocation([-180, 91]), null);
      assert.equal(locoNS.validateLocation([181, -90]), null);
      assert.equal(locoNS.validateLocation([180, 91]), null);
      assert.equal(locoNS.validateLocation([10, 10, null]), null);
      assert.equal(locoNS.validateLocation([10, 10, -10]), null);
      assert.equal(locoNS.validateLocation([10, 10, 0]), null);
      assert.equal(locoNS.validateLocation([10, 10, 10, 10]), null);
    });
  });


  describe('`.geojson` filenames', () => {
    it('a valid `.geojson` identifier returns a "geojson" result', () => {
      ['philly_metro.geojson', 'dc_metro.geojson'].forEach(val => {
        const result = loco.validateLocation(val);
        assert.ok(result instanceof Object);
        assert.equal(result.type, 'geojson');
        assert.equal(result.location, val);
        assert.equal(result.id, val);
      });
    });

    it('(strict mode) an invalid `.geojson` identifier throws an error', () => {
      assert.throws(() => loco.validateLocation('philly_metro'));      // missing .geojson
      assert.throws(() => loco.validateLocation('fake.geojson'));      // fake filename
    });

    it('(non strict mode) an invalid `.geojson` identifier returns null', () => {
      assert.equal(locoNS.validateLocation('philly_metro'), null);     // missing .geojson
      assert.equal(locoNS.validateLocation('fake.geojson'), null);     // fake filename
    });

    it('`.geojson` identifiers compare as lowercase', () => {
      const result = loco.validateLocation('PHiLLy_MeTRo.GeoJSoN');
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'geojson');
      assert.equal(result.location, 'PHiLLy_MeTRo.GeoJSoN');
      assert.equal(result.id, 'philly_metro.geojson');
    });
  });


  describe('country coder feature identifiers', () => {
    it('a valid country coder identifier returns a "countrycoder" result', () => {
      ['GB', 'gb', 'gbr', '826', 826, 'Q145', '🇬🇧', 'united kingdom'].forEach(val => {
        const result = loco.validateLocation(val);
        assert.ok(result instanceof Object);
        assert.equal(result.type, 'countrycoder');
        assert.equal(result.location, val);
        assert.equal(result.id, 'Q145');
      });
    });

    it('(strict mode) an invalid country coder identifier throws an error', () => {
      assert.throws(() => loco.validateLocation(''));
      assert.throws(() => loco.validateLocation('false'));
      assert.throws(() => loco.validateLocation('null'));
    });

    it('(non strict mode) an invalid country coder identifier returns null', () => {
      assert.equal(locoNS.validateLocation(''), null);
      assert.equal(locoNS.validateLocation('false'), null);
      assert.equal(locoNS.validateLocation('null'), null);
    });
  });

});
