import * as THREE from 'three';

/**
 * Creates a procedural carbon-fiber twill weave texture.
 */
export function createCarbonFiberTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#181818';
  ctx.fillRect(0, 0, size, size);

  const cellSize = 16;
  for (let y = 0; y < size; y += cellSize) {
    for (let x = 0; x < size; x += cellSize) {
      const isShifted = Math.floor((x + y) / cellSize) % 2 === 0;
      
      const grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
      if (isShifted) {
        grad.addColorStop(0, '#2b2b2b');
        grad.addColorStop(0.5, '#121212');
        grad.addColorStop(1, '#252525');
      } else {
        grad.addColorStop(0, '#101010');
        grad.addColorStop(0.5, '#282828');
        grad.addColorStop(1, '#0e0e0e');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, cellSize, cellSize);

      // Fine micro fibers
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let i = 2; i < cellSize; i += 4) {
        ctx.beginPath();
        if (isShifted) {
          ctx.moveTo(x + i, y);
          ctx.lineTo(x, y + i);
        } else {
          ctx.moveTo(x + cellSize - i, y);
          ctx.lineTo(x + cellSize, y + i);
        }
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates the "RescueMesh AI" fuselage top logo and technical markings texture.
 */
export function createRescueMeshLogoTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Smooth white/light grey base matching main body
  ctx.fillStyle = '#f4f5f7';
  ctx.fillRect(0, 0, width, height);

  // Subtle aerodynamic panel line seams
  ctx.strokeStyle = '#d0d4dc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(40, 40, width - 80, height - 80, 24);
  ctx.stroke();

  // Cooling vent louvers (painted visual relief)
  ctx.fillStyle = '#22252a';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(80 + i * 28, 80, 16, 50);
    ctx.fillRect(width - 240 + i * 28, 80, 16, 50);
  }

  // RescueMesh AI Emblem & Typography
  const centerX = width / 2;
  const centerY = height / 2 + 10;

  // Hexagonal Mesh Symbol
  ctx.save();
  ctx.translate(centerX, centerY - 60);

  // Hexagon outer ring
  ctx.strokeStyle = '#0284c7'; // vibrant rescue blue
  ctx.lineWidth = 8;
  ctx.beginPath();
  const hexRadius = 42;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const hx = Math.cos(angle) * hexRadius;
    const hy = Math.sin(angle) * hexRadius;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.stroke();

  // Central mesh nodes (tri-cluster communication relay icon)
  ctx.fillStyle = '#0ea5e9';
  const nodeDist = 20;
  const nodeRadius = 6;
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
    const nx = Math.cos(angle) * nodeDist;
    const ny = Math.sin(angle) * nodeDist;
    
    // Connect lines
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(nx, ny, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#0284c7';
  ctx.fill();

  ctx.restore();

  // Typography: RescueMesh AI
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.font = '900 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#0f172a'; // Deep slate
  ctx.fillText('RescueMesh', centerX - 25, centerY + 20);

  ctx.fillStyle = '#0284c7'; // Blue highlight
  ctx.fillText('AI', centerX + 155, centerY + 20);

  // Subtitle / Specs stencil
  ctx.font = '600 16px "SF Mono", Menlo, Consolas, monospace';
  ctx.fillStyle = '#64748b';
  ctx.letterSpacing = '3px';
  ctx.fillText('CONTINUOUS EMERGENCY RELAY • TETHER POWERED • RM-400T', centerX, centerY + 70);

  // Safety / Port notice
  ctx.font = '700 13px "SF Mono", monospace';
  ctx.fillStyle = '#d97706'; // Safety amber
  ctx.fillText('▼ DISASTER RELIEF AIRBORNE COMMS HUB ▼', centerX, centerY + 115);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates knurled metal normal/bump map for the tether locking collar.
 */
export function createKnurledMetalTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const step = 8;
  ctx.lineWidth = 2;

  // Diamond knurling
  for (let i = -size; i < size * 2; i += step) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();

    ctx.strokeStyle = '#202020';
    ctx.beginPath();
    ctx.moveTo(i + step / 2, 0);
    ctx.lineTo(i + size + step / 2, size);
    ctx.stroke();

    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(i + size, 0);
    ctx.lineTo(i, size);
    ctx.stroke();

    ctx.strokeStyle = '#202020';
    ctx.beginPath();
    ctx.moveTo(i + size + step / 2, 0);
    ctx.lineTo(i + step / 2, size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 2);
  return texture;
}

/**
 * Creates a braided protective sheath texture for the tether cable.
 */
export function createBraidedCableTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#18191c';
  ctx.fillRect(0, 0, size, size);

  // Braided spiral pattern
  const rows = 16;
  const rowHeight = size / rows;
  for (let r = 0; r < rows; r++) {
    const isEven = r % 2 === 0;
    const grad = ctx.createLinearGradient(0, r * rowHeight, size, (r + 1) * rowHeight);
    if (isEven) {
      grad.addColorStop(0, '#222327');
      grad.addColorStop(0.5, '#353740');
      grad.addColorStop(1, '#1a1b1e');
    } else {
      grad.addColorStop(0, '#16171a');
      grad.addColorStop(0.5, '#282930');
      grad.addColorStop(1, '#141517');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, r * rowHeight, size, rowHeight);

    // subtle longitudinal spiral ribbing
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(0, r * rowHeight + rowHeight * 0.5);
    ctx.lineTo(size, r * rowHeight + rowHeight * 0.5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 24);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a circular brushed metal texture for brushless motor top bells.
 */
export function createBrushedMotorTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = '#2a2d33';
  ctx.fillRect(0, 0, size, size);

  // Concentric radial brushed circles
  for (let r = 10; r < cx; r += 2) {
    const brightness = 35 + Math.sin(r * 1.5) * 12 + (Math.random() * 8);
    ctx.strokeStyle = `rgb(${brightness}, ${brightness + 2}, ${brightness + 5})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Laser etched markings
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, cx - 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RM-3510 • 780KV', cx, cy - 35);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
