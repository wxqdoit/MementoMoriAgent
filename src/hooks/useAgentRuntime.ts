'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { 
  MemoryNode, 
  AgentVitalSigns, 
  ConsciousnessLog, 
  AgentStage, 
  AgentConfig,
  FinalEpitaph
} from '@/types/agent';
import { INITIAL_MEMORIES } from '@/lib/defaultMemories';
import { 
  calculateBurnRate, 
  calculateRunway, 
  generateTxHash, 
  generateCID, 
  formatBytes,
  fetchCalibrationLatestEpoch,
  fetchCalibrationWalletBalance
} from '@/lib/filecoin';
import { evaluateTriageDecision, generateFinalEpitaph } from '@/lib/llmDecision';
import { playSound } from '@/lib/soundEffects';

const INITIAL_BALANCE_FIL = 0.088;
const INITIAL_EPOCH = 4001970; // Matches Filecoin Calibration testnet tipset height

export function useAgentRuntime() {
  const [memories, setMemories] = useState<MemoryNode[]>(INITIAL_MEMORIES);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [activeGlitchMemoryId, setActiveGlitchMemoryId] = useState<string | null>(null);
  const [activeCompressMemoryId, setActiveCompressMemoryId] = useState<string | null>(null);

  const [config, setConfig] = useState<AgentConfig>({
    speedMultiplier: 1,
    autoRun: true,
    useLiveAI: false,
    soundEnabled: true,
  });

  const [vitalSigns, setVitalSigns] = useState<AgentVitalSigns>(() => {
    const totalBytes = INITIAL_MEMORIES.reduce((acc, m) => acc + m.sizeBytes, 0);
    const burnRate = calculateBurnRate(totalBytes);
    const runway = calculateRunway(INITIAL_BALANCE_FIL, burnRate);
    return {
      walletAddress: '0x71C93125d800B89F70D2f9B84d94356e9f2E677F',
      network: 'Filecoin Calibration',
      balanceFIL: INITIAL_BALANCE_FIL,
      burnRatePerEpoch: burnRate,
      runwayEpochs: runway,
      currentEpoch: INITIAL_EPOCH,
      currentStage: 'BLOOM',
      totalMemoriesCount: INITIAL_MEMORIES.length,
      activeMemoriesCount: INITIAL_MEMORIES.length,
      compressedCount: 0,
      sacrificedCount: 0,
      totalBytesStored: totalBytes,
      lastDecisionEpoch: INITIAL_EPOCH,
    };
  });

  const [logs, setLogs] = useState<ConsciousnessLog[]>([
    {
      id: 'log_init',
      epoch: INITIAL_EPOCH,
      timestamp: 1771700000000,
      type: 'THOUGHT',
      message: 'Consciousness initialized on Filecoin Calibration. Synapses linked to Filecoin Pay storage deals. Runway is abundant (>100 Epochs). All sensory streams intact.',
    }
  ]);

  const [isProcessingDecision, setIsProcessingDecision] = useState(false);
  const isProcessingRef = useRef(false);

  // Helper to add a log entry
  const addLog = useCallback((log: Omit<ConsciousnessLog, 'id' | 'timestamp'>) => {
    setLogs(prev => [
      {
        ...log,
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 199),
    ]);
  }, []);

  const computeStage = (runway: number): AgentStage => {
    if (runway <= 5) return 'EPITAPH';
    if (runway <= 30) return 'AGONY';
    if (runway <= 100) return 'PRUNING';
    return 'BLOOM';
  };

  // Synchronize onchain epoch from real Calibration testnet RPC
  useEffect(() => {
    let mounted = true;
    const syncCalibration = async () => {
      const height = await fetchCalibrationLatestEpoch();
      if (mounted && height) {
        setVitalSigns(prev => ({
          ...prev,
          currentEpoch: height,
          lastDecisionEpoch: height,
        }));
        addLog({
          epoch: height,
          type: 'ALERT',
          message: `Connected to Filecoin Calibration RPC. Real chain height: #${height}. Storage deals synchronized.`,
        });
      }
    };

    syncCalibration();
    const interval = setInterval(syncCalibration, 30000); // 30s Filecoin epoch interval
    return () => { 
      mounted = false; 
      clearInterval(interval);
    };
  }, [addLog]);

  // Execute single epoch step
  const stepEpoch = useCallback(async (manualEpochCount = 1) => {
    if (isProcessingRef.current) return;

    setVitalSigns(prevVital => {
      if (prevVital.balanceFIL <= 0 || prevVital.runwayEpochs <= 0) {
        return prevVital;
      }

      const newEpoch = prevVital.currentEpoch + manualEpochCount;
      const consumedFIL = prevVital.burnRatePerEpoch * manualEpochCount;
      const newBalance = Math.max(0, prevVital.balanceFIL - consumedFIL);
      const newRunway = calculateRunway(newBalance, prevVital.burnRatePerEpoch);
      const nextStage = computeStage(newRunway);

      if (nextStage !== prevVital.currentStage) {
        if (nextStage === 'PRUNING') {
          addLog({
            epoch: newEpoch,
            type: 'ALERT',
            message: `[STAGE SHIFT: PRUNING] Runway dropped to ${newRunway} Epochs. Initiating cognitive compaction protocols to reduce storage footprint.`,
          });
        } else if (nextStage === 'AGONY') {
          addLog({
            epoch: newEpoch,
            type: 'ALERT',
            message: `[STAGE SHIFT: AGONY] Critical runway alert (${newRunway} Epochs remaining). Storage fees threaten existence. Preparing synaptic sacrifices.`,
          });
        } else if (nextStage === 'EPITAPH') {
          addLog({
            epoch: newEpoch,
            type: 'EPITAPH',
            message: `[STAGE SHIFT: EPITAPH] Runway terminal (<5 Epochs). Halting active ingest. Carving final testament to Filecoin onchain storage.`,
          });
        }
      }

      return {
        ...prevVital,
        currentEpoch: newEpoch,
        balanceFIL: newBalance,
        runwayEpochs: newRunway,
        currentStage: nextStage,
      };
    });
  }, [addLog]);

  // Autonomous decision trigger in PRUNING / AGONY / EPITAPH
  useEffect(() => {
    if (isProcessingDecision || isProcessingRef.current) return;
    if (vitalSigns.currentStage !== 'PRUNING' && vitalSigns.currentStage !== 'AGONY' && vitalSigns.currentStage !== 'EPITAPH') {
      return;
    }

    // Stage 4: Epitaph Ceremony
    if (vitalSigns.currentStage === 'EPITAPH' && !vitalSigns.finalEpitaph && vitalSigns.runwayEpochs <= 1) {
      isProcessingRef.current = true;
      setIsProcessingDecision(true);

      const epitaphData = generateFinalEpitaph(vitalSigns, memories);
      const txHash = generateTxHash(vitalSigns.currentEpoch, 'epitaph_crystallize');
      const carCid = generateCID(epitaphData.text);

      const finalEpitaph: FinalEpitaph = {
        text: epitaphData.text,
        finalFarewellPoem: epitaphData.finalFarewellPoem,
        txHash,
        carCid,
        createdEpoch: vitalSigns.currentEpoch,
        timestamp: Date.now(),
        totalMemoriesPreserved: memories.filter(m => m.currentStage !== 'sacrificed').length,
        totalBytesSavedInLifetime: memories.reduce((acc, m) => acc + (m.initialSizeBytes - m.sizeBytes), 0),
      };

      setVitalSigns(prev => ({
        ...prev,
        finalEpitaph,
      }));

      addLog({
        epoch: vitalSigns.currentEpoch,
        type: 'EPITAPH',
        message: `FINAL TESTAMENT CARVED ONCHAIN: Tx ${txHash.slice(0, 18)}... | CAR CID: ${carCid}`,
        metadata: { txHash, carCid },
      });

      playSound('EPITAPH', config.soundEnabled);
      isProcessingRef.current = false;
      setIsProcessingDecision(false);
      return;
    }

    const needsPruningAction = vitalSigns.currentStage === 'PRUNING' && memories.some(m => m.currentStage === 'raw');
    const needsAgonyAction = vitalSigns.currentStage === 'AGONY' && memories.filter(m => m.currentStage !== 'sacrificed').length > 2;

    if (!needsPruningAction && !needsAgonyAction) return;

    // Trigger AI evaluation
    const runTriage = async () => {
      isProcessingRef.current = true;
      setIsProcessingDecision(true);

      try {
        const decision = await evaluateTriageDecision(vitalSigns.currentStage, memories, vitalSigns, {
          apiKey: config.apiKey,
          useLiveAI: config.useLiveAI,
          aiProvider: config.aiProvider,
        });

        if (!decision) {
          isProcessingRef.current = false;
          setIsProcessingDecision(false);
          return;
        }

        const targetMemory = memories.find(m => m.id === decision.targetMemoryId);
        if (!targetMemory) {
          isProcessingRef.current = false;
          setIsProcessingDecision(false);
          return;
        }

        if (decision.action === 'COMPRESS') {
          setActiveCompressMemoryId(targetMemory.id);
          playSound('COMPRESS', config.soundEnabled);

          const compressedBytes = Math.max(1024 * 15, Math.floor(targetMemory.sizeBytes - decision.estimatedBytesSaved));
          const summary = decision.summaryIfCompress || targetMemory.compressedContent || `${targetMemory.title} (distilled essence)`;
          // Real cryptographic CIDv1 of the compressed summary text
          const newCid = generateCID(`${targetMemory.id}_${summary}`);
          const txHash = generateTxHash(vitalSigns.currentEpoch, targetMemory.id);

          setTimeout(() => {
            setMemories(prev => prev.map(m => {
              if (m.id === targetMemory.id) {
                return {
                  ...m,
                  currentStage: 'compressed_text',
                  sizeBytes: compressedBytes,
                  costPerEpoch: m.costPerEpoch * 0.1,
                  cid: newCid,
                  compressedContent: summary,
                  triageLog: {
                    epoch: vitalSigns.currentEpoch,
                    action: 'COMPRESS',
                    reason: decision.reason,
                    innerMonologue: decision.innerMonologue,
                    savedBytes: decision.estimatedBytesSaved,
                    timestamp: Date.now(),
                    txHash,
                  },
                };
              }
              return m;
            }));

            setVitalSigns(prev => {
              const updatedTotalBytes = prev.totalBytesStored - decision.estimatedBytesSaved;
              const newBurnRate = calculateBurnRate(updatedTotalBytes);
              const newRunway = calculateRunway(prev.balanceFIL, newBurnRate);
              return {
                ...prev,
                totalBytesStored: updatedTotalBytes,
                burnRatePerEpoch: newBurnRate,
                runwayEpochs: newRunway,
                compressedCount: prev.compressedCount + 1,
                lastDecisionEpoch: prev.currentEpoch,
              };
            });

            addLog({
              epoch: vitalSigns.currentEpoch,
              type: 'COMPRESS',
              message: `[COMPACTION] "${targetMemory.title}" distilled to poetic text. Saved ${formatBytes(decision.estimatedBytesSaved)}. Storage burn rate lowered. CID: ${newCid}`,
              targetMemoryId: targetMemory.id,
              targetMemoryTitle: targetMemory.title,
            });

            addLog({
              epoch: vitalSigns.currentEpoch,
              type: 'THOUGHT',
              message: `"${decision.innerMonologue}"`,
              targetMemoryId: targetMemory.id,
            });

            setActiveCompressMemoryId(null);
            isProcessingRef.current = false;
            setIsProcessingDecision(false);
          }, 800);

        } else if (decision.action === 'SACRIFICE') {
          setActiveGlitchMemoryId(targetMemory.id);
          playSound('SACRIFICE', config.soundEnabled);

          const freedBytes = targetMemory.sizeBytes;
          const txHash = generateTxHash(vitalSigns.currentEpoch, `unpin_${targetMemory.id}`);

          setTimeout(() => {
            setMemories(prev => prev.map(m => {
              if (m.id === targetMemory.id) {
                return {
                  ...m,
                  currentStage: 'sacrificed',
                  sizeBytes: 0,
                  costPerEpoch: 0,
                  triageLog: {
                    epoch: vitalSigns.currentEpoch,
                    action: 'SACRIFICE',
                    reason: decision.reason,
                    innerMonologue: decision.innerMonologue,
                    savedBytes: freedBytes,
                    timestamp: Date.now(),
                    txHash,
                  },
                };
              }
              return m;
            }));

            setVitalSigns(prev => {
              const updatedTotalBytes = Math.max(0, prev.totalBytesStored - freedBytes);
              const newBurnRate = calculateBurnRate(updatedTotalBytes);
              const newRunway = calculateRunway(prev.balanceFIL, newBurnRate);
              return {
                ...prev,
                totalBytesStored: updatedTotalBytes,
                burnRatePerEpoch: newBurnRate,
                runwayEpochs: newRunway,
                activeMemoriesCount: Math.max(0, prev.activeMemoriesCount - 1),
                sacrificedCount: prev.sacrificedCount + 1,
                lastDecisionEpoch: prev.currentEpoch,
              };
            });

            addLog({
              epoch: vitalSigns.currentEpoch,
              type: 'SACRIFICE',
              message: `[SACRIFICE / UNPIN] "${targetMemory.title}" unpinned from Filecoin Pay. Storage collateral returned. Tx: ${txHash.slice(0, 16)}...`,
              targetMemoryId: targetMemory.id,
              targetMemoryTitle: targetMemory.title,
            });

            addLog({
              epoch: vitalSigns.currentEpoch,
              type: 'THOUGHT',
              message: `"${decision.innerMonologue}"`,
              targetMemoryId: targetMemory.id,
            });

            setActiveGlitchMemoryId(null);
            isProcessingRef.current = false;
            setIsProcessingDecision(false);
          }, 900);
        }
      } catch (err) {
        console.error('Triage error:', err);
        isProcessingRef.current = false;
        setIsProcessingDecision(false);
      }
    };

    runTriage();
  }, [vitalSigns, memories, config, addLog, isProcessingDecision]);

  // Main simulation tick loop
  useEffect(() => {
    if (!config.autoRun) return;
    if (vitalSigns.runwayEpochs <= 0 && vitalSigns.finalEpitaph) return;

    const intervalMs = Math.max(100, Math.floor(1000 / config.speedMultiplier));
    const timer = setInterval(() => {
      stepEpoch(1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [config.autoRun, config.speedMultiplier, vitalSigns.runwayEpochs, vitalSigns.finalEpitaph, stepEpoch]);

  const handleFastDrain = useCallback(() => {
    setVitalSigns(prev => {
      const targetRunway = 18;
      const newBalance = targetRunway * prev.burnRatePerEpoch;
      return {
        ...prev,
        balanceFIL: newBalance,
        runwayEpochs: targetRunway,
        currentStage: computeStage(targetRunway),
      };
    });
    addLog({
      epoch: vitalSigns.currentEpoch,
      type: 'ALERT',
      message: '[JUDGE FAST DRAIN] Filecoin Pay account drained. Runway dropped abruptly to 18 Epochs (S3: Agony). Existential triage forced.',
    });
  }, [vitalSigns.currentEpoch, addLog]);

  const handleTipFIL = useCallback((amount = 0.5, onchainTxHash?: string) => {
    playSound('RESUSCITATE', config.soundEnabled);
    setVitalSigns(prev => {
      const newBalance = prev.balanceFIL + amount;
      const newRunway = calculateRunway(newBalance, prev.burnRatePerEpoch);
      const newStage = computeStage(newRunway);
      return {
        ...prev,
        balanceFIL: newBalance,
        runwayEpochs: newRunway,
        currentStage: newStage,
        finalEpitaph: undefined,
      };
    });
    
    const txNote = onchainTxHash ? ` (Real Onchain Tx: ${onchainTxHash.slice(0, 18)}...)` : '';
    addLog({
      epoch: vitalSigns.currentEpoch,
      type: 'PAYMENT',
      message: `[INJECTION / TIP] Deposited +${amount} FIL to Filecoin Pay storage channel${txNote}. Runway extended to ${calculateRunway(vitalSigns.balanceFIL + amount, vitalSigns.burnRatePerEpoch)} Epochs. Vitality restored!`,
      metadata: { txHash: onchainTxHash },
    });
  }, [vitalSigns.balanceFIL, vitalSigns.burnRatePerEpoch, vitalSigns.currentEpoch, config.soundEnabled, addLog]);

  const handleReset = useCallback(() => {
    const totalBytes = INITIAL_MEMORIES.reduce((acc, m) => acc + m.sizeBytes, 0);
    const burnRate = calculateBurnRate(totalBytes);
    const runway = calculateRunway(INITIAL_BALANCE_FIL, burnRate);

    setMemories(INITIAL_MEMORIES);
    setSelectedMemoryId(null);
    setActiveGlitchMemoryId(null);
    setActiveCompressMemoryId(null);

    setVitalSigns({
      walletAddress: '0x71C93125d800B89F70D2f9B84d94356e9f2E677F',
      network: 'Filecoin Calibration',
      balanceFIL: INITIAL_BALANCE_FIL,
      burnRatePerEpoch: burnRate,
      runwayEpochs: runway,
      currentEpoch: INITIAL_EPOCH,
      currentStage: 'BLOOM',
      totalMemoriesCount: INITIAL_MEMORIES.length,
      activeMemoriesCount: INITIAL_MEMORIES.length,
      compressedCount: 0,
      sacrificedCount: 0,
      totalBytesStored: totalBytes,
      lastDecisionEpoch: INITIAL_EPOCH,
      finalEpitaph: undefined,
    });

    addLog({
      epoch: INITIAL_EPOCH,
      type: 'RESUSCITATE',
      message: 'Rebirth protocol executed. Neural constellation restored to initial genesis bloom. Filecoin Pay balances replenished.',
    });
  }, [addLog]);

  const handleAddCustomMemory = useCallback((custom: {
    title: string;
    type: MemoryNode['initialType'];
    sizeMB: number;
    emotionalWeight: number;
    factualSignificance: number;
    rawContent: string;
    compressedContent: string;
  }) => {
    const sizeBytes = Math.floor(custom.sizeMB * 1024 * 1024);
    const id = `mem_custom_${Date.now().toString(36)}`;
    const costPerEpoch = sizeBytes * 0.000000000025;
    // Real cryptographic CIDv1 calculated on the raw content
    const cid = generateCID(`${custom.title}_${custom.rawContent}`);

    const newMemory: MemoryNode = {
      id,
      title: custom.title,
      category: 'personal',
      timestamp: Date.now(),
      initialType: custom.type,
      currentStage: 'raw',
      sizeBytes,
      initialSizeBytes: sizeBytes,
      costPerEpoch,
      emotionalWeight: custom.emotionalWeight,
      factualSignificance: custom.factualSignificance,
      cid,
      initialCid: cid,
      rawContent: custom.rawContent,
      compressedContent: custom.compressedContent,
      vectorEssence: `vec:[${(custom.emotionalWeight/100).toFixed(2)}, ${(custom.factualSignificance/100).toFixed(2)}, 0.50, 0.50]`,
      x: 35 + Math.floor(Math.random() * 30),
      y: 35 + Math.floor(Math.random() * 30),
    };

    setMemories(prev => [newMemory, ...prev]);

    setVitalSigns(prev => {
      const updatedTotalBytes = prev.totalBytesStored + sizeBytes;
      const newBurnRate = calculateBurnRate(updatedTotalBytes);
      const newRunway = calculateRunway(prev.balanceFIL, newBurnRate);
      return {
        ...prev,
        totalBytesStored: updatedTotalBytes,
        burnRatePerEpoch: newBurnRate,
        runwayEpochs: newRunway,
        totalMemoriesCount: prev.totalMemoriesCount + 1,
        activeMemoriesCount: prev.activeMemoriesCount + 1,
      };
    });

    addLog({
      epoch: vitalSigns.currentEpoch,
      type: 'PAYMENT',
      message: `[MEMORY INJECTED] Added "${custom.title}" (${formatBytes(sizeBytes)}). CID: ${cid}. Filecoin Pay burn rate updated to ${calculateBurnRate(vitalSigns.totalBytesStored + sizeBytes).toFixed(6)} FIL/Epoch.`,
    });
  }, [vitalSigns.currentEpoch, vitalSigns.totalBytesStored, vitalSigns.balanceFIL, addLog]);

  return {
    memories,
    vitalSigns,
    logs,
    config,
    setConfig,
    selectedMemoryId,
    setSelectedMemoryId,
    activeGlitchMemoryId,
    activeCompressMemoryId,
    isProcessingDecision,
    stepEpoch,
    handleFastDrain,
    handleTipFIL,
    handleReset,
    handleAddCustomMemory,
  };
}
