import React from 'react';
import { X, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DronePartInfo } from '../types/drone';

interface PartDetailModalProps {
  part: DronePartInfo | null;
  onClose: () => void;
  onFocusPartPreset?: (partId: string) => void;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  onClose,
  onFocusPartPreset,
}) => {
  if (!part) return null;

  return (
    <div className="absolute top-20 right-4 z-20 w-84 sm:w-96 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-200 animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 mb-1">
            {part.category}
          </span>
          <h2 className="text-sm font-bold text-white leading-snug">{part.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close part inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
        {part.description}
      </p>

      {/* Material finish */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Material & Fabrication</span>
        </div>
        <p className="text-xs font-mono text-slate-200">{part.material}</p>
      </div>

      {/* Engineering Specs */}
      <div className="mt-3">
        <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Technical Specifications</span>
        </h4>
        <div className="space-y-1.5 font-mono text-[11px]">
          {part.specs.map((spec, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1 px-2 rounded bg-slate-800/50 border border-slate-800"
            >
              <span className="text-slate-400">{spec.label}</span>
              <span className="font-semibold text-sky-300">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action to switch to dedicated camera angle if applicable */}
      {onFocusPartPreset && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onFocusPartPreset(part.id)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Align Camera View</span>
          </button>
        </div>
      )}
    </div>
  );
};
