import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, AlertOctagon, Scale, Shield, FileCheck2, Search } from 'lucide-react';
import {
  LEGAL_METROLOGY_ACT_SECTIONS,
  MANDATORY_DECLARATIONS_RULE_6,
  VALID_SI_SYMBOLS,
  INVALID_UNIT_SYMBOLS,
} from '../data/legalRules';

interface LegalReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalReferenceModal: React.FC<LegalReferenceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rule6' | 'siUnits' | 'actSections'>('rule6');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-blue-900" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Statutory Rulebook & Legal Metrology Reference Manual
              </h3>
              <p className="text-[11px] text-slate-500">
                The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011 (as amended)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 gap-2">
          <button
            onClick={() => setActiveTab('rule6')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'rule6'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Rule 6 Mandatory Declarations
          </button>
          <button
            onClick={() => setActiveTab('siUnits')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'siUnits'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Statutory SI Units & Rule 12 Table
          </button>
          <button
            onClick={() => setActiveTab('actSections')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'actSections'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Legal Metrology Act, 2009 Penalties
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'rule6' && (
            <div className="space-y-3">
              <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200 text-slate-700">
                <p className="font-bold text-blue-950 text-xs mb-1">
                  Rule 6: Declarations to be made on every package
                </p>
                <p className="text-[11px] leading-relaxed">
                  Every package must bear legible, prominent, and conspicuous declarations in English or Hindi in Devanagari script. Every omission constitutes an actionable statutory default.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MANDATORY_DECLARATIONS_RULE_6.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs">{rule.name}</span>
                      <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {rule.rule}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                      {rule.description}
                    </p>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px]">
                      <span className="text-slate-500 font-bold uppercase">Requirement: </span>
                      <span className="text-slate-800">{rule.sampleRequirements}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'siUnits' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200 text-slate-700 text-xs">
                <p className="font-bold text-amber-950 mb-1">
                  Strict Rule 12 & Rule 6(1)(c) Compliance: SI Unit Symbols
                </p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  In accordance with the Legal Metrology (Packaged Commodities) Rules, unit symbols cannot have plural forms ("gms", "kgs", "ltrs", "ml.") or abbreviations not recognized in the First Schedule. Using illegal symbols makes the entire batch liable to seizure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Permitted Units */}
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-1.5 mb-3 text-emerald-900 font-bold text-xs">
                    <CheckCircle className="h-4 w-4 text-emerald-700" />
                    <span>PERMITTED STATUTORY SI SYMBOLS</span>
                  </div>

                  <div className="space-y-2">
                    {VALID_SI_SYMBOLS.map((u, i) => (
                      <div
                        key={i}
                        className="bg-white p-2.5 rounded border border-emerald-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-emerald-800 text-sm">{u.symbol}</span>
                          <span className="text-slate-500 text-[11px] ml-2">({u.fullName})</span>
                        </div>
                        <span className="text-[10px] text-slate-600 capitalize bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {u.dimension}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prohibited Units */}
                <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-4">
                  <div className="flex items-center gap-1.5 mb-3 text-rose-900 font-bold text-xs">
                    <AlertOctagon className="h-4 w-4 text-rose-700" />
                    <span>PROHIBITED / NON-STANDARD SYMBOLS (VIOLATIONS)</span>
                  </div>

                  <div className="space-y-2">
                    {INVALID_UNIT_SYMBOLS.map((inv, i) => (
                      <div
                        key={i}
                        className="bg-white p-2.5 rounded border border-rose-200 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono line-through font-bold text-rose-700">{inv.invalid}</span>
                          <span className="text-[10px] font-bold text-emerald-800">
                            Legal Form: <code className="font-mono bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">{inv.correctAlternative}</code>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1">{inv.legalReason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actSections' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700">
                <p className="font-bold text-slate-900 text-xs mb-1">
                  Enforcement Framework: The Legal Metrology Act, 2009 (No. 1 of 2010)
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Key statutory provisions authorizing inspections, notice issuances, seizures, compounding of offences, and penal fines for non-compliant packaged commodities.
                </p>
              </div>

              <div className="space-y-2.5">
                {LEGAL_METROLOGY_ACT_SECTIONS.map((sec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-blue-900 text-xs">{sec.section}</span>
                      <span className="text-[11px] font-bold text-slate-900">{sec.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed mt-1">
                      {sec.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Statutory Penalty:</span>
                      <span className="font-bold text-rose-800">{sec.penalty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Official legal documentation source: Department of Consumer Affairs, New Delhi.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
