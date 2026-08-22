'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AutoDemoTour } from '@/components/AutoDemoTour';
import { AgentStage, AgentConfig } from '@/types/agent';
import { 
  Brain, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  ExternalLink, 
  Zap, 
  Radio
} from 'lucide-react';
import { FILFOX_CALIBRATION_URL } from '@/lib/filecoin';

// Dynamically import ReownWalletButton with ssr disabled
const ReownWalletButton = dynamic(
  () => import('@/components/ReownWalletButton').then(mod => mod.ReownWalletButton),
  {
    ssr: false,
    loading: () => (
      <button className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono whitespace-nowrap">
        Connect Wallet
      </button>
    ),
  }
);

interface HeaderBarProps {
  stage: AgentStage;
  config: AgentConfig;
  currentEpoch: number;
  onUpdateConfig: (updater: (prev: AgentConfig) => AgentConfig) => void;
  onOpenExplainer: () => void;
  onOpenAddMemory: () => void;
  onTipFIL: (amount: number, txHash?: string) => void;
  onFastDrain: () => void;
  onReset: () => void;
  onSelectMemory: (id: string) => void;
  onStepEpoch: (count: number) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stage,
  config,
  currentEpoch,
  onUpdateConfig,
  onOpenExplainer,
  onOpenAddMemory,
  onTipFIL,
  onFastDrain,
  onReset,
  onSelectMemory,
  onStepEpoch,
}) => {
  const getStageBadge = (s: AgentStage) => {
    switch (s) {
      case 'BLOOM':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span>STAGE 1: BLOOM (丰盈期)</span>
          </span>
        );
      case 'PRUNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <span>STAGE 2: PRUNING (修剪期)</span>
          </span>
        );
      case 'AGONY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-red-950/80 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
            <span>STAGE 3: AGONY (挣扎期)</span>
          </span>
        );
      case 'EPITAPH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-900/90 text-slate-200 border border-slate-400/40 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-slate-200 shrink-0"></span>
            <span>STAGE 4: EPITAPH (寂灭期)</span>
          </span>
        );
    }
  };

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-40 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 transition-colors">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-slate-100 uppercase whitespace-nowrap truncate">
              Memento Mori Agent
            </h1>
            <span className="hidden md:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 whitespace-nowrap shrink-0">
              Filecoin Pay Sentinel
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-mono truncate hidden lg:block">
            Autonomous Storage Runway & Cognitive Decay Orchestrator
          </p>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
        {/* Stage Badge */}
        <div className="shrink-0">
          {getStageBadge(stage)}
        </div>

        {/* Calibration Live Explorer Badge */}
        <a
          href={`${FILFOX_CALIBRATION_URL}/tipset/${currentEpoch}`}
          target="_blank"
          rel="noreferrer"
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors whitespace-nowrap shrink-0"
          title="Click to view live Tipset on Filfox Calibration Explorer"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
          <span>Calibration #{currentEpoch}</span>
          <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
        </a>

        {/* Reown AppKit Dynamic Wallet Button */}
        <div className="shrink-0">
          <AutoDemoTour 
            onFastDrain={onFastDrain}
            onTipFIL={onTipFIL}
            onReset={onReset}
            onSelectMemory={onSelectMemory}
            onStepEpoch={onStepEpoch}
          />
        </div>

        <div className="shrink-0">
          <ReownWalletButton onTipFIL={onTipFIL} />
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => onUpdateConfig(c => ({ ...c, soundEnabled: !c.soundEnabled }))}
          className={`p-2 rounded-lg border text-xs transition-all flex items-center justify-center shrink-0 ${
            config.soundEnabled 
              ? 'bg-cyan-950/40 border-cyan-600/40 text-cyan-300 hover:bg-cyan-900/50' 
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={config.soundEnabled ? 'Audio Feedback Enabled' : 'Audio Muted'}
        >
          {config.soundEnabled ? <Volume2 className="w-4 h-4 shrink-0" /> : <VolumeX className="w-4 h-4 shrink-0" />}
        </button>

        {/* Inject Memory Quick button */}
        <button
          onClick={onOpenAddMemory}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline">Inject Memory</span>
        </button>

        {/* Challenge Architecture Spec */}
        <button
          onClick={onOpenExplainer}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline">Architecture</span>
        </button>
      </div>
    </header>
  );
};
