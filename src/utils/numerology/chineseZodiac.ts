/**
 * Chinese Zodiac Calculator
 * Determines zodiac animal based on birth year
 */

import type { Zodiacs } from '../../models/calculators';

const CHINESE_ZODIAC_ANIMALS: readonly Zodiacs[] = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];

/**
 * Get Chinese Zodiac animal for a given year
 * Uses traditional 12-year cycle with base year 4
 *
 * @param year - Birth year (e.g., 1996)
 * @returns Chinese zodiac animal name
 */
export function getChineseZodiac(year: number): Zodiacs {
  const index = (year - 4) % 12;
  return CHINESE_ZODIAC_ANIMALS[index];
}

/**
 * Get all Chinese Zodiac animals in order
 */
export function getAllChineseZodiacs(): readonly Zodiacs[] {
  return CHINESE_ZODIAC_ANIMALS;
}
