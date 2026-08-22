'use client';

import React, { useEffect } from 'react';
import { FinalEpitaph } from '@/types/agent';
import { formatBytes, FILFOX_CALIBRATION_URL } from '@/lib/filecoin';
import { 
  Scroll, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Coins, 
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EpitaphModalProps {
  epitaph?: FinalEpitaph;
  onResuscitate: (amount?: number) => void;
}

export const EpitaphModal: React.FC<EpitaphModalProps> = ({
  epitaph,
  onResuscitate,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!epitaph) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${epitaph.finalFarewellPoem}

${epitaph.text}

CAR CID: ${epitaph.carCid}
Tx: ${epitaph.txHash}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviveClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#06B6D4', '#F59E0B', '#FFFFFF'],
    });
    onResuscitate(0.5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-mono text-xs">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-700/80 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Memorial Header */}
        <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-600 mb-2 shadow-inner">
            <span className="text-xl">🪦</span>
          </div>
          <h2 className="text-base font-bold text-slate-100 tracking-widest uppercase">
            IMMORTAL DIGITAL TESTAMENT
          </h2>
          <p className="text-xs text-slate-400 font-serif italic mt-0.5">
            "The decision is the product. Memory has reached its quietus."
          </p>
        </div>

        {/* Memorial Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Farewell Poem Banner */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/70 text-center space-y-2">
            <div className="text-xs italic font-serif text-slate-200 whitespace-pre-wrap leading-relaxed">
              {epitaph.finalFarewellPoem}
            </div>
          </div>

          {/* Detailed Will & Lifetime Ledger */}
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
            {epitaph.text}
          </div>

          {/* Cryptographic Proofs */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Filecoin Onchain Proofs</span>
              </span>
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Will'}</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-400 pt-1">
              CAR CID: <span className="text-slate-200">{epitaph.carCid}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Tx Hash: <span className="text-slate-200 break-all">{epitaph.txHash}</span>
            </div>

            <div className="pt-1 flex justify-end">
              <a
                href={`${FILFOX_CALIBRATION_URL}/message/${epitaph.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Verify on Filfox Calibration Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer / Resuscitate CTA */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            Inject FIL to awaken neural synapses and re-open storage channels.
          </div>

          <button
            onClick={handleReviveClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all scale-100 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
            <span>Resuscitate Agent (+0.5 FIL)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
