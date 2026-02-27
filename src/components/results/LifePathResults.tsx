import type { LifePathResult } from '../../models';
import { ResultSection } from './ResultSection';

interface LifePathResultsProps {
  result: LifePathResult | null;
}

export function LifePathResults({ result }: LifePathResultsProps) {
  if (!result) {
    return (
      <ResultSection title="Life Path & Numerology" defaultOpen={true}>
        <p className="text-gray-400">No life path data available</p>
      </ResultSection>
    );
  }

  return (
    <ResultSection title="Life Path & Numerology" defaultOpen={true}>
      <div className="space-y-6">
        {/* Life Path Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
              Life Path Number
            </p>
            <p className="text-3xl font-bold text-indigo-800 mt-2">{result.lifePathNumber}</p>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">
              Day Path Number
            </p>
            <p className="text-3xl font-bold text-teal-800 mt-2">{result.dayPathNumber}</p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">
              Personal Year
            </p>
            <p className="text-3xl font-bold text-amber-800 mt-2">{result.personalYear}</p>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-xs font-medium text-rose-600 uppercase tracking-wide">
              Chinese Zodiac
            </p>
            <p className="text-2xl font-bold text-rose-800 mt-2">{result.chineseZodiac}</p>
          </div>
        </div>

        {/* Meanings */}
        <div className="space-y-4">
          <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50/50">
            <h3 className="font-semibold text-indigo-700 mb-2">Life Path Meaning</h3>
            <p className="text-[#4a4560] text-xs leading-relaxed mb-2">
              {result.meanings.lifePathMeaning}
            </p>
            <p className="text-[#4a4560] text-sm leading-relaxed">
              {result.meanings.lifePathDescription}
            </p>
          </div>

          <div className="p-4 border border-amber-200 rounded-lg bg-amber-50/50">
            <h3 className="font-semibold text-amber-700 mb-2">Personal Year Meaning</h3>
            <p className="text-[#4a4560] text-xs leading-relaxed mb-2">
              {result.meanings.personalYearMeaning}
            </p>
            <p className="text-[#4a4560] text-sm leading-relaxed">
              {result.meanings.personalYearDescription}
            </p>
          </div>
        </div>
      </div>
    </ResultSection>
  );
}

export default LifePathResults;
