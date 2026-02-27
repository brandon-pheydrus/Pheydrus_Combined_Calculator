/**
 * Address Numerology Calculator Service
 * Calculates address numerology with dynamic levels (matching legacy getLevelsArray)
 * Includes L5 "unconscious combined value" and extended meanings
 * Determines zodiac compatibility between home year and birth year
 */

import type {
  AddressNumerologyInput,
  AddressNumerologyResult,
  NumerologyLevel,
  ZodiacMeaning,
} from '../../models/calculators';
import { chaldeanNumerologyCalculator } from '../../utils/numerology/chaldean';
import { getChineseZodiac } from '../../utils/numerology/chineseZodiac';
import { areZodiacsCompatible } from '../../utils/numerology/compatibility';
import {
  NUMEROLOGY_MEANINGS,
  EXTENDED_NUMEROLOGY_MEANINGS,
  CHINESE_ZODIAC_MEANINGS,
} from '../../utils/data/constants';

/**
 * Get numerology meaning for a number (basic + extended)
 */
function getFullMeaning(num: number): {
  meaning: string;
  description: string;
  themes: string;
  challenges: string;
  gifts: string;
  reflection: string;
} {
  const basic = NUMEROLOGY_MEANINGS[num] || {
    meaning: 'Unknown',
    description: 'Numerology meaning not found',
  };
  const extended = EXTENDED_NUMEROLOGY_MEANINGS[num] || {
    themes: '',
    challenges: '',
    gifts: '',
    reflection: '',
  };
  return { ...basic, ...extended };
}

/**
 * Get Chinese zodiac meaning
 */
function getZodiacMeaning(zodiac: string): ZodiacMeaning | null {
  const meaning = CHINESE_ZODIAC_MEANINGS[zodiac];
  if (!meaning) return null;
  return {
    name: zodiac,
    themes: meaning.themes,
    challenges: meaning.challenges,
    gifts: meaning.gifts,
    reflection: meaning.reflection,
  };
}

/**
 * Build a numerology level with full meanings
 */
function buildLevel(level: string, value: string, name: string): NumerologyLevel {
  const number = chaldeanNumerologyCalculator([value]);
  const meaning = getFullMeaning(number);

  return {
    level,
    value,
    name,
    number,
    meaning: meaning.meaning,
    description: meaning.description,
    themes: meaning.themes,
    challenges: meaning.challenges,
    gifts: meaning.gifts,
    reflection: meaning.reflection,
  };
}

/**
 * Calculate Address Numerology
 * Uses dynamic level numbering matching legacy getLevelsArray logic:
 * - Push non-empty fields in order: unitNumber, streetNumber, streetName, postalCode
 * - Add "Level" unconscious combined value using legacy priority logic
 * - Chinese zodiac meanings for home and birth years
 *
 * @param input - Address and year inputs
 * @returns AddressNumerologyResult with all levels and compatibility
 */
export function calculateAddressNumerology(input: AddressNumerologyInput): AddressNumerologyResult {
  const { unitNumber, streetNumber, streetName, postalCode, homeYear, birthYear } = input;

  // Validate required fields
  if (!birthYear) {
    throw new Error('Birth year is required');
  }

  const birthYearNum = Number(birthYear);
  const homeYearNum = homeYear ? Number(homeYear) : null;

  // Build levels dynamically (matching legacy getLevelsArray)
  const levelsRaw: Array<{ value: string; name: string }> = [];

  const L1 = unitNumber ? { value: unitNumber, name: 'Unit Number' } : null;
  const L2A = streetNumber ? { value: streetNumber, name: 'Building/House Number' } : null;
  const L3 = streetName ? { value: streetName, name: 'Street Name' } : null;
  const L4 = postalCode ? { value: postalCode, name: 'Postal Code' } : null;

  if (L1?.value) levelsRaw.push(L1);
  if (L2A?.value) levelsRaw.push(L2A);
  if (L3?.value) levelsRaw.push(L3);
  if (L4?.value) levelsRaw.push(L4);

  // Calculate "Level" (unconscious combined value) using legacy priority logic
  // Must match legacy getLevelsArray exactly (with buildingNumberAndName always null):
  //   L1=unitNumber, L2B=streetNumber (L2A=buildingNumberAndName is always null in legacy form)
  //   Priority: L1+L2B+L3 → L1+L2B → L2B+L3
  let unconsciousValue: string[] | null = null;
  if (L1?.value && L2A?.value && L3?.value) {
    unconsciousValue = [L1.value, L2A.value, L3.value];
  } else if (L1?.value && L2A?.value) {
    unconsciousValue = [L1.value, L2A.value];
  } else if (L2A?.value && L3?.value) {
    unconsciousValue = [L2A.value, L3.value];
  }

  if (unconsciousValue) {
    levelsRaw.push({
      value: unconsciousValue.join(' + '),
      name: 'Level',
    });
  }

  // Build final levels with dynamic numbering (L1, L2, L3, ...)
  const levels: NumerologyLevel[] = levelsRaw.map((raw, index) =>
    buildLevel(`L${index + 1}`, raw.value, raw.name)
  );

  // Calculate Chinese Zodiacs
  const homeZodiac = homeYearNum ? getChineseZodiac(homeYearNum) : 'Unknown';
  const birthZodiac = getChineseZodiac(birthYearNum);

  // Get zodiac meanings
  const homeZodiacMeaning = homeZodiac !== 'Unknown' ? getZodiacMeaning(homeZodiac) : null;
  const birthZodiacMeaning = getZodiacMeaning(birthZodiac);

  // Calculate Compatibility
  let compatibility = 'unknown';
  if (homeZodiac !== 'Unknown') {
    compatibility = areZodiacsCompatible(homeZodiac, birthZodiac);
  }

  return {
    levels,
    homeZodiac,
    birthZodiac,
    homeZodiacMeaning,
    birthZodiacMeaning,
    compatibility,
  };
}

/**
 * Validate address numerology input
 */
export function validateAddressNumerologyInput(input: AddressNumerologyInput): {
  valid: boolean;
  error?: string;
} {
  if (!input.birthYear) {
    return { valid: false, error: 'Birth year is required' };
  }

  const birthYear = Number(input.birthYear);
  if (isNaN(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
    return { valid: false, error: 'Invalid birth year' };
  }

  if (input.homeYear) {
    const homeYear = Number(input.homeYear);
    if (isNaN(homeYear) || homeYear < 1500 || homeYear > new Date().getFullYear() + 100) {
      return { valid: false, error: 'Invalid home year' };
    }
  }

  return { valid: true };
}

/**
 * Get summary of address numerology
 */
export function getAddressNumerologySummary(result: AddressNumerologyResult): string {
  const levelSummary = result.levels.map((l) => `${l.level}: ${l.number}`).join(', ');
  return `${levelSummary} | ${result.homeZodiac} \u2665 ${result.birthZodiac}: ${result.compatibility}`;
}
