import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { LegalMetrologyAuditReport } from '../types';
import { InspectionSummary } from '../utils/legalMetrologyEngine';

interface SimpleComplianceReportProps {
  auditReport: LegalMetrologyAuditReport;
  summary: InspectionSummary;
  onScanAnother: () => void;
}

export const SimpleComplianceReport: React.FC<SimpleComplianceReportProps> = ({
  summary,
  onScanAnother,
}) => {
  const isCompliant = summary.status === 'COMPLIANT';
  const violations = summary.ruleChecks.filter((c) => c.status === 'VIOLATION');
  const warnings = summary.ruleChecks.filter((c) => c.status === 'WARNING');
  const passedChecks = summary.ruleChecks.filter((c) => c.status === 'COMPLIANT');

  const totalErrors = violations.length + warnings.length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-6 p-6">
      {/* 1. Is it completely compliance? */}
      <div
        className={`rounded-xl p-5 border-2 flex items-center justify-between gap-4 ${
          isCompliant
            ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
            : 'bg-rose-50 border-rose-500 text-rose-950'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
              isCompliant ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {isCompliant ? (
              <CheckCircle2 className="h-7 w-7" />
            ) : (
              <AlertOctagon className="h-7 w-7" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              Is it Completely Compliant?
            </div>
            <div className="text-xl sm:text-2xl font-black mt-0.5">
              {isCompliant ? 'YES — Completely Compliant' : 'NO — Not Compliant'}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">
              {isCompliant
                ? 'All packaging rules passed. It is 100% legal to sell this package.'
                : `Found ${totalErrors} issue(s). This package broke legal rules and must be corrected before sale.`}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onScanAnother}
          className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 shadow-2xs transition"
        >
          Scan Another
        </button>
      </div>

      {/* 2. Which is wrong & where it has broke */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-600"></span>
          <span>Which is Wrong & Where it Broke:</span>
        </h3>

        {violations.length === 0 && warnings.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>None! Nothing is wrong with this package. All rules are satisfied.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {violations.map((v, i) => (
              <div
                key={v.id || i}
                className="bg-rose-50/70 border-2 border-rose-300 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white bg-rose-600 px-2 py-0.5 rounded">
                    Issue #{i + 1}
                  </span>
                  <span className="text-xs font-bold text-rose-800">
                    Broken: {v.ruleCitation}
                  </span>
                </div>

                <div className="text-sm">
                  <div className="font-bold text-slate-900">
                    {v.ruleTitle}
                  </div>
                  <div className="text-rose-950 font-medium mt-1">
                    <span className="font-bold">What is wrong: </span>
                    {v.finding}
                  </div>
                  <div className="text-slate-600 text-xs mt-1">
                    <span className="font-bold text-slate-800">Where it broke: </span>
                    {v.description}
                  </div>
                </div>
              </div>
            ))}

            {warnings.map((w, i) => (
              <div
                key={w.id || i}
                className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-1 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white bg-amber-600 px-2 py-0.5 rounded">
                    Advisory
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    {w.ruleCitation}
                  </span>
                </div>
                <div className="font-bold text-slate-900">{w.ruleTitle}</div>
                <div className="text-amber-950 font-medium text-xs mt-1">
                  {w.finding}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Which is not wrong (What is correct) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
          <span>Which is Not Wrong (Passed Rules):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {passedChecks.map((p, i) => (
            <div
              key={p.id || i}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 text-xs"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">{p.ruleTitle}</div>
                <div className="text-slate-600 mt-0.5">{p.finding}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
