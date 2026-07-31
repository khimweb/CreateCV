const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const db = require('../db'); // pg pool / prisma client wrapper

// GET /api/v1/templates — public gallery grid
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const templates = await db.templates.findMany({ category, search, activeOnly: true });
  res.json({ templates });
});

// GET /api/v1/templates/:id — public preview (design + colors + rating)
router.get('/:id', async (req, res) => {
  const template = await db.templates.findById(req.params.id);
  if (!template) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ template });
});

// POST /api/v1/templates/:id/select — 🔒 LOGIN REQUIRED
// This is the gate the frontend calls when a user clicks "Select" on a
// template card or "Use This Template" on the preview page. If there's
// no valid session, requireAuth returns 401 and the Angular app
// redirects to /login?returnUrl=/templates/preview/:id
router.post('/:id/select', requireAuth, async (req, res) => {
  const template = await db.templates.findById(req.params.id);
  if (!template || !template.is_active) return res.status(404).json({ error: 'NOT_FOUND' });

  // record the selection / start a draft CV for this user
  const draftCv = await db.userCvs.createDraft({
    userId: req.user.id,
    templateId: template.id,
    selectedColor: req.body.selectedColor,
  });

  res.status(201).json({ cvId: draftCv.id, templateId: template.id });
});

// GET /api/v1/templates/:id/reviews — public
router.get('/:id/reviews', async (req, res) => {
  const reviews = await db.reviews.findByTemplate(req.params.id);
  res.json({ reviews });
});

// POST /api/v1/templates/:id/reviews — 🔒 star rating + comment
router.post('/:id/reviews', requireAuth, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'INVALID_RATING' });
  }
  const review = await db.reviews.upsert({
    userId: req.user.id,
    templateId: req.params.id,
    rating,
    comment,
  });
  res.status(201).json({ review });
});

// ---- Admin-only management ----
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const template = await db.templates.create(req.body);
  res.status(201).json({ template });
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const template = await db.templates.update(req.params.id, req.body);
  res.json({ template });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await db.templates.remove(req.params.id);
  res.status(204).send();
});

module.exports = router;
