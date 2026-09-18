/**
 * Generate transparent suit overlays for woman suits.
 * Strategy: Remove solid-color backgrounds (white, blue, grey) using 
 * color-distance threshold, keep the suit/outfit pixels.
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SUIT_DIR = path.resolve(__dirname, '..', 'assets', 'edit-image', 'suits', 'woman');

// Background color detection threshold (Euclidean distance in RGB space)
const BG_THRESHOLD = 55;

/**
 * Detect the most likely background color from image corners/edges
 */
function detectBgColor(data, width, height) {
  // Sample corners and edges
  const samples = [];
  const positions = [
    0, // top-left
    (width - 1) * 4, // top-right
    (height - 1) * width * 4, // bottom-left
    ((height - 1) * width + width - 1) * 4, // bottom-right
    // top edge middle
    Math.floor(width / 2) * 4,
    // left edge middle
    Math.floor(height / 2) * width * 4,
    // right edge middle
    (Math.floor(height / 2) * width + width - 1) * 4,
  ];

  for (const pos of positions) {
    if (pos + 2 < data.length) {
      samples.push({ r: data[pos], g: data[pos + 1], b: data[pos + 2] });
    }
  }

  // Average the samples
  const avg = samples.reduce(
    (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
    { r: 0, g: 0, b: 0 }
  );
  return {
    r: Math.round(avg.r / samples.length),
    g: Math.round(avg.g / samples.length),
    b: Math.round(avg.b / samples.length),
  };
}

/**
 * Color distance in RGB space
 */
function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt(
    (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
  );
}

async function processWomanSuit(inputPath, outputPath, suitIndex) {
  console.log(`\nProcessing woman-suit-${suitIndex}...`);
  
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Uint8Array(data);

  // Detect background color
  const bgColor = detectBgColor(pixels, width, height);
  console.log(`  Detected BG color: rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`);

  // Make background pixels transparent
  let transparentCount = 0;
  let keptCount = 0;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const dist = colorDist(r, g, b, bgColor.r, bgColor.g, bgColor.b);
    
    if (dist < BG_THRESHOLD) {
      // Background pixel -> make transparent
      pixels[i + 3] = 0;
      transparentCount++;
    } else {
      keptCount++;
      // Keep alpha as-is (opaque)
    }
  }

  console.log(`  Removed: ${transparentCount} bg pixels | Kept: ${keptCount} suit pixels`);

  // Convert back to PNG
  const result = await sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  fs.writeFileSync(outputPath, result);
  console.log(`  ✅ Saved: ${path.basename(outputPath)} (${Math.round(result.length / 1024)}KB)`);
  
  return { transparentCount, keptCount };
}

async function main() {
  console.log('=== Generating Woman Suit Transparent Overlays ===');
  
  for (let i = 1; i <= 5; i++) {
    const inputPath = path.join(SUIT_DIR, `woman-suit-${i}.png`);
    const outputPath = path.join(SUIT_DIR, `woman-suit-${i}-transparent.png`);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping woman-suit-${i} (file not found)`);
      continue;
    }
    
    try {
      await processWomanSuit(inputPath, outputPath, i);
    } catch (err) {
      console.error(`❌ Error processing suit ${i}:`, err.message);
    }
  }
  
  console.log('\n=== Done! All woman suit transparents generated ===');
}

main().catch(console.error);
