import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please check browser permissions or upload an image file.');
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

  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const confirmCapture = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Capture Packaging / Label</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[460px] overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-slate-300 max-w-sm">
              <p className="text-sm text-red-400 mb-2 font-medium">{cameraError}</p>
              <p className="text-xs text-slate-500">You can also upload a file directly from your computer or phone gallery.</p>
            </div>
          ) : capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured package preview"
              className="w-full h-auto max-h-[450px] object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-[450px] object-contain"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-amber-500/40 m-6 rounded-lg flex items-center justify-center">
                <span className="bg-slate-950/70 text-amber-300 text-[11px] px-3 py-1 rounded border border-amber-500/30">
                  Align MRP, Net Wt, and Manufacturer details inside frame
                </span>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Cancel
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
                  onClick={confirmCapture}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md shadow transition"
                >
                  <Check className="h-3.5 w-3.5" />
                  Use Photo
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={!!cameraError}
                onClick={takeSnapshot}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow transition"
              >
                <Camera className="h-4 w-4" />
                Capture Label
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
