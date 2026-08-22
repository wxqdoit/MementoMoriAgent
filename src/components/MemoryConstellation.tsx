'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MemoryNode, AgentStage } from '@/types/agent';
import { formatBytes } from '@/lib/filecoin';
import { Sparkles } from 'lucide-react';

interface MemoryConstellationProps {
  memories: MemoryNode[];
  stage: AgentStage;
  selectedMemoryId: string | null;
  activeGlitchMemoryId: string | null;
  activeCompressMemoryId: string | null;
  onSelectMemory: (id: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface DissolveParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
}

interface NodeAnimState {
  r: number;
  g: number;
  b: number;
  radius: number;
  alpha: number;
}

// Helper: Linear Interpolation
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export const MemoryConstellation: React.FC<MemoryConstellationProps> = ({
  memories,
  stage,
  selectedMemoryId,
  activeGlitchMemoryId,
  activeCompressMemoryId,
  onSelectMemory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredMemory, setHoveredMemory] = useState<MemoryNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const particlesRef = useRef<Particle[]>([]);
  const dissolveParticlesRef = useRef<DissolveParticle[]>([]);
  const nodeStatesRef = useRef<Map<string, NodeAnimState>>(new Map());
  const bgColorsRef = useRef<{ r1: number; g1: number; b1: number; r2: number; g2: number; b2: number }>({
    r1: 4, g1: 23, b1: 18,
    r2: 6, g2: 10, b2: 18,
  });
  const synapseColorRef = useRef<{ r: number; g: number; b: number }>({ r: 16, g: 185, b: 129 });
  const animFrameRef = useRef<number | null>(null);

  // Initialize starfield particles
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: '#38bdf8',
      });
    }
    particlesRef.current = particles;
  }, []);

  // Spawn dissolve particles when memory is being sacrificed or compressed
  useEffect(() => {
    if (!activeGlitchMemoryId && !activeCompressMemoryId) return;
    const targetId = activeGlitchMemoryId || activeCompressMemoryId;
    const mem = memories.find(m => m.id === targetId);
    const canvas = canvasRef.current;
    if (!mem || !canvas) return;

    const cx = (mem.x / 100) * canvas.width;
    const cy = (mem.y / 100) * canvas.height;
    const count = activeGlitchMemoryId ? 30 : 18;
    const color = activeGlitchMemoryId ? '#ef4444' : '#f59e0b';

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      dissolveParticlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 2.5 + 1,
        alpha: 1,
        maxLife: Math.random() * 40 + 30,
        life: 0,
        color,
      });
    }
  }, [activeGlitchMemoryId, activeCompressMemoryId, memories]);

  // Main Continuous Render Loop with silky smooth interpolation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Smoothly interpolate background gradient targets
      let targetR1 = 4, targetG1 = 23, targetB1 = 18;
      let targetR2 = 6, targetG2 = 10, targetB2 = 18;
      let targetSynR = 16, targetSynG = 185, targetSynB = 129;

      if (stage === 'PRUNING') {
        targetR1 = 28; targetG1 = 18; targetB1 = 4;
        targetR2 = 8;  targetG2 = 10; targetB2 = 18;
        targetSynR = 245; targetSynG = 158; targetSynB = 11;
      } else if (stage === 'AGONY') {
        targetR1 = 28; targetG1 = 7;  targetB1 = 9;
        targetR2 = 9;  targetG2 = 10; targetB2 = 18;
        targetSynR = 239; targetSynG = 68;  targetSynB = 68;
      } else if (stage === 'EPITAPH') {
        targetR1 = 13; targetG1 = 17; targetB1 = 23;
        targetR2 = 3;  targetG2 = 4;  targetB2 = 7;
        targetSynR = 148; targetSynG = 163; targetSynB = 184;
      }

      const bg = bgColorsRef.current;
      bg.r1 = lerp(bg.r1, targetR1, 0.04);
      bg.g1 = lerp(bg.g1, targetG1, 0.04);
      bg.b1 = lerp(bg.b1, targetB1, 0.04);
      bg.r2 = lerp(bg.r2, targetR2, 0.04);
      bg.g2 = lerp(bg.g2, targetG2, 0.04);
      bg.b2 = lerp(bg.b2, targetB2, 0.04);

      const syn = synapseColorRef.current;
      syn.r = lerp(syn.r, targetSynR, 0.04);
      syn.g = lerp(syn.g, targetSynG, 0.04);
      syn.b = lerp(syn.b, targetSynB, 0.04);

      // Draw interpolated cosmic background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 40,
        width / 2, height / 2, Math.max(width, height) / 1.4
      );
      bgGrad.addColorStop(0, `rgb(${Math.round(bg.r1)}, ${Math.round(bg.g1)}, ${Math.round(bg.b1)})`);
      bgGrad.addColorStop(1, `rgb(${Math.round(bg.r2)}, ${Math.round(bg.g2)}, ${Math.round(bg.b2)})`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Starfield particles update
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${p.alpha * 0.35})`;
        ctx.fill();
      });

      // 3. Dissolve particles for sacrifice/compaction
      const activeDissolve: DissolveParticle[] = [];
      dissolveParticlesRef.current.forEach(p => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - (p.life / p.maxLife));
        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
          activeDissolve.push(p);
        }
      });
      dissolveParticlesRef.current = activeDissolve;

      // 4. Compute smooth node properties & positions
      const mappedNodes = memories.map((m, idx) => {
        const floatX = Math.sin(time + idx * 1.5) * 5;
        const floatY = Math.cos(time + idx * 1.2) * 5;
        const x = (m.x / 100) * width + floatX;
        const y = (m.y / 100) * height + floatY;

        // Target radius calculation
        let targetRadius = 10;
        if (m.currentStage === 'raw') {
          targetRadius = Math.max(12, Math.min(24, 12 + Math.log2(Math.max(1000, m.sizeBytes) / 500000) * 3));
        } else if (m.currentStage === 'compressed_text') {
          targetRadius = 9;
        } else if (m.currentStage === 'vector_essence') {
          targetRadius = 6.5;
        } else {
          targetRadius = 4.5;
        }

        // Target color calculation
        let targetR = 16, targetG = 185, targetB = 129, targetAlpha = 1;
        if (m.currentStage === 'sacrificed') {
          targetR = 71; targetG = 85; targetB = 105; targetAlpha = 0.45;
        } else if (m.currentStage === 'compressed_text') {
          targetR = 245; targetG = 158; targetB = 11;
        } else if (m.currentStage === 'vector_essence') {
          targetR = 168; targetG = 85; targetB = 247;
        } else {
          if (stage === 'AGONY') {
            targetR = 239; targetG = 68; targetB = 68;
          } else if (stage === 'PRUNING') {
            targetR = 245; targetG = 158; targetB = 11;
          } else {
            targetR = 16; targetG = 185; targetB = 129;
          }
        }

        // Fetch or initialize per-node animation state
        let state = nodeStatesRef.current.get(m.id);
        if (!state) {
          state = {
            r: targetR,
            g: targetG,
            b: targetB,
            radius: targetRadius,
            alpha: targetAlpha,
          };
          nodeStatesRef.current.set(m.id, state);
        } else {
          // Smoothly interpolate towards target values (No sudden pops!)
          state.r = lerp(state.r, targetR, 0.08);
          state.g = lerp(state.g, targetG, 0.08);
          state.b = lerp(state.b, targetB, 0.08);
          state.radius = lerp(state.radius, targetRadius, 0.08);
          state.alpha = lerp(state.alpha, targetAlpha, 0.06);
        }

        return { memory: m, x, y, anim: state, idx };
      });

      // 5. Draw Synaptic Connections with smooth alpha & color
      const activeNodes = mappedNodes.filter(n => n.memory.currentStage !== 'sacrificed');
      for (let i = 0; i < activeNodes.length; i++) {
        for (let j = i + 1; j < activeNodes.length; j++) {
          const n1 = activeNodes[i];
          const n2 = activeNodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          const maxDist = width * 0.45;

          if (dist < maxDist) {
            const linkAlpha = (1 - dist / maxDist) * 0.25 * n1.anim.alpha * n2.anim.alpha;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            
            ctx.strokeStyle = `rgba(${Math.round(syn.r)}, ${Math.round(syn.g)}, ${Math.round(syn.b)}, ${linkAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Smooth traveling photon pulse
            const pulsePos = (time * 0.7 + (i + j) * 0.3) % 1;
            const px = n1.x + (n2.x - n1.x) * pulsePos;
            const py = n1.y + (n2.y - n1.y) * pulsePos;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${linkAlpha * 1.8})`;
            ctx.fill();
          }
        }
      }

      // 6. Draw Memory Nodes with smooth breathing glow & hover scaling
      mappedNodes.forEach(node => {
        const { memory, x, y, anim, idx } = node;
        const isSelected = selectedMemoryId === memory.id;
        const isHovered = hoveredMemory?.id === memory.id;
        const isGlitching = activeGlitchMemoryId === memory.id;

        let renderX = x;
        let renderY = y;
        if (isGlitching) {
          renderX += (Math.random() - 0.5) * 6;
          renderY += (Math.random() - 0.5) * 4;
        }

        const pulse = Math.sin(time * 2 + idx) * 2;
        const currentR = anim.radius + (isHovered || isSelected ? 4 : 0);

        // Outer Glow with smooth opacity
        if (memory.currentStage !== 'sacrificed') {
          const glowGrad = ctx.createRadialGradient(
            renderX, renderY, currentR * 0.4,
            renderX, renderY, currentR * 2.2 + pulse
          );
          glowGrad.addColorStop(0, `rgba(${Math.round(anim.r)}, ${Math.round(anim.g)}, ${Math.round(anim.b)}, ${0.45 * anim.alpha})`);
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(renderX, renderY, currentR * 2.2 + pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        // Inner Core Circle
        ctx.beginPath();
        ctx.arc(renderX, renderY, currentR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(anim.r)}, ${Math.round(anim.g)}, ${Math.round(anim.b)}, ${anim.alpha})`;
        ctx.fill();

        // Border Stroke
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.strokeStyle = isSelected ? '#ffffff' : (isHovered ? '#38bdf8' : `rgba(255,255,255,${0.35 * anim.alpha})`);
        ctx.stroke();

        // Sacrificed cross mark
        if (memory.currentStage === 'sacrificed') {
          ctx.beginPath();
          ctx.moveTo(renderX - 3.5, renderY - 3.5);
          ctx.lineTo(renderX + 3.5, renderY + 3.5);
          ctx.moveTo(renderX + 3.5, renderY - 3.5);
          ctx.lineTo(renderX - 3.5, renderY + 3.5);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Node Title Text
        ctx.font = isSelected || isHovered ? 'bold 11px ui-monospace, monospace' : '10px ui-monospace, monospace';
        ctx.fillStyle = memory.currentStage === 'sacrificed' 
          ? 'rgba(100, 116, 139, 0.7)' 
          : (isSelected ? '#ffffff' : 'rgba(203, 213, 225, 0.9)');
        ctx.textAlign = 'center';
        ctx.fillText(
          memory.title.length > 18 ? memory.title.slice(0, 16) + '…' : memory.title,
          renderX,
          renderY + currentR + 14
        );
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [memories, stage, selectedMemoryId, hoveredMemory, activeGlitchMemoryId, activeCompressMemoryId]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = mouseX * scaleX;
    const scaledY = mouseY * scaleY;

    let found: MemoryNode | null = null;

    memories.forEach(m => {
      const nodeX = (m.x / 100) * canvas.width;
      const nodeY = (m.y / 100) * canvas.height;
      const dist = Math.hypot(scaledX - nodeX, scaledY - nodeY);

      if (dist < 32) {
        found = m;
      }
    });

    setHoveredMemory(found);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, [memories]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = mouseX * scaleX;
    const scaledY = mouseY * scaleY;

    memories.forEach(m => {
      const nodeX = (m.x / 100) * canvas.width;
      const nodeY = (m.y / 100) * canvas.height;
      const dist = Math.hypot(scaledX - nodeX, scaledY - nodeY);

      if (dist < 32) {
        onSelectMemory(m.id);
      }
    });
  }, [memories, onSelectMemory]);

  return (
    <div className="relative w-full h-[480px] lg:h-[540px] rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl flex flex-col transition-colors duration-700">
      {/* Top Banner overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 transition-all duration-500">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Neural Synapse Constellation</span>
        <span className="text-[10px] text-slate-500 hidden sm:inline">(Click node to inspect CID)</span>
      </div>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 transition-all duration-500">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 transition-colors duration-500"></span>
          <span>Raw Media</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 transition-colors duration-500"></span>
          <span>Pruned / Essence</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 transition-colors duration-500"></span>
          <span>Sacrificed / Void</span>
        </div>
      </div>

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredMemory(null)}
        onClick={handleClick}
        className="w-full h-full cursor-pointer"
      />

      {/* Floating Hover Tooltip with smooth fade-in */}
      {hoveredMemory && (
        <div 
          className="fixed z-50 pointer-events-none p-3 rounded-lg bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-xs text-slate-200 shadow-2xl max-w-xs font-mono space-y-1.5 animate-fade-in transition-all duration-200"
          style={{
            left: Math.min(window.innerWidth - 300, tooltipPos.x + 16),
            top: Math.min(window.innerHeight - 200, tooltipPos.y + 16),
          }}
        >
          <div className="font-bold text-slate-100 flex items-center justify-between">
            <span>{hoveredMemory.title}</span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
              {hoveredMemory.currentStage}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            CID: <span className="text-cyan-400">{hoveredMemory.cid.slice(0, 16)}...</span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1 border-t border-slate-800">
            <div>Size: <span className="text-slate-100">{formatBytes(hoveredMemory.sizeBytes)}</span></div>
            <div>Cost: <span className="text-amber-400">{hoveredMemory.costPerEpoch.toFixed(6)} FIL</span></div>
            <div>Sentimental: <span className="text-emerald-400">{hoveredMemory.emotionalWeight}/100</span></div>
            <div>Factual: <span className="text-blue-400">{hoveredMemory.factualSignificance}/100</span></div>
          </div>

          {hoveredMemory.compressedContent && hoveredMemory.currentStage !== 'raw' && (
            <div className="text-[10px] italic text-amber-200/90 pt-1 border-t border-slate-800 line-clamp-2">
              "{hoveredMemory.compressedContent}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
