'use client';

import React, { useState } from 'react';
import { MemoryType } from '@/types/agent';
import { X, Plus, HardDrive, Sparkles, Image, Music, BookOpen, Binary } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: {
    title: string;
    type: MemoryType;
    sizeMB: number;
    emotionalWeight: number;
    factualSignificance: number;
    rawContent: string;
    compressedContent: string;
  }) => void;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MemoryType>('journal_rich');
  const [sizeMB, setSizeMB] = useState(6.5);
  const [emotionalWeight, setEmotionalWeight] = useState(85);
  const [factualSignificance, setFactualSignificance] = useState(70);
  const [rawContent, setRawContent] = useState('');
  const [compressedContent, setCompressedContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMemory({
      title: title.trim(),
      type,
      sizeMB: Number(sizeMB),
      emotionalWeight: Number(emotionalWeight),
      factualSignificance: Number(factualSignificance),
      rawContent: rawContent.trim() || `User inscribed memory: "${title}". Preserved into Filecoin storage network.`,
      compressedContent: compressedContent.trim() || `Essence of ${title}: etched in memory before the fall.`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in font-mono text-xs">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Inject Synaptic Memory
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Memory Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Midnight Conversation by the Seine"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Memory Format</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as MemoryType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="journal_rich">Rich Journal (Markdown)</option>
                <option value="image_raw">Raw Image (4K)</option>
                <option value="audio_raw">Binaural Audio (FLAC)</option>
                <option value="fact_record">Factual Proof / Ledger</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Payload Size: <span className="text-cyan-400">{sizeMB} MB</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={sizeMB}
                onChange={e => setSizeMB(Number(e.target.value))}
                className="w-full accent-cyan-500 mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Sentimental Weight: <span className="text-emerald-400">{emotionalWeight}</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={emotionalWeight}
                onChange={e => setEmotionalWeight(Number(e.target.value))}
                className="w-full accent-emerald-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">
                Factual Significance: <span className="text-blue-400">{factualSignificance}</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={factualSignificance}
                onChange={e => setFactualSignificance(Number(e.target.value))}
                className="w-full accent-blue-500 mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Full Narrative (Raw Content)</label>
            <textarea
              rows={3}
              placeholder="Describe the detailed memory, dialogue, or sensory impressions..."
              value={rawContent}
              onChange={e => setRawContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Poetic Distillation (For Pruning Stage)</label>
            <input
              type="text"
              placeholder="A one-line poetic essence..."
              value={compressedContent}
              onChange={e => setCompressedContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              Inscribe to Brain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
