import { useState } from 'react';
import type { ConsolidatedResults } from '../models';
import { exportToPDF } from '../services/pdfExport';

interface ExportButtonProps {
  results: ConsolidatedResults;
  variant?: 'button' | 'icon';
}

export function ExportButton({ results, variant = 'button' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      await exportToPDF(results);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export PDF';
      setError(message);
      console.error('PDF Export Error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleExport}
        disabled={isExporting}
        title={isExporting ? 'Exporting...' : 'Export to PDF'}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
      >
        <svg
          className="w-5 h-5 text-gray-900 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-4-2m4 2l4-2"
          />
        </svg>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors"
      >
        {isExporting ? 'Exporting PDF...' : 'Export to PDF'}
      </button>
      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}

export default ExportButton;
