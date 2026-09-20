import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Scan Product Package</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Take a photo or upload an image of the front, back, or MRP declarations panel.
          </p>
        </div>

        {/* Discreet Context Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Type:</span>
          <select
            value={sourceType}
            onChange={(e) => onSourceTypeChange(e.target.value)}
            className="bg-white border border-slate-300 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="physical_label_or_listing">Retail Pack / Label</option>
            <option value="e_commerce_catalog_listing">Online Store Listing</option>
            <option value="carton_master_pack">Wholesale Shipper Box</option>
          </select>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Main Action Area */}
        {!currentImage ? (
          <div className="space-y-4">
            {/* Big 2-button choice: Camera or Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Button 1: Camera Scan */}
              <button
                type="button"
                onClick={onOpenCamera}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-500 transition group text-center"
              >
                <div className="h-14 w-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                  <Camera className="h-7 w-7" />
                </div>
                <span className="text-base font-bold text-slate-900 group-hover:text-blue-950">
                  Scan with Camera
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Point camera at product label or MRP print
                </span>
              </button>

              {/* Button 2: Upload File / Drag & Drop */}
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition cursor-pointer text-center group ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-slate-50'
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
                <div className="h-14 w-14 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="h-7 w-7 text-slate-800" />
                </div>
                <span className="text-base font-bold text-slate-900 group-hover:text-blue-950">
                  Upload Label Photo
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Click to browse or drag and drop photo
                </span>
              </div>
            </div>

            {/* Quick Demo Pill Options (Discreet, replaces the bulky 3 cards) */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Or test with a demo package:</span>
              {SAMPLE_PACKAGING_CASES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`px-3 py-1 rounded-full border text-xs font-semibold transition ${
                    sample.badgeType === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : sample.badgeType === 'danger'
                      ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {sample.badgeType === 'success' ? '✓ ' : '⚠ '}
                  {sample.title.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Preview when Image is Selected */
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 shrink-0 shadow-xs">
                <img
                  src={currentImage}
                  alt="Scanned product package"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 space-y-3 text-center md:text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Photo Ready for Audit</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Product Package Loaded
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click the button below to inspect all mandatory declarations (Net quantity, MRP, taxes, manufacturer, origin).
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={onRunAudit}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-xl shadow-sm transition transform active:scale-95"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-amber-300" />
                        <span>Checking Compliance...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="h-4 w-4 text-amber-300" />
                        <span>Check Compliance Now</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition"
                  >
                    <Upload className="h-3.5 w-3.5 text-slate-600" />
                    <span>Change Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenCamera}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition"
                  >
                    <Camera className="h-3.5 w-3.5 text-slate-600" />
                    <span>Retake Photo</span>
                  </button>

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
                </div>
              </div>
            </div>

            {/* Quick Demo Pill Options for quick switching */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="font-medium">Or switch to a demo sample:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PACKAGING_CASES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 text-[11px] font-medium text-slate-700 transition"
                  >
                    {sample.title.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
