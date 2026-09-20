import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, AlertTriangle, Copy, Check, Download, FileText, ArrowUpRight } from 'lucide-react';
import { InspectionSummary } from '../utils/legalMetrologyEngine';
import { LegalMetrologyAuditReport } from '../types';

interface VerdictBannerProps {
  summary: InspectionSummary;
  auditReport: LegalMetrologyAuditReport;
  onOpenMemo: () => void;
}

export const InspectionVerdictBanner: React.FC<VerdictBannerProps> = ({
  summary,
  auditReport,
  onOpenMemo,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(auditReport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `legal-metrology-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isCompliant = summary.status === 'COMPLIANT';
  const isViolation = summary.status === 'NON_COMPLIANT';

  return (
    <div
      className={`rounded-xl border p-5 shadow-xs transition ${
        isCompliant
          ? 'bg-emerald-50/70 border-emerald-300'
          : isViolation
          ? 'bg-rose-50/70 border-rose-300'
          : 'bg-amber-50/70 border-amber-300'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isCompliant
                ? 'bg-emerald-600 text-white'
                : isViolation
                ? 'bg-rose-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {isCompliant ? (
              <ShieldCheck className="h-7 w-7" />
            ) : isViolation ? (
              <AlertOctagon className="h-7 w-7" />
            ) : (
              <AlertTriangle className="h-7 w-7" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isCompliant
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : isViolation
                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {summary.status === 'COMPLIANT'
                  ? 'Statutory Compliance Verified'
                  : summary.status === 'NON_COMPLIANT'
                  ? 'Statutory Violations Identified'
                  : 'Notice Required'}
              </span>

              <span className="text-xs font-bold text-slate-700 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                Rule 6 Score: {summary.complianceScore}%
              </span>

              {summary.totalViolations > 0 && (
                <span className="text-[11px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                  {summary.totalViolations} Actionable Breach{summary.totalViolations > 1 ? 'es' : ''}
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {summary.inspectorVerdict}
            </h3>

            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              <span className="font-bold text-slate-900">Enforcement Action: </span>
              {summary.statutoryPenaltyEstimate}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={handleCopyJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
            title="Copy Verbatim Extracted JSON"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
            title="Download JSON Report"
          >
            <Download className="h-3.5 w-3.5 text-blue-900" />
            <span>Export Report</span>
          </button>

          <button
            type="button"
            onClick={onOpenMemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition"
          >
            <FileText className="h-3.5 w-3.5 text-amber-300" />
            <span>Official Memo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
