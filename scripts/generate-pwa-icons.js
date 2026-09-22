import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // Raw uncompressed RGBA pixel data
  const rowSize = width * 4;
  const rawBuffer = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawBuffer[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawBuffer[pixelOffset] = r;
      rawBuffer[pixelOffset + 1] = g;
      rawBuffer[pixelOffset + 2] = b;
      rawBuffer[pixelOffset + 3] = a;
    }
  }

  // Deflate compressed IDAT chunk
  const compressed = zlib.deflateSync(rawBuffer);

  // CRC32 calculation
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);

    return Buffer.concat([len, typeAndData, crc]);
  }

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function renderPwaIcon(x, y, w, h, isMaskable = false) {
  // Normalize coords [0..1]
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background deep slate navy (#0f172a to #1e293b)
  let r = Math.round(15 + ny * 25);
  let g = Math.round(23 + ny * 35);
  let b = Math.round(42 + ny * 45);
  let a = 255;

  // Maskable: fill whole square canvas. Non-maskable: rounded rect
  if (!isMaskable) {
    const rx = Math.abs(dx);
    const ry = Math.abs(dy);
    const cornerR = 0.22;
    if (rx > 0.5 - cornerR && ry > 0.5 - cornerR) {
      const cdx = rx - (0.5 - cornerR);
      const cdy = ry - (0.5 - cornerR);
      if (Math.sqrt(cdx * cdx + cdy * cdy) > cornerR) {
        return [0, 0, 0, 0];
      }
    }
  }

  // Top Tricolor stripe
  if (ny > 0.12 && ny < 0.14 && nx > 0.25 && nx < 0.75) {
    return [255, 153, 51, 255]; // Saffron
  }
  if (ny >= 0.14 && ny < 0.16 && nx > 0.32 && nx < 0.68) {
    return [255, 255, 255, 255]; // White
  }
  if (ny >= 0.16 && ny < 0.18 && nx > 0.38 && nx < 0.62) {
    return [19, 136, 8, 255]; // India Green
  }

  // Scanner Frame
  const frameMinX = 0.22;
  const frameMaxX = 0.78;
  const frameMinY = 0.24;
  const frameMaxY = 0.76;
  const borderThickness = 0.025;

  const isBorderX = (nx >= frameMinX && nx <= frameMinX + borderThickness) || (nx <= frameMaxX && nx >= frameMaxX - borderThickness);
  const isBorderY = (ny >= frameMinY && ny <= frameMinY + borderThickness) || (ny <= frameMaxY && ny >= frameMaxY - borderThickness);

  // Corner highlights (Gold #f59e0b)
  if ((isBorderX && (ny < frameMinY + 0.15 || ny > frameMaxY - 0.15)) ||
      (isBorderY && (nx < frameMinX + 0.15 || nx > frameMaxX - 0.15))) {
    if (nx >= frameMinX && nx <= frameMaxX && ny >= frameMinY && ny <= frameMaxY) {
      return [245, 158, 11, 255];
    }
  }

  // Center Scales / Beam (Gold)
  if (Math.abs(nx - 0.5) < 0.015 && ny >= 0.36 && ny <= 0.62) {
    return [251, 191, 36, 255]; // Vertical post
  }
  if (Math.abs(ny - 0.40) < 0.012 && nx >= 0.35 && nx <= 0.65) {
    return [251, 191, 36, 255]; // Balance crossbar
  }
  // Left pan
  if (Math.abs(nx - 0.38) < 0.04 && Math.abs(ny - 0.50) < 0.01) {
    return [217, 119, 6, 255];
  }
  // Right pan
  if (Math.abs(nx - 0.62) < 0.04 && Math.abs(ny - 0.50) < 0.01) {
    return [217, 119, 6, 255];
  }

  // Cyan Laser Line in center
  if (Math.abs(ny - 0.50) < 0.008 && nx >= 0.25 && nx <= 0.75) {
    return [56, 189, 248, 230];
  }

  // Emerald verification badge at bottom right
  const badgeDx = nx - 0.68;
  const badgeDy = ny - 0.68;
  const badgeDist = Math.sqrt(badgeDx * badgeDx + badgeDy * badgeDy);
  if (badgeDist < 0.08) {
    if (badgeDist > 0.07) {
      return [52, 211, 153, 255]; // Badge border
    }
    return [5, 150, 105, 255]; // Badge fill
  }

  return [r, g, b, a];
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate Icons
console.log('Generating PWA Icons...');
const icon192 = createPNG(192, 192, (x, y, w, h) => renderPwaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);

const icon512 = createPNG(512, 512, (x, y, w, h) => renderPwaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);

const iconMaskable = createPNG(512, 512, (x, y, w, h) => renderPwaIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);

const appleTouchIcon = createPNG(180, 180, (x, y, w, h) => renderPwaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);

console.log('Successfully generated all PWA PNG icons in /public!');
