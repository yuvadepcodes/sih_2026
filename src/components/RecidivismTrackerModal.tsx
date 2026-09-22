import React, { useState, useMemo } from 'react';
import { X, Search, ShieldAlert, History, AlertTriangle, CheckCircle, FileText, Building2, ChevronRight, IndianRupee } from 'lucide-react';
import { MANUFACTURER_REGISTRY } from '../data/recidivismDatabase';
import { ManufacturerRecidivismProfile } from '../types';

interface RecidivismTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectManufacturer?: (mfr: ManufacturerRecidivismProfile) => void;
}

export const RecidivismTrackerModal: React.FC<RecidivismTrackerModalProps> = ({
  isOpen,
  onClose,
  onSelectManufacturer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ManufacturerRecidivismProfile | null>(null);

  const filteredProfiles = useMemo(() => {
    if (!searchTerm.trim()) return MANUFACTURER_REGISTRY;
    const q = searchTerm.toLowerCase();
    return MANUFACTURER_REGISTRY.filter(
      (p) =>
        p.entityName.toLowerCase().includes(q) ||
        p.registrationNumber.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.violationHistory.some((v) => v.productName.toLowerCase().includes(q) || v.inspectionId.toLowerCase().includes(q))
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="text-base font-bold tracking-wide flex items-center gap-2">
                National Packaging Recidivism Register & Offender History
              </h2>
              <p className="text-xs text-blue-200">
                Tracking Repeat Violations, Historical Default Notices & Compounding Status under Legal Metrology Act
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-blue-900 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Manufacturer Name, Brand, CIN/Registration, or Product (e.g. PepsiCo, Nestlé, Haldiram, E-Com)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Main Content Area: Split View or Detail View */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: Manufacturer List */}
          <div className={`${selectedProfile ? 'md:col-span-5' : 'md:col-span-12'} space-y-3 overflow-y-auto max-h-[55vh]`}>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1 px-1">
              <span>REGISTERED ENTITIES ({filteredProfiles.length})</span>
              <span>RISK TIER</span>
            </div>

            {filteredProfiles.map((mfr) => {
              const isCritical = mfr.riskRating === 'CRITICAL_REPEAT_OFFENDER';
              const isMedium = mfr.riskRating === 'MEDIUM';
              const isSelected = selectedProfile?.id === mfr.id;

              return (
                <div
                  key={mfr.id}
                  onClick={() => setSelectedProfile(mfr)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/70 shadow-xs ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                        <Building2 className="h-3.5 w-3.5 text-blue-900 shrink-0" />
                        <span>{mfr.entityName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono truncate">
                        {mfr.registrationNumber}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isMedium
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isCritical ? 'REPEAT OFFENDER' : isMedium ? 'MODERATE' : 'COMPLIANT'}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>
                      Audits: <strong>{mfr.totalInspections}</strong> | Defaults: <strong className={mfr.totalViolations > 0 ? 'text-rose-600' : 'text-emerald-600'}>{mfr.totalViolations}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-blue-900 font-semibold text-[11px]">
                      View Dossier <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredProfiles.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No matching manufacturer or e-commerce packer found in the national register.
              </div>
            )}
          </div>

          {/* Right Column: Selected Dossier Detail */}
          {selectedProfile && (
            <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto max-h-[55vh] space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-blue-950">{selectedProfile.entityName}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedProfile.registrationNumber}</p>
                  <p className="text-xs text-slate-600 mt-0.5">Jurisdiction: {selectedProfile.state}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded bg-slate-200 md:hidden"
                >
                  Back to List
                </button>
              </div>

              {/* High-level metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Raids/Audits</span>
                  <span className="text-base font-extrabold text-slate-900">{selectedProfile.totalInspections}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Default Notices</span>
                  <span className={`text-base font-extrabold ${selectedProfile.totalViolations > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {selectedProfile.totalViolations}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Compounding Paid</span>
                  <span className="text-base font-extrabold text-amber-700">₹{selectedProfile.compoundedFeesPaidInr.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* History Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-blue-900" />
                  Statutory Violation History & Notices
                </h4>

                <div className="space-y-2">
                  {selectedProfile.violationHistory.map((v, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{v.productName}</span>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {v.inspectionId} • {v.date}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        <span className="font-semibold text-rose-700">Violations: </span>
                        {v.violations.join(', ')}
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                        <span className="text-slate-500">{v.actionTaken}</span>
                        <span className="font-bold text-amber-800">
                          {v.penaltyInr > 0 ? `Penalty: ₹${v.penaltyInr.toLocaleString('en-IN')}` : 'Improvement Window (₹0)'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {onSelectManufacturer && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectManufacturer(selectedProfile);
                    onClose();
                  }}
                  className="w-full mt-2 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Attach Manufacturer Profile to Current Audit Docket
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>National Legal Metrology Enforcement Registry • Updated Daily</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
