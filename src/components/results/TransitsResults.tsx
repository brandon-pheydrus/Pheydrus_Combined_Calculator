import type { TransitsResult, Placement } from '../../models';
import { SIGN_COLORS, HOUSE_THEMES } from '../../utils/data/constants';
import { ResultSection } from './ResultSection';

interface TransitsResultsProps {
  result: TransitsResult | null;
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

function getSignStyle(sign: string): React.CSSProperties {
  return {
    background: SIGN_COLORS[sign] || '#f0f0f0',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-block',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 4px',
  };
}

function TransitCard({
  planet,
  placement,
  houseNumber,
  title,
  isPast,
}: {
  planet: string;
  placement: Placement;
  houseNumber: number;
  title: string;
  isPast: boolean;
}) {
  const houseTheme = HOUSE_THEMES[houseNumber - 1] || '';

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-4 border-l-4 ${
        isPast ? 'border-blue-300' : 'border-purple-300'
      }`}
    >
      <p className="font-bold pb-2 text-gray-900 dark:text-white">
        {title}
        <span style={getSignStyle(placement.sign)}>{placement.sign}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-2 bg-gray-50 dark:bg-gray-700 py-1 px-2 rounded">
        {planet} transited {placement.sign} in your {houseNumber}
        {getOrdinalSuffix(houseNumber)} house
        <br />
        from {placement.start} - {placement.end}
      </p>

      <div
        className={`mt-2 ${
          isPast ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-purple-50 dark:bg-purple-900/30'
        } p-2 rounded grid sm:grid-cols-5 sm:gap-2 gap-1`}
      >
        <p className="col-span-1 text-sm capitalize text-slate-600 dark:text-slate-400">
          House {houseNumber}:
          <b className="block text-xs text-slate-400 dark:text-slate-500">(area of life)</b>
        </p>
        <p className="col-span-4 text-sm text-gray-800 dark:text-gray-200">{houseTheme}</p>
        <p className="col-span-1 text-sm capitalize text-slate-600 dark:text-slate-400">Gifts:</p>
        <p className="col-span-4 text-sm text-gray-800 dark:text-gray-200">{placement.high}</p>
        <p className="col-span-1 text-sm capitalize text-slate-600 dark:text-slate-400">
          Challenges:
        </p>
        <p className="col-span-4 text-sm text-gray-800 dark:text-gray-200">{placement.low}</p>
      </div>
    </div>
  );
}

export function TransitsResults({ result }: TransitsResultsProps) {
  if (!result) {
    return (
      <ResultSection title="Planetary Transits" defaultOpen={true}>
        <p className="text-gray-600 dark:text-gray-400">No transit data available</p>
      </ResultSection>
    );
  }

  return (
    <ResultSection title="Planetary Transits" defaultOpen={true}>
      <div className="space-y-5">
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
            Rising Sign: <span className="font-bold">{result.risingSign}</span>
          </p>
        </div>

        {result.transits.map((transit, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 bg-opacity-90 p-6 rounded-2xl backdrop-blur-md"
            style={{
              borderTop: '3px solid',
              borderImage: (SIGN_COLORS[transit.current.sign] || '#ccc') + ' 1',
            }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              {transit.planet}
            </h3>

            <p className="text-sm mb-3 italic bg-gray-50 dark:bg-gray-700 p-2 rounded text-gray-700 dark:text-gray-300">
              <span className="font-medium">{transit.planet}</span> {transit.planetTheme}
            </p>

            <div className="grid gap-4">
              <TransitCard
                planet={transit.planet}
                placement={transit.current}
                houseNumber={transit.houseNumber}
                title="Current Transit → "
                isPast={false}
              />
              <TransitCard
                planet={transit.planet}
                placement={transit.past}
                houseNumber={transit.houseNumber}
                title="Past Transit → "
                isPast={true}
              />
            </div>
          </div>
        ))}
      </div>
    </ResultSection>
  );
}

export default TransitsResults;
