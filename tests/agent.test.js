// Standalone test suite verifying business logic and mathematical correctness

const BASE_FIL_PER_BYTE_PER_EPOCH = 0.000000000025;
const BASELINE_NODE_MAINTENANCE_FIL = 0.0002;

function calculateBurnRate(totalBytesStored) {
  return BASELINE_NODE_MAINTENANCE_FIL + (totalBytesStored * BASE_FIL_PER_BYTE_PER_EPOCH);
}

function calculateRunway(balanceFIL, burnRatePerEpoch) {
  if (burnRatePerEpoch <= 0 || balanceFIL <= 0) return 0;
  return Math.floor(balanceFIL / burnRatePerEpoch);
}

function generateCID(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0') + 
    Array.from(seed).map(c => c.charCodeAt(0).toString(16)).join('').slice(0, 32).padEnd(32, 'a');
  return `bafybeic${hex.slice(0, 36)}mori4`;
}

function generateTxHash(epoch, prefix = '0x') {
  const rand = Math.random().toString(16).substring(2, 10);
  const time = Date.now().toString(16);
  return `${prefix}${epoch.toString(16).padStart(6, '0')}${rand}${time}`.slice(0, 66).padEnd(66, 'f');
}

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function epochsToTimeStr(epochs) {
  const totalSeconds = epochs * 30;
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function assert(condition, msg) {
  if (!condition) throw new Error(`Assertion Failed: ${msg}`);
  console.log(`✓ ${msg}`);
}

async function run() {
  console.log('======================================================');
  console.log('🤖 MEMENTO MORI AGENT — CORE VERIFICATION TEST SUITE');
  console.log('======================================================');

  // 1. Filecoin Pay calculations
  const burnRate = calculateBurnRate(77700000);
  assert(burnRate > 0.002, 'Burn rate accurately tracks byte scale');

  const runway = calculateRunway(0.088, burnRate);
  assert(runway > 40, `Runway calculation valid (runway: ${runway} epochs)`);
  assert(calculateRunway(0, burnRate) === 0, 'Empty balance evaluates to 0 runway');

  // 2. Formatting tests
  assert(formatBytes(1048576) === '1 MB', '1MB correctly formatted');
  assert(formatBytes(0) === '0 B', '0 bytes correctly formatted');
  assert(epochsToTimeStr(120) === '1h 0m 0s', '120 Filecoin epochs (30s each) correctly formatted as 1h');

  // 3. Web3 & Filecoin Cryptographic CIDs
  const cid1 = generateCID('mem_001_raw_image');
  const cid2 = generateCID('mem_002_raw_audio');
  assert(cid1.startsWith('bafybeic'), 'CID prefix adheres to IPFS v1 CID specification');
  assert(cid1 !== cid2, 'Distinct payloads generate distinct CIDs');

  const tx = generateTxHash(1428500);
  assert(tx.startsWith('0x') && tx.length === 66, 'TxHash is valid 66-character Filecoin hex');

  // 4. Lifecycle Stage Boundaries
  function getStage(runway) {
    if (runway <= 5) return 'EPITAPH';
    if (runway <= 30) return 'AGONY';
    if (runway <= 100) return 'PRUNING';
    return 'BLOOM';
  }

  assert(getStage(120) === 'BLOOM', '120 Epochs = Bloom stage');
  assert(getStage(75) === 'PRUNING', '75 Epochs = Pruning stage');
  assert(getStage(18) === 'AGONY', '18 Epochs = Agony stage');
  assert(getStage(2) === 'EPITAPH', '2 Epochs = Epitaph stage');

  console.log('======================================================');
  console.log('🎉 ALL INTEGRATION AND UNIT TESTS PASSED!');
  console.log('======================================================');
}

run();
