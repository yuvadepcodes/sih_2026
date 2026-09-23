import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  RefreshCw,
  Search,
  X,
  Plus,
  Layers,
} from 'lucide-react';
import { optimizePackagingImage } from '../utils/imageOptimizer';

interface PlainScannerProps {
  images: string[];
  onAddImage: (base64: string) => void;
  onAddMultipleImages: (base64List: string[]) => void;
  onRemoveImage: (index: number) => void;
  onClearImages: () => void;
  onOpenCamera: () => void;
  onRunAudit: () => void;
  isLoading: boolean;
}

export const PlainScanner: React.FC<PlainScannerProps> = ({
  images,
  onAddMultipleImages,
  onRemoveImage,
  onClearImages,
  onOpenCamera,
  onRunAudit,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (fileList: FileList) => {
    const promises: Promise<string>[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/')) {
        promises.push(optimizePackagingImage(file, 1600, 0.85));
      }
    }

    try {
      const results = await Promise.all(promises);
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        onAddMultipleImages(valid);
      }
    } catch (err) {
      console.error('File optimization error:', err);
    }
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const getAngleLabel = (index: number) => {
    switch (index) {
      case 0:
        return 'Front (Net Wt / Brand)';
      case 1:
        return 'Back (Manufacturer & Care)';
      case 2:
        return 'Side / MRP Flap';
      case 3:
        return 'Top / Bottom / Batch';
      default:
        return `Angle ${index + 1}`;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
            // Reset input value so same files can be re-selected if needed
            e.target.value = '';
          }
        }}
        accept="image/*"
        multiple
        className="hidden"
      />

      {images.length === 0 ? (
        /* Empty State: Take photo or upload image */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition flex flex-col items-center justify-center gap-4 ${
            isDragging ? 'border-blue-600 bg-blue-50/50' : 'border-slate-300 bg-slate-50/50'
          }`}
        >
          <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">
            <Camera className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Scan Packaging Pictures (All Angles)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Take or upload photos from different angles (Front, Back, Sides, MRP panel) for comprehensive Legal Metrology verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition cursor-pointer"
            >
              <Upload className="h-4 w-4 text-slate-600" />
              <span>Upload Images (Select Multiple)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Image Gallery State */
        <div className="space-y-4">
          {/* Header with counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {images.length} {images.length === 1 ? 'Angle' : 'Angles'} Added
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Multi-surface synthesis ready
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Add more sides of the package or press Check to inspect all mandatory declarations.
              </p>
            </div>

            <button
              type="button"
              onClick={onClearImages}
              className="self-start sm:self-auto text-xs text-slate-400 hover:text-red-600 transition"
            >
              Clear all photos
            </button>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden aspect-4/3 flex items-center justify-center shadow-2xs"
              >
                <img
                  src={img}
                  alt={`Packaging angle ${idx + 1}`}
                  className="w-full h-full object-contain p-1"
                />

                {/* Angle label badge */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded text-center truncate">
                  {getAngleLabel(idx)}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-full shadow transition"
                  title="Remove this angle"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* "+ Add Another Angle" Card */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl aspect-4/3 flex flex-col items-center justify-center p-3 text-center bg-slate-50/50 hover:bg-blue-50/30 transition">
              <span className="text-[11px] font-bold text-slate-700 mb-2">
                + Add Angle
              </span>
              <div className="flex flex-col w-full gap-1.5">
                <button
                  type="button"
                  onClick={onOpenCamera}
                  className="inline-flex items-center justify-center gap-1 w-full py-1 text-[11px] font-semibold text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-lg transition cursor-pointer"
                >
                  <Camera className="h-3 w-3" />
                  <span>Snap Angle</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1 w-full py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  <span>Upload Pic</span>
                </button>
              </div>
            </div>
          </div>

          {/* Practical Tip for user */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
            <Layers className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold">Best Results Tip:</strong> Include photos of the front (Net Wt), back (Manufacturer & Consumer Care address/phone/email), and side or bottom flap (MRP & packaging date) to guarantee every statutory rule can be evaluated.
            </p>
          </div>

          {/* Main Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenCamera}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5 text-slate-600" />
                <span>Add from Camera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-slate-600" />
                <span>Upload More</span>
              </button>
            </div>

            <button
              type="button"
              disabled={isLoading || images.length === 0}
              onClick={onRunAudit}
              className="inline-flex items-center gap-2 px-7 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-xl shadow-xs transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-amber-300" />
                  <span>Analyzing {images.length} {images.length === 1 ? 'Angle' : 'Angles'}...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 text-amber-300" />
                  <span>Check Packaging ({images.length} {images.length === 1 ? 'Photo' : 'Photos'})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
