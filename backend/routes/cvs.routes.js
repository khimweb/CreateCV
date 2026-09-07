const express = require('express');
const router = express.Router();
const { requireAuth, requireApproved } = require('../middleware/auth');
const db = require('../db');
const { renderCvToPdf } = require('../services/pdf.service');

// GET /api/v1/cvs — "My CV" dashboard grid
router.get('/', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  const isFreeStaffOrAdmin = user?.role === 'admin' || (user?.role === 'staff' && !!user?.is_approved);

  const cvs = await db.userCvs.findByUser(req.user.id);
  const mapped = cvs.map((c) => ({
    ...c,
    is_paid: isFreeStaffOrAdmin ? 1 : (c.is_paid ? 1 : 0),
  }));
  res.json({ cvs: mapped });
});

// GET /api/v1/cvs/:id
router.get('/:id', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  const isFreeStaffOrAdmin = user?.role === 'admin' || (user?.role === 'staff' && !!user?.is_approved);

  const cv = await db.userCvs.findById(req.params.id, req.user.id, isFreeStaffOrAdmin);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  if (isFreeStaffOrAdmin) {
    cv.is_paid = 1;
  }
  res.json({ cv });
});

// POST /api/v1/cvs — create a new CV from a templateId (mirrors /templates/:id/select)
router.post('/', requireAuth, requireApproved, async (req, res) => {
  const { templateId } = req.body;
  const template = await db.templates.findById(templateId);
  if (!template) return res.status(404).json({ error: 'TEMPLATE_NOT_FOUND' });
  if (!template.is_active && req.user?.role !== 'admin') return res.status(404).json({ error: 'TEMPLATE_NOT_FOUND' });

  const cv = await db.userCvs.createDraft({ userId: req.user.id, templateId });
  const user = await db.users.findById(req.user.id);
  const isFreeStaffOrAdmin = user?.role === 'admin' || (user?.role === 'staff' && !!user?.is_approved);
  if (isFreeStaffOrAdmin) {
    await db.userCvs.setPaid(cv.id, true);
    cv.is_paid = 1;
  }
  res.status(201).json({ cv });
});

// PUT /api/v1/cvs/:id — autosave form content from the Make CV workstation
router.put('/:id', requireAuth, requireApproved, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  const isStaffOrAdmin = (user?.role === 'staff' || user?.role === 'admin');
  const existingCv = await db.userCvs.findById(req.params.id, req.user.id, isStaffOrAdmin);
  if (existingCv && existingCv.is_paid && !isStaffOrAdmin) {
    return res.status(403).json({ error: 'PAID_CV_READONLY', message: 'Paid CVs are finalized and cannot be edited.' });
  }

  const { content, title } = req.body;
  const cv = await db.userCvs.updateContent(req.params.id, req.user.id, content || {}, title, isStaffOrAdmin);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ cv });
});

// PUT /api/v1/cvs/:id/color — live color-scheme swap
router.put('/:id/color', requireAuth, requireApproved, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  const isStaffOrAdmin = (user?.role === 'staff' || user?.role === 'admin');
  const { color } = req.body;
  if (!color) return res.status(400).json({ error: 'MISSING_COLOR' });

  const cv = await db.userCvs.updateColor(req.params.id, req.user.id, color, isStaffOrAdmin);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ cv });
});

// POST /api/v1/cvs/:id/download — generate & return a PDF
router.post('/:id/download', requireAuth, requireApproved, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  const isStaffOrAdmin = (user?.role === 'staff' || user?.role === 'admin');
  const cv = await db.userCvs.findById(req.params.id, req.user.id, isStaffOrAdmin);
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });

  const { url } = await renderCvToPdf(cv);
  const updated = await db.userCvs.setPdfUrl(cv.id, req.user.id, url, isStaffOrAdmin);

  res.json({ pdfUrl: updated.pdf_url });
});

// DELETE /api/v1/cvs/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  const isStaffOrAdmin = (user?.role === 'staff' || user?.role === 'admin');
  await db.userCvs.remove(req.params.id, req.user.id, isStaffOrAdmin);
  res.status(204).send();
});

module.exports = router;
