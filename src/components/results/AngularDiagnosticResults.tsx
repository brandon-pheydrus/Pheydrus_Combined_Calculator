import { useState } from 'react';
import type {
  AngularDiagnosticResult,
  GradeItem,
  PillarSummary,
  FinalGrade,
} from '../../models/diagnostic';
import { ChevronDownIcon } from '../icons';

interface AngularDiagnosticResultsProps {
  result: AngularDiagnosticResult | undefined;
}

const GRADE_COLORS: Record<
  FinalGrade,
  { bg: string; text: string; border: string; label: string }
> = {
  A: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-400',
    label: 'Excellent',
  },
  B: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-400', label: 'Good' },
  D: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-400',
    label: 'Challenging',
  },
  F: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-400', label: 'Difficult' },
};

// Pillar colours: Structure=orange, Timing=blue, Environment=purple
const PILLAR_COLORS = ['#f97316', '#3b82f6', '#8b5cf6'] as const;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const span = endDeg - startDeg;
  if (span >= 359.99) {
    // Full circle — two half-arcs
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  }
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = span > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

function FSourcePieChart({ pillars, totalFs }: { pillars: readonly PillarSummary[]; totalFs: number }) {
  const cx = 90, cy = 90, r = 72;

  if (totalFs === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 180 180" className="w-32 h-32">
          <circle cx={cx} cy={cy} r={r} fill="#10b981" />
          <text x={cx} y={cy - 7} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">All</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">A&apos;s</text>
        </svg>
        <p className="text-xs text-emerald-700 font-semibold">Zero Pressure Points</p>
      </div>
    );
  }

  let angle = 0;
  const slices = pillars
    .map((p, i) => {
      if (p.fCount === 0) return null;
      const sweep = (p.fCount / totalFs) * 360;
      const slice = {
        path: arcPath(cx, cy, r, angle, angle + sweep),
        color: PILLAR_COLORS[i],
        name: p.name,
        fCount: p.fCount,
        pct: Math.round((p.fCount / totalFs) * 100),
      };
      angle += sweep;
      return slice;
    })
    .filter(Boolean);

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 180 180" className="w-32 h-32 shrink-0">
        {slices.map((s, i) =>
          s ? <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="1.5" /> : null
        )}
      </svg>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#6b6188] uppercase tracking-wide mb-1">F Sources</p>
        {slices.map((s, i) =>
          s ? (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-xs text-[#2d2a3e] font-medium">{s.name}</span>
              <span className="text-xs font-bold text-[#2d2a3e]">{s.pct}%</span>
              <span className="text-xs text-gray-400">({s.fCount} F{s.fCount !== 1 ? "'s" : ''})</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

function getGradeItemStyle(grade: GradeItem['grade']): string {
  if (grade === 'F') return 'bg-red-50 border-l-4 border-red-400';
  if (grade === 'A') return 'bg-emerald-50 border-l-4 border-emerald-400';
  return 'bg-gray-50 border-l-4 border-gray-300';
}

function getGradeBadge(grade: GradeItem['grade']): string {
  if (grade === 'F') return 'bg-red-100 text-red-700';
  if (grade === 'A') return 'bg-emerald-100 text-emerald-700';
  return 'bg-gray-100 text-gray-500';
}

function PillarSection({ summary }: { summary: PillarSummary }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasFs = summary.fCount > 0;
  const hasAs = summary.aCount > 0;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white bg-[#2d2a3e] rounded-full w-7 h-7 flex items-center justify-center">
            {summary.pillar}
          </span>
          <div className="text-left">
            <h3 className="text-base font-semibold text-[#2d2a3e]">{summary.name}</h3>
            <p className="text-xs text-[#6b6188]">{summary.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasFs && (
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">
              {summary.fCount} F{summary.fCount !== 1 ? "'s" : ''}
            </span>
          )}
          {hasAs && (
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
              {summary.aCount} A{summary.aCount !== 1 ? "'s" : ''}
            </span>
          )}
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-5 py-4 bg-white">
          {summary.items.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No data available for this pillar</p>
          ) : (
            <div className="space-y-2">
              {summary.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-3 rounded px-3 py-2 ${getGradeItemStyle(item.grade)}`}
                >
                  <div className="text-sm text-[#2d2a3e]">
                    <span className="font-semibold">{item.source}</span>
                    <span className="block text-xs text-[#6b6188] mt-0.5">{item.reason}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded shrink-0 ${getGradeBadge(item.grade)}`}
                  >
                    {item.grade === 'Neutral' ? '—' : item.grade}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AngularDiagnosticResults({ result }: AngularDiagnosticResultsProps) {
  if (!result) return null;

  const gradeStyle = GRADE_COLORS[result.finalGrade];

  return (
    <div className="mb-8">
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header with final grade */}
        <div className={`px-6 py-5 ${gradeStyle.bg} border-b-2 ${gradeStyle.border}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#9a7d4e]">Angular Diagnostic</h2>
              <p className="text-sm text-[#6b6188] mt-1">
                The Three Pillars Model — Structure, Timing, Environment
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-[#6b6188]">Total F&apos;s</p>
                <p className="text-2xl font-bold text-red-600">{result.totalFs}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6b6188]">Total A&apos;s</p>
                <p className="text-2xl font-bold text-emerald-600">{result.totalAs}</p>
              </div>
              <div
                className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center border-2 ${gradeStyle.border} ${gradeStyle.bg}`}
              >
                <span className={`text-3xl font-black ${gradeStyle.text}`}>
                  {result.finalGrade}
                </span>
                <span className={`text-[10px] font-medium ${gradeStyle.text}`}>
                  {gradeStyle.label}
                </span>
              </div>
            </div>
          </div>

          {/* Pie chart — F source breakdown */}
          <div className="mt-4 pt-4 border-t border-black/10">
            <FSourcePieChart pillars={result.pillars} totalFs={result.totalFs} />
          </div>
        </div>

        {/* Pillar sections */}
        <div className="p-6 bg-white space-y-4">
          {result.pillars.map((pillar) => (
            <PillarSection key={pillar.pillar} summary={pillar} />
          ))}
        </div>

        {/* Grade scale reference */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b6188]">
            <span className="font-medium">Grade Scale:</span>
            <span>A = 0-2 F&apos;s</span>
            <span>B = 3-6 F&apos;s</span>
            <span>D = 7-9 F&apos;s</span>
            <span>F = 10+ F&apos;s</span>
            <span className="ml-auto italic">A&apos;s do not offset F&apos;s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AngularDiagnosticResults;
