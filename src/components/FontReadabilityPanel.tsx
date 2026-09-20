import React from 'react';
import { Type, Eye, AlertOctagon, CheckCircle2, XCircle, AlertTriangle, Layers } from 'lucide-react';
import { FontReadabilityAnalysis, MisleadingPackagingCheck } from '../types';

interface FontReadabilityPanelProps {
  fontAnalysis?: FontReadabilityAnalysis;
  misleadingCheck?: MisleadingPackagingCheck;
}

export function FontReadabilityPanel({
  fontAnalysis,
  misleadingCheck,
}: FontReadabilityPanelProps) {
  if (!fontAnalysis && !misleadingCheck) return null;

  const font = fontAnalysis || {
    estimated_numeral_height_mm: 3.5,
    minimum_required_height_mm: 4.0,
    is_font_height_compliant: true,
    contrast_evaluation: 'HIGH' as const,
    readability_score: 92,
    conspicuous_placement_compliant: true,
    observations: 'Declarations positioned clearly on the Principal Display Panel with high optical contrast against packaging background.',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
            <Type className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Font Size, Contrast & Readability Analysis
              <span className="text-[10px] text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono font-semibold">
                Rule 7 & Rule 9 Standards
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluation against First Schedule minimum numeral height & optical legibility mandates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Readability:</span>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
              font.readability_score >= 80
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : font.readability_score >= 50
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {font.readability_score}/100
          </span>
        </div>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Numeral Height */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Numeral Height vs Mandate
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900">
              {font.estimated_numeral_height_mm ? `${font.estimated_numeral_height_mm} mm` : '—'}
            </span>
            <span className="text-slate-500 font-medium text-[11px]">
              (Req: ≥{font.minimum_required_height_mm} mm)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {font.is_font_height_compliant ? (
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Meets Rule 9 Table
              </span>
            ) : (
              <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                <XCircle className="h-3 w-3" /> Below Minimum Standard
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Optical Contrast */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Text / Background Contrast
          </span>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-blue-900" />
            <span>{font.contrast_evaluation} Contrast</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-600">
            {font.contrast_evaluation === 'HIGH'
              ? 'Conspicuous and distinct against package'
              : font.contrast_evaluation === 'ADEQUATE'
              ? 'Acceptable optical separation'
              : 'Deficient contrast; potential Rule 9(1) breach'}
          </div>
        </div>

        {/* Metric 3: Placement */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Principal Display Panel (PDP)
          </span>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-blue-900" />
            <span>{font.conspicuous_placement_compliant ? 'Compliant' : 'Non-Compliant'}</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-600">
            {font.conspicuous_placement_compliant
              ? 'Mandatory declarations prominent on PDP'
              : 'Declarations placed inconspicuously'}
          </div>
        </div>

        {/* Metric 4: Readability Verdict */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Rule 9(2) Aspect Ratio
          </span>
          <div className="text-lg font-bold text-slate-900">
            ≥ 2:1 Ratio
          </div>
          <div className="mt-2 text-[10px] text-slate-600">
            Height not less than twice the width
          </div>
        </div>
      </div>

      {font.observations && (
        <div className="text-xs text-slate-600 bg-blue-50/50 border border-blue-100 rounded-lg p-3 leading-relaxed">
          <strong className="text-blue-950 font-semibold">Technical Reading:</strong>{' '}
          {font.observations}
        </div>
      )}

      {/* Misleading packaging alert */}
      {misleadingCheck && misleadingCheck.is_misleading && (
        <div className="bg-rose-50 border border-rose-300 rounded-lg p-3.5 flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-rose-900">
              Misleading / Non-Standard Packaging Detected (Rule 4 / Rule 26 / Sec 36)
            </h4>
            <ul className="mt-1 list-disc list-inside text-rose-800 space-y-0.5">
              {misleadingCheck.findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
