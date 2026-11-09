import * as THREE from 'three';

// Cache generated textures so canvas isn't re-rendered on every frame
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates high-detail procedural planetary textures using HTML5 Canvas
 */
export function createPlanetTexture(type: 'moon' | 'mars'): THREE.CanvasTexture {
  const cacheKey = `planet_${type}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  if (type === 'moon') {
    // 1. Base lunar anorthosite highland color
    ctx.fillStyle = '#9aa0a6';
    ctx.fillRect(0, 0, width, height);

    // 2. Add fine high-frequency noise & grain
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Draw lunar maria (darker basalt plains e.g. Tranquillitatis, Imbrium, Procellarum)
    const maria = [
      { x: width * 0.35, y: height * 0.40, rx: width * 0.12, ry: height * 0.16, opacity: 0.55 },
      { x: width * 0.22, y: height * 0.38, rx: width * 0.15, ry: height * 0.22, opacity: 0.60 },
      { x: width * 0.48, y: height * 0.35, rx: width * 0.08, ry: height * 0.10, opacity: 0.50 },
      { x: width * 0.55, y: height * 0.50, rx: width * 0.09, ry: height * 0.12, opacity: 0.52 },
      { x: width * 0.30, y: height * 0.62, rx: width * 0.07, ry: height * 0.09, opacity: 0.45 },
      { x: width * 0.78, y: height * 0.45, rx: width * 0.05, ry: height * 0.07, opacity: 0.35 }
    ];

    maria.forEach(m => {
      ctx.save();
      const grad = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.rx);
      grad.addColorStop(0, `rgba(45, 50, 58, ${m.opacity})`);
      grad.addColorStop(0.7, `rgba(60, 66, 75, ${m.opacity * 0.7})`);
      grad.addColorStop(1, 'rgba(120, 125, 135, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. Draw impact craters with bright ejecta rays
    for (let c = 0; c < 160; c++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const cr = 3 + Math.random() * 22;

      // Dark crater floor
      ctx.fillStyle = 'rgba(35, 38, 44, 0.65)';
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();

      // Bright sunlit rim
      ctx.strokeStyle = 'rgba(235, 240, 250, 0.75)';
      ctx.lineWidth = Math.max(1, cr * 0.22);
      ctx.beginPath();
      ctx.arc(cx - cr * 0.15, cy - cr * 0.15, cr * 0.9, Math.PI * 0.8, Math.PI * 1.9);
      ctx.stroke();

      // Deep shadow rim
      ctx.strokeStyle = 'rgba(15, 17, 22, 0.85)';
      ctx.beginPath();
      ctx.arc(cx + cr * 0.15, cy + cr * 0.15, cr * 0.9, Math.PI * 1.9, Math.PI * 0.8);
      ctx.stroke();

      // Prominent ray systems for a few large craters (e.g. Tycho / Copernicus)
      if (cr > 16) {
        ctx.strokeStyle = 'rgba(240, 245, 255, 0.25)';
        ctx.lineWidth = 1.5;
        for (let ray = 0; ray < 10; ray++) {
          const angle = (ray / 10) * Math.PI * 2 + Math.random() * 0.2;
          const rayLen = cr * (3 + Math.random() * 6);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
          ctx.stroke();
        }
      }
    }
  } else {
    // MARS: Rich iron-oxide red with dunes, canyon rifts, and polar caps
    // 1. Base Martian reddish-orange gradient
    const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
    baseGrad.addColorStop(0, '#e5d7c8'); // North polar ice fringe
    baseGrad.addColorStop(0.12, '#c1613b'); // Northern lowlands (Vastitas Borealis)
    baseGrad.addColorStop(0.45, '#b04928'); // Equatorial rust deserts
    baseGrad.addColorStop(0.75, '#85351a'); // Southern cratered highlands
    baseGrad.addColorStop(0.92, '#9c4524');
    baseGrad.addColorStop(1, '#ffffff'); // South polar ice cap
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. High-frequency terrain dust noise
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 32;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.7));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.5));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Albedo features (Dark volcanic basalt sands e.g. Syrtis Major, Acidalia Planitia)
    const darkRegions = [
      { x: width * 0.65, y: height * 0.45, rx: width * 0.12, ry: height * 0.18, opacity: 0.62 }, // Syrtis Major
      { x: width * 0.28, y: height * 0.38, rx: width * 0.10, ry: height * 0.14, opacity: 0.50 }, // Acidalia
      { x: width * 0.45, y: height * 0.60, rx: width * 0.15, ry: height * 0.12, opacity: 0.55 }, // Mare Erythraeum
      { x: width * 0.85, y: height * 0.55, rx: width * 0.10, ry: height * 0.14, opacity: 0.48 }, // Tyrrhena Terra
    ];

    darkRegions.forEach(d => {
      const grad = ctx.createRadialGradient(d.x, d.y, 10, d.x, d.y, d.rx);
      grad.addColorStop(0, `rgba(50, 24, 18, ${d.opacity})`);
      grad.addColorStop(0.7, `rgba(85, 38, 25, ${d.opacity * 0.7})`);
      grad.addColorStop(1, 'rgba(150, 70, 45, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.rx, d.ry, 0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Valles Marineris (Colossal canyon chasm)
    ctx.strokeStyle = 'rgba(40, 18, 12, 0.75)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(width * 0.22, height * 0.52);
    ctx.bezierCurveTo(
      width * 0.30, height * 0.50,
      width * 0.38, height * 0.55,
      width * 0.48, height * 0.53
    );
    ctx.stroke();

    // 5. Olympus Mons and Tharsis Montes shield volcanoes
    const volcanoes = [
      { x: width * 0.16, y: height * 0.40, r: 24, label: 'Olympus Mons' },
      { x: width * 0.24, y: height * 0.45, r: 14, label: 'Ascraeus Mons' },
      { x: width * 0.22, y: height * 0.52, r: 14, label: 'Pavonis Mons' },
      { x: width * 0.20, y: height * 0.60, r: 14, label: 'Arsia Mons' }
    ];

    volcanoes.forEach(v => {
      const vGrad = ctx.createRadialGradient(v.x, v.y, 2, v.x, v.y, v.r);
      vGrad.addColorStop(0, 'rgba(65, 30, 20, 0.9)');
      vGrad.addColorStop(0.4, 'rgba(180, 85, 50, 0.8)');
      vGrad.addColorStop(1, 'rgba(140, 60, 35, 0)');
      ctx.fillStyle = vGrad;
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.fill();

      // Caldera crater peak
      ctx.fillStyle = 'rgba(25, 10, 8, 0.95)';
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Brilliant North & South Polar Ice Caps (CO2 dry ice & water ice)
    // North pole
    const nCapGrad = ctx.createRadialGradient(width * 0.5, 0, 0, width * 0.5, 0, height * 0.16);
    nCapGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    nCapGrad.addColorStop(0.6, 'rgba(235, 245, 255, 0.85)');
    nCapGrad.addColorStop(1, 'rgba(210, 160, 130, 0)');
    ctx.fillStyle = nCapGrad;
    ctx.fillRect(0, 0, width, height * 0.16);

    // South pole
    const sCapGrad = ctx.createRadialGradient(width * 0.5, height, 0, width * 0.5, height, height * 0.14);
    sCapGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    sCapGrad.addColorStop(0.6, 'rgba(235, 245, 255, 0.85)');
    sCapGrad.addColorStop(1, 'rgba(200, 140, 110, 0)');
    ctx.fillStyle = sCapGrad;
    ctx.fillRect(0, height * 0.86, width, height * 0.14);

    // 7. Martian impact craters
    for (let c = 0; c < 90; c++) {
      const cx = Math.random() * width;
      const cy = height * 0.2 + Math.random() * (height * 0.65);
      const cr = 2 + Math.random() * 16;

      ctx.fillStyle = 'rgba(50, 20, 15, 0.55)';
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(230, 160, 130, 0.6)';
      ctx.lineWidth = Math.max(1, cr * 0.2);
      ctx.beginPath();
      ctx.arc(cx - cr * 0.15, cy - cr * 0.15, cr * 0.9, Math.PI * 0.7, Math.PI * 1.8);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  textureCache.set(cacheKey, texture);

  return texture;
}

/**
 * Creates normal/bump map for surface relief
 */
export function createPlanetBumpMap(type: 'moon' | 'mars'): THREE.CanvasTexture {
  const cacheKey = `bump_${type}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Neutral grey baseline (height 0)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  const numCraters = type === 'moon' ? 140 : 80;
  for (let i = 0; i < numCraters; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const cr = 3 + Math.random() * 20;

    // Dark crater bowl (depression)
    ctx.fillStyle = '#303030';
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();

    // Bright rim (elevation)
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = Math.max(1, cr * 0.3);
    ctx.beginPath();
    ctx.arc(cx, cy, cr * 0.95, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(cacheKey, texture);

  return texture;
}

/**
 * Creates procedural terrain floor for the 3D Outpost Construction grid
 */
export function createOutpostTerrainTexture(destination: 'moon' | 'mars'): THREE.CanvasTexture {
  const cacheKey = `terrain_${destination}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base regolith tint
  if (destination === 'moon') {
    ctx.fillStyle = '#3a3f47';
  } else {
    ctx.fillStyle = '#78351c';
  }
  ctx.fillRect(0, 0, size, size);

  // Surface texture noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 38;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * (destination === 'moon' ? 1 : 0.7)));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * (destination === 'moon' ? 1 : 0.5)));
  }
  ctx.putImageData(imgData, 0, 0);

  // Surface rocks and pebbles
  for (let p = 0; p < 350; p++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const pr = 1 + Math.random() * 5;

    ctx.fillStyle = destination === 'moon' ? 'rgba(90, 95, 105, 0.8)' : 'rgba(160, 80, 50, 0.8)';
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(10, 10, 15, 0.7)';
    ctx.beginPath();
    ctx.arc(px + 1, py + 1, pr * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set(cacheKey, texture);

  return texture;
}
