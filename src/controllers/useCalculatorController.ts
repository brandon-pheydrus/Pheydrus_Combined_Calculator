/**
 * Calculator Controller Hook
 * Orchestrates calculator workflow: form submission → calculations → results navigation
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { runAllCalculators, getErrorSummary } from '../services/orchestration';
import type { FormData } from '../models';

interface CalculatorControllerState {
  isLoading: boolean;
  error: string | null;
}

export function useCalculatorController() {
  const navigate = useNavigate();
  const [state, setState] = useState<CalculatorControllerState>({
    isLoading: false,
    error: null,
  });

  /**
   * Handle form submission - runs all calculators and navigates to results
   */
  const calculate = useCallback(
    async (formData: FormData) => {
      setState({ isLoading: true, error: null });

      try {
        const results = await runAllCalculators(formData);

        if (results.success) {
          // Success - navigate to results page with consolidated results
          navigate('/results', { state: { results } });
        } else {
          // Fail-all: show error if any calculator failed
          const errorMessage = getErrorSummary(results);
          setState({
            isLoading: false,
            error: errorMessage || 'Calculation failed',
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState({
          isLoading: false,
          error: errorMessage,
        });
      }
    },
    [navigate]
  );

  return {
    calculate,
    isLoading: state.isLoading,
    error: state.error,
  };
}

export default useCalculatorController;
