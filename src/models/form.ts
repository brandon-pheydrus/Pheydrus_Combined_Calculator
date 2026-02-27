/**
 * Form data models for the unified input form
 * Captures all inputs needed by all 5 calculators
 */

import type { UserInfo } from './calculators';

export interface CityData {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  admin1?: string;
  population?: number;
}

export interface FormData {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM (24-hour)
  birthLocation: CityData | null;
  currentLocation: CityData | null;
  risingSign: string; // zodiac sign or empty string
  l1: string; // unit number
  streetNumber: string; // building/house number
  l2: string; // street name
  postalCode: string;
  homeBuiltYear: string; // YYYY or empty
}

/**
 * Empty form template for resetting
 */
export const EMPTY_FORM: FormData = {
  name: '',
  dateOfBirth: '',
  timeOfBirth: '',
  birthLocation: null,
  currentLocation: null,
  risingSign: '',
  l1: '',
  streetNumber: '',
  l2: '',
  postalCode: '',
  homeBuiltYear: '',
};

/**
 * Form storage key for localStorage
 */
export const FORM_STORAGE_KEY = 'pheydrus_form_data';

/**
 * Zodiac sign options for rising sign dropdown
 */
export const ZODIAC_SIGNS_OPTIONS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;

/**
 * Extract user info from form data (for display in results)
 */
export function extractUserInfo(formData: FormData): UserInfo {
  return {
    name: formData.name || 'Unknown',
    dateOfBirth: formData.dateOfBirth,
    timeOfBirth: formData.timeOfBirth,
    birthLocation: formData.birthLocation?.name || 'Unknown',
    currentLocation: formData.currentLocation?.name || 'Unknown',
  };
}

/**
 * Serialize form data for localStorage
 */
export function serializeFormData(formData: FormData): string {
  return JSON.stringify(formData);
}

/**
 * Deserialize form data from localStorage
 */
export function deserializeFormData(json: string): FormData {
  try {
    return JSON.parse(json);
  } catch {
    return EMPTY_FORM;
  }
}
