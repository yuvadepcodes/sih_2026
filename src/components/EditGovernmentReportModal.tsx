import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  FileCode,
  Printer,
  Check,
  Building,
  User,
  Calendar,
  Hash,
  AlertCircle,
} from 'lucide-react';
import { LegalMetrologyAuditReport } from '../types';
import { InspectionSummary } from '../utils/legalMetrologyEngine';
import {
  GovernmentReportMeta,
  generateGovernmentPdf,
  generateGovernmentWordDoc,
} from '../utils/governmentReportGenerator';

interface EditGovernmentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportMeta: GovernmentReportMeta;
  onUpdateMeta: (newMeta: GovernmentReportMeta) => void;
  auditReport: LegalMetrologyAuditReport;
  summary: InspectionSummary;
  images: string[];
}

export const EditGovernmentReportModal: React.FC<EditGovernmentReportModalProps> = ({
  isOpen,
  onClose,
  reportMeta,
  onUpdateMeta,
  auditReport,
  summary,
  images,
}) => {
  const [formData, setFormData] = useState<GovernmentReportMeta>({ ...reportMeta });
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof GovernmentReportMeta, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateMeta(formData);
    onClose();
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      onUpdateMeta(formData);
      await generateGovernmentPdf(auditReport, summary, images, formData);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadDoc = async () => {
    onUpdateMeta(formData);
    await generateGovernmentWordDoc(auditReport, summary, images, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col my-6 animate-in fade-in duration-150">
        {/* Government Header */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/40">
              GOI
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Edit Government Statutory Report & PDF Details
              </h3>
              <p className="text-[11px] text-slate-400">
                Department of Consumer Affairs • Legal Metrology Division
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notice Info Banner */}
        <div className="bg-blue-50 px-6 py-2.5 border-b border-blue-100 flex items-center gap-2 text-xs text-blue-900">
          <AlertCircle className="h-4 w-4 text-blue-700 shrink-0" />
          <span>
            You can customize officer names, notice reference numbers, and legal remarks before exporting to PDF or editable Word document.
          </span>
        </div>

        {/* Form Fields Body */}
        <div className="p-6 space-y-4 max-h-[68vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Ref Number */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-slate-500" />
                Notice / File Reference Number
              </label>
              <input
                type="text"
                value={formData.fileNumber}
                onChange={(e) => handleChange('fileNumber', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Date of Inspection
              </label>
              <input
                type="text"
                value={formData.inspectionDate}
                onChange={(e) => handleChange('inspectionDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Officer Name */}
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                Inspecting Officer Name
              </label>
              <input
                type="text"
                value={formData.officerName}
                onChange={(e) => handleChange('officerName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Officer Designation */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Officer Designation
              </label>
              <input
                type="text"
                value={formData.officerDesignation}
                onChange={(e) => handleChange('officerDesignation', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Jurisdiction / Zone */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">
                Enforcement Division / District Zone
              </label>
              <input
                type="text"
                value={formData.districtZone}
                onChange={(e) => handleChange('districtZone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Establishment / Premise Name */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-slate-500" />
                Inspection Premises / Establishment Name & Address
              </label>
              <input
                type="text"
                value={formData.premisesName}
                onChange={(e) => handleChange('premisesName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Commodity Name */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">
                Subject Commodity Description
              </label>
              <input
                type="text"
                value={formData.commodityName}
                onChange={(e) => handleChange('commodityName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Official Remarks */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">
                Inspecting Officer Remarks & Statutory Notes
              </label>
              <textarea
                rows={3}
                value={formData.officialRemarks}
                onChange={(e) => handleChange('officialRemarks', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Prescribed Action */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">
                Recommended Statutory Action / Notice
              </label>
              <input
                type="text"
                value={formData.recommendedAction}
                onChange={(e) => handleChange('recommendedAction', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 transition"
          >
            Cancel
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition cursor-pointer"
              title="Download Editable Microsoft Word Document"
            >
              <FileCode className="h-4 w-4 text-blue-700" />
              <span>Export Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4 text-amber-300" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Govt PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
