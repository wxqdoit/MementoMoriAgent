'use client';

import React, { useState } from 'react';
import { useAgentRuntime } from '@/hooks/useAgentRuntime';
import { HeaderBar } from '@/components/HeaderBar';
import { VitalSignsHUD } from '@/components/VitalSignsHUD';
import { MemoryConstellation } from '@/components/MemoryConstellation';
import { ConsciousnessTerminal } from '@/components/ConsciousnessTerminal';
import { JudgeControlPanel } from '@/components/JudgeControlPanel';
import { MemoryDrawer } from '@/components/MemoryDrawer';
import { AddMemoryModal } from '@/components/AddMemoryModal';
import { EpitaphModal } from '@/components/EpitaphModal';
import { ArchitectureExplainerModal } from '@/components/ArchitectureExplainerModal';

export default function MementoMoriApp() {
  const {
    memories,
    vitalSigns,
    logs,
    config,
    setConfig,
    selectedMemoryId,
    setSelectedMemoryId,
    activeGlitchMemoryId,
    activeCompressMemoryId,
    stepEpoch,
    handleFastDrain,
    handleTipFIL,
    handleReset,
    handleAddCustomMemory,
  } = useAgentRuntime();

  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);

  const selectedMemory = memories.find(m => m.id === selectedMemoryId) || null;

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* 1. Header Bar with Web3 Wallet & Calibration Sync & Auto Tour */}
      <HeaderBar
        stage={vitalSigns.currentStage}
        config={config}
        currentEpoch={vitalSigns.currentEpoch}
        onUpdateConfig={setConfig}
        onOpenExplainer={() => setIsExplainerOpen(true)}
        onOpenAddMemory={() => setIsAddMemoryOpen(true)}
        onTipFIL={handleTipFIL}
        onFastDrain={handleFastDrain}
        onReset={handleReset}
        onSelectMemory={id => setSelectedMemoryId(id)}
        onStepEpoch={stepEpoch}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 space-y-4 flex flex-col">
        {/* Vital Signs & Runway Gauge */}
        <VitalSignsHUD vitalSigns={vitalSigns} />

        {/* Constellation & Stream Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left: Memory Constellation Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <MemoryConstellation
              memories={memories}
              stage={vitalSigns.currentStage}
              selectedMemoryId={selectedMemoryId}
              activeGlitchMemoryId={activeGlitchMemoryId}
              activeCompressMemoryId={activeCompressMemoryId}
              onSelectMemory={id => setSelectedMemoryId(id)}
            />
          </div>

          {/* Right: Consciousness Stream & Triage Log (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <ConsciousnessTerminal
              logs={logs}
              onSelectMemory={id => setSelectedMemoryId(id)}
            />
          </div>
        </div>

        {/* Judge Control Panel (Bottom) */}
        <JudgeControlPanel
          config={config}
          onUpdateConfig={setConfig}
          onStepEpoch={stepEpoch}
          onFastDrain={handleFastDrain}
          onTipFIL={handleTipFIL}
          onReset={handleReset}
          onOpenAddMemory={() => setIsAddMemoryOpen(true)}
        />
      </div>

      {/* Modals & Drawers */}
      <MemoryDrawer
        memory={selectedMemory}
        onClose={() => setSelectedMemoryId(null)}
      />

      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        onAddMemory={handleAddCustomMemory}
      />

      <EpitaphModal
        epitaph={vitalSigns.finalEpitaph}
        onResuscitate={handleTipFIL}
      />

      <ArchitectureExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />
    </main>
  );
}
