import React from 'react';
import {
  BookOpen,
  Wifi,
  WifiOff,
  UserCheck,
  Search,
  Scale,
  Sun,
  Moon,
  PhoneCall,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { OfficerRole, GigwAccessibilitySettings } from '../types';

interface GigwHeaderProps {
  currentRole: OfficerRole;
  onRoleChange: (role: OfficerRole) => void;
  accessibility: GigwAccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<GigwAccessibilitySettings>) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  offlineDraftsCount: number;
  onOpenRules: () => void;
  onOpenRecidivism: () => void;
  onResetScan: () => void;
  hasActiveReport: boolean;
}

export const GigwHeader: React.FC<GigwHeaderProps> = ({
  currentRole,
  onRoleChange,
  accessibility,
  onUpdateAccessibility,
  isOnline,
  onToggleOnline,
  offlineDraftsCount,
  onOpenRules,
  onOpenRecidivism,
  onResetScan,
  hasActiveReport,
}) => {
  const isHindi = accessibility.language === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* 1. National Tricolor Strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* 2. GIGW Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-[11px] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4">
          {/* Left: Official Government Portal Cues */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:bg-amber-400 focus:text-slate-950 focus:px-2 focus:py-0.5 focus:rounded text-xs font-bold"
            >
              Skip to Main Content
            </a>

            <span className="font-bold text-white tracking-wide">
              {isHindi ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden md:inline">
              {isHindi
                ? 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय'
                : 'Ministry of Consumer Affairs, Food & Public Distribution'}
            </span>
          </div>

          {/* Right: Helpline, Accessibility Controls, Bilingual Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* National Consumer Helpline (NCH) */}
            <a
              href="tel:1915"
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition"
              title="National Consumer Helpline Toll-Free"
            >
              <PhoneCall className="h-3 w-3" />
              <span>NCH: 1915</span>
            </a>

            <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

            {/* Accessibility Font Size Controls (A-, A, A+) */}
            <div className="flex items-center gap-1 font-bold text-slate-300" title="Text Resizing Controls (GIGW Standard)">
              <button
                type="button"
                onClick={() => onUpdateAccessibility({ fontSizeLevel: 'normal' })}
                className={`px-1 py-0.5 rounded transition ${
                  accessibility.fontSizeLevel === 'normal'
                    ? 'bg-blue-800 text-white font-extrabold'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
                aria-label="Normal Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => onUpdateAccessibility({ fontSizeLevel: 'large' })}
                className={`px-1 py-0.5 rounded transition ${
                  accessibility.fontSizeLevel === 'large'
                    ? 'bg-blue-800 text-white font-extrabold'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
                aria-label="Large Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onUpdateAccessibility({ fontSizeLevel: 'larger' })}
                className={`px-1 py-0.5 rounded transition ${
                  accessibility.fontSizeLevel === 'larger'
                    ? 'bg-blue-800 text-white font-extrabold'
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
                aria-label="Largest Font Size"
              >
                A+
              </button>
            </div>

            <div className="h-3 w-px bg-slate-700"></div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={() => onUpdateAccessibility({ highContrast: !accessibility.highContrast })}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition px-1 py-0.5 rounded hover:bg-slate-800"
              title="Toggle High-Contrast Mode for Field Sunlight / Enforcement"
              aria-label="High Contrast Toggle"
            >
              {accessibility.highContrast ? (
                <>
                  <Sun className="h-3 w-3 text-amber-400" />
                  <span className="hidden sm:inline">Normal</span>
                </>
              ) : (
                <>
                  <Moon className="h-3 w-3 text-blue-300" />
                  <span className="hidden sm:inline">Contrast</span>
                </>
              )}
            </button>

            <div className="h-3 w-px bg-slate-700"></div>

            {/* Language Switcher (English / हिन्दी) */}
            <button
              type="button"
              onClick={() => onUpdateAccessibility({ language: isHindi ? 'en' : 'hi' })}
              className="font-bold text-amber-300 hover:text-amber-200 transition px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700"
              title="Bilingual Switcher"
            >
              {isHindi ? 'English' : 'हिन्दी'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Official Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Emblem & Department Branding */}
        <div className="flex items-center gap-3">
          <img
            src="/emblem-of-india.svg"
            alt="State Emblem of India"
            className="h-11 sm:h-12 w-auto object-contain shrink-0"
          />

          <div className="border-l border-slate-300 pl-3">
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-wide block">
              {isHindi ? 'भारत सरकार • विधिक मापविज्ञान प्रभाग' : 'भारत सरकार • Government of India'}
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-blue-950 tracking-tight leading-tight">
              {isHindi ? 'पैकेजिंग अनुपालन स्कैनर' : 'Packaging Compliance Scanner'}
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-slate-600">
              {isHindi ? 'उपभोक्ता मामले विभाग' : 'Department of Consumer Affairs'}
            </p>
          </div>
        </div>

        {/* Right: Role Switcher & Tactical Enforcement Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* RBAC Role Selector Dropdown */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-blue-900 ml-1.5 mr-1 shrink-0" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as OfficerRole)}
              className="bg-transparent font-bold text-slate-800 pr-1 py-0.5 focus:outline-none cursor-pointer text-xs"
              title="Select Enforcement Role"
            >
              <option value="INSPECTOR">Field Inspector</option>
              <option value="ADJUDICATING_OFFICER">Adjudicating Officer</option>
              <option value="DIRECTOR">Director / Controller</option>
            </select>
          </div>

          {/* Offender Recidivism Search */}
          <button
            type="button"
            onClick={onOpenRecidivism}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs cursor-pointer"
            title="Search National Recidivism & Offender Registry"
          >
            <Search className="h-3.5 w-3.5 text-blue-900" />
            <span className="hidden sm:inline">Offender Register</span>
          </button>

          {/* Legal Reference Rules */}
          <button
            type="button"
            onClick={onOpenRules}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs cursor-pointer"
            title="Legal Metrology Act & Packaging Rules Reference"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-900" />
            <span className="hidden md:inline">Legal Rules</span>
          </button>

          {/* Offline/Online Mode Sync Indicator */}
          <button
            type="button"
            onClick={onToggleOnline}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl transition border shadow-2xs cursor-pointer ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Click to toggle simulated Field Offline mode"
          >
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden lg:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-600" />
                <span>Offline ({offlineDraftsCount})</span>
              </>
            )}
          </button>

          {/* Reset / New Scan button */}
          {hasActiveReport && (
            <button
              type="button"
              onClick={onResetScan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              title="Clear & Start New Packaging Audit"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Audit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
