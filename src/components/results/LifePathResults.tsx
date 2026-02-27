import type { LifePathResult } from '../../models';
import { ResultSection } from './ResultSection';

interface LifePathResultsProps {
  result: LifePathResult | null;
}

export function LifePathResults({ result }: LifePathResultsProps) {
  if (!result) {
    return (
      <ResultSection title="Life Path & Numerology" defaultOpen={true}>
        <p className="text-gray-600 dark:text-gray-400">No life path data available</p>
      </ResultSection>
    );
  }

  return (
    <ResultSection title="Life Path & Numerology" defaultOpen={true}>
      <div className="space-y-6">
        {/* Life Path Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-lg">
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
              Life Path Number
            </p>
            <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mt-2">
              {result.lifePathNumber}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900 dark:to-emerald-900 rounded-lg">
            <p className="text-xs font-medium text-teal-600 dark:text-teal-300 uppercase tracking-wide">
              Day Path Number
            </p>
            <p className="text-3xl font-bold text-teal-900 dark:text-teal-100 mt-2">
              {result.dayPathNumber}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900 dark:to-yellow-900 rounded-lg">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-300 uppercase tracking-wide">
              Personal Year
            </p>
            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">
              {result.personalYear}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900 dark:to-red-900 rounded-lg">
            <p className="text-xs font-medium text-rose-600 dark:text-rose-300 uppercase tracking-wide">
              Chinese Zodiac
            </p>
            <p className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-2">
              {result.chineseZodiac}
            </p>
          </div>
        </div>

        {/* Meanings */}
        <div className="space-y-4">
          <div className="p-4 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-indigo-50 dark:bg-indigo-900 bg-opacity-30">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
              Life Path Meaning
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed mb-2">
              {result.meanings.lifePathMeaning}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {result.meanings.lifePathDescription}
            </p>
          </div>

          <div className="p-4 border border-amber-200 dark:border-amber-700 rounded-lg bg-amber-50 dark:bg-amber-900 bg-opacity-30">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Personal Year Meaning
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed mb-2">
              {result.meanings.personalYearMeaning}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {result.meanings.personalYearDescription}
            </p>
          </div>
        </div>
      </div>
    </ResultSection>
  );
}

export default LifePathResults;
