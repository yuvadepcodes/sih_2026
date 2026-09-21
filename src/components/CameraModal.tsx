import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Upload, AlertCircle, Plus } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string) => void;
  onCaptureMultiple?: (base64List: string[]) => void;
  currentCount?: number;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onCaptureMultiple,
  currentCount = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSessionCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedPhoto]);

  const startCamera = async () => {
    setCameraError(null);
    setIsRequesting(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported on this browser or device. Please upload photos instead.');
      setIsRequesting(false);
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access notice:', err?.name || err?.message || err);
      const errMsg = err?.message || err?.toString() || '';

      if (err?.name === 'NotAllowedError' || errMsg.includes('Permission dismissed') || errMsg.includes('Permission denied') || errMsg.includes('dismissed')) {
        setCameraError('Camera permission was dismissed or denied. You can enable camera access in your browser bar, or upload photos directly from your device.');
      } else if (err?.name === 'NotFoundError' || errMsg.includes('DevicesNotFoundError') || errMsg.includes('not found')) {
        setCameraError('No camera found on this device. Please upload image files instead.');
      } else if (err?.name === 'NotReadableError' || errMsg.includes('hardware error')) {
        setCameraError('Camera is currently in use by another application. Please close other camera apps or upload photos.');
      } else {
        setCameraError('Camera is unavailable in this environment. You can upload image files directly.');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleMultipleFiles = (files: FileList) => {
    const promises: Promise<string>[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        promises.push(
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          })
        );
      }
    }

    Promise.all(promises).then((results) => {
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        if (onCaptureMultiple) {
          onCaptureMultiple(valid);
        } else {
          valid.forEach((img) => onCapture(img));
        }
        onClose();
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleMultipleFiles(e.target.files);
    }
  };

  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const snapAnotherAngle = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      setSessionCount((prev) => prev + 1);
      setCapturedPhoto(null);
      startCamera();
    }
  };

  const confirmDone = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
    }
    onClose();
  };

  if (!isOpen) return null;

  const totalPhotos = currentCount + sessionCount + (capturedPhoto ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Capture Packaging Angle</h3>
              <p className="text-[11px] text-slate-400">
                {totalPhotos > 0 ? `${totalPhotos} angle${totalPhotos > 1 ? 's' : ''} added so far` : 'Front, back, or side panel'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[440px] overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-slate-300 max-w-md space-y-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-white font-semibold mb-1">Camera Notice</p>
                <p className="text-xs text-slate-400 leading-relaxed">{cameraError}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Photos Instead</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isRequesting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRequesting ? 'animate-spin' : ''}`} />
                  <span>Try Camera Again</span>
                </button>
              </div>
            </div>
          ) : capturedPhoto ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={capturedPhoto}
                alt="Captured angle preview"
                className="w-full h-auto max-h-[440px] object-contain"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/40 backdrop-blur-xs flex items-center gap-1.5">
                <Check className="h-3 w-3" />
                <span>Angle Captured</span>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-[440px] object-contain"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-amber-500/40 m-6 rounded-lg flex items-center justify-center">
                <span className="bg-slate-950/80 text-amber-300 text-[11px] px-3 py-1 rounded border border-amber-500/30">
                  Align packaging surface inside frame
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            {totalPhotos > 0 ? 'Close' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            {capturedPhoto ? (
              <>
                <button
                  type="button"
                  onClick={retake}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retake
                </button>

                <button
                  type="button"
                  onClick={snapAnotherAngle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md transition"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-400" />
                  Snap Next Angle
                </button>

                <button
                  type="button"
                  onClick={confirmDone}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow transition"
                >
                  <Check className="h-3.5 w-3.5" />
                  Done ({totalPhotos})
                </button>
              </>
            ) : !cameraError ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow transition"
                >
                  <Camera className="h-4 w-4" />
                  Capture Photo
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
