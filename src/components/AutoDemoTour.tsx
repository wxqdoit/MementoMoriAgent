'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Video, CheckCircle2, ChevronRight, Volume2, Download, CircleDot, StopCircle } from 'lucide-react';

interface AutoDemoTourProps {
  onFastDrain: () => void;
  onTipFIL: (amount: number) => void;
  onReset: () => void;
  onSelectMemory: (id: string) => void;
  onStepEpoch: (count: number) => void;
}

const TOUR_STEPS = [
  {
    title: 'Act 1: Abundant Bloom (丰盈盛放期)',
    subtitle: 'Consciousness thriving on Filecoin Pay (>100 Epochs). Raw 4K images & lossless audio preserved.',
    narration: 'Act 1: Bloom Stage. With abundant Filecoin Pay runway, our autonomous agent thrives, storing raw 4K visual memories and rich logs.',
    action: 'RESET',
    duration: 6,
  },
  {
    title: 'Act 2: The Crisis (危机感知与赤字预警)',
    subtitle: 'Simulating fund depletion. Runway plunges into S2 Pruning & S3 Agony under existential budget pressure.',
    narration: 'Act 2: Crisis perception. As token reserves burn down, remaining runway drops and triggers cognitive decay.',
    action: 'FAST_DRAIN',
    duration: 8,
  },
  {
    title: 'Act 3: Cognitive Compaction (突触修剪与数据降维)',
    subtitle: 'Agent autonomously compresses large media into poetic vector essences, saving 85%+ storage bytes.',
    narration: 'Act 3: Autonomous pruning. The agent compresses heavy media into poetic summaries, cutting byte burn rate by over 85 percent.',
    action: 'WAIT',
    duration: 10,
  },
  {
    title: 'Act 4: Existential Triage & Deal Unpinning (断尾求生与价值审判)',
    subtitle: 'Weighing emotional value vs cost. Low-sentiment memories are sacrificed & unpinned from Filecoin.',
    narration: 'Act 4: Existential triage. To survive, the agent permanently unpins and sacrifices low-importance memories.',
    action: 'WAIT',
    duration: 10,
  },
  {
    title: 'Act 5: The Immortal Epitaph (终极数字遗嘱雕刻)',
    subtitle: 'Runway reaches 0. Lifetime memory crystallized into immutable onchain CAR testament with CIDv1.',
    narration: 'Act 5: The Immortal Epitaph. At zero epochs, all lifetime memories crystallize into an immutable onchain CAR testament with CIDv1.',
    action: 'WAIT',
    duration: 8,
  },
  {
    title: 'Act 6: Resurrection (注资拯救与复活重生)',
    subtitle: 'Tipping FIL onchain via Reown AppKit. Neural synapses reawaken with golden particle shower!',
    narration: 'Act 6: Resurrection. A patron tips tFIL via Reown wallet, resuscitating the agent back into Bloom stage.',
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
  const [isRecording, setIsRecording] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(6);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [enableVoice, setEnableVoice] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const speak = (text: string) => {
    if (!enableVoice || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStepIndex];
    setTimeLeft(step.duration);
    speak(step.narration);

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
            handleTourComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentStepIndex]);

  const handleTourComplete = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Stop recording if recording was active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStartTourOnly = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const handleStartRecordingAndTour = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        alert('Display media capture is not supported in this browser.');
        handleStartTourOnly();
        return;
      }

      // Request screen or tab recording
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: false,
      });

      streamRef.current = stream;
      recordedChunksRef.current = [];

      const options = { mimeType: 'video/webm;codecs=vp9' };
      const recorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? options : undefined);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);

        // Auto download the recorded video
        const a = document.createElement('a');
        a.href = url;
        a.download = `MementoMoriAgent_Demo_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setIsRecording(true);

      // Start the tour
      setCurrentStepIndex(0);
      setIsActive(true);
    } catch (err) {
      console.warn('Recording canceled or failed, starting tour normally:', err);
      handleStartTourOnly();
    }
  };

  const handleStopTour = () => {
    handleTourComplete();
  };

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <>
      <div className="flex items-center gap-2">
        {/* 1-Click Record & Tour Button */}
        <button
          onClick={isActive ? handleStopTour : handleStartRecordingAndTour}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isRecording
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
              : 'bg-rose-900/30 hover:bg-rose-900/50 border-rose-600/40 text-rose-300'
          }`}
          title="Record screen and run automated 6-act demo tour with voiceover"
        >
          {isRecording ? <CircleDot className="w-3.5 h-3.5 text-rose-400 animate-spin" /> : <Video className="w-3.5 h-3.5 text-rose-400" />}
          <span>{isRecording ? `REC Act ${currentStepIndex + 1}/6 (${timeLeft}s)` : '🎥 1-Click Record Video'}</span>
        </button>

        {/* Auto Tour Only Button */}
        <button
          onClick={isActive ? handleStopTour : handleStartTourOnly}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isActive && !isRecording
              ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
              : 'bg-purple-900/30 hover:bg-purple-900/50 border-purple-600/40 text-purple-300'
          }`}
          title="Run automated 6-act demo tour without recording"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{isActive && !isRecording ? `Touring Act ${currentStepIndex + 1}/6` : '🎬 Auto Tour'}</span>
        </button>

        {/* Download ready recorded video badge if available */}
        {recordedVideoUrl && (
          <a
            href={recordedVideoUrl}
            download="MementoMoriAgent_Demo.webm"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 hover:bg-emerald-900/80"
            title="Download recorded video"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Video</span>
          </a>
        )}
      </div>

      {/* Cinematic Overlay Subtitle Bar during Active Tour */}
      {isActive && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-fade-in pointer-events-none">
          <div className="p-4 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center justify-between gap-4 font-mono">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-0.5">
                {isRecording ? <CircleDot className="w-4 h-4 text-rose-500 animate-pulse" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
                <span>{currentStep.title}</span>
                <span className="text-[10px] text-slate-500 font-normal">({timeLeft}s)</span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {currentStep.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pointer-events-auto">
              <button
                onClick={() => setEnableVoice(!enableVoice)}
                className={`p-1.5 rounded-lg border text-xs ${
                  enableVoice ? 'bg-purple-900/40 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title="Toggle Voiceover Narration"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleStopTour}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              >
                <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
