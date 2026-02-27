import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseResultsControllerReturn {
  handleNewCalculation: () => void;
  handleEditInputs: () => void;
}

export function useResultsController(): UseResultsControllerReturn {
  const navigate = useNavigate();

  /**
   * Start a new calculation - clears stored form data and returns to calculator
   */
  const handleNewCalculation = useCallback(() => {
    // Clear localStorage form data to start fresh
    localStorage.removeItem('pheydrus_form_data');
    navigate('/calculator');
  }, [navigate]);

  /**
   * Edit current inputs - returns to calculator with form data preserved
   */
  const handleEditInputs = useCallback(() => {
    // Form data is already in localStorage, just navigate back
    navigate('/calculator');
  }, [navigate]);

  return {
    handleNewCalculation,
    handleEditInputs,
  };
}

export default useResultsController;
