export type CameraViewPreset = 
  | 'front_three_quarter'
  | 'top_quad'
  | 'bottom_tether'
  | 'side_profile'
  | 'connector_closeup'
  | 'free';

export interface CameraPresetConfig {
  id: CameraViewPreset;
  label: string;
  shortLabel: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
}

export type LightingPreset = 'studio_dark_blue' | 'clean_slate' | 'emergency_night';

export type OperatingMode = 'inspection' | 'tethered_hover';

export interface DronePartInfo {
  id: string;
  name: string;
  category: 'Structural' | 'Power & Tether' | 'Avionics & RF' | 'Propulsion' | 'Optics';
  description: string;
  material: string;
  specs: {
    label: string;
    value: string;
  }[];
  highlightMeshes?: string[];
}

export interface TetherTelemetry {
  voltage: string;
  current: string;
  power: string;
  fiberSpeed: string;
  cableTension: string;
  deployedLength: string;
  altitude: string;
  status: 'ONLINE' | 'STANDBY' | 'RELAYING';
}
