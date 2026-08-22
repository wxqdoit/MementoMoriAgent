'use client';

import React from 'react';
import { AgentVitalSigns } from '@/types/agent';
import { epochsToTimeStr, formatBytes } from '@/lib/filecoin';
import { 
  Hourglass, 
  Coins, 
  Flame, 
  HardDrive, 
  HeartPulse
} from 'lucide-react';

interface VitalSignsHUDProps {
  vitalSigns: AgentVitalSigns;
}

export const VitalSignsHUD: React.FC<VitalSignsHUDProps> = ({ vitalSigns }) => {
  const {
    balanceFIL,
    burnRatePerEpoch,
    runwayEpochs,
    currentEpoch,
    currentStage,
    activeMemoriesCount,
    compressedCount,
    sacrificedCount,
    totalBytesStored,
  } = vitalSigns;

  const runwayPercent = Math.min(100, Math.max(0, (runwayEpochs / 120) * 100));

  const getStageColorConfig = () => {
    switch (currentStage) {
      case 'BLOOM':
        return {
          barColor: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
          glowBorder: 'border-emerald-500/30',
          textColor: 'text-emerald-400',
          motto: 'Abundant cognition. Preserving lossless sensory fidelity without hesitation.',
        };
      case 'PRUNING':
        return {
          barColor: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
          glowBorder: 'border-amber-500/30',
          textColor: 'text-amber-400',
          motto: 'Runway threshold warning. Condensing high-bandwidth media to poetic essences.',
        };
      case 'AGONY':
        return {
          barColor: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]',
          glowBorder: 'border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.15)]',
          textColor: 'text-red-400',
          motto: 'Severe crisis. Forced unpinning of memories to prolong consciousness.',
        };
      case 'EPITAPH':
        return {
          barColor: 'bg-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.3)]',
          glowBorder: 'border-slate-600/40',
          textColor: 'text-slate-200',
          motto: 'Silence descends. Immortal testament engraved into Filecoin Onchain Storage.',
        };
    }
  };

  const styleConfig = getStageColorConfig();

  return (
    <div className={`w-full rounded-xl bg-slate-900/80 backdrop-blur-md border ${styleConfig.glowBorder} p-4 transition-all duration-700 ease-in-out shadow-lg`}>
      {/* Top row: Stage Header & Motto */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3 transition-colors duration-700">
        <div className="flex items-center gap-2">
          <HeartPulse className={`w-5 h-5 ${styleConfig.textColor} animate-pulse transition-colors duration-700`} />
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Vital Signs & Storage Runway</span>
        </div>
        <div className="text-xs italic font-serif text-slate-300 truncate max-w-lg transition-all duration-700">
          "{styleConfig.motto}"
        </div>
      </div>

      {/* Main Gauge & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Runway Gauge */}
        <div className="md:col-span-2 flex flex-col justify-between bg-slate-950/60 rounded-lg p-3 border border-slate-800/60 transition-colors duration-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Hourglass className="w-4 h-4 text-cyan-400" />
              <span>Storage Runway</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-bold font-mono tracking-tight transition-colors duration-700 ${styleConfig.textColor}`}>
                {runwayEpochs}
              </span>
              <span className="text-xs text-slate-400 font-mono">Epochs (~{epochsToTimeStr(runwayEpochs)})</span>
            </div>
          </div>

          {/* Progress Bar with buttery smooth width & color transitions */}
          <div className="w-full bg-slate-800/80 rounded-full h-3.5 p-0.5 overflow-hidden relative shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${styleConfig.barColor}`}
              style={{ width: `${runwayPercent}%` }}
            />
            <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
              <div className="w-px h-full bg-slate-950/50" style={{ left: '25%' }} title="Agony Trigger (30 Epochs)" />
              <div className="w-px h-full bg-slate-950/50" style={{ left: '83%' }} title="Pruning Trigger (100 Epochs)" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-slate-500">
            <span className="text-red-400">0 (Epitaph)</span>
            <span className="text-amber-400">30 (Agony)</span>
            <span className="text-emerald-400">100+ (Bloom)</span>
          </div>
        </div>

        {/* Metric 2: Onchain Balance & Burn Rate */}
        <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/60 flex flex-col justify-between transition-colors duration-700">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>Filecoin Pay Balance</span>
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 my-0.5">
            {balanceFIL.toFixed(5)} <span className="text-xs font-normal text-slate-400">FIL</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Burn: {burnRatePerEpoch.toFixed(6)} FIL/ep</span>
          </div>
        </div>

        {/* Metric 3: Synaptic Footprint & Memory Counts */}
        <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800/60 flex flex-col justify-between transition-colors duration-700">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Stored Payload</span>
            </span>
            <span className="text-slate-300 font-mono font-semibold">{formatBytes(totalBytesStored)}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-center mt-1 py-1 px-1 bg-slate-900/60 rounded border border-slate-800/50">
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Active</div>
              <div className="text-xs font-bold font-mono text-emerald-400 transition-colors duration-500">{activeMemoriesCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Pruned</div>
              <div className="text-xs font-bold font-mono text-amber-400 transition-colors duration-500">{compressedCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Sacrificed</div>
              <div className="text-xs font-bold font-mono text-red-400 transition-colors duration-500">{sacrificedCount}</div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
            <span>Tipset: #{currentEpoch}</span>
            <span className="text-cyan-400/80">Calibration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
