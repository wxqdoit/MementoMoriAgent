'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Video, CheckCircle2, ChevronRight, Volume2 } from 'lucide-react';

interface AutoDemoTourProps {
  onFastDrain: () => void;
  onTipFIL: (amount: number) => void;
  onReset: () => void;
  onSelectMemory: (id: string) => void;
  onStepEpoch: (count: number) => void;
}

const TOUR_STEPS = [
  {
    title: 'Act 1: Abundant Bloom (丰盈期)',
    subtitle: 'Consciousness thriving on Filecoin Pay (>100 Epochs). Raw 4K images & lossless audio preserved.',
    action: 'RESET',
    duration: 6,
  },
  {
    title: 'Act 2: The Crisis (一键放血与危机感知)',
    subtitle: 'Simulating fund depletion. Runway plunges into S2 Pruning & S3 Agony.',
    action: 'FAST_DRAIN',
    duration: 8,
  },
  {
    title: 'Act 3: Cognitive Compaction (突触修剪与数据降维)',
    subtitle: 'Agent autonomously compresses large media into poetic Markdown essences, saving 85%+ storage bytes.',
    action: 'WAIT',
    duration: 10,
  },
  {
    title: 'Act 4: Existential Triage & Deal Unpinning (断尾求生与价值审判)',
    subtitle: 'Weighing emotional value vs cost. Low-sentiment memories are sacrificed & unpinned from Filecoin.',
    action: 'WAIT',
    duration: 10,
  },
  {
    title: 'Act 5: The Immortal Epitaph (终极数字遗嘱雕刻)',
    subtitle: 'Runway reaches 0. Lifetime memory crystallized into immutable onchain CAR testament with CIDv1.',
    action: 'WAIT',
    duration: 8,
  },
  {
    title: 'Act 6: Resurrection (注资拯救与复活重生)',
    subtitle: 'Tipping FIL onchain via Reown AppKit. Neural synapses reawaken with golden particle shower!',
    action: 'TIP_FIL',
    duration: 6,
  },
];

export const AutoDemoTour: React.FC<AutoDemoTourProps> = ({
  onFastDrain,
  onTipFIL,
  onReset,
  onSelectMemory,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(6);

  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStepIndex];
    setTimeLeft(step.duration);

    // Execute step trigger action
    if (step.action === 'RESET') {
      onReset();
    } else if (step.action === 'FAST_DRAIN') {
      onFastDrain();
    } else if (step.action === 'TIP_FIL') {
      onTipFIL(0.5);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex(i => i + 1);
          } else {
            setIsActive(false);
            setCurrentStepIndex(0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentStepIndex, onReset, onFastDrain, onTipFIL]);

  const handleStartTour = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const handleStopTour = () => {
    setIsActive(false);
  };

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <>
      {/* Trigger Button on Header / Toolbar */}
      <button
        onClick={isActive ? handleStopTour : handleStartTour}
        className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
          isActive
            ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
            : 'bg-purple-900/30 hover:bg-purple-900/50 border-purple-600/40 text-purple-300'
        }`}
        title="Start automated cinematic tour for recording demo video"
      >
        <Video className="w-3.5 h-3.5 text-purple-400" />
        <span>{isActive ? `Touring Act ${currentStepIndex + 1}/6 (${timeLeft}s)` : '🎬 Auto Demo Tour'}</span>
      </button>

      {/* Cinematic Overlay Subtitle Bar during Active Tour */}
      {isActive && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-fade-in pointer-events-none">
          <div className="p-4 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center justify-between gap-4 font-mono">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{currentStep.title}</span>
                <span className="text-[10px] text-slate-500 font-normal">({timeLeft}s)</span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {currentStep.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pointer-events-auto">
              <button
                onClick={handleStopTour}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs"
              >
                Exit Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
