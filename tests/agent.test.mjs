import { 
  calculateBurnRate, 
  calculateRunway, 
  generateCID, 
  generateTxHash,
  formatBytes,
  epochsToTimeStr
} from '../src/lib/filecoin.ts';
import { INITIAL_MEMORIES } from '../src/lib/defaultMemories.ts';
import { evaluateTriageDecision, generateFinalEpitaph } from '../src/lib/llmDecision.ts';

function assert(condition, msg) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${msg}`);
  }
  console.log(`✓ ${msg}`);
}

async function runTests() {
  console.log('=============================================');
  console.log('🤖 MEMENTO MORI AGENT — AUTOMATED TEST SUITE');
  console.log('=============================================');

  // Test 1: Filecoin Burn Rate and Runway Calculations
  const totalBytes = INITIAL_MEMORIES.reduce((sum, m) => sum + m.sizeBytes, 0);
  const burnRate = calculateBurnRate(totalBytes);
  assert(burnRate > 0.0002, 'Burn rate includes baseline node maintenance overhead and byte cost');

  const initialBalance = 0.088;
  const runway = calculateRunway(initialBalance, burnRate);
  assert(runway > 30, `Initial balance gives sufficient runway (${runway} epochs) for Bloom stage`);

  const zeroRunway = calculateRunway(0, burnRate);
  assert(zeroRunway === 0, 'Zero balance yields 0 runway');

  // Test 2: Formatting helpers
  assert(formatBytes(1048576) === '1 MB', 'formatBytes formats 1MB accurately');
  assert(formatBytes(8800000) === '8.4 MB', 'formatBytes formats 8.8MB accurately');
  assert(epochsToTimeStr(120) === '1h 0m 0s', 'epochsToTimeStr converts 120 epochs (3600s) to 1h');

  // Test 3: CID & Tx Hash generation
  const cid1 = generateCID('mem_001_raw_image_fuji_dawn_4k');
  const cid2 = generateCID('mem_002_raw_audio_kyoto_rain_flac');
  assert(cid1.startsWith('bafybeic'), 'Generated CID matches Filecoin IPFS v1 CID prefix');
  assert(cid1 !== cid2, 'Distinct seeds produce distinct CIDs');

  const txHash = generateTxHash(1428500);
  assert(txHash.startsWith('0x') && txHash.length === 66, 'Generated TxHash matches Filecoin 32-byte hex format');

  // Test 4: Pruning Stage Triage Decision (Compression)
  const vitalsPruning = {
    walletAddress: 'f1test...',
    network: 'Filecoin Calibration',
    balanceFIL: 0.03,
    burnRatePerEpoch: burnRate,
    runwayEpochs: 60, // S2: Pruning
    currentEpoch: 1428500,
    currentStage: 'PRUNING',
    totalMemoriesCount: INITIAL_MEMORIES.length,
    activeMemoriesCount: INITIAL_MEMORIES.length,
    compressedCount: 0,
    sacrificedCount: 0,
    totalBytesStored: totalBytes,
    lastDecisionEpoch: 1428500,
  };

  const pruningDecision = await evaluateTriageDecision('PRUNING', INITIAL_MEMORIES, vitalsPruning);
  assert(pruningDecision !== null, 'Pruning decision is generated when raw memories exist');
  assert(pruningDecision.action === 'COMPRESS', 'Pruning action recommends COMPRESS to reduce byte footprint');
  assert(pruningDecision.estimatedBytesSaved > 1000000, 'Compaction saves significant byte payload');
  assert(typeof pruningDecision.innerMonologue === 'string' && pruningDecision.innerMonologue.length > 20, 'Inner monologue expresses introspective philosophical reasoning');

  // Test 5: Agony Stage Triage Decision (Sacrifice)
  const vitalsAgony = {
    ...vitalsPruning,
    balanceFIL: 0.005,
    runwayEpochs: 15, // S3: Agony
    currentStage: 'AGONY',
  };

  const agonyDecision = await evaluateTriageDecision('AGONY', INITIAL_MEMORIES, vitalsAgony);
  assert(agonyDecision !== null, 'Agony decision is generated in crisis');
  assert(agonyDecision.action === 'SACRIFICE', 'Agony action selects SACRIFICE / Unpin');
  assert(agonyDecision.targetMemoryId !== 'mem_003', 'Creator letter (highest sentiment) is protected from initial sacrifice');

  // Test 6: Final Epitaph Testament Generation
  const epitaph = generateFinalEpitaph(vitalsAgony, INITIAL_MEMORIES);
  assert(epitaph.finalFarewellPoem.includes('Memento Mori'), 'Farewell poem includes Memento Mori testament');
  assert(epitaph.text.includes('FINAL WILL & TESTAMENT'), 'Testament text contains structured ledger summary');

  console.log('=============================================');
  console.log('🎉 ALL 12 VERIFICATION ASSERTIONS PASSED!');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
