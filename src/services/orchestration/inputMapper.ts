/**
 * Input Mapper
 * Converts unified FormData into individual calculator input formats
 */

import type {
  FormData,
  TransitsInput,
  NatalChartInput,
  LifePathInput,
  RelocationInput,
  AddressNumerologyInput,
} from '../../models';

/**
 * Map FormData to Transits Calculator input
 */
export function mapToTransitsInput(formData: FormData): TransitsInput {
  return {
    risingSign: formData.risingSign || 'Aries',
  };
}

/**
 * Map FormData to Natal Chart Calculator input
 */
export function mapToNatalChartInput(formData: FormData): NatalChartInput {
  if (!formData.birthLocation) {
    throw new Error('Birth location is required for natal chart');
  }

  const [year, month, day] = formData.dateOfBirth.split('-').map(Number);
  const [hour, minute] = formData.timeOfBirth.split(':').map(Number);

  return {
    year,
    month,
    day,
    hour,
    minute,
    latitude: formData.birthLocation.latitude,
    longitude: formData.birthLocation.longitude,
    timeZone: formData.birthLocation.timeZone,
  };
}

/**
 * Map FormData to Life Path Calculator input
 */
export function mapToLifePathInput(formData: FormData): LifePathInput {
  return {
    birthDate: formData.dateOfBirth,
  };
}

/**
 * Map FormData to Relocation Calculator input
 */
export function mapToRelocationInput(formData: FormData): RelocationInput {
  if (!formData.birthLocation || !formData.currentLocation) {
    throw new Error('Both birth and current locations are required for relocation');
  }

  const [year, month, day] = formData.dateOfBirth.split('-').map(Number);
  const [hour, minute] = formData.timeOfBirth.split(':').map(Number);

  return {
    year,
    month,
    day,
    hour,
    minute,
    birthLatitude: formData.birthLocation.latitude,
    birthLongitude: formData.birthLocation.longitude,
    birthTimeZone: formData.birthLocation.timeZone,
    destinationLatitude: formData.currentLocation.latitude,
    destinationLongitude: formData.currentLocation.longitude,
  };
}

/**
 * Map FormData to Address Numerology Calculator input
 */
export function mapToAddressNumerologyInput(formData: FormData): AddressNumerologyInput {
  const birthYear = formData.dateOfBirth.split('-')[0];

  return {
    unitNumber: formData.l1,
    streetNumber: formData.streetNumber || '',
    streetName: formData.l2,
    postalCode: formData.postalCode,
    homeYear: formData.homeBuiltYear,
    birthYear,
  };
}

/**
 * Map all inputs at once (for validation)
 */
export function mapAllInputs(formData: FormData) {
  return {
    transits: mapToTransitsInput(formData),
    natalChart: mapToNatalChartInput(formData),
    lifePath: mapToLifePathInput(formData),
    relocation: mapToRelocationInput(formData),
    addressNumerology: mapToAddressNumerologyInput(formData),
  };
}
