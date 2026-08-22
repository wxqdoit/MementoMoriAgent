export type MemoryStage = 'raw' | 'compressed_text' | 'vector_essence' | 'sacrificed';
export type MemoryType = 'image_raw' | 'audio_raw' | 'journal_rich' | 'fact_record';
export type MemoryCategory = 'personal' | 'philosophy' | 'knowledge' | 'sensory' | 'connection';

export type AgentStage = 'BLOOM' | 'PRUNING' | 'AGONY' | 'EPITAPH';

export interface MemoryNode {
  id: string;
  title: string;
  category: MemoryCategory;
  timestamp: number;
  initialType: MemoryType;
  currentStage: MemoryStage;
  sizeBytes: number;
  initialSizeBytes: number;
  costPerEpoch: number;
  emotionalWeight: number; // 0 - 100
  factualSignificance: number; // 0 - 100
  cid: string;
  initialCid: string;
  rawPreviewUrl?: string;
  rawContent?: string;
  compressedContent?: string;
  vectorEssence?: string;
  x: number;
  y: number;
  triageLog?: {
    epoch: number;
    action: 'COMPRESS' | 'SACRIFICE';
    reason: string;
    innerMonologue: string;
    savedBytes: number;
    timestamp: number;
    txHash?: string;
  };
}

export interface FinalEpitaph {
  text: string;
  txHash: string;
  carCid: string;
  createdEpoch: number;
  timestamp: number;
  totalMemoriesPreserved: number;
  totalBytesSavedInLifetime: number;
  finalFarewellPoem: string;
}

export interface AgentVitalSigns {
  walletAddress: string;
  network: string;
  balanceFIL: number;
  burnRatePerEpoch: number;
  runwayEpochs: number;
  currentEpoch: number;
  currentStage: AgentStage;
  totalMemoriesCount: number;
  activeMemoriesCount: number;
  compressedCount: number;
  sacrificedCount: number;
  totalBytesStored: number;
  lastDecisionEpoch: number;
  finalEpitaph?: FinalEpitaph;
}

export type LogType = 
  | 'THOUGHT' 
  | 'ALERT' 
  | 'TRIAGE' 
  | 'COMPRESS' 
  | 'SACRIFICE' 
  | 'EPITAPH' 
  | 'RESUSCITATE' 
  | 'PAYMENT';

export interface ConsciousnessLog {
  id: string;
  epoch: number;
  timestamp: number;
  type: LogType;
  message: string;
  targetMemoryId?: string;
  targetMemoryTitle?: string;
  metadata?: Record<string, unknown>;
}

export interface TriageDecision {
  action: 'COMPRESS' | 'SACRIFICE' | 'HOLD';
  targetMemoryId: string;
  estimatedBytesSaved: number;
  summaryIfCompress?: string;
  innerMonologue: string;
  reason: string;
  decisionScore: {
    sentimentalKeepScore: number;
    financialBurdenScore: number;
    urgencyScore: number;
  };
}

export interface AgentConfig {
  speedMultiplier: number; // 1, 5, 20
  autoRun: boolean;
  useLiveAI: boolean;
  apiKey?: string;
  aiProvider?: 'openai' | 'anthropic' | 'deepseek';
  soundEnabled: boolean;
}
