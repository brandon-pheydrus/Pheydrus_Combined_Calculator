/**
 * Result Consolidator
 * Merges individual calculator results into a single ConsolidatedResults object
 */

import type {
  FormData,
  TransitsResult,
  NatalChartResult,
  LifePathResult,
  RelocationResult,
  AddressNumerologyResult,
  ConsolidatedResults,
  CalculatorError,
} from '../../models';
import { extractUserInfo } from '../../models/form';

/**
 * Consolidate all calculator results into a single output
 */
export function consolidateResults(
  formData: FormData,
  transitsResult: TransitsResult | null,
  natalChartResult: NatalChartResult | null,
  lifePathResult: LifePathResult | null,
  relocationResult: RelocationResult | null,
  addressNumerologyResult: AddressNumerologyResult | null,
  errors?: CalculatorError[]
): ConsolidatedResults {
  const userInfo = extractUserInfo(formData);

  return {
    success: !errors || errors.length === 0,
    timestamp: new Date().toISOString(),
    userInfo,
    calculators: {
      transits: transitsResult,
      natalChart: natalChartResult,
      lifePath: lifePathResult,
      relocation: relocationResult,
      addressNumerology: addressNumerologyResult,
    },
    errors: errors && errors.length > 0 ? errors : undefined,
  };
}

/**
 * Handle calculator errors and create consolidated error response
 */
export function createErrorResult(formData: FormData, error: Error): ConsolidatedResults {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    userInfo: extractUserInfo(formData),
    calculators: {
      transits: null,
      natalChart: null,
      lifePath: null,
      relocation: null,
      addressNumerology: null,
    },
    errors: [
      {
        calculatorName: 'orchestrator',
        errorMessage: error.message,
      },
    ],
  };
}
