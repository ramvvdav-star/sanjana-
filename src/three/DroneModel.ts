import * as THREE from 'three';
import { 
  createCarbonFiberTexture, 
  createRescueMeshLogoTexture, 
  createKnurledMetalTexture, 
  createBraidedCableTexture,
  createBrushedMotorTexture 
} from '../utils/proceduralTextures';
import { DronePartInfo } from '../types/drone';

export interface DroneModelParts {
  rootGroup: THREE.Group;
  droneBodyGroup: THREE.Group;
  topShellGroup: THREE.Group;
  bottomFuselageGroup: THREE.Group;
  avionicsCoreGroup: THREE.Group;
  armsGroup: THREE.Group;
  motorsGroup: THREE.Group;
  propellersGroup: THREE.Group;
  cameraGroup: THREE.Group;
  antennaGroup: THREE.Group;
  tetherMountGroup: THREE.Group;
  tetherCableMesh: THREE.Mesh;
  groundTerminalGroup: THREE.Group;
  propellerBlades: THREE.Group[];
  navLeds: THREE.PointLight[];
  inspectableMeshes: THREE.Mesh[];
  updateExploded: (progress: number) => void;
  updateCable: (hoverTime: number, hoverMode: boolean) => void;
  updatePropellers: (delta: number, spinning: boolean) => void;
}

export const DRONE_PARTS_SPEC: Record<string, DronePartInfo> = {
  part_tether_assembly: {
    id: 'part_tether_assembly',
    name: 'Bottom-Centre Tether Connector & Strain-Relief Boot',
    category: 'Power & Tether',
    description: 'Reinforced underside titanium bulkhead connector located at the exact bottom centre of the rectangular body. Features a multi-tiered fluted rubber strain-relief boot, bayonet locking ring, and continuous high-voltage power & fiber-optic feedthrough.',
    material: 'Anodized 7075-T6 Aluminum & Molded EPDM/Polyurethane Elastomer',
    specs: [
      { label: 'Attachment Point', value: 'Direct Bottom Center Bulkhead' },
      { label: 'Tensile Load Rating', value: '450 N Continuous / 900 N Burst' },
      { label: 'Locking Collar', value: 'Knurled Mil-Spec Bayonet Coupler' },
      { label: 'Strain Relief Angle', value: 'Multi-Axis Flexible Articulation' },
    ],
  },
  part_tether_cable: {
    id: 'part_tether_cable',
    name: 'Flexible High-Voltage & Optical Tether Cable',
    category: 'Power & Tether',
    description: 'Ruggedized flexible black insulated cable hanging vertically downward from the bottom centre of the drone. Delivers continuous ground-fed electricity (800V DC) and dual high-speed fiber-optic links for uninterrupted disaster response relay.',
    material: 'Aramid Kevlar Core, Shielded Copper Conductor, TPU Outer Sheath',
    specs: [
      { label: 'Nominal Diameter', value: '12.5 mm Shielded Umbilical' },
      { label: 'Hanging Geometry', value: 'Natural Catenary Flexible Curve' },
      { label: 'Power Transmission', value: '800 V DC @ up to 3.2 kW' },
      { label: 'Data Relay', value: 'Dual Single-Mode Tactical Fiber' },
    ],
  },
  part_fuselage: {
    id: 'part_fuselage',
    name: 'Compact Rectangular Industrial Drone Body',
    category: 'Structural',
    description: 'Solid, compact rectangular central enclosure with slightly rounded edges, realistic white/light-grey matte plastic casing, visible panel parting seams, recessed hex bolts, battery hatch, and side thermal cooling vents.',
    material: 'UV-Stabilized Polycarbonate-ABS Injection Molded Casing',
    specs: [
      { label: 'Architecture', value: 'Boxy Solid Rectangular Enclosure' },
      { label: 'Ingress Protection', value: 'IP54 Rain & Debris Sealed' },
      { label: 'Mechanical Details', value: 'Recessed Hex Screws, Parting Seams & Vents' },
      { label: 'Battery Bay', value: 'Quick-Release Top Latch Compartment' },
    ],
  },
  part_camera: {
    id: 'part_camera',
    name: 'Integrated Front Sensor & Gimbal Camera',
    category: 'Optics',
    description: 'Forward-mounted 2-axis stabilized gimbal housing a 4K optical daylight sensor and long-wave infrared sensor, cleanly integrated into the front nose recess of the boxy body.',
    material: 'CNC Magnesium Alloy & Sapphire Glass Elements',
    specs: [
      { label: 'Daylight Sensor', value: '4K Ultra-HD 60fps with Optical Zoom' },
      { label: 'Thermal Sensor', value: 'FLIR 640 × 512 LWIR Core' },
      { label: 'Mounting', value: 'Recessed Forward Nose Bracket' },
    ],
  },
  part_arms: {
    id: 'part_arms',
    name: 'Diagonal Carbon-Fiber Quadcopter Arms',
    category: 'Structural',
    description: 'Four structural arms extending diagonally from the rectangular central body to form an authentic quadcopter layout. Rigid hollow carbon-fiber tubes contain internal motor power and signal lines.',
    material: 'Toray 3K Twill High-Modulus Carbon Fiber',
    specs: [
      { label: 'Configuration', value: 'Four Diagonal Arms (X-Quadcopter)' },
      { label: 'Wheelbase', value: '490 mm Motor-to-Motor' },
      { label: 'Arm Diameter', value: '20 mm Carbon-Fiber Tube' },
    ],
  },
  part_motors: {
    id: 'part_motors',
    name: 'RM-3510 Commercial Brushless Motors',
    category: 'Propulsion',
    description: 'Four heavy-duty brushless outrunner motors, exactly one installed at the end of each diagonal arm, featuring visible copper stator coils, cooling vents, and anodized aluminum rotor bells.',
    material: 'Anodized 6061-T6 Aluminum & 0.2mm Silicon Steel Stators',
    specs: [
      { label: 'Count', value: 'Exactly 4 Brushless Motors' },
      { label: 'Stator Size', value: '3510 (35mm × 10mm)' },
      { label: 'KV Rating', value: '780 KV High-Efficiency' },
    ],
  },
  part_props: {
    id: 'part_props',
    name: 'Four Black Two-Blade Propellers',
    category: 'Propulsion',
    description: 'Exactly four realistic black two-blade propellers mounted directly to the four motor shafts. Aerodynamic airfoil profile, realistic pitch twist, and balanced composite blades (2 CW, 2 CCW).',
    material: 'Matte Black Carbon Composite',
    specs: [
      { label: 'Count', value: 'Exactly 4 Two-Blade Propellers' },
      { label: 'Diameter × Pitch', value: '13.0 × 5.0 inches' },
      { label: 'Color & Finish', value: 'Realistic Matte Black Composite' },
      { label: 'Rotation', value: '2 Clockwise, 2 Counter-Clockwise' },
    ],
  },
  part_antenna: {
    id: 'part_antenna',
    name: 'RescueMesh AI Communication Relay Dome',
    category: 'Avionics & RF',
    description: 'Low-profile communication dome mounted on the top of the boxy body with the official RescueMesh AI insignia, providing emergency ad-hoc mesh connectivity.',
    material: 'Low-Loss Polyetherimide (Ultem) RF Radome',
    specs: [
      { label: 'Coverage', value: 'Up to 5 km Disaster Relay Bubble' },
      { label: 'Frequencies', value: 'MIMO LTE / Mesh / RTK GNSS' },
    ],
  },
  part_ground_terminal: {
    id: 'part_ground_terminal',
    name: 'Ground Station Power & Fiber Terminal',
    category: 'Power & Tether',
    description: 'Ground-end termination connector interfacing the flexible tether cable with the mobile command power supply.',
    material: 'Cast Zinc & Gold-Plated Contacts',
    specs: [
      { label: 'Termination', value: 'Heavy-Duty Ground Power Interface' },
      { label: 'Safety Trip', value: '< 2 ms Fast Current Disconnect' },
    ],
  },
};

/**
 * Creates a rounded rectangular extruded shape for realistic boxy bodies with rounded corners and edges.
 */
function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  bevel: number = 0.03
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hd = depth / 2;
  const r = Math.min(radius, hw, hd);

  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

  const extrudeSettings = {
    steps: 1,
    depth: height - (bevel * 2),
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Re-orient so depth is along Z and height is along Y
  geo.rotateX(Math.PI / 2);
  geo.center();
  return geo;
}

/**
 * Builds the photorealistic, mechanically authentic RescueMesh AI Drone Model:
 * 1. Exactly four propellers (quadcopter with four arms, four motors, four black two-blade props).
 * 2. Boxy body: Compact, solid, rectangular central body with slightly rounded edges, realistic white/light-grey casing, visible panel seams, and mechanical details.
 * 3. Bottom-connected wire: Realistic black insulated cable attached directly to a connector at the bottom centre, extending vertically downward with natural flexible curvature.
 */
export function createDroneModel(): DroneModelParts {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'RescueMesh_Drone_Root';

  // Sub-groups
  const droneBodyGroup = new THREE.Group();
  droneBodyGroup.name = 'Drone_Airframe';
  rootGroup.add(droneBodyGroup);

  const topShellGroup = new THREE.Group();
  topShellGroup.name = 'Top_Fuselage_Shell';
  droneBodyGroup.add(topShellGroup);

  const bottomFuselageGroup = new THREE.Group();
  bottomFuselageGroup.name = 'Bottom_Fuselage_Chassis';
  droneBodyGroup.add(bottomFuselageGroup);

  const avionicsCoreGroup = new THREE.Group();
  avionicsCoreGroup.name = 'Avionics_Core';
  droneBodyGroup.add(avionicsCoreGroup);

  const armsGroup = new THREE.Group();
  armsGroup.name = 'Carbon_Arms';
  droneBodyGroup.add(armsGroup);

  const motorsGroup = new THREE.Group();
  motorsGroup.name = 'Brushless_Motors';
  droneBodyGroup.add(motorsGroup);

  const propellersGroup = new THREE.Group();
  propellersGroup.name = 'Propellers';
  droneBodyGroup.add(propellersGroup);

  const cameraGroup = new THREE.Group();
  cameraGroup.name = 'Front_Gimbal_Camera';
  droneBodyGroup.add(cameraGroup);

  const antennaGroup = new THREE.Group();
  antennaGroup.name = 'RescueMesh_Antenna';
  topShellGroup.add(antennaGroup);

  const tetherMountGroup = new THREE.Group();
  tetherMountGroup.name = 'Tether_Mount_Assembly';
  bottomFuselageGroup.add(tetherMountGroup);

  const groundTerminalGroup = new THREE.Group();
  groundTerminalGroup.name = 'Ground_Tether_Terminal';
  rootGroup.add(groundTerminalGroup);

  // Collections
  const inspectableMeshes: THREE.Mesh[] = [];
  const propellerBlades: THREE.Group[] = [];
  const navLeds: THREE.PointLight[] = [];

  function registerMesh(mesh: THREE.Mesh, partId: string) {
    mesh.userData.partId = partId;
    inspectableMeshes.push(mesh);
  }

  // Textures
  const carbonTexture = createCarbonFiberTexture();
  const logoTexture = createRescueMeshLogoTexture();
  const knurlTexture = createKnurledMetalTexture();
  const cableTexture = createBraidedCableTexture();
  const motorTexture = createBrushedMotorTexture();

  // -------------------------------------------------------------
  // Physically Based Materials (Photorealistic & Mechanically Believable)
  // -------------------------------------------------------------
  // Realistic matte white/light-grey industrial plastic casing
  const whitePlasticMat = new THREE.MeshStandardMaterial({
    color: 0xebedf0,
    roughness: 0.38,
    metalness: 0.04,
  });

  // Dark slate-grey lower tub casing
  const darkPlasticMat = new THREE.MeshStandardMaterial({
    color: 0x272b33,
    roughness: 0.42,
    metalness: 0.08,
  });

  // Dark panel seam accent / split line
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0x14161a,
    roughness: 0.75,
    metalness: 0.05,
  });

  // Stainless / Black-oxide hex socket bolts
  const hexScrewMat = new THREE.MeshStandardMaterial({
    color: 0x33363d,
    roughness: 0.22,
    metalness: 0.88,
  });

  // Top logo label plate
  const logoPlateMat = new THREE.MeshStandardMaterial({
    map: logoTexture,
    roughness: 0.35,
    metalness: 0.05,
  });

  // Diagonal Carbon Fiber Arms
  const carbonFiberMat = new THREE.MeshStandardMaterial({
    color: 0x1f2125,
    roughness: 0.4,
    metalness: 0.15,
    map: carbonTexture,
  });

  // Brushless Motor Bell (Brushed Anodized Aluminum)
  const motorBellMat = new THREE.MeshStandardMaterial({
    color: 0x25282e,
    roughness: 0.26,
    metalness: 0.88,
    map: motorTexture,
  });

  const motorBaseMat = new THREE.MeshStandardMaterial({
    color: 0x181a1d,
    roughness: 0.4,
    metalness: 0.7,
  });

  const copperCoilMat = new THREE.MeshStandardMaterial({
    color: 0xb8652b,
    roughness: 0.3,
    metalness: 0.9,
  });

  // Propellers: Matte Black Carbon Composite (Realistic Two-Blade)
  const propBlackMat = new THREE.MeshStandardMaterial({
    color: 0x141618,
    roughness: 0.42,
    metalness: 0.1,
  });

  const propNutMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Rescue Blue anodized aluminum lock nut
    roughness: 0.22,
    metalness: 0.9,
  });

  // Tether Connector: Knurled Aluminum Bayonet Collar
  const tetherCollarMat = new THREE.MeshStandardMaterial({
    color: 0x3a3f4a,
    roughness: 0.28,
    metalness: 0.85,
    bumpMap: knurlTexture,
    bumpScale: 0.04,
  });

  // Tether Strain Boot: Flexible Black Polyurethane Rubber
  const tetherRubberMat = new THREE.MeshStandardMaterial({
    color: 0x151619,
    roughness: 0.65,
    metalness: 0.04,
  });

  // Tether Cable: Flexible Black Insulated Braided Umbilical
  const tetherCableMat = new THREE.MeshStandardMaterial({
    color: 0x131416,
    roughness: 0.6,
    metalness: 0.06,
    map: cableTexture,
  });

  // Optical Lens Glass
  const opticalLensMat = new THREE.MeshPhysicalMaterial({
    color: 0x06111f,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.92,
    thickness: 0.3,
    ior: 1.62,
    clearcoat: 1.0,
  });

  // Battery Fuel Gauge LED Material
  const batteryLedMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
  });

  const powerButtonLedMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
  });

  // -------------------------------------------------------------
  // 1. BOXY BODY: Compact, Solid, Rectangular Central Body
  // -------------------------------------------------------------
  // Proportions: Solid rectangular casing with slightly rounded edges
  const bodyWidth = 1.35;
  const bodyLength = 1.65;
  const bodyHeight = 0.48;
  const cornerRadius = 0.14; // Slightly rounded edges

  // Upper Rectangular Shell (White/Light-Grey Plastic)
  const upperBodyGeo = createRoundedBoxGeometry(
    bodyWidth,
    bodyHeight * 0.58,
    bodyLength,
    cornerRadius,
    0.035
  );
  const upperBodyMesh = new THREE.Mesh(upperBodyGeo, whitePlasticMat);
  upperBodyMesh.position.set(0, 0.12, 0);
  upperBodyMesh.castShadow = true;
  upperBodyMesh.receiveShadow = true;
  topShellGroup.add(upperBodyMesh);
  registerMesh(upperBodyMesh, 'part_fuselage');

  // Visible Horizontal Parting Seam along the waist
  const seamGeo = createRoundedBoxGeometry(
    bodyWidth + 0.015,
    0.025,
    bodyLength + 0.015,
    cornerRadius,
    0.005
  );
  const seamMesh = new THREE.Mesh(seamGeo, seamMat);
  seamMesh.position.set(0, -0.015, 0);
  topShellGroup.add(seamMesh);

  // Top Battery Hatch Lid (Recessed Rectangular Plate with Chamfer)
  const batteryLidGeo = createRoundedBoxGeometry(
    bodyWidth * 0.72,
    0.03,
    bodyLength * 0.74,
    0.08,
    0.015
  );
  const batteryLidMesh = new THREE.Mesh(batteryLidGeo, logoPlateMat);
  batteryLidMesh.position.set(0, 0.265, 0.02);
  batteryLidMesh.castShadow = true;
  topShellGroup.add(batteryLidMesh);
  registerMesh(batteryLidMesh, 'part_fuselage');

  // Visible Battery Hatch Perimeter Seam Groove
  const batterySeamGeo = new THREE.BoxGeometry(bodyWidth * 0.74, 0.01, bodyLength * 0.76);
  const batterySeamMesh = new THREE.Mesh(batterySeamGeo, seamMat);
  batterySeamMesh.position.set(0, 0.252, 0.02);
  topShellGroup.add(batterySeamMesh);

  // Battery Level Fuel Gauge (4 green LED dashes)
  for (let i = 0; i < 4; i++) {
    const ledDashGeo = new THREE.BoxGeometry(0.04, 0.015, 0.018);
    const ledDash = new THREE.Mesh(ledDashGeo, batteryLedMat);
    ledDash.position.set(-0.35 + (i * 0.06), 0.28, 0.52);
    topShellGroup.add(ledDash);
  }

  // Circular Power Push-Button with Blue Translucent LED Halo
  const powerBtnBaseGeo = new THREE.CylinderGeometry(0.06, 0.065, 0.02, 20);
  const powerBtnBase = new THREE.Mesh(powerBtnBaseGeo, seamMat);
  powerBtnBase.position.set(0.35, 0.275, 0.52);
  topShellGroup.add(powerBtnBase);

  const powerBtnHaloGeo = new THREE.TorusGeometry(0.045, 0.008, 10, 24);
  powerBtnHaloGeo.rotateX(Math.PI / 2);
  const powerBtnHalo = new THREE.Mesh(powerBtnHaloGeo, powerButtonLedMat);
  powerBtnHalo.position.set(0.35, 0.285, 0.52);
  topShellGroup.add(powerBtnHalo);

  // Four Stainless Hex Socket Head Cap Screws at Top Corners
  const screwPositions = [
    [-bodyWidth * 0.42, 0.26, -bodyLength * 0.42],
    [bodyWidth * 0.42, 0.26, -bodyLength * 0.42],
    [-bodyWidth * 0.42, 0.26, bodyLength * 0.42],
    [bodyWidth * 0.42, 0.26, bodyLength * 0.42],
  ];
  screwPositions.forEach(([sx, sy, sz]) => {
    // Screw counterbore recess
    const holeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    const hole = new THREE.Mesh(holeGeo, seamMat);
    hole.position.set(sx, sy, sz);
    topShellGroup.add(hole);

    // Hex bolt head
    const screwGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.03, 6);
    const screw = new THREE.Mesh(screwGeo, hexScrewMat);
    screw.position.set(sx, sy + 0.005, sz);
    topShellGroup.add(screw);
  });

  // Believable Mechanical Side Cooling Vents (Recessed louvered gills)
  for (let side = -1; side <= 1; side += 2) {
    const ventPanelGeo = new THREE.BoxGeometry(0.025, 0.12, 0.65);
    const ventPanel = new THREE.Mesh(ventPanelGeo, seamMat);
    ventPanel.position.set(side * (bodyWidth / 2 + 0.005), 0.12, -0.05);
    topShellGroup.add(ventPanel);

    // Slanted louvers
    for (let v = 0; v < 6; v++) {
      const louverGeo = new THREE.BoxGeometry(0.03, 0.012, 0.08);
      louverGeo.rotateZ(side * 0.25);
      const louver = new THREE.Mesh(louverGeo, whitePlasticMat);
      louver.position.set(side * (bodyWidth / 2 + 0.012), 0.08 + v * 0.018, -0.22 + v * 0.08);
      topShellGroup.add(louver);
    }
  }

  // Top Low-Profile Antenna Puck (RescueMesh AI Mesh Dome)
  const antennaBaseGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.06, 24);
  const antennaBase = new THREE.Mesh(antennaBaseGeo, darkPlasticMat);
  antennaBase.position.set(0, 0.29, -0.38);
  antennaGroup.add(antennaBase);

  const antennaDomeGeo = new THREE.SphereGeometry(0.15, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const antennaDomeMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // RescueMesh vibrant blue
    roughness: 0.25,
    metalness: 0.35,
  });
  const antennaDome = new THREE.Mesh(antennaDomeGeo, antennaDomeMat);
  antennaDome.position.set(0, 0.32, -0.38);
  antennaDome.castShadow = true;
  antennaGroup.add(antennaDome);
  registerMesh(antennaDome, 'part_antenna');

  // Low-profile stubby comms whip
  const whipGeo = new THREE.CylinderGeometry(0.012, 0.016, 0.28, 12);
  const whip = new THREE.Mesh(whipGeo, darkPlasticMat);
  whip.position.set(0, 0.46, -0.38);
  antennaGroup.add(whip);

  // Lower Rectangular Chassis Tub (Dark Slate-Grey Engineering Plastic)
  const lowerBodyGeo = createRoundedBoxGeometry(
    bodyWidth * 0.96,
    bodyHeight * 0.45,
    bodyLength * 0.96,
    cornerRadius * 0.85,
    0.03
  );
  const lowerBodyMesh = new THREE.Mesh(lowerBodyGeo, darkPlasticMat);
  lowerBodyMesh.position.set(0, -0.13, 0);
  lowerBodyMesh.castShadow = true;
  lowerBodyMesh.receiveShadow = true;
  bottomFuselageGroup.add(lowerBodyMesh);
  registerMesh(lowerBodyMesh, 'part_fuselage');

  // Four Low-Profile Ground Landing Skid Pads on corners of bottom chassis
  const skidPositions = [
    [-bodyWidth * 0.4, -0.25, -bodyLength * 0.38],
    [bodyWidth * 0.4, -0.25, -bodyLength * 0.38],
    [-bodyWidth * 0.4, -0.25, bodyLength * 0.38],
    [bodyWidth * 0.4, -0.25, bodyLength * 0.38],
  ];
  skidPositions.forEach(([sx, sy, sz]) => {
    const padBracketGeo = new THREE.BoxGeometry(0.12, 0.08, 0.14);
    const padBracket = new THREE.Mesh(padBracketGeo, darkPlasticMat);
    padBracket.position.set(sx, sy + 0.03, sz);
    padBracket.castShadow = true;
    bottomFuselageGroup.add(padBracket);

    const rubberPadGeo = new THREE.CylinderGeometry(0.05, 0.055, 0.04, 16);
    const rubberPad = new THREE.Mesh(rubberPadGeo, tetherRubberMat);
    rubberPad.position.set(sx, sy - 0.02, sz);
    bottomFuselageGroup.add(rubberPad);
  });

  // Internal Avionics Core (PCB, RF modules & status LED for exploded view)
  const pcbGeo = new THREE.BoxGeometry(bodyWidth * 0.8, 0.03, bodyLength * 0.8);
  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x0f3b25,
    roughness: 0.4,
    metalness: 0.5,
  });
  const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
  pcbMesh.position.set(0, 0, 0);
  avionicsCoreGroup.add(pcbMesh);

  for (let i = -1; i <= 1; i += 2) {
    const shieldCanGeo = new THREE.BoxGeometry(0.25, 0.07, 0.5);
    const shieldCanMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.25,
      metalness: 0.85,
    });
    const shieldCan = new THREE.Mesh(shieldCanGeo, shieldCanMat);
    shieldCan.position.set(i * 0.28, 0.04, 0);
    avionicsCoreGroup.add(shieldCan);
  }

  // -------------------------------------------------------------
  // 2. BOTTOM-CONNECTED WIRE: Directly Connected at Bottom Centre
  // -------------------------------------------------------------
  // Bulkhead Mount Flange centered at (0, -0.24, 0) directly on the bottom center of the rectangular body
  const mountFlangeGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.08, 24);
  const mountFlange = new THREE.Mesh(mountFlangeGeo, darkPlasticMat);
  mountFlange.position.set(0, -0.24, 0);
  mountFlange.castShadow = true;
  tetherMountGroup.add(mountFlange);
  registerMesh(mountFlange, 'part_tether_assembly');

  // Fastener bolts holding the tether port directly into the central structural frame
  for (let i = 0; i < 4; i++) {
    const boltAngle = (i * Math.PI) / 2 + Math.PI / 4;
    const boltGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.04, 12);
    const bolt = new THREE.Mesh(boltGeo, hexScrewMat);
    bolt.position.set(
      Math.cos(boltAngle) * 0.22,
      -0.26,
      Math.sin(boltAngle) * 0.22
    );
    tetherMountGroup.add(bolt);
  }

  // High-voltage warning safety band
  const warnBandGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.04, 24);
  const warnBandMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Industrial Amber
    roughness: 0.35,
    metalness: 0.2,
  });
  const warnBand = new THREE.Mesh(warnBandGeo, warnBandMat);
  warnBand.position.set(0, -0.29, 0);
  tetherMountGroup.add(warnBand);

  // Knurled Metal Bayonet Locking Collar (Industrial Quick-Release Coupler)
  const collarGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.14, 24);
  const collarMesh = new THREE.Mesh(collarGeo, tetherCollarMat);
  collarMesh.position.set(0, -0.37, 0);
  collarMesh.castShadow = true;
  tetherMountGroup.add(collarMesh);
  registerMesh(collarMesh, 'part_tether_assembly');

  // Locking bayonet release pins
  for (let i = 0; i < 2; i++) {
    const pinGeo = new THREE.BoxGeometry(0.06, 0.05, 0.08);
    const pin = new THREE.Mesh(pinGeo, propNutMat);
    pin.position.set(Math.cos(i * Math.PI) * 0.20, -0.37, Math.sin(i * Math.PI) * 0.20);
    tetherMountGroup.add(pin);
  }

  // Flexible Multi-Tiered Rubber Strain-Relief Boot
  // Stepped fluted rubber ribs protruding vertically downward
  const bootSegments = 8;
  for (let r = 0; r < bootSegments; r++) {
    const fraction = r / bootSegments;
    const ringRadius = 0.16 - fraction * 0.085;
    const ringY = -0.45 - (r * 0.06);
    const ringGeo = new THREE.TorusGeometry(ringRadius, 0.02, 12, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, tetherRubberMat);
    ringMesh.position.set(0, ringY, 0);
    ringMesh.castShadow = true;
    tetherMountGroup.add(ringMesh);
  }

  // Core tapered boot sleeve
  const bootSleeveGeo = new THREE.CylinderGeometry(0.14, 0.075, 0.48, 24);
  const bootSleeve = new THREE.Mesh(bootSleeveGeo, tetherRubberMat);
  bootSleeve.position.set(0, -0.66, 0);
  bootSleeve.castShadow = true;
  tetherMountGroup.add(bootSleeve);
  registerMesh(bootSleeve, 'part_tether_assembly');

  // Cable Retention Clamp
  const clampGeo = new THREE.CylinderGeometry(0.08, 0.075, 0.08, 20);
  const clampMesh = new THREE.Mesh(clampGeo, tetherCollarMat);
  clampMesh.position.set(0, -0.92, 0);
  clampMesh.castShadow = true;
  tetherMountGroup.add(clampMesh);
  registerMesh(clampMesh, 'part_tether_assembly');

  // -------------------------------------------------------------
  // PHYSICAL TETHER CABLE (HANGING VERTICALLY DOWNWARD)
  // -------------------------------------------------------------
  // Originates directly from the bottom centre attachment at Y = -0.94
  const cableOriginY = -0.94;
  const cableGroundY = -4.5;
  const cableRadius = 0.048; // Thick realistic ~12.5mm industrial umbilical

  function generateCableCurve(hoverTime: number = 0, hoverMode: boolean = false): THREE.CatmullRomCurve3 {
    const swayAmp = hoverMode ? 0.16 : 0.04;
    const swayFreq = 1.5;

    // Natural catenary flexible curve extending vertically downward from bottom centre
    const p0 = new THREE.Vector3(0, cableOriginY, 0);
    const p1 = new THREE.Vector3(
      Math.sin(hoverTime * swayFreq) * (swayAmp * 0.3),
      cableOriginY - 0.75,
      Math.cos(hoverTime * swayFreq * 0.8) * (swayAmp * 0.25)
    );
    const p2 = new THREE.Vector3(
      Math.sin(hoverTime * swayFreq + 1.2) * swayAmp,
      cableOriginY - 1.7,
      Math.cos(hoverTime * swayFreq * 0.9 + 1.0) * (swayAmp * 0.9)
    );
    const p3 = new THREE.Vector3(
      Math.sin(hoverTime * swayFreq + 2.4) * (swayAmp * 0.8),
      cableOriginY - 2.6,
      Math.cos(hoverTime * swayFreq * 0.7 + 2.0) * (swayAmp * 0.7)
    );
    const p4 = new THREE.Vector3(
      Math.sin(hoverTime * swayFreq + 3.6) * (swayAmp * 0.35),
      cableGroundY + 0.45,
      Math.cos(hoverTime * swayFreq * 0.6 + 3.0) * (swayAmp * 0.3)
    );
    const p5 = new THREE.Vector3(0.04, cableGroundY, 0.04);

    return new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5]);
  }

  const initialCurve = generateCableCurve(0, false);
  const cableGeo = new THREE.TubeGeometry(initialCurve, 48, cableRadius, 16, false);
  const tetherCableMesh = new THREE.Mesh(cableGeo, tetherCableMat);
  tetherCableMesh.castShadow = true;
  tetherCableMesh.receiveShadow = true;
  rootGroup.add(tetherCableMesh);
  registerMesh(tetherCableMesh, 'part_tether_cable');

  // Ground Terminal Connector (where tether reaches ground generator)
  const termBaseGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.22, 20);
  const termBase = new THREE.Mesh(termBaseGeo, darkPlasticMat);
  termBase.position.set(0.04, cableGroundY + 0.11, 0.04);
  termBase.castShadow = true;
  groundTerminalGroup.add(termBase);
  registerMesh(termBase, 'part_ground_terminal');

  const termBootGeo = new THREE.ConeGeometry(0.14, 0.3, 16);
  termBootGeo.rotateX(Math.PI);
  const termBoot = new THREE.Mesh(termBootGeo, tetherRubberMat);
  termBoot.position.set(0.04, cableGroundY + 0.34, 0.04);
  groundTerminalGroup.add(termBoot);

  // -------------------------------------------------------------
  // 3. EXACTLY FOUR PROPELLERS (FOUR ARMS, FOUR MOTORS, FOUR 2-BLADE PROPS)
  // -------------------------------------------------------------
  // Standard X-quadcopter layout: four arms extending diagonally at 45°, 135°, 225°, 315°
  const armRadius = 0.06;
  const armLength = 1.65;
  const motorOffsetDist = 1.82;

  const armAngles = [
    Math.PI / 4,         // Front-Right (45°)
    (3 * Math.PI) / 4,   // Front-Left (135°)
    (5 * Math.PI) / 4,   // Rear-Left (225°)
    (7 * Math.PI) / 4,   // Rear-Right (315°)
  ];

  armAngles.forEach((angle, index) => {
    const isFront = index === 0 || index === 1;
    const isLeft = index === 1 || index === 2;

    const armHolder = new THREE.Group();
    armHolder.rotation.y = angle;

    // Structural Aluminum Clamping Block at Body Corner
    const cornerClampGeo = new THREE.BoxGeometry(0.24, 0.16, 0.18);
    const cornerClamp = new THREE.Mesh(cornerClampGeo, darkPlasticMat);
    cornerClamp.position.set(0.68, 0, 0);
    cornerClamp.castShadow = true;
    armHolder.add(cornerClamp);

    // Carbon Tube Arm
    const armGeo = new THREE.CylinderGeometry(armRadius * 0.95, armRadius, armLength, 16);
    armGeo.rotateZ(Math.PI / 2);
    const armMesh = new THREE.Mesh(armGeo, carbonFiberMat);
    armMesh.position.set(armLength / 2 + 0.55, 0, 0);
    armMesh.castShadow = true;
    armHolder.add(armMesh);
    registerMesh(armMesh, 'part_arms');

    // Motor Mount Plate at Arm Tip
    const mountPlateGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 20);
    const mountPlate = new THREE.Mesh(mountPlateGeo, darkPlasticMat);
    mountPlate.position.set(motorOffsetDist, 0.02, 0);
    mountPlate.castShadow = true;
    armHolder.add(mountPlate);

    // Navigation LED on Arm Tip
    const ledColor = isFront 
      ? (isLeft ? 0xef4444 : 0x22c55e)
      : (isLeft ? 0xf59e0b : 0xffffff);
    
    const ledGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(motorOffsetDist + 0.20, 0.02, 0);
    armHolder.add(ledMesh);

    const navLight = new THREE.PointLight(ledColor, 0.8, 1.5);
    navLight.position.set(motorOffsetDist + 0.22, 0.02, 0);
    armHolder.add(navLight);
    navLeds.push(navLight);

    armsGroup.add(armHolder);

    // -------------------------------------------------------------
    // Brushless Motors (Exactly 4 motors, one at each arm tip)
    // -------------------------------------------------------------
    const mx = Math.cos(angle) * motorOffsetDist;
    const mz = -Math.sin(angle) * motorOffsetDist;

    const motorHolder = new THREE.Group();
    motorHolder.position.set(mx, 0, mz);

    // Motor stator base with perimeter cooling vents
    const statorBaseGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.08, 24);
    const statorBase = new THREE.Mesh(statorBaseGeo, motorBaseMat);
    statorBase.position.set(0, 0.07, 0);
    motorHolder.add(statorBase);
    registerMesh(statorBase, 'part_motors');

    // Visible copper stator coils
    for (let c = 0; c < 8; c++) {
      const coilAngle = (c * Math.PI) / 4;
      const coilGeo = new THREE.BoxGeometry(0.04, 0.08, 0.05);
      const coil = new THREE.Mesh(coilGeo, copperCoilMat);
      coil.position.set(Math.cos(coilAngle) * 0.12, 0.12, Math.sin(coilAngle) * 0.12);
      motorHolder.add(coil);
    }

    // Rotating Rotor Bell (Anodized housing with brushed top)
    const rotorBellGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.13, 24);
    const rotorBell = new THREE.Mesh(rotorBellGeo, motorBellMat);
    rotorBell.position.set(0, 0.16, 0);
    rotorBell.castShadow = true;
    motorHolder.add(rotorBell);
    registerMesh(rotorBell, 'part_motors');

    // Threaded prop adapter shaft
    const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.13, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, motorBaseMat);
    shaftMesh.position.set(0, 0.26, 0);
    motorHolder.add(shaftMesh);

    motorsGroup.add(motorHolder);

    // -------------------------------------------------------------
    // Propellers (Exactly 4 two-blade propellers, one per motor)
    // -------------------------------------------------------------
    const propHolder = new THREE.Group();
    propHolder.position.set(mx, 0.28, mz);

    // Central prop hub
    const hubGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.06, 18);
    const hubMesh = new THREE.Mesh(hubGeo, propBlackMat);
    propHolder.add(hubMesh);

    // Center lock nut
    const nutGeo = new THREE.ConeGeometry(0.055, 0.07, 16);
    const nutMesh = new THREE.Mesh(nutGeo, propNutMat);
    nutMesh.position.set(0, 0.045, 0);
    propHolder.add(nutMesh);

    // Two-blade configuration (realistic airfoil taper and authentic pitch twist)
    const isClockwise = (index % 2 === 0);
    const bladeLength = 0.96; // 13-inch scale

    for (let b = 0; b < 2; b++) {
      const bladeAngle = b * Math.PI;
      const bladeArm = new THREE.Group();
      bladeArm.rotation.y = bladeAngle;

      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, -0.045);
      bladeShape.quadraticCurveTo(bladeLength * 0.35, -0.085, bladeLength * 0.85, -0.04);
      bladeShape.quadraticCurveTo(bladeLength, 0, bladeLength * 0.85, 0.04);
      bladeShape.quadraticCurveTo(bladeLength * 0.35, 0.07, 0, 0.045);
      bladeShape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: 0.014,
        bevelEnabled: true,
        bevelThickness: 0.007,
        bevelSize: 0.007,
        bevelSegments: 3,
      };

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
      bladeGeo.rotateX(-Math.PI / 2);
      bladeGeo.rotateZ(isClockwise ? -0.14 : 0.14);

      const bladeMesh = new THREE.Mesh(bladeGeo, propBlackMat);
      bladeMesh.position.set(0.055, 0.01, 0);
      bladeMesh.castShadow = true;
      bladeArm.add(bladeMesh);
      registerMesh(bladeMesh, 'part_props');

      propHolder.add(bladeArm);
    }

    propHolder.userData.isClockwise = isClockwise;
    propellersGroup.add(propHolder);
    propellerBlades.push(propHolder);
  });

  // -------------------------------------------------------------
  // 4. FRONT GIMBAL CAMERA (Cleanly integrated in front recess)
  // -------------------------------------------------------------
  const gimbalRoot = new THREE.Group();
  gimbalRoot.position.set(0, -0.08, bodyLength / 2 + 0.12);

  const gimbalBracketGeo = new THREE.BoxGeometry(0.18, 0.12, 0.14);
  const gimbalBracket = new THREE.Mesh(gimbalBracketGeo, darkPlasticMat);
  gimbalRoot.add(gimbalBracket);

  const rollArmGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.20, 16);
  rollArmGeo.rotateZ(Math.PI / 2);
  const rollArm = new THREE.Mesh(rollArmGeo, darkPlasticMat);
  rollArm.position.set(0, -0.07, 0.03);
  gimbalRoot.add(rollArm);

  const podGeo = new THREE.SphereGeometry(0.14, 24, 20);
  podGeo.scale(1.0, 0.9, 1.2);
  const podMesh = new THREE.Mesh(podGeo, darkPlasticMat);
  podMesh.position.set(0, -0.16, 0.10);
  podMesh.castShadow = true;
  gimbalRoot.add(podMesh);
  registerMesh(podMesh, 'part_camera');

  // 4K Lens Barrel & Optical Glass
  const lensBarrelGeo = new THREE.CylinderGeometry(0.065, 0.07, 0.08, 20);
  lensBarrelGeo.rotateX(Math.PI / 2);
  const lensBarrel = new THREE.Mesh(lensBarrelGeo, tetherCollarMat);
  lensBarrel.position.set(-0.045, -0.16, 0.24);
  gimbalRoot.add(lensBarrel);

  const lensGlassGeo = new THREE.SphereGeometry(0.06, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  lensGlassGeo.rotateX(-Math.PI / 2);
  const lensGlass = new THREE.Mesh(lensGlassGeo, opticalLensMat);
  lensGlass.position.set(-0.045, -0.16, 0.28);
  gimbalRoot.add(lensGlass);
  registerMesh(lensGlass, 'part_camera');

  // FLIR Thermal Core Barrel
  const thermalBarrelGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.06, 18);
  thermalBarrelGeo.rotateX(Math.PI / 2);
  const thermalBarrel = new THREE.Mesh(thermalBarrelGeo, propNutMat);
  thermalBarrel.position.set(0.05, -0.16, 0.22);
  gimbalRoot.add(thermalBarrel);

  cameraGroup.add(gimbalRoot);

  // -------------------------------------------------------------
  // Animation & Dynamic Callbacks
  // -------------------------------------------------------------
  function updateExploded(progress: number) {
    topShellGroup.position.y = progress * 1.5;
    avionicsCoreGroup.position.y = progress * 0.65;
    bottomFuselageGroup.position.y = -progress * 0.85;
    tetherMountGroup.position.y = -progress * 1.2;
    cameraGroup.position.z = bodyLength / 2 + 0.12 + progress * 0.8;

    armsGroup.children.forEach((child) => {
      child.position.x = Math.cos(child.rotation.y) * (progress * 0.55);
      child.position.z = -Math.sin(child.rotation.y) * (progress * 0.55);
    });

    motorsGroup.children.forEach((child, i) => {
      const angle = armAngles[i];
      child.position.x = Math.cos(angle) * (motorOffsetDist + progress * 0.55);
      child.position.z = -Math.sin(angle) * (motorOffsetDist + progress * 0.55);
      child.position.y = progress * 0.25;
    });

    propellersGroup.children.forEach((child, i) => {
      const angle = armAngles[i];
      child.position.x = Math.cos(angle) * (motorOffsetDist + progress * 0.55);
      child.position.z = -Math.sin(angle) * (motorOffsetDist + progress * 0.55);
      child.position.y = 0.28 + progress * 0.7;
    });
  }

  function updateCable(hoverTime: number, hoverMode: boolean) {
    const newCurve = generateCableCurve(hoverTime, hoverMode);
    const newGeo = new THREE.TubeGeometry(newCurve, 48, cableRadius, 16, false);
    
    tetherCableMesh.geometry.dispose();
    tetherCableMesh.geometry = newGeo;
  }

  function updatePropellers(delta: number, spinning: boolean) {
    if (!spinning) return;
    const speed = 28.0; // rad/sec
    propellerBlades.forEach((prop) => {
      const dir = prop.userData.isClockwise ? -1 : 1;
      prop.rotation.y += speed * delta * dir;
    });
  }

  return {
    rootGroup,
    droneBodyGroup,
    topShellGroup,
    bottomFuselageGroup,
    avionicsCoreGroup,
    armsGroup,
    motorsGroup,
    propellersGroup,
    cameraGroup,
    antennaGroup,
    tetherMountGroup,
    tetherCableMesh,
    groundTerminalGroup,
    propellerBlades,
    navLeds,
    inspectableMeshes,
    updateExploded,
    updateCable,
    updatePropellers,
  };
}
