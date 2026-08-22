'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConsciousnessLog, LogType } from '@/types/agent';
import { 
  Terminal, 
  Copy, 
  Check, 
  Filter
} from 'lucide-react';

interface ConsciousnessTerminalProps {
  logs: ConsciousnessLog[];
  onSelectMemory?: (id: string) => void;
}

// Deterministic 24-hour time formatter to prevent SSR/Client locale hydration mismatch
function formatLogTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export const ConsciousnessTerminal: React.FC<ConsciousnessTerminalProps> = ({
  logs,
  onSelectMemory,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'THOUGHT' | 'DECISION' | 'ONCHAIN'>('ALL');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLogs = logs.filter(l => {
    if (filter === 'ALL') return true;
    if (filter === 'THOUGHT') return l.type === 'THOUGHT' || l.type === 'EPITAPH';
    if (filter === 'DECISION') return l.type === 'TRIAGE' || l.type === 'COMPRESS' || l.type === 'SACRIFICE';
    if (filter === 'ONCHAIN') return l.type === 'PAYMENT' || l.type === 'ALERT' || l.type === 'RESUSCITATE';
    return true;
  });

  const handleCopy = () => {
    const text = filteredLogs
      .map(l => `[Epoch ${l.epoch}] [${l.type}] ${l.message}`)
      .join(String.fromCharCode(10));
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogBadge = (type: LogType) => {
    switch (type) {
      case 'THOUGHT':
        return <span className="px-1.5 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/60 text-[10px]">THOUGHT</span>;
      case 'ALERT':
        return <span className="px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60 text-[10px]">ALERT</span>;
      case 'COMPRESS':
        return <span className="px-1.5 py-0.2 rounded bg-yellow-950/70 text-yellow-300 border border-yellow-700/60 text-[10px]">COMPRESS</span>;
      case 'SACRIFICE':
        return <span className="px-1.5 py-0.2 rounded bg-red-950/70 text-red-300 border border-red-800/60 text-[10px]">SACRIFICE</span>;
      case 'EPITAPH':
        return <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-200 border border-slate-600 text-[10px]">EPITAPH</span>;
      case 'RESUSCITATE':
        return <span className="px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 text-[10px]">REVIVAL</span>;
      case 'PAYMENT':
        return <span className="px-1.5 py-0.2 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 text-[10px]">ONCHAIN</span>;
      default:
        return <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">LOG</span>;
    }
  };

  return (
    <div className="w-full rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col h-[320px] lg:h-[540px] shadow-2xl overflow-hidden font-mono">
      {/* Terminal Topbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Stream of Consciousness & Triage Log</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
            title="Copy audit log"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 border-b border-slate-800/70 text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
        </span>
        {(['ALL', 'THOUGHT', 'DECISION', 'ONCHAIN'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2 py-0.5 rounded text-[10px] uppercase transition-colors ${
              filter === tab
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-slate-600 text-xs py-8 italic">
            No events match current filter.
          </div>
        ) : (
          filteredLogs.map(log => {
            const isMonologue = log.message.startsWith('"');
            return (
              <div 
                key={log.id} 
                className={`p-2 rounded-lg transition-all duration-300 ease-out animate-log-entry border ${
                  log.type === 'SACRIFICE'
                    ? 'bg-red-950/20 border-red-900/40 text-red-200'
                    : log.type === 'COMPRESS'
                    ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                    : log.type === 'EPITAPH'
                    ? 'bg-slate-900/80 border-slate-700 text-slate-100'
                    : 'bg-slate-900/40 border-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {getLogBadge(log.type)}
                    <span className="text-[10px] text-slate-500">Epoch #{log.epoch}</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono" suppressHydrationWarning>
                    {mounted ? formatLogTime(log.timestamp) : '--:--:--'}
                  </span>
                </div>

                <div className={`leading-relaxed break-words ${isMonologue ? 'italic font-serif text-slate-200 text-[12.5px] pl-1 border-l-2 border-cyan-500/40' : 'text-slate-300 text-[11px]'}`}>
                  {log.message}
                </div>

                {log.targetMemoryId && onSelectMemory && (
                  <div className="mt-1.5 flex items-center justify-end">
                    <button
                      onClick={() => onSelectMemory(log.targetMemoryId!)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Inspect Memory</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
