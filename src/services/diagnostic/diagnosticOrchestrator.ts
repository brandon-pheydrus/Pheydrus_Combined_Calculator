/**
 * Angular Diagnostic Orchestrator
 * Coordinates running the Three Pillars grading after the 5 calculators complete.
 *
 * 1. Computes destination planet houses (async — Swiss Ephemeris)
 * 2. Runs the grading engine (sync — pure computation)
 * 3. Returns AngularDiagnosticResult
 */

import type { ConsolidatedResults } from '../../models/calculators';
import type { FormData } from '../../models/form';
import type { AngularDiagnosticResult } from '../../models/diagnostic';
import { computePlanetHousesAtDestination } from '../../utils/astro/destinationHouses';
import { gradeThreePillars } from './threePillarsGrader';

/**
 * Run the Angular Diagnostic grading.
 * This should be called AFTER all 5 calculators have completed.
 *
 * @param results - Consolidated results from the 5 calculators
 * @param formData - Original form data (needed for destination coordinates)
 * @returns AngularDiagnosticResult with all pillar grades and final score
 */
export async function runAngularDiagnostic(
  results: ConsolidatedResults,
  formData: FormData
): Promise<AngularDiagnosticResult> {
  // Compute destination planet houses for Pillar 3A
  let destinationPlanetHouses = null;

  if (
    formData.currentLocation &&
    formData.birthLocation &&
    formData.dateOfBirth &&
    formData.timeOfBirth
  ) {
    try {
      destinationPlanetHouses = await computePlanetHousesAtDestination({
        date: formData.dateOfBirth,
        time: formData.timeOfBirth,
        birthTimeZone: formData.birthLocation.timeZone,
        destinationLatitude: formData.currentLocation.latitude,
        destinationLongitude: formData.currentLocation.longitude,
      });
    } catch (error) {
      console.warn('[Angular Diagnostic] Failed to compute destination houses:', error);
    }
  }

  return gradeThreePillars({
    natalChart: results.calculators.natalChart,
    transits: results.calculators.transits,
    lifePath: results.calculators.lifePath,
    destinationPlanetHouses,
    addressNumerology: results.calculators.addressNumerology,
  });
}
