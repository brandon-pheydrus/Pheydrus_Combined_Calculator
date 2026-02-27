/**
 * Planet constants for astrology calculations
 */

import type { PlanetKey } from './types';

export const PLANETS: readonly PlanetKey[] = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
];

/**
 * Get all planets in calculation order
 */
export function getAllPlanets(): readonly PlanetKey[] {
  return PLANETS;
}

/**
 * Check if a string is a valid planet name
 */
export function isPlanet(name: string): name is PlanetKey {
  return PLANETS.includes(name as PlanetKey);
}
