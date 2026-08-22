'use client';

import React, { useState } from 'react';
import { AgentConfig } from '@/types/agent';
import { 
  Play, 
  Pause, 
  FastForward, 
  Zap, 
  Coins, 
  RotateCcw, 
  PlusCircle, 
  Sliders,
  Sparkles,
  Bot,
  Key,
  ShieldAlert,
  StepForward
} from 'lucide-react';

interface JudgeControlPanelProps {
  config: AgentConfig;
  onUpdateConfig: (updater: (prev: AgentConfig) => AgentConfig) => void;
  onStepEpoch: (count?: number) => void;
  onFastDrain: () => void;
  onTipFIL: (amount?: number) => void;
  onReset: () => void;
  onOpenAddMemory: () => void;
}

export const JudgeControlPanel: React.FC<JudgeControlPanelProps> = ({
  config,
  onUpdateConfig,
  onStepEpoch,
  onFastDrain,
  onTipFIL,
  onReset,
  onOpenAddMemory,
}) => {
  const [showKeyInput, setShowKeyInput] = useState(false);

  return (
    <div className="w-full rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 shadow-xl font-mono">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Section: Speed & Step Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Judge Timeflow</span>
          </span>

          {/* Auto-run Toggle */}
          <button
            onClick={() => onUpdateConfig(c => ({ ...c, autoRun: !c.autoRun }))}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              config.autoRun
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {config.autoRun ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{config.autoRun ? 'Running' : 'Paused'}</span>
          </button>

          {/* Step 1 Epoch */}
          <button
            onClick={() => onStepEpoch(1)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
            title="Advance 1 Epoch manually"
          >
            <StepForward className="w-3.5 h-3.5 text-slate-400" />
            <span>+1 Epoch</span>
          </button>

          {/* Speed Presets */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {[1, 5, 20].map(speed => (
              <button
                key={speed}
                onClick={() => onUpdateConfig(c => ({ ...c, speedMultiplier: speed }))}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  config.speedMultiplier === speed
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Center/Right Section: Crisis Simulator & Injectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Fast Drain (Trigger Agony) */}
          <button
            onClick={onFastDrain}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/70 text-red-300 border border-red-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
            title="Fast drain runway into Agony stage (<30 epochs) to witness live AI triage"
          >
            <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>⚡ Fast Drain (Crisis Test)</span>
          </button>

          {/* Tip / Resuscitate +0.5 FIL */}
          <button
            onClick={() => onTipFIL(0.5)}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-700/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            title="Deposit +0.5 FIL to Filecoin Pay storage stream"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span>💊 Tip +0.5 FIL</span>
          </button>

          {/* Inject Memory */}
          <button
            onClick={onOpenAddMemory}
            className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/70 text-blue-300 border border-blue-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Memory</span>
          </button>

          {/* Reset / Rebirth */}
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
            title="Reset to genesis state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rebirth</span>
          </button>
        </div>
      </div>

      {/* Optional Live AI Config Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <span>AI Decision Engine:</span>
          <span className="font-semibold text-purple-300">
            {config.useLiveAI ? 'Live External LLM (Claude/GPT)' : 'Built-in Philosophical Cognitive Model'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Key className="w-3 h-3" />
            <span>{showKeyInput ? 'Hide API Config' : 'Configure Custom API Key'}</span>
          </button>
        </div>
      </div>

      {showKeyInput && (
        <div className="mt-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-2">
          <select
            value={config.aiProvider || 'openai'}
            onChange={e => onUpdateConfig(c => ({ ...c, aiProvider: e.target.value as 'openai' | 'anthropic' }))}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="openai">OpenAI (GPT-4o-mini)</option>
            <option value="anthropic">Anthropic (Claude 3.5)</option>
          </select>
          <input
            type="password"
            placeholder="Enter API Key (sk-...)"
            value={config.apiKey || ''}
            onChange={e => onUpdateConfig(c => ({ ...c, apiKey: e.target.value, useLiveAI: !!e.target.value }))}
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => onUpdateConfig(c => ({ ...c, useLiveAI: !c.useLiveAI }))}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              config.useLiveAI ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {config.useLiveAI ? 'Enabled' : 'Use Built-in'}
          </button>
        </div>
      )}
    </div>
  );
};
