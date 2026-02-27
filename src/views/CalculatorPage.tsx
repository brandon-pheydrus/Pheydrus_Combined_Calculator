import { useCalculatorController } from '../controllers';
import { UnifiedInputForm } from '../components/form';
import type { FormData } from '../models/form';

export function CalculatorPage() {
  const { calculate, isLoading, error } = useCalculatorController();

  const handleFormSubmit = async (formData: FormData) => {
    await calculate(formData);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Pheydrus Combined Calculator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your birth chart, transits, life path, relocation, and address numerology in one
          place.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">Calculation Error</p>
            <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">{error}</p>
          </div>
        )}

        <UnifiedInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default CalculatorPage;
