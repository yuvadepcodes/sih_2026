import React, { useState } from 'react';
import { X, Printer, Copy, Check, Scale, ShieldAlert, Award } from 'lucide-react';
import { LegalMetrologyAuditReport } from '../types';
import { InspectionSummary } from '../utils/legalMetrologyEngine';

interface StatutoryMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditReport: LegalMetrologyAuditReport;
  summary: InspectionSummary;
}

export const StatutoryMemoModal: React.FC<StatutoryMemoModalProps> = ({
  isOpen,
  onClose,
  auditReport,
  summary,
}) => {
  const [copied, setCopied] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const memoRefNo = `DCA/LM/INSP/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;

  const d = auditReport.declarations;
  const entityName = d.manufacturer_or_packer.entity_name || 'Manufacturer / Packer / Importer of Record';
  const entityAddress = d.manufacturer_or_packer.full_address || 'Address not declared / illegible on label';
  const commodityName = d.common_or_generic_name.raw_text || 'Pre-packaged Retail Commodity';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textContent = `
GOVERNMENT OF INDIA
MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
DEPARTMENT OF CONSUMER AFFAIRS
LEGAL METROLOGY DIVISION
KRISHI BHAWAN, NEW DELHI - 110001
============================================================
STATUTORY INSPECTION MEMORANDUM & NOTICE
Reference No: ${memoRefNo}
Date: ${currentDate}

SUBJECT: STATUTORY NOTICE UNDER LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011 & SECTION 36 OF THE LEGAL METROLOGY ACT, 2009

TARGET COMMODITY: ${commodityName}
RESPONSIBLE PARTY: ${entityName}
DECLARED ADDRESS: ${entityAddress}
OVERALL AUDIT COMPLIANCE SCORE: ${summary.complianceScore}%
INSPECTOR VERDICT: ${summary.inspectorVerdict}

STATUTORY FINDINGS:
${summary.ruleChecks
  .map(
    (c, i) =>
      `${i + 1}. [${c.status}] ${c.ruleCitation} - ${c.ruleTitle}
   Finding: ${c.finding}
   Statutory Provision: ${c.legalActSection || 'Rule 6 of Packaged Commodities Rules, 2011'}`
  )
  .join('\n\n')}

ENFORCEMENT LIABILITY / ACTION:
${summary.statutoryPenaltyEstimate}

By Order of:
Authorized Officer / Senior Inspector
Legal Metrology Enforcement Wing
Department of Consumer Affairs, Government of India
============================================================
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-3xl w-full my-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Scale className="h-5 w-5 text-blue-900" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Official Inspection Memorandum & Statutory Notice
              </h3>
              <p className="text-[11px] text-slate-500">
                Generated per Legal Metrology Enforcement Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notice Content (Document styled) */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-800 font-sans space-y-5 text-xs sm:text-sm print:p-0">
          {/* Emblem & Department header */}
          <div className="text-center pb-4 border-b border-slate-200 space-y-1">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-bold uppercase tracking-wider mb-1">
              भारत सरकार • Government of India
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide uppercase">
              Ministry of Consumer Affairs, Food & Public Distribution
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Department of Consumer Affairs • Legal Metrology Division
            </p>
            <p className="text-[11px] text-slate-500">
              Krishi Bhawan, New Delhi - 110001
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-3 border-t border-slate-100 mt-2">
              <span>Notice Ref: <strong className="text-blue-900">{memoRefNo}</strong></span>
              <span>Date: <strong>{currentDate}</strong></span>
            </div>
          </div>

          {/* Subject */}
          <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-200">
            <p className="font-bold text-blue-950 text-xs sm:text-sm">
              SUBJECT: STATUTORY AUDIT & FORMAL NOTICE UNDER LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011 & SECTION 36 OF THE LEGAL METROLOGY ACT, 2009.
            </p>
          </div>

          {/* Subject Package Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Target Commodity:
              </span>
              <span className="font-bold text-slate-900 text-sm">{commodityName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Responsible Entity:
              </span>
              <span className="font-bold text-slate-900 text-sm truncate block">{entityName}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Declared Address on Packaging:
              </span>
              <span className="text-slate-700">{entityAddress}</span>
            </div>
          </div>

          {/* Inspection Verdict summary */}
          <div
            className={`p-4 rounded-lg border text-xs ${
              summary.status === 'COMPLIANT'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <p className="font-bold text-sm mb-1 uppercase tracking-wide">
              Inspector Verdict: {summary.status} (Compliance Score: {summary.complianceScore}%)
            </p>
            <p className="text-xs leading-relaxed">{summary.inspectorVerdict}</p>
          </div>

          {/* Detailed rule findings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Specific Rule Audit Findings:
            </h4>
            <div className="space-y-2">
              {summary.ruleChecks.map((check) => (
                <div
                  key={check.id}
                  className={`p-3 rounded-lg border text-xs flex flex-col gap-1 ${
                    check.status === 'VIOLATION'
                      ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                      : check.status === 'WARNING'
                      ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">{check.ruleTitle}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        check.status === 'VIOLATION'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : check.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {check.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono font-semibold text-blue-900">{check.ruleCitation}</p>
                  <p className="text-xs mt-0.5 text-slate-700">{check.finding}</p>
                  {check.statutoryPenaltyNotice && (
                    <p className="text-[11px] text-rose-700 font-bold mt-0.5">
                      Statutory Directive: {check.statutoryPenaltyNotice}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action clause */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <p className="font-bold text-slate-900 uppercase text-[11px]">Enforcement Directive:</p>
            <p className="leading-relaxed">{summary.statutoryPenaltyEstimate}</p>
            <p className="text-[11px] text-slate-500 italic mt-1">
              Under Section 48 of the Act, compounding of offences may be exercised prior to or subsequent to initiation of prosecution by the competent Controller.
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Legal Metrology Division</p>
              <p>Department of Consumer Affairs, Government of India</p>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 w-44 ml-auto"></div>
              <p className="font-bold text-slate-900">Authorized Legal Metrology Officer</p>
              <p className="text-[11px] text-slate-500">Official Seal & Signature</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Dismiss
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Notice Text'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Official Notice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
