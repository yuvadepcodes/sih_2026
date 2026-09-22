import React from 'react';
import {
  ShieldAlert,
  Scale,
  BarChart3,
  Calendar,
  AlertCircle,
  FileText,
  Building,
  CheckCircle2,
  Clock,
  IndianRupee,
  TrendingUp,
  MapPin,
  Send,
  Download,
} from 'lucide-react';
import { OfficerRole, OfflineInspectionDraft } from '../types';

interface RoleDashboardProps {
  currentRole: OfficerRole;
  offlineDrafts: OfflineInspectionDraft[];
  onLoadDraft: (draft: OfflineInspectionDraft) => void;
  onOpenJanVishwas: () => void;
  onOpenRecidivism: () => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  currentRole,
  offlineDrafts,
  onLoadDraft,
  onOpenJanVishwas,
  onOpenRecidivism,
}) => {
  if (currentRole === 'INSPECTOR') {
    return (
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-950 font-bold text-xs sm:text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Field Inspector Terminal Mode</span>
          </div>
          <span className="text-[11px] font-mono text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md font-semibold">
            Terminal: LM-NIC-TERM-8841
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Capture multi-angle package photos or upload labels. The optical verification engine computes SHA-256 evidence hashes and checks for mandatory Legal Metrology declarations under PCR 2011.
        </p>

        {offlineDrafts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span>Offline Draft Audits ({offlineDrafts.length})</span>
              <span className="text-amber-700 text-[11px]">Saved in Local Storage</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {offlineDrafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => onLoadDraft(draft)}
                  className="bg-white p-2.5 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-2xs transition cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-blue-950 block">{draft.inspectionId}</span>
                    <span className="text-[11px] text-slate-500">{draft.premiseName || 'Retail Mandi / Godown'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md">
                    Load Scan
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentRole === 'ADJUDICATING_OFFICER') {
    return (
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
            <Scale className="h-4 w-4 text-amber-800" />
            <span>Adjudication & Compounding Bench (Legal Metrology)</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
            Section 36(1) Jan Vishwas Jurisdiction
          </span>
        </div>

        {/* Adjudication KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Notices</span>
            <span className="text-base font-extrabold text-amber-900">12 Cases</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">30-Day Windows Active</span>
            <span className="text-base font-extrabold text-blue-900">7 Mfrs</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Compounded This Month</span>
            <span className="text-base font-extrabold text-emerald-800">₹3,75,000</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Repeat Escalate Tier</span>
            <span className="text-base font-extrabold text-rose-700">2 Entities</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <p className="text-xs text-slate-600">
            Review live inspection files, trigger automated 30-day statutory notices, or issue compounding decrees.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenJanVishwas}
              className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-amber-300" />
              <span>Issue Section 36(1) Notice</span>
            </button>
            <button
              type="button"
              onClick={onOpenRecidivism}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-amber-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Building className="h-3.5 w-3.5 text-amber-800" />
              <span>Offender Recidivism Dossier</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DIRECTOR / CONTROLLER VIEW
  return (
    <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
          <span>Director / State Controller Enforcement Intelligence</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md">
          National Packaging Compliance Index (2026)
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Raids & Audits (YTD)</span>
          <span className="text-base font-extrabold text-white">4,892</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Compliance Rate</span>
          <span className="text-base font-extrabold text-emerald-400">86.4%</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Civil Penalties</span>
          <span className="text-base font-extrabold text-amber-400">₹84.50 Lakh</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Repeat Default Index</span>
          <span className="text-base font-extrabold text-rose-400">3.8%</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
        <span className="text-slate-300 font-bold block text-[11px]">
          HIGH-RISK NON-COMPLIANCE COMMODITY CLUSTERS:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-300">E-Commerce Dark Stores</span>
            <span className="text-rose-400 font-bold">28.4% Deficient</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-300">Imported Cosmetics</span>
            <span className="text-amber-400 font-bold">19.1% Deficient</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-300">Packaged Snacks & USP</span>
            <span className="text-yellow-400 font-bold">11.6% Deficient</span>
          </div>
        </div>
      </div>
    </div>
  );
};
