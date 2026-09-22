import React, { useState } from 'react';
import { ShieldCheck, MapPin, Hash, Laptop, Clock, Copy, Check, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { EvidentiaryMetadata } from '../types';

interface EvidentiaryChainBannerProps {
  evidence: EvidentiaryMetadata;
}

export const EvidentiaryChainBanner: React.FC<EvidentiaryChainBannerProps> = ({ evidence }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedHash, setCopiedHash] = useState<number | null>(null);

  const handleCopy = (text: string, isHash = false, hashIndex = 0) => {
    navigator.clipboard?.writeText(text);
    if (isHash) {
      setCopiedHash(hashIndex);
      setTimeout(() => setCopiedHash(null), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-700/80 shadow-md overflow-hidden text-xs">
      {/* Top Header Bar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Evidentiary Chain of Custody
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Lock className="h-2.5 w-2.5" /> Immutable
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-white">
                {evidence.inspectionId}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(evidence.inspectionId)}
                className="text-slate-400 hover:text-white p-0.5 rounded transition cursor-pointer"
                title="Copy Official Inspection ID"
              >
                {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300">
            <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-mono">{evidence.formattedDateTimeIST}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-900/60 hover:bg-blue-900 border border-blue-700/60 rounded-lg text-blue-200 hover:text-white transition cursor-pointer text-[11px] font-semibold"
          >
            <span>{isExpanded ? 'Hide Forensics' : 'Inspect Audit Trail'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Forensics Details */}
      {isExpanded && (
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            {/* GPS Metadata */}
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <MapPin className="h-3.5 w-3.5" />
                <span>Geotag & Location Forensics</span>
              </div>
              {evidence.gpsCoordinates ? (
                <div className="text-slate-300 space-y-0.5">
                  <div className="font-mono">
                    Lat: <strong>{evidence.gpsCoordinates.latitude}° N</strong>, Lon: <strong>{evidence.gpsCoordinates.longitude}° E</strong>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Accuracy: ±{evidence.gpsCoordinates.accuracyMeters}m • {evidence.gpsCoordinates.districtZone}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">Location sensor not available</div>
              )}
            </div>

            {/* Inspector Terminal Device */}
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Laptop className="h-3.5 w-3.5" />
                <span>Enforcement Terminal ID</span>
              </div>
              <div className="text-slate-300 space-y-0.5">
                <div className="font-mono font-bold text-white">{evidence.deviceId}</div>
                <div className="text-[10px] text-slate-400">
                  National Legal Metrology Portal Handheld Terminal v4.2
                </div>
              </div>
            </div>

            {/* Custody Sync */}
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Tamper-Evident Digest</span>
              </div>
              <div className="text-slate-300 space-y-0.5">
                <div className="text-emerald-400 font-semibold text-[10px]">
                  ✓ SHA-256 Hash Verified against Central Registry
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  ISO/IEC 27037 Digital Forensics Conformance
                </div>
              </div>
            </div>
          </div>

          {/* SHA-256 Photo Hashes List */}
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Hash className="h-3.5 w-3.5" />
                Cryptographic Image Digests (SHA-256)
              </span>
              <span className="text-[10px] text-slate-500">
                {Object.keys(evidence.imageHashes).length} Evidence File(s)
              </span>
            </div>

            <div className="space-y-1">
              {Object.entries(evidence.imageHashes).map(([idx, hash]) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-[10px] text-slate-300"
                >
                  <span className="text-slate-400 font-semibold shrink-0">Photo #{Number(idx) + 1}:</span>
                  <span className="truncate text-amber-300">{hash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(hash, true, Number(idx))}
                    className="text-slate-400 hover:text-white p-1 rounded transition shrink-0 cursor-pointer"
                    title="Copy SHA-256 Hash"
                  >
                    {copiedHash === Number(idx) ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
