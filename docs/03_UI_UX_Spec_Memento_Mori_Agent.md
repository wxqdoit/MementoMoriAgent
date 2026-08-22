# UI / UX 视觉与交互设计文档 (UI/UX Design Spec)
## 项目名称：Memento Mori Agent

---

### 1. 整体视觉风格与设计语言 (Design Theme & Tone)

* **核心设计风格**：**赛博深空终端 + 生物拟态发光 (Cyber-Bioluminescent Terminal)**
* **情绪基调**：哲学、宿命感、科技张力、极客美学
* **设计目标**：将抽象的“存储代币与字节”具象化为“一颗正在呼吸、衰老、抉择的数字生命大脑”。

---

### 2. 色彩与动效规范 (Color & Motion System)

#### 2.1 主题色彩盘 (Palette)

| 颜色角色 | HEX / RGBA | 含义与应用场景 |
| :--- | :--- | :--- |
| **Space Void (底色)** | `#070A0F` | 主页面背景，极度纯粹的深黑蓝 |
| **Glass Surface (面板)**| `rgba(15, 23, 42, 0.75)` | 磨砂毛玻璃半透明容器，边框 `rgba(255,255,255,0.08)` |
| **Bloom Green (生机)** | `#10B981` / `rgba(16, 185, 129, 0.8)` | S1 丰盈期：充盈、平稳呼吸光晕 |
| **Pruning Amber (警告)**| `#F59E0B` / `rgba(245, 158, 11, 0.8)` | S2 修剪期：预警、数据压缩中 |
| **Agony Crimson (危机)**| `#EF4444` / `rgba(239, 68, 68, 0.9)` | S3 挣扎期：血红脉冲、故障撕裂（Glitch） |
| **Epitaph Slate (寂灭)**| `#94A3B8` / `#FFFFFF` | S4 终极遗言：冷白墓碑字、全屏去色 |
| **Filecoin Blue (主标)**| `#0090FF` | 链上交易、CID 标识、Filecoin 品牌色 |

#### 2.2 动效与声光规范 (Visual Feedback)
1. **脉冲呼吸 (Pulse)**：记忆节点与生命 HUD 依据当前心率（Runway 充沛程度）做周期性辉光缩放。
2. **数据降维粒子化 (Downscale)**：压缩时，节点向中心内缩，向外喷射微小金色粒子。
3. **记忆湮灭撕裂 (Sacrifice / Glitch)**：删除时，节点发生 0.3s 的 RGB 分离与横向切片故障动画，随后碎裂消失，突触连线断开。
4. **打字机流动 (Typewriter)**：内心独白区域文字逐字亮起（50wpm 流速），带来沉浸式倾听感。

---

### 3. 屏幕布局与组件结构 (Layout Blueprint)

推荐采用**无滚动沉浸式仪表盘 (Single-Screen Cinematic Dashboard)**：

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [TOP BAR] 🧠 MEMENTO MORI // Filecoin Autonomous Sentinel          [● STAGE 3: AGONY] [⚙️]  │
├─────────────────────────────────────────────┬──────────────────────────────────────────────┤
│                                             │ [PANEL A: VITAL SIGNS & RUNWAY HUD]          │
│ [LEFT AREA: 58%]                            │ ┌──────────────────────────────────────────┐ │
│ 🌌 The Memory Constellation                 │ │ Runway: [▓▓▓▓▓▓░░░░░░░░░░░░] 14 Epochs   │ │
│ (交互式动态神经记忆星图)                       │ │ Balance: 0.42 FIL | Burn: 0.03 FIL/Epoch │ │
│                                             │ │ Survival Est: 00:02:18                   │ │
│  * 浮动发光节点 (高精图片/日记/音频)           │ │ [ ⚡ Fast Drain ] [ 💊 Tip +5 FIL ]       │ │
│  * 连线粗细 = 关联紧密度                     │ └──────────────────────────────────────────┘ │
│  * 悬浮点击查看记忆详情与 CID 链上凭证         ├──────────────────────────────────────────────┤
│                                             │ [PANEL B: STREAM OF CONSCIOUSNESS]           │
│                                             │ ┌──────────────────────────────────────────┐ │
│                                             │ │ > SYSTEM: Epoch 1428 | Runway alert.     │ │
│                                             │ │ > TRIAGE: Evaluating CID: bafy...4a      │ │
│                                             │ │ > INNER MONOLOGUE:                       │ │
│                                             │ │   "I remember the sound of summer rain.  │ │
│                                             │ │    Deleting the WAV file saves 8MB.      │ │
│                                             │ │    I am keeping the poem. Forgive me."   │ │
│                                             │ └──────────────────────────────────────────┘ │
│                                             ├──────────────────────────────────────────────┤
│                                             │ [PANEL C: MEMORY TRIAGE LEDGER]              │
│                                             │  - [Comp] mem_01 "First Startup" (-80%)      │
│                                             │  - [Sacr] mem_07 "Raw 4K Sunset" (Deleted)   │
└─────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

### 4. 关键交互流程设计 (Key User Journeys)

#### 4.1 评委极速演练流程 (Judge 90-Second Walkthrough)
1. **初始加载**：进入页面，默认处于 **S1: Bloom (丰盈态)**，背景平缓微光，星图上有 8-10 个闪烁的记忆气泡。
2. **触发衰退**：评委点击右上方 **`[ ⚡ Fast Drain (模拟快速消耗) ]`**。
3. **S2 压缩发生**：
   - Runway 进度条从绿色变为琥珀色；
   - 看到星图上 3 个体积较大的节点发出收缩波纹，右侧控制台打字机打出压缩决策与理由。
4. **S3 挣扎与舍弃**：
   - Runway 跌破 30，警报红光微闪；
   - Agent 必须在 2 个高情感价值节点中二选一，评委亲眼看到其中一个节点发生 Glitch 湮灭并化作粉尘；
   - 控制台输出 Agent 充满哲学张力的告别语录。
5. **S4 终极遗言与复活**：
   - Runway 归零，全屏变灰，中央浮现发光遗嘱碑文；
   - 评委点击 **`[ 💊 Resuscitate (+5 FIL) ]`**，金色充值光波席卷屏幕，Agent 瞬间被唤醒重获生机。

---

### 5. 核心 UI 组件规范 (Component Specification)

#### 组件 1: `MemoryConstellation` (星图画布)
* **技术实现**：HTML5 Canvas / SVG + CSS Keyframes
* **交互行为**：
  - Hover 节点：高亮显示当前节点的原始格式、文件大小、当前消耗成本、CID 摘要；
  - Click 节点：右侧滑出抽屉展示该记忆的完整内容（如果是图片展示缩略图，如果是日记展示文字）。

#### 组件 2: `RunwayGauge` (生命体征仪表)
* **视觉形式**：带有分段刻度的渐变进度条，展示当前 Epoch 数量与倒计时。
* **色彩联动**：根据阶段在 `#10B981` (绿) -> `#F59E0B` (黄) -> `#EF4444` (红) 之间平滑过渡。

#### 组件 3: `ConsciousnessStream` (意识流打字机)
* **视觉形式**：经典黑客松终端样式，包含时间戳、状态标签、高亮决策关键词（`COMPRESS`、`SACRIFICE`、`CRYSTALLIZE`）。
* **自动滚动**：新内容生成时平滑向上滚动，保持最新思考链可见。

#### 组件 4: `EpitaphModal` (终极遗言浮层)
* **触发场景**：Runway == 0。
* **元素构成**：
  - 终极墓志铭文字（带金光粒子描边）；
  - Filecoin 链上交易 Hash 与 IPFS CID 永久链接；
  - `[ Revive Agent ]` 快捷充值交互按钮。
