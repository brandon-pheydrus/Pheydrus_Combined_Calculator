import type { RelocationResult } from '../../models';
import { ResultSection } from './ResultSection';

interface RelocationResultsProps {
  result: RelocationResult | null;
}

function getNatureBadgeClass(nature: 'benefic' | 'malefic' | 'neutral'): string {
  if (nature === 'benefic') {
    return 'text-xs rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 px-2 py-1';
  }
  if (nature === 'malefic') {
    return 'text-xs rounded bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100 px-2 py-1';
  }
  return 'text-xs rounded bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 px-2 py-1';
}

export function RelocationResults({ result }: RelocationResultsProps) {
  if (!result) {
    return (
      <ResultSection title="Relocation Analysis" defaultOpen={true}>
        <p className="text-gray-600 dark:text-gray-400">No relocation data available</p>
      </ResultSection>
    );
  }

  return (
    <ResultSection title="Relocation Analysis" defaultOpen={true}>
      <div className="space-y-6">
        {/* Angular Hits */}
        {result.angularHits && result.angularHits.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Angular Hits
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Planets activating angles in the relocated chart
            </p>
            <ul className="space-y-2">
              {result.angularHits.map((hit, idx) => (
                <li
                  key={idx}
                  className={
                    hit.isCareer
                      ? 'flex flex-wrap items-center justify-between gap-3 rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-3 py-2'
                      : 'flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 dark:border-slate-700 px-3 py-2'
                  }
                >
                  <div className="text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold">{hit.key}</span>
                    <span className="opacity-70"> on </span>
                    <span className="font-semibold">{hit.angle}</span>
                    <span className="opacity-70"> (house {hit.house})</span>
                    {hit.isCareer && (
                      <span className="ml-2 text-xs rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100 px-2 py-0.5">
                        career
                      </span>
                    )}
                  </div>
                  <div className={getNatureBadgeClass(hit.nature)}>{hit.nature}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Business House Activations */}
        {result.businessHouseActivations && result.businessHouseActivations.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Business House Activations (2 / 6 / 10)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Planets in houses 2 (finances), 6 (work), and 10 (career) in the relocated chart
            </p>
            <ul className="space-y-2">
              {result.businessHouseActivations.map((activation, idx) => (
                <li
                  key={idx}
                  className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  <div className="text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold">{activation.key}</span>
                    <span className="opacity-70"> in </span>
                    <span className="font-semibold">house {activation.house}</span>
                  </div>
                  <div className={getNatureBadgeClass(activation.nature)}>{activation.nature}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.angularHits.length === 0 && result.businessHouseActivations.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No significant angular hits or business house activations found
          </p>
        )}
      </div>
    </ResultSection>
  );
}

export default RelocationResults;
