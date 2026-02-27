import { useLocation, useNavigate } from 'react-router-dom';
import { useResultsController } from '../controllers/useResultsController';
import { NavigationButtons } from '../components/results/NavigationButtons';
import { TransitsResults } from '../components/results/TransitsResults';
import { NatalChartResults } from '../components/results/NatalChartResults';
import { LifePathResults } from '../components/results/LifePathResults';
import { RelocationResults } from '../components/results/RelocationResults';
import { AddressNumerologyResults } from '../components/results/AddressNumerologyResults';
import type { ConsolidatedResults } from '../models';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleNewCalculation, handleEditInputs } = useResultsController();

  // Type the router state
  const results = (location.state as { results?: ConsolidatedResults })?.results;

  // Guard: redirect to calculator if no results in state
  if (!results) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            No Results Found
          </h2>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            Please complete a calculation first.
          </p>
          <button
            onClick={() => navigate('/calculator')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to Calculator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Pheydrus Calculation Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete astrological and numerological analysis for {results.userInfo.name}
        </p>
      </div>

      {/* User Info Summary */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Profile Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</p>
            <p className="text-lg text-gray-900 dark:text-white">{results.userInfo.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Date of Birth</p>
            <p className="text-lg text-gray-900 dark:text-white">{results.userInfo.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Birth Location</p>
            <p className="text-lg text-gray-900 dark:text-white">
              {results.userInfo.birthLocation}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Location</p>
            <p className="text-lg text-gray-900 dark:text-white">
              {results.userInfo.currentLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert (if any) */}
      {results.errors && results.errors.length > 0 && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
            Calculation Warnings
          </h3>
          <ul className="space-y-1">
            {results.errors.map((error, idx) => (
              <li key={idx} className="text-red-800 dark:text-red-200 text-sm">
                <span className="font-medium">{error.calculatorName}:</span> {error.errorMessage}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Results Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-0 mb-8">
        <TransitsResults result={results.calculators.transits} />
        <NatalChartResults result={results.calculators.natalChart} />
        <LifePathResults result={results.calculators.lifePath} />
        <RelocationResults result={results.calculators.relocation} />
        <AddressNumerologyResults result={results.calculators.addressNumerology} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center">
        <NavigationButtons
          results={results}
          onNewCalculation={handleNewCalculation}
          onEditInputs={handleEditInputs}
        />
      </div>

      {/* Report Timestamp */}
      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Report generated: {new Date(results.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ResultsPage;
