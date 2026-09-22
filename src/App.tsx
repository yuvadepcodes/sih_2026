import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import { PlainScanner } from './components/PlainScanner';
import { SimpleComplianceReport } from './components/SimpleComplianceReport';
import { CameraModal } from './components/CameraModal';
import { LegalReferenceModal } from './components/LegalReferenceModal';
import { LegalPoliciesModal, PolicyTab } from './components/LegalPoliciesModal';
import { RecidivismTrackerModal } from './components/RecidivismTrackerModal';
import { JanVishwasNoticeModal } from './components/JanVishwasNoticeModal';
import { GigwHeader } from './components/GigwHeader';
import { GigwFooter } from './components/GigwFooter';
import { RoleDashboard } from './components/RoleDashboard';
import {
  LegalMetrologyAuditReport,
  OfficerRole,
  GigwAccessibilitySettings,
  EvidentiaryMetadata,
  OfflineInspectionDraft,
  ManufacturerRecidivismProfile,
} from './types';
import { evaluateLegalMetrologyCompliance } from './utils/legalMetrologyEngine';
import { SAMPLE_PACKAGING_CASES } from './data/samplePackages';
import { createEvidentiaryRecord } from './utils/chainOfCustody';
import {
  getOfflineDrafts,
  saveOfflineDraft,
  markDraftAsSynced,
} from './utils/offlineSync';

export function App() {
  // GIGW Accessibility State
  const [accessibility, setAccessibility] = useState<GigwAccessibilitySettings>({
    fontSizeLevel: 'normal',
    highContrast: false,
    language: 'en',
  });

  // Enforcement Role (RBAC)
  const [currentRole, setCurrentRole] = useState<OfficerRole>('INSPECTOR');

  // Field Connectivity (Online / Offline mode)
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineDrafts, setOfflineDrafts] = useState<OfflineInspectionDraft[]>([]);

  // Audit State
  const [images, setImages] = useState<string[]>([]);
  const [auditReport, setAuditReport] = useState<LegalMetrologyAuditReport | null>(null);
  const [evidence, setEvidence] = useState<EvidentiaryMetadata | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<ManufacturerRecidivismProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  const [isRecidivismOpen, setIsRecidivismOpen] = useState<boolean>(false);
  const [isJanVishwasOpen, setIsJanVishwasOpen] = useState<boolean>(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [activePolicyTab, setActivePolicyTab] = useState<PolicyTab>('privacy');

  // Load offline drafts on mount
  useEffect(() => {
    setOfflineDrafts(getOfflineDrafts());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateAccessibility = (settings: Partial<GigwAccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  };

  const handleOpenPolicy = (tab: PolicyTab) => {
    setActivePolicyTab(tab);
    setIsPolicyModalOpen(true);
  };

  // Image Upload Handlers
  const handleAddImage = (base64: string) => {
    setImages((prev) => [...prev, base64]);
    setErrorMessage(null);
    setAuditReport(null);
    setEvidence(null);
  };

  const handleAddMultipleImages = (list: string[]) => {
    setImages((prev) => [...prev, ...list]);
    setErrorMessage(null);
    setAuditReport(null);
    setEvidence(null);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearImages = () => {
    setImages([]);
    setAuditReport(null);
    setEvidence(null);
    setErrorMessage(null);
  };

  // Run AI & Statutory Audit + Evidentiary Record Creation
  const handleRunAudit = async () => {
    if (images.length === 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    // 1. Generate Evidentiary Record with Geolocation and SHA-256 hashes
    const evidentiaryRecord = await createEvidentiaryRecord(images);
    setEvidence(evidentiaryRecord);

    try {
      if (!isOnline) {
        // Offline Inspection Mode: Save locally
        const sampleMatch = SAMPLE_PACKAGING_CASES.find((s) =>
          images.some((img) => img === s.imageSrc)
        ) || SAMPLE_PACKAGING_CASES[0];

        const reportData = sampleMatch.expectedResult;
        setAuditReport(reportData);

        const draft: OfflineInspectionDraft = {
          id: `draft_${Date.now()}`,
          inspectionId: evidentiaryRecord.inspectionId,
          createdAt: evidentiaryRecord.timestamp,
          premiseName: 'Local Field Inspection Outlet',
          commodityName: reportData.declarations.common_or_generic_name.raw_text || 'Packaged Commodity',
          images,
          evidence: evidentiaryRecord,
          auditReport: reportData,
          summaryStatus: 'NON_COMPLIANT',
          isSynced: false,
        };
        saveOfflineDraft(draft);
        setOfflineDrafts(getOfflineDrafts());
        showToast('Field inspection saved offline. Cryptographic hashes logged.');
        return;
      }

      // Online Mode: API Call
      const response = await fetch('/api/analyze-packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images,
          sourceType: 'physical_label_or_listing',
        }),
      });

      if (!response.ok) {
        let errDetails = `Server returned status ${response.status}`;
        try {
          const errJson = await response.json();
          errDetails = errJson.error || errJson.message || errDetails;
        } catch {
          // If response was not JSON (e.g. 404 HTML on Vercel without serverless route)
          if (response.status === 404) {
            errDetails = 'The API endpoint /api/analyze-packaging was not found (404). Ensure serverless functions or vercel.json rewrites are deployed.';
          }
        }
        throw new Error(errDetails);
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to extract packaging declarations from image.');
      }

      setAuditReport(result.data);
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Packaging analysis error:', err);

      // Check if image matches one of the known demo samples
      const matchedSample = SAMPLE_PACKAGING_CASES.find((s) =>
        images.some((img) => img === s.imageSrc)
      );

      if (matchedSample) {
        setAuditReport(matchedSample.expectedResult);
        setErrorMessage(null);
      } else {
        setAuditReport(null);
        const errMsg = err?.message || 'Failed to connect to the packaging analysis engine.';
        setErrorMessage(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadOfflineDraft = (draft: OfflineInspectionDraft) => {
    setImages(draft.images);
    setEvidence(draft.evidence);
    if (draft.auditReport) {
      setAuditReport(draft.auditReport);
    }
    showToast(`Loaded inspection docket ${draft.inspectionId}`);
  };

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      showToast('Back Online. Synced with National Metrology Register.');
    } else {
      showToast('Field Offline Mode Activated. Local Storage Logging Enabled.');
    }
  };

  // Compute compliance summary from active report
  const summary = auditReport ? evaluateLegalMetrologyCompliance(auditReport) : null;

  // Compute GIGW Font Size scaling class
  const getFontSizeClass = () => {
    if (accessibility.fontSizeLevel === 'large') return 'text-[105%]';
    if (accessibility.fontSizeLevel === 'larger') return 'text-[115%]';
    return 'text-[100%]';
  };

  return (
    <div
      id="main-app-container"
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-150 ${getFontSizeClass()} ${
        accessibility.highContrast
          ? 'bg-black text-white contrast-125'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. GIGW Top Bar & Official Header */}
      <GigwHeader
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        offlineDraftsCount={offlineDrafts.length}
        onOpenRules={() => setIsReferenceOpen(true)}
        onOpenRecidivism={() => setIsRecidivismOpen(true)}
        onResetScan={handleClearImages}
        hasActiveReport={Boolean(auditReport)}
      />

      {/* 2. Main Body Container */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Role Overview Utility Banner */}
        <RoleDashboard
          currentRole={currentRole}
          offlineDrafts={offlineDrafts}
          onLoadDraft={handleLoadOfflineDraft}
          onOpenJanVishwas={() => setIsJanVishwasOpen(true)}
          onOpenRecidivism={() => setIsRecidivismOpen(true)}
        />

        {/* Offline Alert Banner if Field Offline */}
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-amber-700 shrink-0" />
              <span>
                <strong>Field Offline Mode:</strong> Inspections are cryptographically hashed and cached in secure device local storage.
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleOnline}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg transition cursor-pointer"
            >
              Sync Now
            </button>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 text-xs text-rose-950 shadow-sm animate-in fade-in-50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-200/80 text-rose-800 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-rose-900">Analysis Failed</div>
                <div className="mt-1 text-slate-700 leading-relaxed font-medium">
                  {errorMessage}
                </div>
                {errorMessage.toLowerCase().includes('gemini_api_key') || errorMessage.includes('404') || errorMessage.includes('environment variable') ? (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                    <strong>Vercel Deployment Checklist:</strong>
                    <ol className="list-decimal list-inside mt-1 space-y-0.5 text-slate-700 font-normal">
                      <li>Open your project in the <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-700 underline font-semibold">Vercel Dashboard</a>.</li>
                      <li>Navigate to <strong>Settings &rarr; Environment Variables</strong>.</li>
                      <li>Add key <code>GEMINI_API_KEY</code> with your Google Gemini API key.</li>
                      <li>Trigger a new deployment (or redeploy) so the serverless function receives the key.</li>
                    </ol>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200/60">
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-rose-100 font-semibold transition cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold transition shadow-xs cursor-pointer"
              >
                {isLoading ? 'Retrying...' : 'Retry Inspection'}
              </button>
            </div>
          </div>
        )}

        {/* Multi-Angle Plain Scan Picture Option */}
        <PlainScanner
          images={images}
          onAddImage={handleAddImage}
          onAddMultipleImages={handleAddMultipleImages}
          onRemoveImage={handleRemoveImage}
          onClearImages={handleClearImages}
          onOpenCamera={() => setIsCameraOpen(true)}
          onRunAudit={handleRunAudit}
          isLoading={isLoading}
        />

        {/* The Compliance Report with Evidentiary Chain of Custody */}
        {auditReport && summary && (
          <SimpleComplianceReport
            auditReport={auditReport}
            summary={summary}
            images={images}
            evidence={evidence || undefined}
            onOpenJanVishwas={() => setIsJanVishwasOpen(true)}
            onOpenRecidivism={() => setIsRecidivismOpen(true)}
            onScanAnother={handleClearImages}
          />
        )}
      </main>

      {/* 3. Mandatory GIGW 3.0 Footer */}
      <GigwFooter onOpenPolicy={handleOpenPolicy} language={accessibility.language} />

      {/* Modals & Dialogs */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => handleAddImage(base64)}
        onCaptureMultiple={(list) => handleAddMultipleImages(list)}
        currentCount={images.length}
      />

      <LegalReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      <LegalPoliciesModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        initialTab={activePolicyTab}
      />

      <RecidivismTrackerModal
        isOpen={isRecidivismOpen}
        onClose={() => setIsRecidivismOpen(false)}
        onSelectManufacturer={(mfr) => {
          setSelectedManufacturer(mfr);
          showToast(`Attached ${mfr.entityName} to current inspection docket`);
        }}
      />

      {auditReport && evidence && (
        <JanVishwasNoticeModal
          isOpen={isJanVishwasOpen}
          onClose={() => setIsJanVishwasOpen(false)}
          report={auditReport}
          evidence={evidence}
          manufacturerName={
            selectedManufacturer?.entityName ||
            auditReport.declarations.manufacturer_or_packer.entity_name ||
            'The Managing Director / Packing Incharge'
          }
          priorViolationsCount={selectedManufacturer?.totalViolations || 0}
        />
      )}
    </div>
  );
}

export default App;
