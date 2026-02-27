import type { NatalChartResult, AstrologyAspect } from '../../models';
import { ResultSection } from './ResultSection';

interface NatalChartResultsProps {
  result: NatalChartResult | null;
}

function AngleAspectSection({ title, aspects }: { title: string; aspects: AstrologyAspect[] }) {
  if (aspects.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h4>
      <div className="space-y-1 mb-3">
        {aspects.map((aspect, idx) => (
          <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
            {aspect.planet_1.en} {aspect.aspect.en} {aspect.planet_2.en}
          </p>
        ))}
      </div>
    </div>
  );
}

export function NatalChartResults({ result }: NatalChartResultsProps) {
  if (!result) {
    return (
      <ResultSection title="Natal Chart" defaultOpen={true}>
        <p className="text-gray-600 dark:text-gray-400">No natal chart data available</p>
      </ResultSection>
    );
  }

  const hasAngleAspects =
    result.angleAspects &&
    (result.angleAspects.asc.length > 0 ||
      result.angleAspects.dsc.length > 0 ||
      result.angleAspects.mc.length > 0 ||
      result.angleAspects.ic.length > 0);

  return (
    <ResultSection title="Natal Chart" defaultOpen={true}>
      <div className="space-y-6">
        {/* Rising Sign */}
        <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
          <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
            Ascendant (Rising Sign): <span className="font-bold text-lg">{result.risingSign}</span>
          </p>
        </div>

        {/* Planets */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Planets</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">
                    Planet
                  </th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">
                    Sign
                  </th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">
                    House
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {result.planets.map((planet, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2 px-2 font-medium text-gray-900 dark:text-white">
                      {planet.planet.en}
                      {(planet.isRetro === 'True' || planet.isRetro === 'true') && (
                        <span className="ml-1 inline-block px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                          R
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">
                      {planet.zodiac_sign.name.en}
                    </td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">
                      {planet.house || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Planet-to-Planet Aspects */}
        {result.aspects && result.aspects.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Aspects</h3>
            <div className="space-y-1">
              {result.aspects.map((aspect, idx) => (
                <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                  {aspect.planet_1.en} {aspect.aspect.en} {aspect.planet_2.en}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Angle Aspects (IC, DSC, MC, ASC) */}
        {hasAngleAspects && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Angle Aspects
            </h3>
            <div className="space-y-2">
              <AngleAspectSection title="IC Aspects" aspects={result.angleAspects.ic} />
              <AngleAspectSection title="DSC Aspects" aspects={result.angleAspects.dsc} />
              <AngleAspectSection title="MC Aspects" aspects={result.angleAspects.mc} />
              <AngleAspectSection title="ASC Aspects" aspects={result.angleAspects.asc} />
            </div>
          </div>
        )}
      </div>
    </ResultSection>
  );
}

export default NatalChartResults;
