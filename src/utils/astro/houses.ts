/**
 * House system calculations for astrology
 * Implements whole sign house assignment
 */

import type { PlanetWithHouse } from './types';

/**
 * Get zodiac sign index (0-11) from longitude (0-360)
 * Each sign covers 30 degrees
 */
function getSignIndex(lon: number): number {
  const normalizedLon = normalize360(lon);
  return Math.floor(normalizedLon / 30);
}

/**
 * Normalize angle to 0-360 range
 */
export function normalize360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

/**
 * Assign whole sign houses to planets
 * Whole sign system: house 1 spans from Ascendant sign to next sign
 * Each planet is placed in the house matching its zodiac sign
 *
 * @param ascLon - Ascendant longitude (0-360)
 * @param planetsLon - Array of planets with their longitudes
 * @returns Planets with assigned house numbers (1-12)
 */
export function assignWholeSignHouses(
  ascLon: number,
  planetsLon: Array<{ key: string; lon: number }>
): PlanetWithHouse[] {
  const ascSign = getSignIndex(ascLon);

  return planetsLon.map((p) => {
    const planetSign = getSignIndex(p.lon);
    // House = (planet sign - asc sign + 12) mod 12 + 1
    const house = ((planetSign - ascSign + 12) % 12) + 1;

    return {
      key: p.key,
      lon: p.lon,
      signIndex: planetSign,
      house,
    };
  });
}

/**
 * Build angles from ascendant and midheaven
 * DSC is opposite of ASC (ASC + 180)
 * IC is opposite of MC (MC + 180)
 */
export function buildAngles(asc: number, mc: number) {
  const ascN = normalize360(asc);
  const mcN = normalize360(mc);

  return {
    asc: ascN,
    dsc: normalize360(ascN + 180),
    mc: mcN,
    ic: normalize360(mcN + 180),
  };
}

/**
 * Get house number from zodiac sign index
 * Used for secondary calculations
 */
export function getHouseFromSignIndex(signIndex: number, ascSignIndex: number): number {
  return ((signIndex - ascSignIndex + 12) % 12) + 1;
}
