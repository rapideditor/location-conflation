import { describe, it } from 'bun:test';
import { strict as assert } from 'bun:assert';
import { LocationConflation } from '../src/location-conflation.ts';

const features = await Bun.file('test/fixtures/features.json').json();
const loco = new LocationConflation(features);
const locoNS = new LocationConflation(features);
locoNS.strict = false;


describe('validateLocationSet', () => {

  describe('empty locationSet', () => {
    it('(strict mode) empty locationSet throws an error', () => {
      const locationSet = { };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) empty locationSet defaults to world (Q2)', () => {
      const locationSet = { };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]');
    });
  });


  describe('country coder feature identifiers', () => {
    it('sorts included countrycoder locations', () => {
      const locationSet = { include: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q18,Q27611]');
    });

    it('(strict mode) fake included countrycoder locations throw an error', () => {
      const locationSet = { include: ['013', 'fake', '005'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) fake included countrycoder locations are ignored', () => {
      const locationSet = { include: ['013', 'fake', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q18,Q27611]');
    });

    it('sorts excluded countrycoder locations', () => {
      const locationSet = { include: ['001'], exclude: ['013', '005'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[Q18,Q27611]');
    });

    it('(strict mode) fake excluded countrycoder locations throw an error', () => {
      const locationSet = { include: ['001'], exclude: ['013', 'fake', '005'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) fake excluded countrycoder locations are ignored', () => {
      const locationSet = { include: ['001'], exclude: ['013', 'fake', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[Q18,Q27611]');
    });

    it('(strict mode) missing include throws an error', () => {
      const locationSet = { exclude: ['013', '005'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) missing include is replaced with world', () => {
      const locationSet = { exclude: ['013', '005'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[Q18,Q27611]');
    });
  });


  describe('`.geojson` filenames', () => {
    it('sorts included .geojson locations', () => {
      const locationSet = { include: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[dc_metro.geojson,philly_metro.geojson]');
    });

    it('(strict mode) fake included .geojson locations throw an error', () => {
      const locationSet = { include: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) fake included .geojson locations are ignored', () => {
      const locationSet = { include: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[dc_metro.geojson,philly_metro.geojson]');
    });

    it('sorts excluded .geojson locations', () => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'dc_metro.geojson'] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
    });

    it('(strict mode) fake excluded .geojson locations throw an error', () => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) fake excluded .geojson locations are ignored', () => {
      const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', 'fake.geojson', 'dc_metro.geojson'] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[dc_metro.geojson,philly_metro.geojson]');
    });

  });


  describe('points', () => {
    it('sorts included point locations', () => {
      const locationSet = { include: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[[0,0],[0,1],[1,0],[1,1]]');
    });

    it('(strict mode) fake included point locations throw an error', () => {
      const locationSet = { include: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) fake included point locations are ignored', () => {
      const locationSet = { include: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[[0,0],[0,1],[1,0],[1,1]]');
    });

    it('sorts excluded point locations', () => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [1, 1], [0, 0]] };
      const result = loco.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
    });

    it('(strict mode) fake excluded point locations throw an error', () => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      assert.throws(() => loco.resolveLocationSet(locationSet));
    });

    it('(non strict mode) fake excluded point locations are ignored', () => {
      const locationSet = { include: ['001'], exclude: [[1, 0], [0, 1], [NaN, NaN], [1, 1], [0, 0]] };
      const result = locoNS.resolveLocationSet(locationSet);
      assert.ok(result instanceof Object);
      assert.equal(result.type, 'locationset');
      assert.equal(result.locationSet, locationSet);
      assert.equal(result.id, '+[Q2]-[[0,0],[0,1],[1,0],[1,1]]');
    });
  });


  it('sorts included countrycoder < geojson < point', () => {
    const locationSet = { include: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q16,philly_metro.geojson,[0,0]]');
  });

  it('sorts excluded countrycoder < geojson < point', () => {
    const locationSet = { include: ['001'], exclude: ['philly_metro.geojson', [0,0], 'ca'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q2]-[Q16,philly_metro.geojson,[0,0]]');
  });

  it('force lowercase', () => {
    const locationSet = { include: ['US'], exclude: ['PR'] };
    const result = loco.resolveLocationSet(locationSet);
    assert.ok(result instanceof Object);
    assert.equal(result.type, 'locationset');
    assert.equal(result.locationSet, locationSet);
    assert.equal(result.id, '+[Q30]-[Q1183]');
  });

});
