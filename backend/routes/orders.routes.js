const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db');

// POST /api/v1/orders — create order for a template ($3 flat pricing model)
router.post('/', requireAuth, async (req, res) => {
  const { templateId, userCvId } = req.body;
  const template = await db.templates.findById(templateId);
  if (!template) return res.status(404).json({ error: 'TEMPLATE_NOT_FOUND' });

  const order = await db.orders.create({
    userId: req.user.id,
    templateId,
    userCvId,
    amountCents: template.price_cents,
  });

  // In production: create a payment-provider session/intent here and
  // return its client secret / redirect URL alongside the order.
  res.status(201).json({ order });
});

// GET /api/v1/orders — current user's order history
router.get('/', requireAuth, async (req, res) => {
  const orders = await db.orders.findByUser(req.user.id);
  res.json({ orders });
});

// GET /api/v1/orders/:id — order detail / receipt
router.get('/:id', requireAuth, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order || order.user_id !== req.user.id) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ order });
});

// POST /api/v1/orders/:id/webhook — payment provider webhook
// NOTE: mount this route with express.raw({type: 'application/json'}) at
// the app level (before the JSON body parser) so provider signatures
// (e.g. Stripe-Signature) can be verified against the raw payload.
router.post('/:id/webhook', async (req, res) => {
  // 1. verify signature header against req.body (raw buffer) with your
  //    payment provider's SDK
  // 2. on success event -> db.orders.markPaid(id, { paymentProvider, paymentRef })
  //    (this also triggers the sold_count increment via the DB trigger)
  res.status(200).json({ received: true });
});

module.exports = router;
