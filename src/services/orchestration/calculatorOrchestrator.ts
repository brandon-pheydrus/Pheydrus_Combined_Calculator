/**
 * Calculator Orchestrator
 * Runs all 5 calculators in parallel with fail-all error handling
 */

import type { FormData, ConsolidatedResults, CalculatorError } from '../../models';
import {
  calculateTransits,
  validateTransitsInput,
  calculateNatalChart,
  validateNatalChartInput,
  calculateLifePath,
  validateLifePathInput,
  calculateRelocation,
  validateRelocationInput,
  calculateAddressNumerology,
  validateAddressNumerologyInput,
} from '../calculators';
import {
  mapToTransitsInput,
  mapToNatalChartInput,
  mapToLifePathInput,
  mapToRelocationInput,
  mapToAddressNumerologyInput,
} from './inputMapper';
import { consolidateResults, createErrorResult } from './resultConsolidator';
import { runAngularDiagnostic } from '../diagnostic';

const ORCHESTRATOR_TIMEOUT = 10000; // 10 seconds

/**
 * Run all 5 calculators in parallel
 * Implements fail-all: if any calculator fails, all fail
 */
export async function runAllCalculators(formData: FormData): Promise<ConsolidatedResults> {
  try {
    // Map inputs
    const transitsInput = mapToTransitsInput(formData);
    const natalChartInput = mapToNatalChartInput(formData);
    const lifePathInput = mapToLifePathInput(formData);
    const relocationInput = mapToRelocationInput(formData);
    const addressNumerologyInput = mapToAddressNumerologyInput(formData);

    // Validate all inputs
    const validations = [
      validateTransitsInput(transitsInput),
      validateNatalChartInput(natalChartInput),
      validateLifePathInput(lifePathInput),
      validateRelocationInput(relocationInput),
      validateAddressNumerologyInput(addressNumerologyInput),
    ];

    const validationErrors = validations
      .map((v, i) => {
        if (!v.valid) {
          const calculators = [
            'transits',
            'natalChart',
            'lifePath',
            'relocation',
            'addressNumerology',
          ];
          return {
            calculatorName: calculators[i],
            errorMessage: v.error || 'Validation failed',
          };
        }
        return null;
      })
      .filter((e) => e !== null) as CalculatorError[];

    if (validationErrors.length > 0) {
      return consolidateResults(formData, null, null, null, null, null, validationErrors);
    }

    // Execute all calculators in parallel with timeout
    const results = await Promise.race([
      Promise.all([
        calculateTransits(transitsInput),
        calculateNatalChart(natalChartInput),
        calculateLifePath(lifePathInput),
        calculateRelocation(relocationInput),
        calculateAddressNumerology(addressNumerologyInput),
      ]),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Calculator timeout: exceeded 10 seconds')),
          ORCHESTRATOR_TIMEOUT
        )
      ),
    ]);

    const [
      transitsResult,
      natalChartResult,
      lifePathResult,
      relocationResult,
      addressNumerologyResult,
    ] = results;

    const consolidated = consolidateResults(
      formData,
      transitsResult,
      natalChartResult,
      lifePathResult,
      relocationResult,
      addressNumerologyResult
    );

    // Run Angular Diagnostic after all calculators complete (non-blocking)
    try {
      const diagnostic = await runAngularDiagnostic(consolidated, formData);
      consolidated.diagnostic = diagnostic;
    } catch (e) {
      console.warn('Angular diagnostic failed:', e);
    }

    return consolidated;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return createErrorResult(formData, err);
  }
}

/**
 * Get human-readable error summary
 */
export function getErrorSummary(results: ConsolidatedResults): string {
  if (results.success) return '';

  if (results.errors && results.errors.length > 0) {
    return results.errors.map((e) => `${e.calculatorName}: ${e.errorMessage}`).join('\n');
  }

  return 'Unknown error occurred';
}
