import React from 'react';
import { BookOpen, FileText, CheckCircle2, Shield, ArrowRight, Award } from 'lucide-react';

interface HeaderProps {
  onOpenReference: () => void;
  onOpenMemo?: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReference, onOpenMemo, hasResult }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top tricolor subtle accent strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Official Top Banner */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">भारत सरकार | Government of India</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 hidden md:inline">उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय</span>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="text-slate-600 hidden md:inline">Ministry of Consumer Affairs</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            National Portal Live
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-500">Legal Metrology Division</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Emblem & Portal Identity */}
          <div className="flex items-center gap-3.5">
            {/* National Emblem Representation / Ashoka Stambh Badge */}
            <div className="h-12 w-12 rounded-lg bg-blue-900 border border-blue-950 flex flex-col items-center justify-center text-white shrink-0 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent"></div>
              <Shield className="h-6 w-6 text-amber-300 relative z-10" />
              <span className="text-[7px] font-black tracking-widest uppercase text-amber-200 mt-0.5 relative z-10">DCA • GOI</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  National Enforcement Portal
                </span>
                <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
                  Rule 6 Mandate Engine
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Legal Metrology Packaging Inspector
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Automated Audit under Legal Metrology (Packaged Commodities) Rules, 2011 & Sec 36 of 2009 Act
              </p>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              type="button"
              onClick={onOpenReference}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition"
              title="Open Official Rulebook and SI Units Reference"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-800" />
              <span>Statutory Rulebook</span>
            </button>

            {hasResult && onOpenMemo && (
              <button
                type="button"
                onClick={onOpenMemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white shadow-xs transition"
              >
                <FileText className="h-3.5 w-3.5 text-amber-300" />
                <span>Issue Statutory Memo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
