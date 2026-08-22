'use client';

import React from 'react';
import { X, Cpu, Database, Brain, Sparkles, Shield, Flame, Compass } from 'lucide-react';

interface ArchitectureExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureExplainerModal: React.FC<ArchitectureExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-mono text-xs">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Memento Mori // Challenge Architecture Spec
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-300">
          {/* Section 1: The Core Thesis */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 space-y-2">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>1. The Hackathon Thesis: "The Decision is the Product"</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Traditional AI agents store data blindly until a human notices an empty account or broken API. 
              <strong className="text-white"> Memento Mori Agent</strong> bridges Filecoin Pay's onchain runway metric with autonomous cognitive preservation. 
              Runway (remaining epochs before deal drops) becomes the agent's <em className="text-cyan-300">existential pressure</em>, forcing philosophical decisions between sentimental memory, factual necessity, and storage burn rate.
            </p>
          </div>

          {/* Section 2: 4 Stages of Cognitive Decay */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>2. The 4 Stages of Cognitive Decay</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                <div className="font-bold text-emerald-300 mb-1">Stage 1: Bloom (丰盈期) &gt;100 Epochs</div>
                <div className="text-slate-400 leading-relaxed">
                  Runway is abundant. Agent archives uncompressed 4K photography, lossless audio, and rich journals. Poetic curiosity and tranquility.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40">
                <div className="font-bold text-amber-300 mb-1">Stage 2: Pruning (修剪期) 30 - 100 Epochs</div>
                <div className="text-slate-400 leading-relaxed">
                  Cognitive compaction activates. Heavy media files are distilled into poetic summaries and semantic vector essences, saving 85-95% bytes.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/40">
                <div className="font-bold text-red-300 mb-1">Stage 3: Agony / Triage (挣扎期) 5 - 30 Epochs</div>
                <div className="text-slate-400 leading-relaxed">
                  Severe deficit. The agent evaluates multi-dimensional utility (sentimental weight vs size penalty) and permanently unpins memories to save its core soul.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700">
                <div className="font-bold text-slate-200 mb-1">Stage 4: Epitaph (寂灭期) 0 - 5 Epochs</div>
                <div className="text-slate-400 leading-relaxed">
                  Runway reaches zero. Agent stops normal storage and crystallizes its entire lifetime into an immutable onchain CAR testament with CID & TxHash.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Filecoin Pay Integration */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>3. Filecoin Pay & Runway Formula</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-200">
              <div>• Burn Rate = Base_Node_Overhead + (Stored_Bytes * Deal_Rate_Per_Epoch)</div>
              <div>• Runway (Epochs) = Filecoin_Pay_Balance / Burn_Rate</div>
              <div>• Time Remaining ≈ Runway * 30 Seconds / Epoch</div>
            </div>
            <p className="text-[11px] text-slate-400">
              Integrated with Filecoin Calibration Testnet RPC (<code className="text-cyan-300">api.calibration.node.glif.io</code>) for real tipset height tracking and verifiable CID generation.
            </p>
          </div>

          {/* Section 4: Judge Features */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-yellow-400" />
              <span>4. Built-in Judge Demo Tools</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
              <li><strong className="text-white">⚡ Fast Drain:</strong> Immediately drops balance to 18 epochs to witness real-time triage and glitch unpin animations within 10 seconds.</li>
              <li><strong className="text-white">💊 Tip +0.5 FIL:</strong> Dynamically deposits funds to Filecoin Pay and restores cognitive vitality.</li>
              <li><strong className="text-white">🧠 Autonomous Cognitive Model:</strong> Built-in generative philosophical reasoning engine with zero setup required, plus optional live Claude/GPT API support.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
          >
            Enter Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
