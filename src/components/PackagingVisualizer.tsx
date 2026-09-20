import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles, Languages, CheckCircle2, AlertTriangle } from 'lucide-react';
import { LegalMetrologyAuditReport } from '../types';

interface PackagingVisualizerProps {
  imageSrc: string | null;
  auditReport: LegalMetrologyAuditReport | null;
  onSelectField?: (fieldName: string) => void;
  selectedField?: string | null;
}

export const PackagingVisualizer: React.FC<PackagingVisualizerProps> = ({
  imageSrc,
  auditReport,
}) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => setZoom(1);

  const quality = auditReport?.audit_metadata.image_quality_assessment || 'CLEAR';
  const languages = auditReport?.detected_languages || ['English'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-xs">
      {/* Visualizer header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-blue-900" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Packaging Visual Inspection Stage
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-700 min-w-10 text-center font-bold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition ml-1"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Image Stage */}
      <div className="relative min-h-[380px] max-h-[520px] bg-slate-100/70 flex items-center justify-center p-4 overflow-hidden">
        {imageSrc ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-auto">
            <img
              src={imageSrc}
              alt="Packaging sample under inspection"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.15s ease-out' }}
              className="max-h-[460px] w-auto max-w-full object-contain rounded-lg border border-slate-300 shadow-sm bg-white"
            />
          </div>
        ) : (
          <div className="text-center p-6 text-slate-500">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-xs font-semibold text-slate-700">No package image loaded.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Select a sample or upload a photo above.</p>
          </div>
        )}

        {/* Quality overlay badge */}
        {auditReport && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs border ${
                quality === 'CLEAR'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              OCR Resolution: {quality}
            </span>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs bg-white text-slate-700 border border-slate-300 flex items-center gap-1">
              <Languages className="h-3 w-3 text-blue-800" />
              {languages.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Footer metadata */}
      {auditReport && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Input Source:</span>
            <span className="capitalize font-medium text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">
              {auditReport.audit_metadata.source_type.replace(/_/g, ' ')}
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Statutory examination per Rule 6, Packaged Commodities Rules 2011
          </span>
        </div>
      )}
    </div>
  );
};
