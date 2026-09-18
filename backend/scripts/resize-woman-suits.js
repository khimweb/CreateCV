/**
 * Resize woman suit images to 707x1024 canvas (match man suits)
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SUIT_DIR = path.resolve(__dirname, '..', 'assets', 'edit-image', 'suits', 'woman');
const W = 707, H = 1024;

async function resize(filename) {
  const inputPath = path.join(SUIT_DIR, filename);
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} (not found)`);
    return;
  }
  
  const buf = await sharp(inputPath)
    .resize(W, H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  
  fs.writeFileSync(inputPath, buf);
  console.log(`✅ Resized ${filename} → ${W}x${H} (${Math.round(buf.length / 1024)}KB)`);
}

async function main() {
  console.log('=== Resizing Woman Suits to 707x1024 ===');
  for (let i = 1; i <= 5; i++) {
    await resize(`woman-suit-${i}.png`);
    await resize(`woman-suit-${i}-transparent.png`);
  }
  console.log('\nDone!');
}

main().catch(console.error);
