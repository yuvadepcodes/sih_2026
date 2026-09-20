import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, CheckCircle2, ChevronRight, FileCheck, RefreshCw } from 'lucide-react';
import { SAMPLE_PACKAGING_CASES } from '../data/samplePackages';
import { SamplePackagingItem } from '../types';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelected: (base64: string, sampleData?: SamplePackagingItem) => void;
  onOpenCamera: () => void;
  onRunAudit: () => void;
  isLoading: boolean;
  sourceType: string;
  onSourceTypeChange: (val: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageSelected,
  onOpenCamera,
  onRunAudit,
  isLoading,
  sourceType,
  onSourceTypeChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SamplePackagingItem) => {
    onImageSelected(sample.imageSrc, sample);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Step Header */}
      <div className="bg-slate-50/80 border-b border-slate-200 px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Packaging Sample Ingestion & Classification
            </h2>
            <p className="text-xs text-slate-500">
              Provide retail front/back label photo or choose an official verification case
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-600 font-semibold">Packaging Context:</label>
          <select
            value={sourceType}
            onChange={(e) => onSourceTypeChange(e.target.value)}
            className="bg-white border border-slate-300 text-xs text-slate-800 font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-800 shadow-2xs"
          >
            <option value="physical_label_or_listing">Retail Pack / Outer Label</option>
            <option value="e_commerce_catalog_listing">E-Commerce Marketplace Listing</option>
            <option value="carton_master_pack">Outer Wholesale Shipper Box</option>
          </select>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Verification Benchmark Test Cases */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Official Benchmark Packaging Samples:
            </span>
            <span className="text-[11px] text-slate-400">Click any sample to audit immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PACKAGING_CASES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition truncate">
                      {sample.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        sample.badgeType === 'success'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : sample.badgeType === 'danger'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {sample.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {sample.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[11px] font-semibold text-blue-800 flex items-center justify-between group-hover:translate-x-0.5 transition-transform">
                  <span>Audit Case</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-blue-600 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            accept="image/*"
            className="hidden"
          />

          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shadow-2xs">
            <ImageIcon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-800">
              <span className="text-blue-800 underline decoration-blue-800/40 underline-offset-2">
                Click to upload label photo
              </span>{' '}
              or drag and drop here
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Supports JPG, PNG, WEBP. Front, back, or MRP declarations panel.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
            >
              <Camera className="h-3.5 w-3.5 text-slate-600" />
              <span>Capture via Camera</span>
            </button>
            {currentImage && (
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Sample Ready
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!currentImage || isLoading}
            onClick={onRunAudit}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-300" />
                <span>Auditing Statutory Declarations...</span>
              </>
            ) : (
              <>
                <FileCheck className="h-3.5 w-3.5 text-amber-300" />
                <span>Inspect Packaging Declarations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
