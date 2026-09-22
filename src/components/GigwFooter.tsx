import React from 'react';
import { ShieldCheck, Award, Lock, FileText, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { PolicyTab } from './LegalPoliciesModal';

interface GigwFooterProps {
  onOpenPolicy: (tab: PolicyTab) => void;
  language?: 'en' | 'hi';
}

export const GigwFooter: React.FC<GigwFooterProps> = ({ onOpenPolicy, language = 'en' }) => {
  const isHindi = language === 'hi';

  return (
    <footer className="mt-12 bg-slate-950 text-slate-300 text-xs border-t-2 border-amber-600 print:hidden">
      {/* Upper Navigation & Policy Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Col 1: Government Identity & Division Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/emblem-of-india.svg"
                alt="State Emblem of India"
                className="h-12 w-auto object-contain brightness-0 invert opacity-90"
              />
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  {isHindi ? 'विधिक मापविज्ञान प्रभाग' : 'LEGAL METROLOGY DIVISION'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isHindi
                    ? 'उपभोक्ता मामले विभाग • भारत सरकार'
                    : 'Department of Consumer Affairs • Government of India'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
              National statutory portal for digital inspection, compliance enforcement, and evidence verification under The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011.
            </p>
          </div>

          {/* Col 2: Mandatory GIGW Legal Policies */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3 text-amber-400">
              Statutory Policies & GIGW
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-amber-300 transition underline underline-offset-2 flex items-center gap-1.5"
                >
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-amber-300 transition underline underline-offset-2 flex items-center gap-1.5"
                >
                  <FileText className="h-3 w-3 text-slate-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('copyright')}
                  className="hover:text-amber-300 transition underline underline-offset-2 flex items-center gap-1.5"
                >
                  <Award className="h-3 w-3 text-slate-400" />
                  <span>Copyright Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('hyperlinking')}
                  className="hover:text-amber-300 transition underline underline-offset-2 flex items-center gap-1.5"
                >
                  <Globe className="h-3 w-3 text-slate-400" />
                  <span>Hyperlinking Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('disclaimer')}
                  className="hover:text-amber-300 transition underline underline-offset-2 flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-3 w-3 text-slate-400" />
                  <span>Disclaimer</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: STQC Compliance Badges & Accreditation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3 text-amber-400">
              Standards & Security
            </h4>
            <button
              type="button"
              onClick={() => onOpenPolicy('stqc')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-600 transition"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>STQC Certified • GIGW 3.0</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Conforms to Guidelines for Indian Government Websites & WCAG 2.1 AA
              </p>
            </button>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
              <span className="text-white font-semibold block">Jan Vishwas Act 2023 Compliant</span>
              Decriminalized statutory compounding engine with evidentiary audit trails.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Attribution Bar */}
      <div className="border-t border-slate-800 bg-black/50 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            <span>
              © 2026 Department of Consumer Affairs, Government of India. All Rights Reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span>Last Reviewed & Updated: <strong>21 September 2026</strong></span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span>Hosted by <strong>National Informatics Centre (NIC)</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
