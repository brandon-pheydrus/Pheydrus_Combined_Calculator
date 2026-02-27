/**
 * Angular calculations for astrology
 * Detects planets on angles (ASC, DSC, MC, IC)
 */

import { normalize360 } from './houses';
import type { Angles, AngularHit, PlanetWithHouse, AngleKey } from './types';

/**
 * Calculate smallest angular difference between two longitudes
 * Returns signed value in range [-180, 180)
 * Positive = second is counter-clockwise from first
 */
function smallestAngleDiff(a: number, b: number): number {
  const d = normalize360(a - b);
  return d >= 180 ? d - 360 : d;
}

/**
 * Detect planets on angles with specified orb
 * Angles: ASC (house 1), DSC (house 7), MC (house 10), IC (house 4)
 *
 * @param angles - ASC, DSC, MC, IC longitudes
 * @param planetLongitudes - Map of planet names to longitudes
 * @param orbDegrees - Orb in degrees (default: 1)
 * @returns Array of planets on angles
 */
export function computeAngularHits(input: {
  angles: Angles;
  planetLongitudes: Record<string, number>;
  orbDegrees?: number;
}): AngularHit[] {
  const { angles, planetLongitudes, orbDegrees = 1 } = input;

  const angleEntries: Array<[AngleKey, number]> = [
    ['ASC', angles.asc],
    ['DSC', angles.dsc],
    ['MC', angles.mc],
    ['IC', angles.ic],
  ];

  const hits: AngularHit[] = [];

  Object.entries(planetLongitudes).forEach(([planet, lon]) => {
    angleEntries.forEach(([angle, angleLon]) => {
      const orb = smallestAngleDiff(lon, angleLon);
      if (Math.abs(orb) <= orbDegrees) {
        hits.push({
          planet,
          angle,
          orbDegrees: orb,
        });
      }
    });
  });

  return hits;
}

/**
 * Get planets on angle houses by house system
 * Maps houses to angles: 1->ASC, 4->IC, 7->DSC, 10->MC
 *
 * @param planetsWithHouse - Planets with house assignments
 * @returns Planets that are on angles
 */
export function getAngularByHouse(planetsWithHouse: PlanetWithHouse[]): Array<{
  key: string;
  house: number;
  angle: AngleKey;
}> {
  const angleHouses: Record<number, AngleKey> = {
    1: 'ASC',
    4: 'IC',
    7: 'DSC',
    10: 'MC',
  };

  return planetsWithHouse
    .filter((p) => p.house in angleHouses)
    .map((p) => ({
      key: p.key,
      house: p.house,
      angle: angleHouses[p.house],
    }));
}

/**
 * Check if a planet is angular (on an angle)
 */
export function isAngular(house: number): boolean {
  return [1, 4, 7, 10].includes(house);
}

/**
 * Get all angular houses
 */
export function getAngularHouses(): number[] {
  return [1, 4, 7, 10];
}
