'use client';

import React, { useState } from 'react';
import { MemoryNode } from '@/types/agent';
import { formatBytes, FILFOX_CALIBRATION_URL } from '@/lib/filecoin';
import { 
  X, 
  HardDrive, 
  Coins, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert,
  Image as ImageIcon,
  Music,
  BookOpen,
  Binary
} from 'lucide-react';

interface MemoryDrawerProps {
  memory: MemoryNode | null;
  onClose: () => void;
}

export const MemoryDrawer: React.FC<MemoryDrawerProps> = ({ memory, onClose }) => {
  const [copiedCid, setCopiedCid] = useState(false);

  if (!memory) return null;

  const handleCopyCid = () => {
    navigator.clipboard.writeText(memory.cid);
    setCopiedCid(true);
    setTimeout(() => setCopiedCid(false), 2000);
  };

  const getTypeIcon = () => {
    switch (memory.initialType) {
      case 'image_raw': return <ImageIcon className="w-4 h-4 text-cyan-400" />;
      case 'audio_raw': return <Music className="w-4 h-4 text-pink-400" />;
      case 'journal_rich': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'fact_record': return <Binary className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md h-full max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <div>
              <h2 className="text-sm font-bold text-slate-100 line-clamp-1">{memory.title}</h2>
              <span className="text-[10px] text-slate-400 uppercase">{memory.category} • {memory.initialType.replace('_', ' ')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400">Synaptic State:</span>
            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
              memory.currentStage === 'sacrificed' 
                ? 'bg-red-950 text-red-400 border border-red-800' 
                : memory.currentStage === 'compressed_text'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {memory.currentStage}
            </span>
          </div>

          {/* Storage & Financial Specs */}
          <div className="space-y-2 p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
            <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filecoin Storage Metrics</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500">Current Payload:</span>
                <div className="text-slate-200 font-bold">{formatBytes(memory.sizeBytes)}</div>
              </div>
              <div>
                <span className="text-slate-500">Initial Payload:</span>
                <div className="text-slate-400">{formatBytes(memory.initialSizeBytes)}</div>
              </div>
              <div>
                <span className="text-slate-500">Burn Cost:</span>
                <div className="text-amber-400">{memory.costPerEpoch.toFixed(6)} FIL/ep</div>
              </div>
              <div>
                <span className="text-slate-500">Sentimental / Factual:</span>
                <div className="text-emerald-400">{memory.emotionalWeight} / {memory.factualSignificance}</div>
              </div>
            </div>
          </div>

          {/* CID Details */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="text-slate-400 font-semibold flex items-center justify-between">
              <span>IPFS / Filecoin CID</span>
              <button
                onClick={handleCopyCid}
                className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
              >
                {copiedCid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCid ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-[10px] text-slate-300 bg-slate-900 p-2 rounded break-all border border-slate-800">
              {memory.cid}
            </div>
            <div className="pt-1 flex justify-end">
              <a
                href={`${FILFOX_CALIBRATION_URL}/message/${memory.cid}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Verify on Filfox Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Preview / Content */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
            <div className="text-slate-400 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Memory Content Representation</span>
            </div>

            {memory.rawPreviewUrl && memory.currentStage === 'raw' && (
              <div className="rounded overflow-hidden border border-slate-800">
                <img src={memory.rawPreviewUrl} alt={memory.title} className="w-full h-36 object-cover" />
              </div>
            )}

            {memory.rawContent && (
              <div>
                <div className="text-[10px] text-slate-500 mb-0.5">Raw Sensory Narrative:</div>
                <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {memory.rawContent}
                </div>
              </div>
            )}

            {memory.compressedContent && (
              <div>
                <div className="text-[10px] text-amber-400 mb-0.5">Distilled Poetic Essence (Pruned):</div>
                <div className="text-[11px] italic font-serif text-amber-200 bg-amber-950/30 p-2 rounded border border-amber-900/50 leading-relaxed">
                  "{memory.compressedContent}"
                </div>
              </div>
            )}

            {memory.vectorEssence && (
              <div>
                <div className="text-[10px] text-purple-400 mb-0.5">Latent Semantic Coordinate:</div>
                <div className="text-[10px] text-purple-300 bg-purple-950/30 p-1.5 rounded border border-purple-900/50">
                  {memory.vectorEssence}
                </div>
              </div>
            )}
          </div>

          {/* Triage Decision Log (If Pruned or Sacrificed) */}
          {memory.triageLog && (
            <div className="p-3 rounded-lg bg-slate-950/90 border border-red-900/40 space-y-2">
              <div className="text-red-300 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Triage Audit Event</span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>Epoch: <span className="text-slate-200">#{memory.triageLog.epoch}</span></div>
                <div>Action: <span className="text-red-400 font-bold">{memory.triageLog.action}</span></div>
                <div>Justification: <span className="text-slate-300">{memory.triageLog.reason}</span></div>
              </div>
              <div className="text-[11px] italic font-serif text-slate-200 bg-slate-900/90 p-2 rounded border-l-2 border-red-500">
                "{memory.triageLog.innerMonologue}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
