const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SAMPLE_AFTER_PATH = path.resolve(__dirname, '..', 'assets', 'edit-image', 'sample-after.png');
const SAMPLE_BEFORE_PATH = path.resolve(__dirname, '..', 'assets', 'edit-image', 'sample-before.png');

const OUTFIT_MAP = {
  'man-suit-1': {
    id: 'man-suit-1',
    category: 'man',
    name: 'Black Suit & Black Dotted Tie',
    nameKh: 'អាវធំពណ៌ខ្មៅ & ក្រវ៉ាត់កអុច',
    badge: 'Classic Black',
    thumbnail: 'assets/edit-image/suits/man/man-suit-1.png',
    transparent: 'assets/edit-image/suits/man/man-suit-1-transparent.png',
    prompt: 'sharp black formal business suit jacket, tailored white dress shirt, black necktie with fine subtle white micro-dots',
  },
  'man-suit-2': {
    id: 'man-suit-2',
    category: 'man',
    name: 'Black Suit & Silver Silk Tie',
    nameKh: 'អាវធំពណ៌ខ្មៅ & ក្រវ៉ាត់កពណ៌ប្រាក់',
    badge: 'Executive',
    thumbnail: 'assets/edit-image/suits/man/man-suit-2.png',
    transparent: 'assets/edit-image/suits/man/man-suit-2-transparent.png',
    prompt: 'tailored black business suit jacket, crisp white collared dress shirt, lustrous smooth silver grey silk necktie',
  },
  'man-suit-3': {
    id: 'man-suit-3',
    category: 'man',
    name: 'Black Suit & Yellow-Navy Striped Tie',
    nameKh: 'អាវធំពណ៌ខ្មៅ & ក្រវ៉ាត់កឆ្នូតលឿងខៀវ',
    badge: 'Gold Stripe',
    thumbnail: 'assets/edit-image/suits/man/man-suit-3.png',
    transparent: 'assets/edit-image/suits/man/man-suit-3-transparent.png',
    prompt: 'formal black business suit jacket, white dress shirt, diagonal golden yellow and navy blue striped silk necktie',
  },
  'man-suit-4': {
    id: 'man-suit-4',
    category: 'man',
    name: 'Navy Suit & Blue-White Striped Tie',
    nameKh: 'អាវធំពណ៌ខៀវ & ក្រវ៉ាត់កឆ្នូតសខៀវ',
    badge: 'Modern Stripe',
    thumbnail: 'assets/edit-image/suits/man/man-suit-4.png',
    transparent: 'assets/edit-image/suits/man/man-suit-4-transparent.png',
    prompt: 'tailored deep navy blue suit jacket, crisp white collared shirt, diagonal blue and white textured striped necktie',
  },
  'man-suit-5': {
    id: 'man-suit-5',
    category: 'man',
    name: 'Dark Navy Suit & Royal Blue Tie',
    nameKh: 'អាវធំពណ៌ខៀវចាស់ & ក្រវ៉ាត់កខៀវ',
    badge: 'Most Popular ⭐',
    thumbnail: 'assets/edit-image/suits/man/man-suit-5.png',
    transparent: 'assets/edit-image/suits/man/man-suit-5-transparent.png',
    prompt: 'tailored dark navy blue formal business suit jacket, crisp white collared dress shirt, royal blue silk necktie',
  },
  'woman-suit-1': {
    id: 'woman-suit-1',
    category: 'woman',
    name: 'Black Blazer & Red Plaid Tie',
    nameKh: 'អាវប្លេហ្សើពណ៌ខ្មៅ & ក្រវ៉ាត់កក្រហម',
    badge: 'School Style',
    thumbnail: 'assets/edit-image/suits/woman/woman-suit-1.png',
    transparent: 'assets/edit-image/suits/woman/woman-suit-1-transparent.png',
    prompt: 'formal black blazer jacket, white collared shirt, red plaid necktie, professional portrait',
  },
  'woman-suit-2': {
    id: 'woman-suit-2',
    category: 'woman',
    name: 'Black Blazer & Black Tie',
    nameKh: 'អាវប្លេហ្សើខ្មៅ & ក្រវ៉ាត់កខ្មៅ',
    badge: 'Classic Executive',
    thumbnail: 'assets/edit-image/suits/woman/woman-suit-2.png',
    transparent: 'assets/edit-image/suits/woman/woman-suit-2-transparent.png',
    prompt: 'sharp black formal blazer jacket, white dress shirt, black striped necktie, professional CV portrait',
  },
  'woman-suit-3': {
    id: 'woman-suit-3',
    category: 'woman',
    name: 'White Blouse (Open Collar)',
    nameKh: 'អាវសខ្យាក់សុទ្ធ (ចំហ collar)',
    badge: 'Elegant White',
    thumbnail: 'assets/edit-image/suits/woman/woman-suit-3.png',
    transparent: 'assets/edit-image/suits/woman/woman-suit-3-transparent.png',
    prompt: 'elegant white collared blouse shirt, open collar, professional women portrait',
  },
  'woman-suit-4': {
    id: 'woman-suit-4',
    category: 'woman',
    name: 'Black Blazer & Grey Plaid Tie',
    nameKh: 'អាវប្លេហ្សើខ្មៅ & ក្រវ៉ាត់កប្រផេះ',
    badge: 'Modern Style',
    thumbnail: 'assets/edit-image/suits/woman/woman-suit-4.png',
    transparent: 'assets/edit-image/suits/woman/woman-suit-4-transparent.png',
    prompt: 'formal black blazer jacket, white shirt, grey plaid checkered necktie, professional studio portrait',
  },
  'woman-suit-5': {
    id: 'woman-suit-5',
    category: 'woman',
    name: 'Black V-neck Blazer',
    nameKh: 'អាវប្លេហ្សើ V-neck ខ្មៅ',
    badge: 'Most Popular ⭐',
    thumbnail: 'assets/edit-image/suits/woman/woman-suit-5.png',
    transparent: 'assets/edit-image/suits/woman/woman-suit-5-transparent.png',
    prompt: 'sleek black V-neck blazer jacket, no tie, open collar, modern women professional portrait',
  },
};

const BACKGROUND_MAP = {
  'white': {
    id: 'white',
    name: 'Pure Studio White',
    nameKh: 'ពណ៌សស្ទូឌីយោ (ស្តង់ដារ CV/Passport)',
    hex: '#FFFFFF',
    prompt: 'solid seamless pure white studio photo background',
  },
  'blue': {
    id: 'blue',
    name: 'Classic Studio Blue',
    nameKh: 'ពណ៌ខៀវ (អត្តសញ្ញាណប័ណ្ណ/សាលា)',
    hex: '#0066FF',
    prompt: 'solid vibrant royal blue official studio backdrop',
  },
  'red': {
    id: 'red',
    name: 'Official Red',
    nameKh: 'ពណ៌ក្រហមផ្លូវការ',
    hex: '#DC2626',
    prompt: 'solid official rich crimson red studio background',
  },
  'grey': {
    id: 'grey',
    name: 'Corporate Soft Grey',
    nameKh: 'ពណ៌ប្រផេះស្រាល',
    hex: '#E2E8F0',
    prompt: 'clean neutral soft light grey studio backdrop',
  },
};

function hexToRgb(hex) {
  const clean = (hex || '#FFFFFF').replace('#', '');
  const bigint = parseInt(clean, 16);
  if (isNaN(bigint)) return { r: 255, g: 255, b: 255 };
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getSampleAfterBase64() {
  if (fs.existsSync(SAMPLE_AFTER_PATH)) {
    const buf = fs.readFileSync(SAMPLE_AFTER_PATH);
    return `data:image/png;base64,${buf.toString('base64')}`;
  }
  return null;
}

function getSampleBeforeBase64() {
  if (fs.existsSync(SAMPLE_BEFORE_PATH)) {
    const buf = fs.readFileSync(SAMPLE_BEFORE_PATH);
    return `data:image/png;base64,${buf.toString('base64')}`;
  }
  return null;
}

/**
 * Server-side high-definition studio portrait compositor using Sharp
 */
async function buildStudioPortrait({
  userImgBuffer,
  outfitId = 'man-suit-5',
  bgHex = '#FFFFFF',
  faceBox = null,
  svgPath = null,
  zoom = 1.0,
  offsetX = 0,
  offsetY = 0,
}) {
  const W = 707, H = 1024;
  const userMeta = await sharp(userImgBuffer).metadata();
  const outfitEntry = OUTFIT_MAP[outfitId];
  const category = outfitEntry ? outfitEntry.category : (outfitId.startsWith('woman') ? 'woman' : 'man');
  const suitFileName = `${outfitId}-transparent.png`;
  const suitPath = path.resolve(__dirname, '..', 'assets', 'edit-image', 'suits', category, suitFileName);

  // Normalize face bounding box
  const fBox = faceBox || [100, 260, 480, 740];
  const ymin = Math.max(0, (fBox[0] / 1000) * userMeta.height);
  const xmin = Math.max(0, (fBox[1] / 1000) * userMeta.width);
  const ymax = Math.min(userMeta.height, (fBox[2] / 1000) * userMeta.height);
  const xmax = Math.min(userMeta.width, (fBox[3] / 1000) * userMeta.width);

  const fW = Math.max(20, xmax - xmin);
  const fH = Math.max(20, ymax - ymin);
  const cx = xmin + fW / 2;

  let croppedHeadBuf;
  let posX, posY, resizedW, resizedH;

  if (category === 'woman') {
    // === WOMAN SUIT COMPOSITION ===
    // Calibrated hole positions for each of the 5 women suit templates
    const WOMAN_SUIT_CONFIG = {
      'woman-suit-1': { targetW: 340, centerX: 355, centerY: 485 },
      'woman-suit-2': { targetW: 310, centerX: 356, centerY: 410 },
      'woman-suit-3': { targetW: 330, centerX: 345, centerY: 430 },
      'woman-suit-4': { targetW: 290, centerX: 353, centerY: 375 },
      'woman-suit-5': { targetW: 290, centerX: 357, centerY: 395 },
    };
    const config = WOMAN_SUIT_CONFIG[outfitId] || { targetW: 310, centerX: 355, centerY: 420 };

    const targetFaceW = Math.round(config.targetW * zoom);
    const scale = targetFaceW / fW;

    const cropX = Math.max(0, Math.floor(cx - fW * 0.95));
    const cropY = Math.max(0, Math.floor(ymin - fH * 0.40));
    const cropW = Math.min(userMeta.width - cropX, Math.ceil(fW * 1.9));
    const cropH = Math.min(userMeta.height - cropY, Math.ceil(fH * 1.8));

    const localCx = cx - cropX;
    const localCy = (ymin - cropY) + fH * 0.48;

    const maskSvg = `<svg width="${cropW}" height="${cropH}">
      <defs>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6.0" />
        </filter>
      </defs>
      <!-- Broad soft feathered ellipse covering entire opening and extending under hair -->
      <ellipse cx="${localCx}" cy="${localCy}" rx="${fW * 0.85}" ry="${fH * 0.88}" fill="white" filter="url(#softBlur)" />
    </svg>`;

    croppedHeadBuf = await sharp(userImgBuffer)
      .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
      .ensureAlpha()
      .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
      .png()
      .toBuffer();

    resizedW = Math.round(cropW * scale);
    resizedH = Math.round(cropH * scale);

    posX = Math.round(config.centerX - (localCx * scale)) + offsetX;
    posY = Math.round(config.centerY - (localCy * scale)) + offsetY;
  } else {
    // === MAN SUIT COMPOSITION ===
    // Man suits have suit jacket, dress shirt and tie; collar opening V at Y = 550, collar shoulders at Y = 440
    // Chin lands at Y = 430, neck trapezoid extends down to Y = 580 with width 140px
    const targetFaceW = Math.round(265 * zoom);
    const scale = targetFaceW / fW;

    const rx = fW * 0.54;
    const ry = fH * 0.56;

    const cropX = Math.max(0, Math.floor(cx - rx * 1.15));
    const cropY = Math.max(0, Math.floor(ymin - fH * 0.14));
    const cropW = Math.min(userMeta.width - cropX, Math.ceil(rx * 2.3));

    // Neck needs to extend ~150px on canvas down into suit collar
    const neckCanvasH = 150;
    const neckH = Math.ceil(neckCanvasH / scale);
    const localChinY = ymax - cropY;
    const cropH = Math.min(userMeta.height - cropY, Math.ceil(localChinY + neckH));

    const localCx = cx - cropX;
    const localCy = (ymin - cropY) + fH * 0.48;

    // Neck width on canvas: ~130px at top, tapering to ~155px at bottom
    const neckTopHalfW = Math.round(65 / scale);
    const neckBotHalfW = Math.round(78 / scale);

    const maskSvg = `<svg width="${cropW}" height="${cropH}">
      <defs>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <!-- Neck trapezoid extending down to tuck seamlessly behind collar -->
      <polygon points="${localCx - neckTopHalfW},${localChinY - 5} ${localCx + neckTopHalfW},${localChinY - 5} ${localCx + neckBotHalfW},${cropH} ${localCx - neckBotHalfW},${cropH}" fill="white" />
      <!-- Head dome ellipse for hair and face -->
      <ellipse cx="${localCx}" cy="${localCy}" rx="${rx}" ry="${ry}" fill="white" filter="url(#softBlur)" />
    </svg>`;

    croppedHeadBuf = await sharp(userImgBuffer)
      .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
      .ensureAlpha()
      .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
      .png()
      .toBuffer();

    resizedW = Math.round(cropW * scale);
    resizedH = Math.round(cropH * scale);

    // Position head so chin lands at Y = 430
    const chinTargetY = 430;
    posX = Math.round((W - resizedW) / 2) + offsetX;
    posY = Math.round(chinTargetY - (localChinY * scale)) + offsetY;
  }

  const resizedHead = await sharp(croppedHeadBuf)
    .resize(resizedW, resizedH)
    .png()
    .toBuffer();

  // Create Studio Background (Solid Color)
  const bgRgb = hexToRgb(bgHex);
  const bg = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: bgRgb.r, g: bgRgb.g, b: bgRgb.b, alpha: 1 },
    },
  }).png().toBuffer();

  // Suit Overlay
  let suitBuf;
  if (fs.existsSync(suitPath)) {
    suitBuf = await sharp(suitPath).toBuffer();
  } else {
    const fallbackFile = category === 'woman' ? 'woman-suit-5-transparent.png' : 'man-suit-5-transparent.png';
    const fallbackPath = path.resolve(__dirname, '..', 'assets', 'edit-image', 'suits', category, fallbackFile);
    if (fs.existsSync(fallbackPath)) {
      suitBuf = await sharp(fallbackPath).toBuffer();
    } else {
      const lastResort = path.resolve(__dirname, '..', 'assets', 'edit-image', 'suits', 'man', 'man-suit-5-transparent.png');
      suitBuf = await sharp(lastResort).toBuffer();
    }
  }

  const clampedX = Math.max(-resizedW, Math.min(W, posX));
  const clampedY = Math.max(-resizedH, Math.min(H, posY));

  const compositeBuf = await sharp(bg)
    .composite([
      { input: resizedHead, left: clampedX, top: clampedY },
      { input: suitBuf, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  // Generate matching portrait crop for "Before" comparison
  const beforeAspect = W / H; // 707 / 1024
  let bCropW = Math.min(userMeta.width, Math.round(fW * 2.8));
  let bCropH = Math.round(bCropW / beforeAspect);
  if (bCropH > userMeta.height) {
    bCropH = userMeta.height;
    bCropW = Math.round(bCropH * beforeAspect);
  }
  const bCropX = Math.max(0, Math.min(userMeta.width - bCropW, Math.round(cx - bCropW / 2)));
  const bCropY = Math.max(0, Math.min(userMeta.height - bCropH, Math.round(ymin - bCropH * 0.15)));

  const beforeBuf = await sharp(userImgBuffer)
    .extract({ left: bCropX, top: bCropY, width: bCropW, height: bCropH })
    .resize(W, H)
    .png()
    .toBuffer();

  return {
    afterBase64: `data:image/png;base64,${compositeBuf.toString('base64')}`,
    beforeBase64: `data:image/png;base64,${beforeBuf.toString('base64')}`,
  };
}

/**
 * Generate a professional portrait wearing a formal suit ("big shirt")
 */
async function generateProfessionalPhoto({
  imageBase64,
  outfit = 'man-suit-5',
  background = 'white',
  isSample = false,
  zoom = 1.0,
  offsetX = 0,
  offsetY = 0,
}) {
  const outfitInfo = OUTFIT_MAP[outfit] || OUTFIT_MAP['man-suit-5'];
  const bgInfo = BACKGROUND_MAP[background] || {
    id: 'custom',
    name: 'Custom Color',
    nameKh: 'ពណ៌តាមចិត្ត',
    hex: background.startsWith('#') ? background : `#${background}`,
    prompt: `solid clean studio portrait backdrop with background color ${background}`,
  };

  // --- If user clicked the demo sample showcase ---
  if (isSample) {
    const sampleImage = getSampleAfterBase64();
    const sampleBefore = getSampleBeforeBase64();
    return {
      success: true,
      provider: 'demo',
      mode: 'sample_showcase',
      imageUrl: sampleImage,
      beforeUrl: sampleBefore,
      outfit: outfitInfo.name,
      background: bgInfo.name,
      bgHex: bgInfo.hex,
      outfitId: outfitInfo.id,
      transparentSuitUrl: outfitInfo.transparent,
      message: 'Successfully loaded demo sample portrait.',
    };
  }

  // --- Real User Uploaded Photo ---
  const match = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  const mimeType = match ? match[1] : 'image/jpeg';
  const rawBase64 = match ? match[2] : imageBase64;
  const userImgBuffer = Buffer.from(rawBase64, 'base64');

  let faceBox = null;
  let svgPath = null;

  // 1. Detect human face and head with Gemini 3.6 Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const detectUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
      const detectPayload = {
        contents: [
          {
            parts: [
              {
                text: 'Detect the primary human face and head in this photo for a formal passport or CV portrait crop. Frame ONLY the person\'s head and face (from top of the hair/crown down to the tip of the chin, and from left hair edge to right hair edge). Do NOT include the body, torso, arms, hands, clothing, animals/pets (e.g. cats, dogs), or background. Return ONLY valid JSON: {"face_box": [ymin, xmin, ymax, xmax], "chin_y": number} where all coordinates are normalized integers 0-1000. Do not include markdown formatting.',
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: rawBase64,
                },
              },
            ],
          },
        ],
        generationConfig: { response_mime_type: 'application/json' },
      };

      const detectResp = await fetch(detectUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detectPayload),
      });

      if (detectResp.ok) {
        const detectData = await detectResp.json();
        const text = detectData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          try {
            const parsed = JSON.parse(text);
            const box = parsed.face_box || parsed.box_2d;
            if (box && Array.isArray(box) && box.length === 4) {
              const fW = box[3] - box[1];
              const fH = box[2] - box[0];
              // Validate: Must be a plausible head bounding box, not the entire picture or an empty point
              if (fW >= 40 && fH >= 40 && (fW < 880 || fH < 880)) {
                faceBox = box;
              }
            }
            console.log('Gemini AI detected human face:', { faceBox });
          } catch (pe) {
            console.warn('Failed to parse Gemini detection JSON:', pe.message);
          }
        }
      } else {
        console.warn('Gemini detection HTTP error:', detectResp.status);
      }
    } catch (err) {
      console.warn('Gemini detection exception:', err.message);
    }
  }

  // Default fallback if detection failed
  if (!faceBox) {
    faceBox = [100, 260, 480, 740];
  }

  // 2. High-precision compositing using native Sharp engine
  try {
    const { afterBase64, beforeBase64 } = await buildStudioPortrait({
      userImgBuffer,
      outfitId: outfitInfo.id,
      bgHex: bgInfo.hex,
      faceBox,
      svgPath,
      zoom,
      offsetX,
      offsetY,
    });

    return {
      success: true,
      provider: 'gemini_sharp_studio',
      mode: 'user_custom_photo',
      imageUrl: afterBase64,
      beforeUrl: beforeBase64,
      faceBox,
      svgPath,
      outfit: outfitInfo.name,
      background: bgInfo.name,
      bgHex: bgInfo.hex,
      outfitId: outfitInfo.id,
      transparentSuitUrl: outfitInfo.transparent,
      message: 'Successfully tailored formal suit and generated studio portrait!',
    };
  } catch (renderErr) {
    console.error('Sharp portrait render error:', renderErr);
    throw new Error('Failed to generate studio portrait: ' + renderErr.message);
  }
}

module.exports = {
  generateProfessionalPhoto,
  buildStudioPortrait,
  getSampleBeforeBase64,
  getSampleAfterBase64,
  OUTFIT_MAP,
  BACKGROUND_MAP,
};
