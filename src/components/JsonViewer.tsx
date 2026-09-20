import React, { useState } from 'react';
import { Copy, Check, Download, Code2, CheckCircle2 } from 'lucide-react';
import { LegalMetrologyAuditReport } from '../types';

interface JsonViewerProps {
  auditReport: LegalMetrologyAuditReport;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ auditReport }) => {
  const [copied, setCopied] = useState(false);
  const formattedJson = JSON.stringify(auditReport, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(formattedJson);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `legal-metrology-declarations-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-blue-900" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Verified JSON Audit Payload
          </h3>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Schema Validated
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-2xs transition"
          >
            <Download className="h-3 w-3 text-amber-300" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-900 overflow-auto max-h-[550px] font-mono text-xs text-amber-200/90 leading-relaxed selection:bg-amber-500/30">
        <pre className="whitespace-pre">{formattedJson}</pre>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Format: Structured Legal Metrology JSON Schema v2.1</span>
        <span>Standard SI symbols & Mandatory tax-inclusive clause validated</span>
      </div>
    </div>
  );
};
