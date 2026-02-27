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
        <h1 className="text-4xl font-bold text-[#2d2a3e] mb-2">Pheydrus Combined Calculator</h1>
        <p className="text-[#6b6188]">
          Calculate your birth chart, transits, life path, relocation, and address numerology in one
          place.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold mb-2">Calculation Error</p>
            <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p>
          </div>
        )}

        <UnifiedInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default CalculatorPage;
