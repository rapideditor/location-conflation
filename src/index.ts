import { LocationConflation } from './location-conflation.ts';

declare global {
  var LocationConflation: typeof import('./location-conflation.ts').LocationConflation;
}

export { LocationConflation };
export type * from './types.ts';
export default LocationConflation;

globalThis.LocationConflation = LocationConflation;
