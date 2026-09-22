import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  AlertTriangle,
  Search,
  Printer,
  Eye,
  X,
  FileText,
  Layers,
  ZoomIn,
  Sparkles,
  ShieldAlert,
  Info,
  Edit3,
  Download,
  FileCode,
} from 'lucide-react';
import { LegalMetrologyAuditReport, EvidentiaryMetadata } from '../types';
import {
  InspectionSummary,
  SearchableDeclarationItem,
} from '../utils/legalMetrologyEngine';
import {
  GovernmentReportMeta,
  DEFAULT_GOVT_META,
  generateGovernmentPdf,
  generateGovernmentWordDoc,
} from '../utils/governmentReportGenerator';
import { EditGovernmentReportModal } from './EditGovernmentReportModal';
import { EvidentiaryChainBanner } from './EvidentiaryChainBanner';
import { Scale, Building } from 'lucide-react';

interface SimpleComplianceReportProps {
  auditReport: LegalMetrologyAuditReport;
  summary: InspectionSummary;
  images: string[];
  evidence?: EvidentiaryMetadata;
  onOpenJanVishwas?: () => void;
  onOpenRecidivism?: () => void;
  onScanAnother: () => void;
}

export const SimpleComplianceReport: React.FC<SimpleComplianceReportProps> = ({
  auditReport,
  summary,
  images,
  evidence,
  onOpenJanVishwas,
  onOpenRecidivism,
  onScanAnother,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ src: string; label: string; index: number } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reportMeta, setReportMeta] = useState<GovernmentReportMeta>(() => {
    const genericName = auditReport.declarations.common_or_generic_name.raw_text || 'Pre-Packaged Retail Commodity';
    const entity = auditReport.declarations.manufacturer_or_packer.entity_name || 'Retail & Pre-Packaging Establishment';
    return {
      ...DEFAULT_GOVT_META,
      fileNumber: evidence?.inspectionId || DEFAULT_GOVT_META.fileNumber,
      commodityName: genericName,
      premisesName: entity,
      gpsCoordinatesText: evidence?.gpsCoordinates
        ? `${evidence.gpsCoordinates.latitude}° N, ${evidence.gpsCoordinates.longitude}° E (${evidence.gpsCoordinates.districtZone})`
        : undefined,
      terminalDeviceId: evidence?.deviceId,
      sha256Digest: evidence?.imageHashes ? Object.values(evidence.imageHashes)[0] : undefined,
    };
  });

  const isCompliant = summary.status === 'COMPLIANT';
  const { missing, misleading, nonStandard } = summary.categorizedDefects;
  const passedChecks = summary.ruleChecks.filter((c) => c.status === 'COMPLIANT');

  const totalDefects = missing.length + misleading.length + nonStandard.length;

  // Filter searchable declarations based on search query and category filter
  const filteredDeclarations = useMemo(() => {
    return summary.searchableDeclarations.filter((item: SearchableDeclarationItem) => {
      // Category filter
      if (activeCategoryFilter === 'VIOLATIONS' && item.status === 'COMPLIANT') {
        return false;
      }
      if (activeCategoryFilter !== 'ALL' && activeCategoryFilter !== 'VIOLATIONS' && item.category !== activeCategoryFilter) {
        return false;
      }

      // Text search
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLabel = item.label.toLowerCase().includes(q);
      const matchValue = item.value.toLowerCase().includes(q);
      const matchRaw = (item.rawText || '').toLowerCase().includes(q);
      const matchRule = item.ruleCitation.toLowerCase().includes(q);

      return matchTitle || matchLabel || matchValue || matchRaw || matchRule;
    });
  }, [summary.searchableDeclarations, searchQuery, activeCategoryFilter]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateGovernmentPdf(auditReport, summary, images, reportMeta);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDoc = async () => {
    await generateGovernmentWordDoc(auditReport, summary, images, reportMeta);
  };

  const getExhibitLabel = (index: number) => {
    switch (index) {
      case 0:
        return 'Exhibit A-1 (Front Panel / Primary Display)';
      case 1:
        return 'Exhibit A-2 (Back Panel / Mandatory Declarations)';
      case 2:
        return 'Exhibit A-3 (Side Panel / MRP & Batch)';
      case 3:
        return 'Exhibit A-4 (Bottom / Top Flap)';
      default:
        return `Exhibit A-${index + 1} (Packaging Angle ${index + 1})`;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-6 p-5 sm:p-7 print:border-none print:shadow-none print:p-0">
      {/* Print-Only Official Header with Emblem on Left and SIH 2026 on Right */}
      <div className="hidden print:block border-b-2 border-amber-600 pb-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <img
            src="/emblem-of-india.svg"
            alt="State Emblem of India"
            className="h-14 w-auto object-contain shrink-0"
          />
          <div className="text-center flex-1">
            <h1 className="text-base font-extrabold text-slate-900 tracking-wide uppercase">
              GOVERNMENT OF INDIA
            </h1>
            <h2 className="text-xs font-bold text-slate-800">
              MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
            </h2>
            <p className="text-[10px] text-slate-600">
              DEPARTMENT OF CONSUMER AFFAIRS • LEGAL METROLOGY DIVISION
            </p>
            <h3 className="text-xs font-black text-blue-950 mt-1 uppercase underline">
              STATUTORY PACKAGING COMPLIANCE AUDIT REPORT
            </h3>
          </div>
          <img
            src="/sih-2026-logo.svg"
            alt="Smart India Hackathon 2026"
            className="h-12 w-auto object-contain shrink-0"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 pt-1 border-t border-slate-200">
          <span>Ref: {reportMeta.fileNumber}</span>
          <span>Date: {reportMeta.inspectionDate}</span>
          <span>Officer: {reportMeta.officerName} ({reportMeta.officerDesignation})</span>
        </div>
      </div>

      {/* Evidentiary Chain of Custody & Geotag Banner */}
      {evidence && <EvidentiaryChainBanner evidence={evidence} />}

      {/* 1. Main Verdict Banner (Is it completely compliance?) */}
      <div
        className={`rounded-2xl p-5 sm:p-6 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
          isCompliant
            ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950'
            : 'bg-rose-50/80 border-rose-500 text-rose-950'
        }`}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isCompliant ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {isCompliant ? (
              <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
            ) : (
              <AlertOctagon className="h-7 w-7 sm:h-8 sm:w-8" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 border border-current">
                Statutory Compliance Verdict
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Score: {summary.complianceScore}%
              </span>
              {!isCompliant && (
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  Jan Vishwas Eligible (Sec 36(1))
                </span>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              {isCompliant ? 'YES — Completely Compliant' : 'NO — Not Compliant'}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium leading-relaxed max-w-xl">
              {isCompliant
                ? 'All mandatory statutory declarations satisfy Legal Metrology rules. This packaging is approved for distribution and retail sale in India.'
                : `Detected ${totalDefects} statutory issue(s). This commodity package violates statutory packaging rules and requires correction before retail sale.`}
            </p>
          </div>
        </div>

        {/* Action Controls: Jan Vishwas Notice, PDF, Editable Formats, Print */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0 print:hidden">
          {!isCompliant && onOpenJanVishwas && (
            <button
              type="button"
              onClick={onOpenJanVishwas}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-amber-900 hover:bg-amber-800 rounded-xl shadow-xs transition cursor-pointer"
              title="Issue Formal Section 36(1) Notice under Jan Vishwas Act"
            >
              <Scale className="h-3.5 w-3.5 text-amber-300" />
              <span>Section 36(1) Notice</span>
            </button>
          )}

          {onOpenRecidivism && (
            <button
              type="button"
              onClick={onOpenRecidivism}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition cursor-pointer"
              title="Look up repeat offenses in National Recidivism Registry"
            >
              <Building className="h-3.5 w-3.5 text-blue-900" />
              <span className="hidden sm:inline">Check Recidivism</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl shadow-2xs transition cursor-pointer"
            title="Edit Government Report Notice, Officer Name, and Remarks"
          >
            <Edit3 className="h-3.5 w-3.5 text-amber-800" />
            <span>Edit Report</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-75 rounded-xl shadow-xs transition cursor-pointer"
            title="Download Official Government Inspection Notice (PDF with SIH 2026 Logo on Top Left & National Emblem on Top Right)"
          >
            {isGeneratingPdf ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-amber-300" />
                <span>Govt PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadDoc}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition cursor-pointer"
            title="Export as Editable Microsoft Word (.doc) format"
          >
            <FileCode className="h-3.5 w-3.5 text-blue-700" />
            <span>Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title="Print Official Report"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={onScanAnother}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition cursor-pointer"
          >
            <span>Scan Another</span>
          </button>
        </div>
      </div>

      {/* Official Government Metadata Notice Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-[11px] flex items-center justify-center border border-amber-500/30 shrink-0 mt-0.5">
            GOI
          </div>
          <div className="text-xs space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-300 font-mono">{reportMeta.fileNumber}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">Date: {reportMeta.inspectionDate}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-semibold">{reportMeta.officerName} ({reportMeta.officerDesignation})</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-xl">
              Establishment: {reportMeta.premisesName} | Division: {reportMeta.districtZone}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition cursor-pointer shrink-0 print:hidden"
        >
          <Edit3 className="h-3 w-3" />
          <span>Edit Notice Details</span>
        </button>
      </div>

      {/* 2. DETECTION OF MISSING, MISLEADING OR NON-STANDARD DECLARATIONS */}
      <div className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-blue-900" />
              <span>Detection: Missing, Misleading or Non-Standard Declarations</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory defect classification under Legal Metrology Act, 2009 & PCR, 2011.
            </p>
          </div>

          {/* Quick status chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span
              className={`px-2.5 py-1 rounded-lg border ${
                missing.length > 0
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Missing: {missing.length}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg border ${
                misleading.length > 0
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Misleading: {misleading.length}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg border ${
                nonStandard.length > 0
                  ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Non-Standard: {nonStandard.length}
            </span>
          </div>
        </div>

        {totalDefects === 0 ? (
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 text-emerald-950">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs font-medium">
              <strong className="font-bold">Zero Violations Detected:</strong> No missing mandatory declarations, no misleading representations, and all metric units adhere to standard SI symbols.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category A: Missing Declarations */}
            {missing.length > 0 && (
              <div className="bg-rose-50/60 border-2 border-rose-300 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                    <h4 className="text-sm font-extrabold text-rose-950">
                      1. Missing Declarations ({missing.length})
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded">
                    Actionable Defect
                  </span>
                </div>

                <div className="space-y-2.5">
                  {missing.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-rose-200 rounded-lg p-3 text-xs space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {item.ruleTitle}
                        </span>
                        <span className="text-[11px] font-mono text-rose-700 font-semibold">
                          {item.ruleCitation}
                        </span>
                      </div>
                      <p className="text-rose-950 font-medium">
                        <strong className="font-bold text-rose-900">What is missing: </strong>
                        {item.finding}
                      </p>
                      <div className="text-slate-600 text-[11px]">
                        <strong className="font-semibold text-slate-700">Statutory mandate: </strong>
                        {item.description}
                      </div>
                      {item.statutoryPenaltyNotice && (
                        <div className="text-[11px] text-amber-900 bg-amber-50 rounded px-2 py-1 font-medium border border-amber-200/60">
                          ⚖️ <strong className="font-semibold">Legal Notice: </strong> {item.statutoryPenaltyNotice}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category B: Misleading Declarations */}
            {misleading.length > 0 && (
              <div className="bg-amber-50/70 border-2 border-amber-300 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h4 className="text-sm font-extrabold text-amber-950">
                      2. Misleading or Deceptive Declarations ({misleading.length})
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                    Rule 4 / Sec 36
                  </span>
                </div>

                <div className="space-y-2.5">
                  {misleading.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-amber-200 rounded-lg p-3 text-xs space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {item.ruleTitle}
                        </span>
                        <span className="text-[11px] font-mono text-amber-800 font-semibold">
                          {item.ruleCitation}
                        </span>
                      </div>
                      <p className="text-amber-950 font-medium">
                        <strong className="font-bold text-amber-900">Misleading finding: </strong>
                        {item.finding}
                      </p>
                      <div className="text-slate-600 text-[11px]">
                        <strong className="font-semibold text-slate-700">Statutory mandate: </strong>
                        {item.description}
                      </div>
                      {item.statutoryPenaltyNotice && (
                        <div className="text-[11px] text-rose-900 bg-rose-50 rounded px-2 py-1 font-medium border border-rose-200">
                          ⚖️ <strong className="font-semibold">Legal consequence: </strong> {item.statutoryPenaltyNotice}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category C: Non-Standard Declarations */}
            {nonStandard.length > 0 && (
              <div className="bg-indigo-50/60 border-2 border-indigo-300 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
                    <h4 className="text-sm font-extrabold text-indigo-950">
                      3. Non-Standard Declarations ({nonStandard.length})
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-900 bg-indigo-200/80 px-2 py-0.5 rounded">
                    Metric & Format Standard
                  </span>
                </div>

                <div className="space-y-2.5">
                  {nonStandard.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-indigo-200 rounded-lg p-3 text-xs space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {item.ruleTitle}
                        </span>
                        <span className="text-[11px] font-mono text-indigo-800 font-semibold">
                          {item.ruleCitation}
                        </span>
                      </div>
                      <p className="text-indigo-950 font-medium">
                        <strong className="font-bold text-indigo-900">Non-standard error: </strong>
                        {item.finding}
                      </p>
                      <div className="text-slate-600 text-[11px]">
                        <strong className="font-semibold text-slate-700">Correct standard: </strong>
                        {item.description}
                      </div>
                      {item.statutoryPenaltyNotice && (
                        <div className="text-[11px] text-indigo-900 bg-indigo-50 rounded px-2 py-1 font-medium border border-indigo-200">
                          ⚖️ <strong className="font-semibold">Notice: </strong> {item.statutoryPenaltyNotice}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. SEARCHING FROM THE SCANNED IMAGE */}
      <div className="space-y-3.5 pt-2 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-900" />
              <span>Search Declarations from Scanned Image</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Search any text, weight, price, company name, address or date found on the packaging photos.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredDeclarations.length} of {summary.searchableDeclarations.length} declarations
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search from scanned image (e.g. MRP, 500g, Tata, care@, India, date)..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { key: 'ALL', label: 'All Fields' },
            { key: 'VIOLATIONS', label: 'Issues Only' },
            { key: 'MRP & Price', label: 'MRP & Price' },
            { key: 'Net Quantity', label: 'Net Quantity' },
            { key: 'Manufacturer', label: 'Manufacturer' },
            { key: 'Country of Origin', label: 'Origin' },
            { key: 'Consumer Care', label: 'Consumer Care' },
            { key: 'Date & Batch', label: 'Date / Batch' },
          ].map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setActiveCategoryFilter(chip.key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeCategoryFilter === chip.key
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Filtered Declarations List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {filteredDeclarations.length === 0 ? (
            <div className="col-span-2 p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              No declaration matching &ldquo;<strong className="text-slate-700">{searchQuery}</strong>&rdquo; was found on the scanned image.
            </div>
          ) : (
            filteredDeclarations.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl p-3.5 border transition text-xs flex flex-col justify-between gap-2 shadow-2xs ${
                  item.status === 'VIOLATION'
                    ? 'bg-rose-50/50 border-rose-300'
                    : item.status === 'WARNING'
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-bold text-slate-900 truncate">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        item.status === 'VIOLATION'
                          ? 'bg-rose-200 text-rose-900'
                          : item.status === 'WARNING'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status === 'VIOLATION' ? 'Broken' : item.status === 'WARNING' ? 'Advisory' : 'Passed'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {item.value}
                  </div>

                  {item.rawText && (
                    <div className="text-[11px] text-slate-500 font-mono mt-1 bg-white/70 px-2 py-1 rounded border border-slate-200/60 truncate">
                      Raw on package: &ldquo;{item.rawText}&rdquo;
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/60 pt-1.5">
                  <span>{item.label}</span>
                  <span className="font-mono text-slate-600 font-medium">{item.ruleCitation}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. ATTACHMENT OF PHOTOGRAPHS & SUPPORTING EVIDENCE (ANNEXURE A) */}
      <div className="space-y-3.5 pt-2 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-900" />
              <span>Attachment of Photographs & Supporting Evidence</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Annexure A: Verified photographic exhibits captured during inspection for evidentiary record.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-bold text-blue-950 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              <FileText className="h-3.5 w-3.5 text-blue-900" />
              {images.length} Attached Exhibit{images.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No packaging photographs attached to this inspection session.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative bg-slate-100 border border-slate-300 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                {/* Photo container */}
                <div
                  className="aspect-4/3 w-full bg-slate-900 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  onClick={() =>
                    setSelectedPhotoModal({
                      src: img,
                      label: getExhibitLabel(idx),
                      index: idx,
                    })
                  }
                >
                  <img
                    src={img}
                    alt={`Attached Evidence Exhibit ${idx + 1}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                  />

                  {/* Hover inspect overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-semibold backdrop-blur-2xs">
                    <ZoomIn className="h-4 w-4" />
                    <span>Enlarge</span>
                  </div>

                  {/* Exhibit Pill */}
                  <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Exhibit #{idx + 1}
                  </div>
                </div>

                {/* Exhibit Details Footer */}
                <div className="p-2.5 bg-white border-t border-slate-200 text-[11px] space-y-1">
                  <div className="font-bold text-slate-900 truncate">
                    {getExhibitLabel(idx)}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Angle #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPhotoModal({
                          src: img,
                          label: getExhibitLabel(idx),
                          index: idx,
                        })
                      }
                      className="text-blue-900 font-semibold hover:underline cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Evidentiary Certification Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-slate-800">Evidentiary Record Notice:</strong>{' '}
            Photographs attached above serve as primary digital evidence under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011. In case of litigation or inspection notices, these exhibits document the verbatim declarations printed on the product packaging at the time of audit.
          </div>
        </div>
      </div>

      {/* 5. PASSED RULES (Which is not wrong) */}
      <div className="space-y-3 pt-2 border-t border-slate-200">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>Which is Not Wrong (Satisfied Statutory Declarations)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {passedChecks.map((p, i) => (
            <div
              key={p.id || i}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 text-xs shadow-2xs"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">{p.ruleTitle}</div>
                <div className="text-slate-600 mt-0.5 leading-relaxed">{p.finding}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{p.ruleCitation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Enlarge Image */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  {selectedPhotoModal.label}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-black p-4 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={selectedPhotoModal.src}
                alt="Enlarged packaging evidence"
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>

            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Evidentiary Exhibit #{selectedPhotoModal.index + 1}</span>
              <button
                type="button"
                onClick={() => setSelectedPhotoModal(null)}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Government Report Editor Modal */}
      <EditGovernmentReportModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reportMeta={reportMeta}
        onUpdateMeta={(newMeta) => setReportMeta(newMeta)}
        auditReport={auditReport}
        summary={summary}
        images={images}
      />
    </div>
  );
};
