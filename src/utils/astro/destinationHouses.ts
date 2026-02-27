/**
 * Destination Planet-House Utility
 * Computes planet-to-house mappings at an arbitrary location using birth date/time.
 * Reuses existing Swiss Ephemeris functions — no new dependencies.
 *
 * Used by Pillar 3A (Environment: Relocation Angular Impact) where we need
 * planet houses at the user's current city, not their birth city.
 */

import type { PlanetHouseResult } from '../../models/diagnostic';
import { getPlanetLongitudes, getAngles } from './swephClient';
import { assignWholeSignHouses } from './houses';
import { birthLocalToJulianDay } from './time';

export interface DestinationHouseInput {
  date: string;
  time: string;
  birthTimeZone: string;
  destinationLatitude: number;
  destinationLongitude: number;
}

/**
 * Compute planet house placements at a destination location.
 *
 * Planet positions are fixed by birth date/time (they don't change with location).
 * House assignments change because the Ascendant shifts with geographic coordinates.
 *
 * @param input - Birth date/time + destination coordinates
 * @returns Array of planet-house mappings
 */
export async function computePlanetHousesAtDestination(
  input: DestinationHouseInput
): Promise<PlanetHouseResult[]> {
  const jdUT = birthLocalToJulianDay({
    date: input.date,
    time: input.time,
    timeZone: input.birthTimeZone,
  });

  // Planet longitudes depend only on time, not location
  const planetLons = await getPlanetLongitudes(jdUT);

  // Angles depend on location — this is what changes for the destination
  const angles = await getAngles(jdUT, input.destinationLatitude, input.destinationLongitude, 'W');

  // Assign whole sign houses using destination Ascendant
  const planetsForHouse = Object.entries(planetLons).map(([key, lon]) => ({ key, lon }));
  const withHouses = assignWholeSignHouses(angles.asc, planetsForHouse);

  return withHouses.map((p) => ({ planet: p.key, house: p.house }));
}
