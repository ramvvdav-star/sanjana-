import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Box, 
  Sun, 
  Wind, 
  ChevronDown, 
  ChevronUp, 
  Cable, 
  Compass, 
  RotateCcw,
  Sliders
} from 'lucide-react';
import { CameraViewPreset, LightingPreset, OperatingMode } from '../types/drone';
import { CAMERA_PRESETS } from '../three/StudioScene';
import { DRONE_PARTS_SPEC } from '../three/DroneModel';

interface ControlDockProps {
  activePreset: CameraViewPreset;
  onSelectPreset: (preset: CameraViewPreset) => void;
  explodedProgress: number;
  onExplodedChange: (val: number) => void;
  operatingMode: OperatingMode;
  onOperatingModeChange: (mode: OperatingMode) => void;
  lightingPreset: LightingPreset;
  onLightingChange: (preset: LightingPreset) => void;
  isWireframe: boolean;
  onToggleWireframe: (wireframe: boolean) => void;
  selectedPartId: string | null;
  onSelectPart: (partId: string | null) => void;
}

type TabKey = 'views' | 'exploded' | 'parts' | 'flight' | 'lighting';

export const ControlDock: React.FC<ControlDockProps> = ({
  activePreset,
  onSelectPreset,
  explodedProgress,
  onExplodedChange,
  operatingMode,
  onOperatingModeChange,
  lightingPreset,
  onLightingChange,
  isWireframe,
  onToggleWireframe,
  selectedPartId,
  onSelectPart,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('views');

  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'views', label: 'Camera Views', icon: Eye },
    { key: 'exploded', label: 'Exploded View', icon: Sliders },
    { key: 'parts', label: 'Components', icon: Box },
    { key: 'flight', label: 'Tether Simulation', icon: Wind },
    { key: 'lighting', label: 'Studio Light', icon: Sun },
  ];

  return (
    <aside
      aria-label="3D Viewer Controls"
      className="fixed z-20 pointer-events-none transition-transform duration-300 ease-out"
      style={{
        bottom: '20px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 36px)' : '0px'})`,
        maxWidth: 'min(960px, 94vw)',
        width: '100%',
      }}
    >
      <div className="flex flex-col items-center">
        {/* Collapse / Expand Toggle Tab */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="pointer-events-auto mb-1.5 flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white shadow-lg transition-all"
          title={isCollapsed ? 'Show Controls Dock (H)' : 'Hide Controls Dock (H)'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show Studio Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls Dock</span>
            </>
          )}
        </button>

        {/* Main Glassmorphic Dock Container */}
        <div className="pointer-events-auto w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl">
          {/* Tab Navigation Row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5 overflow-x-auto gap-1">
            <div className="flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      if (isCollapsed) setIsCollapsed(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick reset */}
            <button
              onClick={() => {
                onSelectPreset('front_three_quarter');
                onExplodedChange(0);
                onSelectPart(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-mono transition-colors shrink-0"
              title="Reset View and Exploded Separation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="min-h-14 flex items-center">
            {/* 1. Camera Views Tab */}
            {activeTab === 'views' && (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CAMERA_PRESETS.map((preset, index) => {
                    const isSelected = activePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => onSelectPreset(preset.id)}
                        className={`group relative flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-sky-950/80 border-sky-500 shadow-md ring-1 ring-sky-500'
                            : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-[10px] font-mono text-slate-400">
                            0{index + 1}
                          </span>
                          {preset.id === 'bottom_tether' && (
                            <Cable className="w-3 h-3 text-amber-400" />
                          )}
                          {preset.id === 'connector_closeup' && (
                            <Compass className="w-3 h-3 text-emerald-400" />
                          )}
                        </div>
                        <div
                          className={`text-xs font-bold leading-tight ${
                            isSelected ? 'text-sky-300' : 'text-slate-200'
                          }`}
                        >
                          {preset.shortLabel}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {preset.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Exploded View Tab */}
            {activeTab === 'exploded' && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
                <div className="flex-1 w-full flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 min-w-32">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Disassembly:</span>
                    <span className="font-mono text-sky-400 font-bold">
                      {Math.round(explodedProgress * 100)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedProgress}
                    onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onExplodedChange(0)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      explodedProgress === 0
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Assembled
                  </button>
                  <button
                    onClick={() => onExplodedChange(0.5)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      Math.abs(explodedProgress - 0.5) < 0.05
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => onExplodedChange(1.0)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      explodedProgress === 1.0
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Full Explode
                  </button>
                </div>
              </div>
            )}

            {/* 3. Components Tab */}
            {activeTab === 'parts' && (
              <div className="w-full flex items-center gap-2 overflow-x-auto pb-1">
                {Object.values(DRONE_PARTS_SPEC).map((part) => {
                  const isSelected = selectedPartId === part.id;
                  const isTetherFeature =
                    part.id === 'part_tether_assembly' || part.id === 'part_tether_cable';

                  return (
                    <button
                      key={part.id}
                      onClick={() => onSelectPart(isSelected ? null : part.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-400 font-semibold'
                          : isTetherFeature
                          ? 'bg-amber-950/40 text-amber-200 border-amber-800/60 hover:bg-amber-900/50'
                          : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {isTetherFeature && <Cable className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{part.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 4. Flight & Tether Simulation Tab */}
            {activeTab === 'flight' && (
              <div className="w-full flex flex-wrap items-center justify-between gap-3 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Flight Physics:</span>
                  <button
                    onClick={() => onOperatingModeChange('tethered_hover')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      operatingMode === 'tethered_hover'
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Dynamic Hover & Propeller Spin</span>
                  </button>
                  <button
                    onClick={() => onOperatingModeChange('inspection')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      operatingMode === 'inspection'
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Static Precision Mode</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleWireframe(!isWireframe)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                      isWireframe
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {isWireframe ? 'Wireframe: ON' : 'Wireframe: OFF'}
                  </button>
                </div>
              </div>
            )}

            {/* 5. Studio Lighting Tab */}
            {activeTab === 'lighting' && (
              <div className="w-full flex items-center justify-between gap-2 overflow-x-auto py-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Environment:</span>
                  <button
                    onClick={() => onLightingChange('studio_dark_blue')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      lightingPreset === 'studio_dark_blue'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Studio Dark Blue (Prompt Neutral)</span>
                  </button>

                  <button
                    onClick={() => onLightingChange('clean_slate')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      lightingPreset === 'clean_slate'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>Clean Technical Slate</span>
                  </button>

                  <button
                    onClick={() => onLightingChange('emergency_night')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      lightingPreset === 'emergency_night'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Emergency Night Ops (Strobes & Spotlight)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
