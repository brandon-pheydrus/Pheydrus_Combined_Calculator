/**
 * Chinese Zodiac Compatibility Calculator
 * Determines compatibility between two zodiac animals
 */

import type { Zodiacs } from '../../models/calculators';

type CompatibilityRank = '-' | 'x' | 'd' | '?' | 't' | 'h';

const COMPATIBILITY_MEANING: Record<CompatibilityRank, string> = {
  '-': 'average',
  x: 'worst',
  d: 'above average',
  '?': 'good match OR enemy',
  t: 'good match',
  h: 'perfect match',
};

/**
 * Zodiac animals in compatibility matrix order
 * Order: [Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig, Rat]
 * This matches the matrix indexing
 */
const ZODIAC_MAPPING: readonly Zodiacs[] = [
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
  'Rat',
];

/**
 * Compatibility matrix
 * Row index = home year zodiac
 * Column index = birth year zodiac
 * Values: h=perfect match, t=good match, ?=ambiguous, d=above average, -=average, x=worst
 */
const COMPATIBILITY_MATRIX: readonly CompatibilityRank[][] = [
  ['-', 'x', 'd', 'x', 'd', 'x', 'x', 'h', 'h', 'd', '?', 'h'], // Ox row
  ['x', 'x', '-', 'h', 'x', 'h', 't', 'x', 'd', 'd', 'h', '-'], // Tiger row
  ['d', '-', '-', '-', 'x', '-', 'h', 'h', 'x', 'h', 'h', 'h'], // Rabbit row
  ['x', 'h', '-', 't', 'h', '-', 'x', 'd', 'd', 'x', 't', 'h'], // Dragon row
  ['d', 'x', 'x', 'h', 'x', 't', 'x', 't', 'h', '-', 'x', 't'], // Snake row
  ['x', 'h', '-', '-', 't', 'x', 'h', '-', 'x', '-', 'd', 'x'], // Horse row
  ['x', 't', 'h', 'x', 'x', 'h', 'd', 'd', '-', 'x', 'h', '?'], // Goat row
  ['h', 'x', 'h', 'd', 't', '-', 'd', 't', '-', 'd', 'x', 'h'], // Monkey row
  ['h', 'd', 'x', 'd', 'h', 'x', '-', '-', 'x', 'x', '-', 'x'], // Rooster row
  ['d', 'd', 'h', 'x', '-', '-', 'x', 'd', 'x', '-', 'd', 'd'], // Dog row
  ['?', 'h', 'h', 't', 'x', 'd', 'h', 'x', '-', 'd', 't', 'd'], // Pig row
  ['h', '-', 'h', 'h', 't', 'x', '?', 'h', 'x', 'd', 'd', '-'], // Rat row
];

/**
 * Determine compatibility between two zodiacs
 *
 * @param zodiac1 - First zodiac animal (typically home year)
 * @param zodiac2 - Second zodiac animal (typically birth year)
 * @returns Compatibility description (perfect match, good match, etc.)
 */
export function areZodiacsCompatible(zodiac1: Zodiacs, zodiac2: Zodiacs): string {
  const row = ZODIAC_MAPPING.indexOf(zodiac1);
  const col = ZODIAC_MAPPING.indexOf(zodiac2);

  if (row === -1 || col === -1) {
    return 'unknown';
  }

  const rank = COMPATIBILITY_MATRIX[row][col];
  return COMPATIBILITY_MEANING[rank];
}

/**
 * Get detailed compatibility rank
 *
 * @param zodiac1 - First zodiac animal
 * @param zodiac2 - Second zodiac animal
 * @returns Single character rank (h, t, d, -, ?, x)
 */
export function getCompatibilityRank(zodiac1: Zodiacs, zodiac2: Zodiacs): CompatibilityRank {
  const row = ZODIAC_MAPPING.indexOf(zodiac1);
  const col = ZODIAC_MAPPING.indexOf(zodiac2);

  if (row === -1 || col === -1) {
    return '-';
  }

  return COMPATIBILITY_MATRIX[row][col];
}

/**
 * Get all zodiac animals in compatibility matrix order
 */
export function getZodiacMappingOrder(): readonly Zodiacs[] {
  return ZODIAC_MAPPING;
}

/**
 * Export the full compatibility matrix for reference
 */
export function getCompatibilityMatrix(): readonly CompatibilityRank[][] {
  return COMPATIBILITY_MATRIX;
}
