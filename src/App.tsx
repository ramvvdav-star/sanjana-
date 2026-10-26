import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StudioScene } from './three/StudioScene';
import { TelemetryBar } from './components/TelemetryBar';
import { ControlDock } from './components/ControlDock';
import { PartDetailModal } from './components/PartDetailModal';
import { 
  CameraViewPreset, 
  LightingPreset, 
  OperatingMode, 
  DronePartInfo, 
  TetherTelemetry 
} from './types/drone';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const studioSceneRef = useRef<StudioScene | null>(null);

  // UI State
  const [activePreset, setActivePreset] = useState<CameraViewPreset>('front_three_quarter');
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('tethered_hover');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio_dark_blue');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [selectedPart, setSelectedPart] = useState<DronePartInfo | null>(null);
  const [telemetry, setTelemetry] = useState<TetherTelemetry | null>(null);

  // Initialize Three.js Studio Scene once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const scene = new StudioScene(canvasMountRef.current, {
      onPartSelect: (part) => {
        setSelectedPart(part);
      },
      onTelemetryUpdate: (data) => {
        setTelemetry(data);
      },
    });

    studioSceneRef.current = scene;

    return () => {
      scene.dispose();
      studioSceneRef.current = null;
    };
  }, []);

  // Preset switch
  const handleSelectPreset = useCallback((preset: CameraViewPreset) => {
    setActivePreset(preset);
    studioSceneRef.current?.setCameraPreset(preset);
  }, []);

  // Exploded progress change
  const handleExplodedChange = useCallback((val: number) => {
    setExplodedProgress(val);
    studioSceneRef.current?.setExplodedProgress(val);
  }, []);

  // Operating mode change (hover vs static)
  const handleOperatingModeChange = useCallback((mode: OperatingMode) => {
    setOperatingMode(mode);
    studioSceneRef.current?.setOperatingMode(mode);
  }, []);

  // Lighting preset change
  const handleLightingChange = useCallback((preset: LightingPreset) => {
    setLightingPreset(preset);
    studioSceneRef.current?.setLightingPreset(preset);
  }, []);

  // Wireframe toggle
  const handleToggleWireframe = useCallback((wireframe: boolean) => {
    setIsWireframe(wireframe);
    studioSceneRef.current?.setWireframe(wireframe);
  }, []);

  // Select part
  const handleSelectPart = useCallback((partId: string | null) => {
    studioSceneRef.current?.selectPart(partId);
  }, []);

  // Snapshot capture
  const handleTakeScreenshot = useCallback(() => {
    if (!studioSceneRef.current) return;
    const dataUrl = studioSceneRef.current.captureScreenshot();
    const link = document.createElement('a');
    link.download = `RescueMesh-AI-Drone-${activePreset}.png`;
    link.href = dataUrl;
    link.click();
  }, [activePreset]);

  // Keyboard shortcuts (1-5 for camera views, H for collapse)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input or form field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case '1':
          handleSelectPreset('front_three_quarter');
          break;
        case '2':
          handleSelectPreset('top_quad');
          break;
        case '3':
          handleSelectPreset('bottom_tether');
          break;
        case '4':
          handleSelectPreset('side_profile');
          break;
        case '5':
          handleSelectPreset('connector_closeup');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectPreset]);

  // Focus part camera angle
  const handleFocusPartPreset = (partId: string) => {
    if (partId === 'part_tether_assembly') {
      handleSelectPreset('connector_closeup');
    } else if (partId === 'part_tether_cable') {
      handleSelectPreset('side_profile');
    } else if (partId === 'part_antenna' || partId === 'part_props') {
      handleSelectPreset('top_quad');
    } else if (partId === 'part_ground_terminal') {
      handleSelectPreset('bottom_tether');
    } else {
      handleSelectPreset('front_three_quarter');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Mount (Independent ref container) */}
      <div 
        ref={canvasMountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Header / Live Telemetry Bar */}
      <TelemetryBar
        telemetry={telemetry}
        operatingMode={operatingMode}
        onTakeScreenshot={handleTakeScreenshot}
        onToggleMode={handleOperatingModeChange}
      />

      {/* Part Inspector Card (Shown on click) */}
      <PartDetailModal
        part={selectedPart}
        onClose={() => handleSelectPart(null)}
        onFocusPartPreset={handleFocusPartPreset}
      />

      {/* Bottom Pinned Collapsible Dock */}
      <ControlDock
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        explodedProgress={explodedProgress}
        onExplodedChange={handleExplodedChange}
        operatingMode={operatingMode}
        onOperatingModeChange={handleOperatingModeChange}
        lightingPreset={lightingPreset}
        onLightingChange={handleLightingChange}
        isWireframe={isWireframe}
        onToggleWireframe={handleToggleWireframe}
        selectedPartId={selectedPart?.id || null}
        onSelectPart={handleSelectPart}
      />
    </div>
  );
}
