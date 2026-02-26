// Calculator controller hook - manages state and orchestrates between views and services
import { useState, useCallback } from 'react';
import { calculatorService } from '../services';
import type { CalculatorResult } from '../models';

interface CalculatorState {
  inputs: Record<string, number | string>;
  results: CalculatorResult[];
  isLoading: boolean;
  error: string | null;
}

export function useCalculatorController() {
  const [state, setState] = useState<CalculatorState>({
    inputs: {},
    results: [],
    isLoading: false,
    error: null,
  });

  const updateInput = useCallback((key: string, value: number | string) => {
    setState((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [key]: value },
      error: null,
    }));
  }, []);

  const calculate = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const response = await calculatorService.calculate(state.inputs);

    if (response.success && response.data) {
      setState((prev) => ({
        ...prev,
        results: response.data!,
        isLoading: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        error: response.error || 'Calculation failed',
        isLoading: false,
      }));
    }
  }, [state.inputs]);

  const reset = useCallback(() => {
    setState({
      inputs: {},
      results: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    updateInput,
    calculate,
    reset,
  };
}

export default useCalculatorController;
