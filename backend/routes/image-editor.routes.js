const express = require('express');
const router = express.Router();
const imageEditorService = require('../services/image-editor.service');

// GET /api/v1/image-editor/presets
router.get('/presets', (req, res) => {
  try {
    const outfits = Object.values(imageEditorService.OUTFIT_MAP);
    const backgrounds = Object.values(imageEditorService.BACKGROUND_MAP);
    const provider = process.env.REPLICATE_API_TOKEN
      ? 'replicate_face_id'
      : (process.env.IMAGE_AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : 'demo'));

    res.json({
      success: true,
      provider,
      hasReplicateKey: !!process.env.REPLICATE_API_TOKEN,
      hasApiKey: !!(process.env.REPLICATE_API_TOKEN || process.env.GEMINI_API_KEY),
      outfits,
      backgrounds,
    });
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

// GET /api/v1/image-editor/samples
router.get('/samples', (req, res) => {
  try {
    const beforeImage = imageEditorService.getSampleBeforeBase64();
    const afterImage = imageEditorService.getSampleAfterBase64();

    res.json({
      success: true,
      before: beforeImage,
      after: afterImage,
    });
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

// POST /api/v1/image-editor/generate
router.post('/generate', async (req, res) => {
  try {
    const { imageBase64, outfit, background, isSample, zoom, offsetX, offsetY } = req.body;

    if (!imageBase64 && !isSample) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'imageBase64 or isSample is required',
      });
    }

    const result = await imageEditorService.generateProfessionalPhoto({
      imageBase64,
      outfit,
      background,
      isSample: Boolean(isSample),
      zoom: typeof zoom === 'number' ? zoom : 1.0,
      offsetX: typeof offsetX === 'number' ? offsetX : 0,
      offsetY: typeof offsetY === 'number' ? offsetY : 0,
    });

    res.json(result);
  } catch (err) {
    console.error('Image editor error:', err);
    res.status(500).json({ error: 'GENERATION_FAILED', message: err.message });
  }
});

module.exports = router;
