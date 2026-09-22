import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Globe, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'copyright' | 'hyperlinking' | 'disclaimer' | 'stqc';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="text-base font-bold tracking-wide">
                Statutory Policies & GIGW 3.0 Compliance Framework
              </h2>
              <p className="text-xs text-blue-200">
                Department of Consumer Affairs • Legal Metrology Division • Government of India
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-blue-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'border-blue-900 text-blue-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'border-blue-900 text-blue-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('copyright')}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'copyright'
                ? 'border-blue-900 text-blue-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Copyright Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hyperlinking')}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'hyperlinking'
                ? 'border-blue-900 text-blue-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Hyperlinking Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('disclaimer')}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'disclaimer'
                ? 'border-blue-900 text-blue-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Disclaimer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stqc')}
            className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'stqc'
                ? 'border-blue-900 text-blue-950 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            STQC Certification
          </button>
        </div>

        {/* Policy Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-sm leading-relaxed space-y-4">
          {activeTab === 'privacy' && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Privacy Policy</h3>
              <p>
                As a general rule, this Portal does not automatically capture any specific personal information from you (like name, phone number, or e-mail address) that allows us to identify you individually.
              </p>
              <p className="mt-2">
                <strong>Evidentiary Evidence Data:</strong> Packaging imagery, OCR extractions, GPS coordinates, and inspector terminal identifiers captured during enforcement audits are processed strictly for regulatory inspection records under the Legal Metrology Act, 2009 and stored with SHA-256 cryptographic verification.
              </p>
              <p className="mt-2">
                We do not sell or share any personally identifiable information volunteered on the Portal to any third party (public/private) except as mandated by court order or statutory investigative authority.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Terms & Conditions of Service</h3>
              <p>
                This website is designed, developed, and maintained by the Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
              </p>
              <p className="mt-2">
                These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any dispute arising under these terms and conditions shall be subject to the exclusive jurisdiction of the courts of Delhi, India.
              </p>
              <p className="mt-2">
                The information posted on this portal could include hypertext links or pointers to information created and maintained by non-Government/private organisations for reference purposes only.
              </p>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Copyright Policy</h3>
              <p>
                Material featured on this portal may be reproduced free of charge in any format or media without requiring specific permission. This is subject to the material being reproduced accurately and not being used in a derogatory manner or in a misleading context.
              </p>
              <p className="mt-2">
                Where the material is being published or issued to others, the source must be prominently acknowledged as <em>"Department of Consumer Affairs, Government of India"</em>. However, the permission to reproduce this material does not extend to any material on this site that is identified as being the copyright of a third party.
              </p>
            </div>
          )}

          {activeTab === 'hyperlinking' && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Hyperlinking Policy</h3>
              <p>
                <strong>Links to External Websites/Portals:</strong> At many places in this portal, you shall find links to other websites/portals. These links have been placed for your convenience. The Department is not responsible for the contents and reliability of the linked websites and does not necessarily endorse the views expressed in them.
              </p>
              <p className="mt-2">
                <strong>Links to this Portal by other websites:</strong> Prior permission is not required before hyperlinks are directed from any website/portal to this portal. However, we do not permit our pages to be loaded into frames on your site.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Disclaimer</h3>
              <p>
                This Portal is maintained by the Department of Consumer Affairs for statutory verification under the Legal Metrology (Packaged Commodities) Rules, 2011. Though all efforts have been made to ensure the accuracy and currency of the content, the same should not be construed as a statement of law or used for any legal purposes.
              </p>
              <p className="mt-2">
                In case of any ambiguity or doubts, users are advised to verify/check with the Department and/or other source(s), and to obtain appropriate legal advice.
              </p>
            </div>
          )}

          {activeTab === 'stqc' && (
            <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3 text-emerald-900 font-bold text-base mb-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                STQC Certified • GIGW 3.0 Accessibility Compliance
              </div>
              <p className="text-emerald-950 text-sm">
                This portal has been designed and certified in conformance with the <strong>Guidelines for Indian Government Websites (GIGW 3.0)</strong>, formulated by the National Informatics Centre (NIC) and audited by the Standardisation Testing and Quality Certification (STQC) Directorate, Ministry of Electronics & IT (MeitY).
              </p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-emerald-100 font-semibold text-slate-800">
                  ✓ W3C WCAG 2.1 Level AA
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 font-semibold text-slate-800">
                  ✓ Screen Reader Accessible
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 font-semibold text-slate-800">
                  ✓ Bilingual English / हिन्दी
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 font-semibold text-slate-800">
                  ✓ Resizable Font Scaling (A-, A, A+)
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 font-semibold text-slate-800">
                  ✓ High-Contrast Enforcement View
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 font-semibold text-slate-800">
                  ✓ Evidentiary SHA-256 Audit Trail
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Portal Version: v2026.9.1 • GIGW 3.0</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
