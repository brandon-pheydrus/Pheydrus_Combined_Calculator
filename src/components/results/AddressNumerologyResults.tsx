import type { AddressNumerologyResult, ZodiacMeaning } from '../../models';
import { ResultSection } from './ResultSection';

interface AddressNumerologyResultsProps {
  result: AddressNumerologyResult | null;
}

function ZodiacMeaningCard({ meaning, label }: { meaning: ZodiacMeaning; label: string }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-xl font-bold text-gray-900 dark:text-white mb-3">{meaning.name}</p>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">Themes:</span>{' '}
          <span className="text-gray-600 dark:text-gray-400">{meaning.themes}</span>
        </p>
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">Challenges:</span>{' '}
          <span className="text-gray-600 dark:text-gray-400">{meaning.challenges}</span>
        </p>
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">Gifts:</span>{' '}
          <span className="text-gray-600 dark:text-gray-400">{meaning.gifts}</span>
        </p>
        <p className="italic text-gray-500 dark:text-gray-500 pt-1">{meaning.reflection}</p>
      </div>
    </div>
  );
}

export function AddressNumerologyResults({ result }: AddressNumerologyResultsProps) {
  if (!result) {
    return (
      <ResultSection title="Address Numerology" defaultOpen={true}>
        <p className="text-gray-600 dark:text-gray-400">No address numerology data available</p>
      </ResultSection>
    );
  }

  return (
    <ResultSection title="Address Numerology" defaultOpen={true}>
      <div className="space-y-6">
        {/* Numerology Levels */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Address Numerology Levels
          </h3>
          {result.levels.map((level, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {level.level}{' '}
                    <span className="text-xs text-gray-400 dark:text-gray-500">{level.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{level.value}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {level.number}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {level.meaning}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {level.description}
              </p>

              {/* Extended meanings */}
              {level.themes && (
                <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Themes:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{level.themes}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Challenges:
                    </span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{level.challenges}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Gifts:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{level.gifts}</span>
                  </p>
                  <p className="italic text-gray-500 dark:text-gray-500 pt-1">{level.reflection}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Zodiac Compatibility */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Chinese Zodiac Compatibility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900 dark:to-amber-900 rounded-lg">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-300 uppercase tracking-wide">
                Home Zodiac
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                {result.homeZodiac}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 rounded-lg">
              <p className="text-xs font-medium text-cyan-600 dark:text-cyan-300 uppercase tracking-wide">
                Birth Zodiac
              </p>
              <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100 mt-2">
                {result.birthZodiac}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900 dark:to-rose-900 rounded-lg">
              <p className="text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wide">
                Compatibility
              </p>
              <p className="text-2xl font-bold text-pink-900 dark:text-pink-100 mt-2">
                {result.compatibility}
              </p>
            </div>
          </div>

          {/* Zodiac Meanings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.homeZodiacMeaning && (
              <ZodiacMeaningCard meaning={result.homeZodiacMeaning} label="Home Year Zodiac" />
            )}
            {result.birthZodiacMeaning && (
              <ZodiacMeaningCard meaning={result.birthZodiacMeaning} label="Birth Year Zodiac" />
            )}
          </div>
        </div>

        {/* Compatibility Guide */}
        <details className="cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <summary className="font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
            Compatibility Guide
          </summary>
          <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-medium">perfect match:</span> Excellent alignment between home
              and birth energies
            </p>
            <p>
              <span className="font-medium">good match:</span> Generally positive alignment
            </p>
            <p>
              <span className="font-medium">above average:</span> Supportive dynamics with minor
              adjustments
            </p>
            <p>
              <span className="font-medium">average:</span> Neither particularly supportive nor
              challenging
            </p>
            <p>
              <span className="font-medium">good match OR enemy:</span> Polarizing - can go either
              way
            </p>
            <p>
              <span className="font-medium">worst:</span> Challenging dynamics that require
              conscious work
            </p>
          </div>
        </details>
      </div>
    </ResultSection>
  );
}

export default AddressNumerologyResults;
