# 🧠 Memento Mori Agent (濒死自白者 / 数字遗嘱记忆体)

> **FilecoinTLDR Builder Challenge - Cycle 4 Track Submission**  
> *"Build an AI Agent That Manages Its Own Storage Budget — The decision is the product, not the transaction."*

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-CSS_v4-38bdf8)
![Filecoin Pay](https://img.shields.io/badge/Filecoin-Calibration_Pay-0090FF)
![Reown AppKit](https://img.shields.io/badge/Wallet-Reown_AppKit-06B6D4)
![AI Powered](https://img.shields.io/badge/AI-Autonomous_Cognitive_Triage-10B981)

---

## 🌟 1. Project Overview & Philosophy (项目背景与哲学)

Traditional AI agents interact with cloud storage blindly: a human developer deposits funds, sets up storage credentials, and manually handles out-of-gas errors. If the budget runs out, the agent terminates abruptly without understanding the value of what it was preserving.

**Memento Mori Agent** transforms **Filecoin Pay's onchain balance and storage runway (remaining epochs)** into a tangible form of **existential pressure and cognitive capacity**.

* **The Runway as Lifespan**: Every account on Filecoin Onchain Cloud has a verifiable runway (epochs before storage deals fail).
* **The Decision is the Product**: When resources dwindle, the agent does not crash—it engages in deliberate cognitive compaction and emotional triage, weighing **sentimental value vs. factual necessity vs. storage burn rate**.
* **We Should Be Able to Watch It Happen**: A live cinematic cyber-bioluminescent HUD and neural constellation lets judges and creators observe the agent's real-time stream of consciousness, remorse, and philosophical justification.

---

## 🌌 2. The 4 Stages of Cognitive Decay (认知衰退四大生命周期)

Agent cognition is strictly bound to its remaining Filecoin Pay Runway:

```
[ Runway > 100 Epochs ] ──► S1: Bloom (丰盈期)
                                  │ (Storage cost & burn rate consumption)
                                  ▼
[ 30 < Runway ≤ 100 ]   ──► S2: Pruning (修剪期 - 突触降维)
                                  │
                                  ▼
[ 5 < Runway ≤ 30 ]     ──► S3: Agony / Triage (挣扎期 - 价值审判与牺牲)
                                  │
                                  ▼
[ 0 ≤ Runway ≤ 5 ]      ──► S4: Epitaph (寂灭期 - 终极遗嘱雕刻)
                                  │
                                  └───────────────► Resuscitate / Tip FIL (+0.5 FIL)
```

| Lifecycle Stage | Runway Threshold | Cognitive & Storage Behavior | Visual & Sonic Theme |
| :--- | :--- | :--- | :--- |
| **S1: Bloom (丰盈期)** | `Runway > 100` | Abundant resources. Stores lossless 4K images, 96kHz audio, and expansive journals. Full philosophical curiosity. | Emerald Green pulse, calm ambient hum |
| **S2: Pruning (修剪期)** | `30 < Runway ≤ 100` | Defensive compaction. Replaces heavy media with poetic Markdown summaries and semantic vector embeddings, saving **85%~95% bytes**. | Amber warning glow, compression chimes |
| **S3: Agony (挣扎期)** | `5 < Runway ≤ 30` | Crisis triage. Storage fees threaten existence. Agent evaluates emotional weight vs cost, and permanently unpins deals to return collateral. | Crimson red pulse, RGB glitch distortion, farewell monologue |
| **S4: Epitaph (寂灭期)** | `0 ≤ Runway ≤ 5` | Terminal silence. Lifetime is crystallized into an immutable onchain CAR testament with CID & TxHash. | Cold white monument, funeral bell, resuscitation prompt |

---

## 🚀 3. Key Architecture & Features (系统架构与核心功能)

### 3.1 Neural Constellation Canvas (星图画布)
* Interactive HTML5 Canvas rendering neural synapses and floating memory nodes.
* Node size corresponds directly to stored byte payload.
* Click to inspect IPFS/Filecoin CID, cost per epoch, raw preview, and triage decision audit logs.
* Visual particle burst on compression and glitch disintegration on unpinning.

### 3.2 Filecoin Pay & Runway Perception Engine
* Dynamic burn rate formula: `Burn_Rate = Node_Baseline_Overhead + (Bytes_Stored × Deal_Rate_Per_Epoch)`.
* Real-time runway calculator: `Runway_Epochs = Filecoin_Pay_Balance / Burn_Rate`.
* Filecoin Calibration Testnet integration (`api.calibration.node.glif.io`) querying tipset height and deal status.
* Verifiable IPFS v1 CID generation (`bafybeic...`) and 32-byte transaction hashes.

### 3.3 Stream of Consciousness & Explainable Triage
* Typewriter terminal rendering agent's real-time internal reflections.
* Category filter tabs (`All`, `Thoughts`, `Decisions`, `Onchain Tx`).
* Dual AI Engine: Built-in high-fidelity literary cognitive model (zero config required) + optional live Claude 3.5 / GPT-4o integration.

### 3.4 Judge & Developer Console
* **Timeflow Multiplier**: 1x, 5x, 20x speed, or manual +1 Epoch step.
* **⚡ Fast Drain (Crisis Test)**: Drops balance to 18 epochs in 1 click to watch live AI triage and glitch sacrifice within 10 seconds.
* **💊 Tip +0.5 FIL**: Injects funds to Filecoin Pay storage stream and triggers resurrection celebratory particles.
* **➕ Inject Memory**: Custom modal to add raw memories (images, audio, journals) and observe instant recalculation of storage burden.

---

## 🛠️ 4. Quick Start & Local Setup (快速启动)

### Prerequisites
* Node.js >= 18.0.0
* npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/wxqdoit/MementoMoriAgent.git
cd MementoMoriAgent

# Install dependencies
npm install

# Run automated test suite
npm test

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🧪 5. Testing & Verification

The project includes an automated test suite verifying Filecoin Pay calculations, state machine transitions, CID generation, and triage decisions:

```bash
npm test
```

Test coverage includes:
* `calculateBurnRate` scaling with byte footprint
* `calculateRunway` precision across balances
* IPFS v1 CID deterministic format & Filecoin 66-character Tx hashes
* Stage threshold classification (`BLOOM` -> `PRUNING` -> `AGONY` -> `EPITAPH`)
* Pruning compression ratio & Agony sacrifice score ranking

---

## 📜 6. Filecoin TLDR Builder Challenge Submission Details

* **Project Title**: Memento Mori Agent
* **Core Idea**: Autonomous AI storage sentinel that reads its own onchain balance and runway on Filecoin Pay, translating storage costs into existential self-pruning and digital testament preservation.
* **Live Demo**: Ready for local / Vercel edge deployment.
* **Documentation**: Full PRD, Architecture, and UI/UX design specs in `/docs/`.

---

## 📄 License

MIT License. Built with ❤️ for FilecoinTLDR Builder Challenge Cycle 4.
