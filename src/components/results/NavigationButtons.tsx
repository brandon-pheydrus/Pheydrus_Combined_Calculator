import type { ConsolidatedResults } from '../../models';
import { ExportButton } from '../ExportButton';

interface NavigationButtonsProps {
  results: ConsolidatedResults;
  onNewCalculation: () => void;
  onEditInputs: () => void;
}

export function NavigationButtons({
  results,
  onNewCalculation,
  onEditInputs,
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
      <button
        onClick={onNewCalculation}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        New Calculation
      </button>
      <button
        onClick={onEditInputs}
        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
      >
        Edit Inputs
      </button>
      <ExportButton results={results} />
    </div>
  );
}

export default NavigationButtons;
