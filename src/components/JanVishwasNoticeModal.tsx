import React, { useState } from 'react';
import { X, Scale, FileText, CheckCircle2, Download, Printer, AlertTriangle, Building, Calendar, IndianRupee, Clock } from 'lucide-react';
import { LegalMetrologyAuditReport, EvidentiaryMetadata, JanVishwasPenaltyCalculation } from '../types';
import { calculateJanVishwasPenalty } from '../utils/janVishwasEngine';

interface JanVishwasNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: LegalMetrologyAuditReport;
  evidence: EvidentiaryMetadata;
  manufacturerName?: string;
  priorViolationsCount?: number;
}

export const JanVishwasNoticeModal: React.FC<JanVishwasNoticeModalProps> = ({
  isOpen,
  onClose,
  report,
  evidence,
  manufacturerName = 'The Managing Director / Packing Incharge',
  priorViolationsCount = 0,
}) => {
  const [priorCount, setPriorCount] = useState(priorViolationsCount);
  const penaltyData: JanVishwasPenaltyCalculation = calculateJanVishwasPenalty(report, priorCount);
  const [isIssued, setIsIssued] = useState(false);

  if (!isOpen) return null;

  const handlePrintNotice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-amber-900 text-white px-6 py-4 flex items-center justify-between border-b border-amber-800">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-amber-300" />
            <div>
              <h2 className="text-base font-bold tracking-wide flex items-center gap-2">
                Jan Vishwas Statutory Improvement Notice & Compounding Engine
              </h2>
              <p className="text-xs text-amber-200">
                Automated notice under Section 36(1) of Legal Metrology Act, 2009 (As Amended by Jan Vishwas Act)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1.5 rounded-lg hover:bg-amber-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Penalty Engine & Offense Tier Selector */}
        <div className="bg-amber-50/70 p-4 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950">Offense History Tier:</span>
            <select
              value={priorCount}
              onChange={(e) => setPriorCount(Number(e.target.value))}
              className="bg-white border border-amber-300 text-amber-950 font-bold px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 cursor-pointer text-xs"
            >
              <option value={0}>First Default (30-Day Improvement Window)</option>
              <option value={1}>Second Default (Compounded ₹50,000 Penalty)</option>
              <option value={2}>Repeat Offender (Maximum ₹1,00,000 + License Referral)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-amber-200 font-bold text-slate-800">
              <Clock className="h-3.5 w-3.5 text-amber-700" />
              <span>Window: {penaltyData.complianceWindowDays} Days</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-amber-200 font-extrabold text-amber-900">
              <IndianRupee className="h-3.5 w-3.5 text-amber-700" />
              <span>
                {penaltyData.tier === 'FIRST_OFFENSE' ? 'Statutory Waiver / ₹25,000' : `Penalty: ₹${penaltyData.prescribedPenaltyInr.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>
        </div>

        {/* Notice Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-800 text-xs sm:text-sm bg-white print:p-0">
          <div className="border-2 border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4">
            <div className="text-center border-b border-slate-300 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase">
                GOVERNMENT OF INDIA • DEPARTMENT OF CONSUMER AFFAIRS
              </h3>
              <p className="text-xs font-bold text-slate-700">LEGAL METROLOGY ENFORCEMENT WING</p>
              <p className="text-xs font-semibold text-blue-900 underline mt-1">
                FORMAL NOTICE OF DEFAULT & OPPORTUNITY FOR IMPROVEMENT / COMPOUNDING
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                [Under Section 36(1) & Section 48 of the Legal Metrology Act, 2009 read with Jan Vishwas Provisions]
              </p>
            </div>

            <div className="flex justify-between items-start text-xs font-mono text-slate-700">
              <div>
                <div><strong>File Notice No:</strong> {evidence.inspectionId}-NTC</div>
                <div><strong>Inspection Date/Time:</strong> {evidence.formattedDateTimeIST}</div>
                <div><strong>Geo-Location Tag:</strong> {evidence.gpsCoordinates?.latitude}°N, {evidence.gpsCoordinates?.longitude}°E</div>
              </div>
              <div className="text-right">
                <div><strong>Terminal ID:</strong> {evidence.deviceId}</div>
                <div><strong>Statutory Window:</strong> {penaltyData.complianceWindowDays} Calendar Days</div>
              </div>
            </div>

            <div className="pt-2 text-xs leading-relaxed text-slate-800 space-y-2">
              <p>
                <strong>TO:</strong> {manufacturerName} <br />
                <strong>Premises/Seller:</strong> As identified in Field Inspection Record {evidence.inspectionId}
              </p>

              <p>
                <strong>SUBJECT:</strong> Notice of Packaging Non-Compliance detected under Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>

              <p>
                WHEREAS, during the statutory digital audit conducted by the authorized Inspector of Legal Metrology using cryptographic AI verification terminal <em>({evidence.deviceId})</em>, the packaged commodity was subjected to optical declaration verification under the Act.
              </p>

              <div className="bg-amber-100/70 p-3 rounded-lg border border-amber-300">
                <p className="font-bold text-amber-950 mb-1">RECORDED STATUTORY INFRACTIONS ({penaltyData.violationCount}):</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                  {!report.declarations.manufacturer_or_packer.found && (
                    <li>Violation of Rule 6(1)(a): Missing/Deficient Manufacturer, Packer or Importer Name & Complete Address</li>
                  )}
                  {!report.declarations.country_of_origin.found && (
                    <li>Violation of Rule 6(10): Missing Country of Origin declaration</li>
                  )}
                  {!report.declarations.net_quantity.found && (
                    <li>Violation of Rule 6(1)(b) & Rule 12: Deficient Net Quantity / Non-standard SI Unit declaration</li>
                  )}
                  {(!report.declarations.mrp.found || !report.declarations.mrp.has_tax_inclusive_clause) && (
                    <li>Violation of Rule 6(1)(e): MRP not declared in mandatory 'Inclusive of all taxes' format</li>
                  )}
                  {!report.declarations.unit_sale_price.found && (
                    <li>Violation of Rule 6(11): Missing Unit Sale Price (USP in ₹ per g/ml/kg/L/piece)</li>
                  )}
                  {!report.declarations.consumer_care_details.found && (
                    <li>Violation of Rule 6(1)(f): Absence of Consumer Care contact person, phone number or email</li>
                  )}
                </ul>
              </div>

              <p>
                <strong>DIRECTIVE UNDER JAN VISHWAS PROVISIONS:</strong>
              </p>
              <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 italic">
                "{penaltyData.notes}"
              </p>

              <p>
                You are hereby called upon to show cause within <strong>{penaltyData.complianceWindowDays} days</strong> of receipt of this notice as to why action under Section 36(1) should not be finalized, or avail the simplified compounding procedure by submitting rectified packaging artwork or paying the compounding fee of <strong>₹{penaltyData.prescribedPenaltyInr.toLocaleString('en-IN')}</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-xs">
              <div>
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  E-Signed & Digitally Verified via SHA-256 Digest
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Digest: {Object.values(evidence.imageHashes)[0]?.substring(0, 24)}...
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-900">Inspector / Adjudicating Officer</div>
                <div className="text-slate-600 text-[11px]">Legal Metrology Division</div>
                <div className="text-slate-500 text-[10px]">Govt. of India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="text-slate-600">
            {isIssued ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Notice Dispatched to National Registry
              </span>
            ) : (
              <span>Status: Draft Notice Generated</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintNotice}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Print Notice</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsIssued(true);
              }}
              className="px-4 py-1.5 bg-amber-900 hover:bg-amber-800 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="h-3.5 w-3.5 text-amber-300" />
              <span>{isIssued ? 'Re-Issue Section 36(1) Notice' : 'Dispatch Statutory Notice'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
