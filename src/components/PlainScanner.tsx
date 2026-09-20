import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

interface PlainScannerProps {
  currentImage: string | null;
  onImageSelected: (base64: string) => void;
  onOpenCamera: () => void;
  onRunAudit: () => void;
  isLoading: boolean;
  onClearImage: () => void;
}

export const PlainScanner: React.FC<PlainScannerProps> = ({
  currentImage,
  onImageSelected,
  onOpenCamera,
  onRunAudit,
  isLoading,
  onClearImage,
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

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
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

      {!currentImage ? (
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
              Scan or Upload Packaging Picture
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Take a photo of the product package or choose an image from your device
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition"
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition"
            >
              <Upload className="h-4 w-4 text-slate-600" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      ) : (
        /* Image Loaded State: Plain preview and Check button */
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative h-44 w-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
            <img
              src={currentImage}
              alt="Packaging scan"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={onClearImage}
              className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">
                <CheckCircle2 className="h-3 w-3" />
                Picture Ready
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Packaging Picture Selected
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Press Check below to generate the compliance report.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              <button
                type="button"
                disabled={isLoading}
                onClick={onRunAudit}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-xl shadow-xs transition"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-amber-300" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 text-amber-300" />
                    <span>Check</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition"
              >
                <Upload className="h-3.5 w-3.5 text-slate-600" />
                <span>Change Pic</span>
              </button>

              <button
                type="button"
                onClick={onOpenCamera}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition"
              >
                <Camera className="h-3.5 w-3.5 text-slate-600" />
                <span>Take New Pic</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
