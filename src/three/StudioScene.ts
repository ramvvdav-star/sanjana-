import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createDroneModel, DroneModelParts, DRONE_PARTS_SPEC } from './DroneModel';
import { CameraViewPreset, CameraPresetConfig, LightingPreset, OperatingMode, DronePartInfo, TetherTelemetry } from '../types/drone';

export const CAMERA_PRESETS: CameraPresetConfig[] = [
  {
    id: 'front_three_quarter',
    label: 'Front 3/4 Perspective',
    shortLabel: 'Front 3/4',
    description: 'Hero commercial perspective showing airframe, camera, propellers, and underbelly tether.',
    position: [2.8, 1.4, 3.2],
    target: [0, -0.6, 0.1],
  },
  {
    id: 'top_quad',
    label: 'Top Quadcopter Layout',
    shortLabel: 'Top Plan',
    description: 'Symmetrical quadcopter X-layout view showcasing four arms, motors, and RescueMesh AI insignia.',
    position: [0.01, 5.0, 0.01],
    target: [0, 0, 0],
  },
  {
    id: 'bottom_tether',
    label: 'Bottom Tether Attachment',
    shortLabel: 'Bottom Mount',
    description: 'Underside view revealing reinforced structural bulkhead, landing pads, and tether interface.',
    position: [0.3, -3.2, 1.8],
    target: [0, -0.5, 0],
  },
  {
    id: 'side_profile',
    label: 'Side Profile & Hanging Cable',
    shortLabel: 'Side Profile',
    description: 'Full vertical profile showing the physical cable extending downward to the ground terminal.',
    position: [5.2, -1.2, 0.0],
    target: [0, -1.8, 0],
  },
  {
    id: 'connector_closeup',
    label: 'Connector & Strain Boot Close-Up',
    shortLabel: 'Connector Macro',
    description: 'Macro inspection of knurled locking collar, fluted polyurethane boot, and cable clamp.',
    position: [0.85, -0.6, 1.05],
    target: [0, -0.45, 0],
  },
];

export interface StudioSceneCallbacks {
  onPartSelect?: (part: DronePartInfo | null) => void;
  onTelemetryUpdate?: (telemetry: TetherTelemetry) => void;
}

export class StudioScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private drone: DroneModelParts;
  private callbacks: StudioSceneCallbacks;

  // Lights
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;
  private emergencySearchlight: THREE.SpotLight;
  private contactShadowMesh: THREE.Mesh;
  private turntableFloor: THREE.Mesh;

  // Animation & State
  private animationFrameId: number = 0;
  private clock: THREE.Clock = new THREE.Clock();
  private isDestroyed: boolean = false;
  private isSoftwareGl: boolean = false;

  // Controls & Camera transition
  private targetCameraPos: THREE.Vector3 = new THREE.Vector3();
  private targetControlsTarget: THREE.Vector3 = new THREE.Vector3();
  private isTransitioningCamera: boolean = false;

  // Raycasting
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private hoveredPartId: string | null = null;
  private selectedPartId: string | null = null;

  // Operational State
  private operatingMode: OperatingMode = 'tethered_hover';
  private lightingPreset: LightingPreset = 'studio_dark_blue';
  private explodedProgress: number = 0;
  private targetExplodedProgress: number = 0;
  private isWireframe: boolean = false;
  private isPowerFlowActive: boolean = true;
  private hoverTime: number = 0;

  constructor(container: HTMLElement, callbacks: StudioSceneCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;

    // Detect software WebGL
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 2. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090f1d); // Neutral dark-blue studio background
    this.scene.fog = new THREE.FogExp2(0x090f1d, 0.045);

    // 3. Camera Setup
    this.camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    const initialPreset = CAMERA_PRESETS[0];
    this.camera.position.set(...initialPreset.position);
    this.targetCameraPos.copy(this.camera.position);

    // 4. Controls Setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 14;
    this.controls.minDistance = 0.8;
    this.controls.target.set(...initialPreset.target);
    this.targetControlsTarget.copy(this.controls.target);

    this.controls.addEventListener('start', () => {
      // User manual control cancels scripted smooth transition
      this.isTransitioningCamera = false;
    });

    // 5. Procedural Studio Environment Reflection
    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();
      const roomEnv = new RoomEnvironment();
      this.scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
      pmrem.dispose();
    } catch (e) {
      console.warn('PMREM environment initialization skipped:', e);
    }

    // 6. Studio Lighting Rig
    // Warm key directional light with high-res soft shadows
    this.keyLight = new THREE.DirectionalLight(0xfff5ea, 2.6);
    this.keyLight.position.set(4.5, 6.0, 4.0);
    this.keyLight.castShadow = !this.isSoftwareGl;
    if (this.keyLight.castShadow) {
      this.keyLight.shadow.mapSize.width = 2048;
      this.keyLight.shadow.mapSize.height = 2048;
      this.keyLight.shadow.camera.near = 0.5;
      this.keyLight.shadow.camera.far = 16;
      this.keyLight.shadow.camera.left = -3.5;
      this.keyLight.shadow.camera.right = 3.5;
      this.keyLight.shadow.camera.top = 3.5;
      this.keyLight.shadow.camera.bottom = -5.0;
      this.keyLight.shadow.bias = -0.0005;
      this.keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(this.keyLight);

    // Cool fill light (Hemisphere)
    this.fillLight = new THREE.HemisphereLight(0x38bdf8, 0x090f1d, 1.2);
    this.scene.add(this.fillLight);

    // Rim/Backlight for crisp silhouette separation
    this.rimLight = new THREE.DirectionalLight(0x60a5fa, 2.0);
    this.rimLight.position.set(-4.0, 3.5, -4.5);
    this.scene.add(this.rimLight);

    // Emergency Spotlight (used in night mode)
    this.emergencySearchlight = new THREE.SpotLight(0x93c5fd, 0, 15, Math.PI / 6, 0.4, 1.0);
    this.emergencySearchlight.position.set(0, 0, 1.2);
    this.emergencySearchlight.target.position.set(0, -6, 5);
    this.scene.add(this.emergencySearchlight);
    this.scene.add(this.emergencySearchlight.target);

    // 7. Studio Turntable Ground Floor & Contact Shadow
    // Floor circle
    const floorGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.15, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d1526,
      roughness: 0.6,
      metalness: 0.2,
    });
    this.turntableFloor = new THREE.Mesh(floorGeo, floorMat);
    this.turntableFloor.position.set(0, -4.58, 0);
    this.turntableFloor.receiveShadow = true;
    this.scene.add(this.turntableFloor);

    // Studio concentric alignment ring markings on the turntable floor
    const ringGeo = new THREE.RingGeometry(2.4, 2.44, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, -4.49, 0);
    this.scene.add(ringMesh);

    // Soft Radial Contact Shadow beneath drone ground anchor
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0,0,0,0.65)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    this.contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadowMesh.position.set(0, -4.48, 0);
    this.scene.add(this.contactShadowMesh);

    // 8. Drone Model Assembly
    this.drone = createDroneModel();
    this.scene.add(this.drone.rootGroup);

    // Hover time telemetry simulation
    this.emitTelemetry();

    // 9. Event Listeners
    this.handleResize = this.handleResize.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);

    window.addEventListener('resize', this.handleResize);
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove);
    this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown);

    // 10. Start Animation Loop
    this.animate();
  }

  // -------------------------------------------------------------
  // Public Controls
  // -------------------------------------------------------------

  public setCameraPreset(presetId: CameraViewPreset) {
    const config = CAMERA_PRESETS.find((p) => p.id === presetId);
    if (!config) return;

    this.targetCameraPos.set(...config.position);
    this.targetControlsTarget.set(...config.target);
    this.isTransitioningCamera = true;
  }

  public setLightingPreset(preset: LightingPreset) {
    this.lightingPreset = preset;

    if (preset === 'studio_dark_blue') {
      this.scene.background = new THREE.Color(0x090f1d);
      this.scene.fog = new THREE.FogExp2(0x090f1d, 0.045);
      this.keyLight.color.setHex(0xfff5ea);
      this.keyLight.intensity = 2.6;
      this.fillLight.color.setHex(0x38bdf8);
      this.fillLight.groundColor.setHex(0x090f1d);
      this.fillLight.intensity = 1.2;
      this.rimLight.color.setHex(0x60a5fa);
      this.rimLight.intensity = 2.0;
      this.emergencySearchlight.intensity = 0;
    } else if (preset === 'clean_slate') {
      this.scene.background = new THREE.Color(0x1e2430);
      this.scene.fog = new THREE.FogExp2(0x1e2430, 0.035);
      this.keyLight.color.setHex(0xffffff);
      this.keyLight.intensity = 3.0;
      this.fillLight.color.setHex(0xe2e8f0);
      this.fillLight.groundColor.setHex(0x1e2430);
      this.fillLight.intensity = 1.6;
      this.rimLight.color.setHex(0x94a3b8);
      this.rimLight.intensity = 1.8;
      this.emergencySearchlight.intensity = 0;
    } else if (preset === 'emergency_night') {
      this.scene.background = new THREE.Color(0x030712);
      this.scene.fog = new THREE.FogExp2(0x030712, 0.06);
      this.keyLight.color.setHex(0x38bdf8);
      this.keyLight.intensity = 0.8;
      this.fillLight.color.setHex(0x1e3a8a);
      this.fillLight.groundColor.setHex(0x020617);
      this.fillLight.intensity = 0.5;
      this.rimLight.color.setHex(0x22c55e);
      this.rimLight.intensity = 1.5;
      this.emergencySearchlight.intensity = 4.5;
    }
  }

  public setOperatingMode(mode: OperatingMode) {
    this.operatingMode = mode;
  }

  public setExplodedProgress(progress: number) {
    this.targetExplodedProgress = Math.max(0, Math.min(1, progress));
  }

  public setWireframe(wireframe: boolean) {
    this.isWireframe = wireframe;
    this.drone.rootGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = wireframe));
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }

  public setPowerFlowActive(active: boolean) {
    this.isPowerFlowActive = active;
  }

  public selectPart(partId: string | null) {
    this.selectedPartId = partId;
    if (partId && DRONE_PARTS_SPEC[partId]) {
      this.callbacks.onPartSelect?.(DRONE_PARTS_SPEC[partId]);
    } else {
      this.callbacks.onPartSelect?.(null);
    }
  }

  public captureScreenshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  // -------------------------------------------------------------
  // Internal Event Handlers & Raycasting
  // -------------------------------------------------------------

  private handleResize() {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private handlePointerMove(e: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.drone.inspectableMeshes, true);

    if (intersects.length > 0) {
      const topObj = intersects[0].object;
      const partId = topObj.userData.partId;
      if (partId !== this.hoveredPartId) {
        this.hoveredPartId = partId;
        this.renderer.domElement.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredPartId !== null) {
        this.hoveredPartId = null;
        this.renderer.domElement.style.cursor = 'default';
      }
    }
  }

  private handlePointerDown() {
    if (this.hoveredPartId) {
      this.selectPart(this.hoveredPartId);
    }
  }

  private emitTelemetry() {
    const isHover = this.operatingMode === 'tethered_hover';
    const tension = isHover 
      ? (14.2 + Math.sin(this.hoverTime * 2) * 1.8).toFixed(1) + ' N'
      : '9.8 N (Static Ground)';
    const power = isHover
      ? (2.42 + Math.sin(this.hoverTime * 1.5) * 0.12).toFixed(2) + ' kW'
      : '0.35 kW (Standby Idle)';
    const altitude = isHover ? '25.0 m AGL' : '0.0 m (Grounded)';

    this.callbacks.onTelemetryUpdate?.({
      voltage: '800 V DC',
      current: isHover ? '3.08 A' : '0.44 A',
      power,
      fiberSpeed: '20 Gbps (Dual OM4)',
      cableTension: tension,
      deployedLength: '26.4 m',
      altitude,
      status: isHover ? 'RELAYING' : 'STANDBY',
    });
  }

  // -------------------------------------------------------------
  // Animation Loop
  // -------------------------------------------------------------

  private animate() {
    if (this.isDestroyed) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.hoverTime += delta;

    // 1. Camera Transition with Exponential Damping
    if (this.isTransitioningCamera) {
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.targetCameraPos.x, 5.0, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.targetCameraPos.y, 5.0, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.targetCameraPos.z, 5.0, delta);

      this.controls.target.x = THREE.MathUtils.damp(this.controls.target.x, this.targetControlsTarget.x, 5.0, delta);
      this.controls.target.y = THREE.MathUtils.damp(this.controls.target.y, this.targetControlsTarget.y, 5.0, delta);
      this.controls.target.z = THREE.MathUtils.damp(this.controls.target.z, this.targetControlsTarget.z, 5.0, delta);

      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.04 &&
          this.controls.target.distanceTo(this.targetControlsTarget) < 0.04) {
        this.camera.position.copy(this.targetCameraPos);
        this.controls.target.copy(this.targetControlsTarget);
        this.isTransitioningCamera = false;
      }
    }

    this.controls.update();

    // 2. Exploded View Interpolation
    if (Math.abs(this.explodedProgress - this.targetExplodedProgress) > 0.001) {
      this.explodedProgress = THREE.MathUtils.damp(
        this.explodedProgress,
        this.targetExplodedProgress,
        6.0,
        delta
      );
      this.drone.updateExploded(this.explodedProgress);
    }

    // 3. Operating Mode Updates: Hover Bobbing & Propellers
    const isHover = (this.operatingMode === 'tethered_hover');
    if (isHover) {
      // Gentle realistic hover float bobbing
      const hoverY = Math.sin(this.hoverTime * 1.8) * 0.045;
      const hoverRoll = Math.sin(this.hoverTime * 1.3) * 0.012;
      const hoverPitch = Math.cos(this.hoverTime * 1.1) * 0.015;

      this.drone.droneBodyGroup.position.y = hoverY;
      this.drone.droneBodyGroup.rotation.z = hoverRoll;
      this.drone.droneBodyGroup.rotation.x = hoverPitch;

      // Spin propellers
      this.drone.updatePropellers(delta, true);

      // Flash navigation lights (emergency aviation strobe pattern)
      const strobeOn = Math.floor(this.hoverTime * 3) % 2 === 0;
      this.drone.navLeds.forEach((led) => {
        led.intensity = strobeOn ? 1.6 : 0.4;
      });
    } else {
      // Static inspection
      this.drone.droneBodyGroup.position.set(0, 0, 0);
      this.drone.droneBodyGroup.rotation.set(0, 0, 0);
      this.drone.navLeds.forEach((led) => {
        led.intensity = 0.8;
      });
    }

    // 4. Update Physical Tether Cable Geometry
    this.drone.updateCable(this.hoverTime, isHover);

    // 5. Update Telemetry periodic feedback (throttled)
    if (Math.floor(this.hoverTime * 10) % 5 === 0) {
      this.emitTelemetry();
    }

    // 6. Render
    this.renderer.render(this.scene, this.camera);
  }

  // -------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------
  public dispose() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);
    this.renderer.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.renderer.domElement.removeEventListener('pointerdown', this.handlePointerDown);

    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
