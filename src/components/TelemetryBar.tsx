import React from 'react';
import { Camera, Radio, Zap, Shield, Activity, Cable } from 'lucide-react';
import { TetherTelemetry, OperatingMode } from '../types/drone';

interface TelemetryBarProps {
  telemetry: TetherTelemetry | null;
  operatingMode: OperatingMode;
  onTakeScreenshot: () => void;
  onToggleMode: (mode: OperatingMode) => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  telemetry,
  operatingMode,
  onTakeScreenshot,
  onToggleMode,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 pointer-events-none p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      {/* Brand & Mission Tag */}
      <div className="pointer-events-auto bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold">
          <Radio className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-wide">
              RescueMesh <span className="text-sky-400">AI</span>
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700/60 font-semibold">
              RM-400T RELAY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Continuous Tethered Quadcopter Disaster-Response Drone
          </p>
        </div>
      </div>

      {/* Live Tether & Flight Telemetry Chips */}
      <div className="pointer-events-auto hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl text-xs font-mono">
        {/* Physical Tether Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
          <Cable className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Tether:</span>
          <span className="font-semibold text-amber-300">
            {telemetry?.voltage || '800V DC'}
          </span>
        </div>

        {/* Cable Tension */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">Tension:</span>
          <span className="font-semibold text-sky-300">
            {telemetry?.cableTension || '14.2 N'}
          </span>
        </div>

        {/* Continuous Power */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Delivery:</span>
          <span className="font-semibold text-emerald-300">
            {telemetry?.power || '2.4 kW'}
          </span>
        </div>

        {/* Optical Link */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Mesh:</span>
          <span className="font-semibold text-cyan-300">
            {telemetry?.status === 'RELAYING' ? 'ACTIVE RELAY' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Toggle Mode */}
        <button
          onClick={() => onToggleMode(operatingMode === 'tethered_hover' ? 'inspection' : 'tethered_hover')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border shadow-md ${
            operatingMode === 'tethered_hover'
              ? 'bg-sky-600 hover:bg-sky-500 text-white border-sky-400'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
          title="Toggle between Dynamic Hovering and Static Studio Inspection"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{operatingMode === 'tethered_hover' ? 'Tethered Hover' : 'Studio Inspect'}</span>
        </button>

        {/* Capture Snapshot */}
        <button
          onClick={onTakeScreenshot}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-md"
          title="Download High-Resolution PNG Render"
        >
          <Camera className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Render PNG</span>
        </button>
      </div>
    </header>
  );
};
