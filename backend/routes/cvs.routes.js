const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db');
const { renderCvToPdf } = require('../services/pdf.service');

// GET /api/v1/cvs — "My CV" dashboard grid
router.get('/', requireAuth, async (req, res) => {
  const cvs = await db.userCvs.findByUser(req.user.id);
  res.json({ cvs });
});

// GET /api/v1/cvs/:id
router.get('/:id', requireAuth, async (req, res) => {
  const cv = await db.userCvs.findById(req.params.id, req.user.id);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ cv });
});

// POST /api/v1/cvs — create a new CV from a templateId (mirrors /templates/:id/select)
router.post('/', requireAuth, async (req, res) => {
  // Check if user is approved
  const user = await db.users.findById(req.user.id);
  if (!user.is_approved && user.role !== 'admin') {
    return res.status(403).json({ error: 'NOT_APPROVED', message: 'Your account is not yet approved by admin. Please wait for approval to use templates.' });
  }

  const { templateId } = req.body;
  const template = await db.templates.findById(templateId);
  if (!template || !template.is_active) return res.status(404).json({ error: 'TEMPLATE_NOT_FOUND' });

  const cv = await db.userCvs.createDraft({ userId: req.user.id, templateId });
  res.status(201).json({ cv });
});

// PUT /api/v1/cvs/:id — autosave form content from the Make CV workstation
router.put('/:id', requireAuth, async (req, res) => {
  const { content, title } = req.body;
  const cv = await db.userCvs.updateContent(req.params.id, req.user.id, content || {}, title);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ cv });
});

// PUT /api/v1/cvs/:id/color — live color-scheme swap
router.put('/:id/color', requireAuth, async (req, res) => {
  const { color } = req.body;
  if (!color) return res.status(400).json({ error: 'MISSING_COLOR' });

  const cv = await db.userCvs.updateColor(req.params.id, req.user.id, color);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ cv });
});

// POST /api/v1/cvs/:id/download — generate & return a PDF
router.post('/:id/download', requireAuth, async (req, res) => {
  const cv = await db.userCvs.findById(req.params.id, req.user.id);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });

  const { url } = await renderCvToPdf(cv);
  const updated = await db.userCvs.setPdfUrl(cv.id, req.user.id, url);

  res.json({ pdfUrl: updated.pdf_url });
});

// DELETE /api/v1/cvs/:id
router.delete('/:id', requireAuth, async (req, res) => {
  await db.userCvs.remove(req.params.id, req.user.id);
  res.status(204).send();
});

module.exports = router;
