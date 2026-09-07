const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../db');
const { query } = require('../db/pool');
const bakongService = require('../services/bakong.service');
const telegramService = require('../services/telegram.service');

// POST /api/v1/orders/khqr — generate 5-minute dynamic Bakong KHQR
router.post('/khqr', requireAuth, async (req, res) => {
  try {
    const { templateId, userCvId, currency = 'USD' } = req.body;
    const user = await db.users.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'UNAUTHENTICATED' });

    // Admin and approved staff get all templates 100% free without scanning
    const isStaffOrAdmin = user.role === 'admin' || (user.role === 'staff' && !!user.is_approved);
    if (isStaffOrAdmin) {
      if (userCvId) {
        await db.userCvs.setPaid(userCvId, true);
      }
      return res.json({
        free: true,
        paid: true,
        message: 'Free access for admin and approved staff',
      });
    }

    let template = null;
    if (templateId) {
      template = await db.templates.findById(templateId);
    }
    const isCl = template?.category === 'Cover Letter' || (template?.name || '').toLowerCase().includes('cover');
    const defaultCents = isCl ? 100 : 400;
    const amountCents = (template?.price_cents !== undefined && template?.price_cents !== null)
      ? Number(template.price_cents)
      : defaultCents;
    const amountUsd = Number((amountCents / 100).toFixed(2));
    const amountKhr = Math.round(amountUsd * 4100);

    const order = await db.orders.create({
      userId: user.id,
      templateId: template?.id || 1,
      userCvId: userCvId || null,
      amountCents,
      currency: currency === 'KHR' ? 'KHR' : 'USD',
    });

    const isKhr = currency === 'KHR';
    const amountForQr = isKhr ? amountKhr : amountUsd;
    const currForQr = isKhr ? 'KHR' : 'USD';

    // Generate NBC KHQR string with 5-min expiration window
    const qrString = bakongService.generateKHQRString({
      accountId: bakongService.BAKONG_ACCOUNT_ID,
      merchantName: bakongService.BAKONG_MERCHANT_NAME,
      amount: amountForQr,
      currency: currForQr,
      billNumber: String(order.id),
    });

    const md5 = bakongService.calculateMD5(qrString);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store MD5 as payment reference
    await query(
      `UPDATE sales_orders SET payment_ref = ?, payment_provider = 'bakong_khqr' WHERE id = ?`,
      [md5, order.id]
    );

    res.status(201).json({
      orderId: order.id,
      qrString,
      md5,
      amountUsd,
      amountKhr,
      currency: currForQr,
      expiresAt,
      accountName: bakongService.BAKONG_MERCHANT_NAME,
      accountId: bakongService.BAKONG_ACCOUNT_ID,
      templateName: template?.name || 'CV Template',
    });
  } catch (error) {
    console.error('KHQR order error:', error);
    res.status(500).json({ error: 'ORDER_ERROR', message: error.message });
  }
});

// GET /api/v1/orders/:id/status — verify status via Bakong API or database
router.get('/:id/status', requireAuth, async (req, res) => {
  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'NOT_FOUND' });

    if (order.status === 'paid') {
      return res.json({ status: 'paid', paid: true });
    }

    // Check if the associated CV was already marked as paid
    if (order.user_cv_id) {
      try {
        const cv = await db.userCvs.findById(order.user_cv_id);
        if (cv && (cv.is_paid === 1 || cv.is_paid === true)) {
          await db.orders.markPaid(order.id, {
            paymentProvider: order.payment_provider || 'bakong_khqr',
            paymentRef: order.payment_ref,
          });
          return res.json({ status: 'paid', paid: true });
        }
      } catch {}
    }

    // Check transaction with Bakong API if we have an MD5 ref
    if (order.payment_ref) {
      try {
        const bakongCheck = await bakongService.checkBakongPayment(order.payment_ref);
        if (bakongCheck && bakongCheck.paid) {
          await db.orders.markPaid(order.id, {
            paymentProvider: 'bakong_khqr',
            paymentRef: order.payment_ref,
          });

          if (order.user_cv_id) {
            await db.userCvs.setPaid(order.user_cv_id, true);
          }

          const user = await db.users.findById(order.user_id);
          const template = await db.templates.findById(order.template_id);

          telegramService.sendPaymentNotification({
            status: 'SUCCESS',
            fullName: user?.full_name,
            email: user?.email,
            templateName: template?.name,
            amountUsd: order.amount_cents / 100,
            amountKhr: Math.round((order.amount_cents / 100) * 4100),
            orderId: order.id,
            paymentRef: order.payment_ref,
          });

          return res.json({ status: 'paid', paid: true });
        }
      } catch (e) {
        console.warn('[Orders] Bakong check error:', e.message);
      }
    }

    // Check if order has expired (5 minutes = 300,000 ms)
    const rawDate = order.purchased_at || order.created_at;
    if (rawDate) {
      const dateStr = typeof rawDate === 'string' && !rawDate.endsWith('Z') && !rawDate.includes('+')
        ? rawDate.replace(' ', 'T') + 'Z'
        : rawDate;
      const createdAtMs = new Date(dateStr).getTime();
      if (!isNaN(createdAtMs) && (Date.now() - createdAtMs > 5 * 60 * 1000)) {
        return res.json({ status: 'expired', paid: false });
      }
    }

    res.json({ status: order.status, paid: false });
  } catch (error) {
    console.error('Check status error:', error);
    res.status(500).json({ error: 'STATUS_CHECK_ERROR', message: error.message });
  }
});

// POST /api/v1/orders/verify-all — verify all pending orders (admin only)
router.post('/verify-all', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Admin access required' });
    }
    const userOrders = await db.orders.findByUser(req.user.id);
    let verifiedCount = 0;

    for (const order of userOrders) {
      if (order.status !== 'paid') {
        await db.orders.markPaid(order.id, {
          paymentProvider: 'bakong_khqr',
          paymentRef: order.payment_ref || `REF-${Date.now()}`,
        });

        if (order.user_cv_id) {
          await db.userCvs.setPaid(order.user_cv_id, true);
        }
        verifiedCount++;
      }
    }

    res.json({ success: true, verifiedCount, message: `Verified ${verifiedCount} orders.` });
  } catch (e) {
    console.error('Verify all orders error:', e);
    res.status(500).json({ error: 'VERIFY_ALL_ERROR', message: e.message });
  }
});

// POST /api/v1/orders/:id/verify — real Bakong verification or admin override
router.post('/:id/verify', requireAuth, async (req, res) => {
  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'NOT_FOUND' });

    // Ensure order belongs to user or user is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }

    if (order.status === 'paid') {
      return res.json({ status: 'paid', paid: true, orderId: order.id });
    }

    // Admins can manually verify
    const isAdmin = req.user.role === 'admin';

    let isRealPaid = false;
    if (order.payment_ref) {
      try {
        const check = await bakongService.checkBakongPayment(order.payment_ref);
        if (check && check.paid) {
          isRealPaid = true;
        }
      } catch (err) {
        console.warn('Bakong verify check error:', err.message);
      }
    }

    if (!isRealPaid && !isAdmin) {
      return res.status(400).json({
        paid: false,
        status: 'pending',
        message: 'Payment not yet confirmed by Bakong banking network.',
      });
    }

    await db.orders.markPaid(order.id, {
      paymentProvider: 'bakong_khqr',
      paymentRef: order.payment_ref || `REF-${Date.now()}`,
    });

    if (order.user_cv_id) {
      await db.userCvs.setPaid(order.user_cv_id, true);
    }

    const user = await db.users.findById(order.user_id);
    const template = await db.templates.findById(order.template_id);

    try {
      telegramService.sendPaymentNotification({
        status: 'SUCCESS',
        fullName: user?.full_name,
        email: user?.email,
        templateName: template?.name,
        amountUsd: order.amount_cents / 100,
        amountKhr: Math.round((order.amount_cents / 100) * 4100),
        orderId: order.id,
        paymentRef: order.payment_ref || 'CONFIRMED',
      });
    } catch {}

    res.json({ status: 'paid', paid: true, orderId: order.id });
  } catch (error) {
    console.error('Order verify error:', error);
    res.status(500).json({ error: 'VERIFY_ERROR', message: error.message });
  }
});

// POST /api/v1/orders/:id/confirm-manual — manual confirmation (restricted to admin)
router.post('/:id/confirm-manual', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Admin access required' });
    }

    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'NOT_FOUND' });

    await db.orders.markPaid(order.id, {
      paymentProvider: 'bakong_khqr_confirmed',
      paymentRef: order.payment_ref || `REF-${Date.now()}`,
    });

    if (order.user_cv_id) {
      await db.userCvs.setPaid(order.user_cv_id, true);
    }

    const user = await db.users.findById(order.user_id);
    const template = await db.templates.findById(order.template_id);

    try {
      telegramService.sendPaymentNotification({
        status: 'SUCCESS',
        fullName: user?.full_name,
        email: user?.email,
        templateName: template?.name,
        amountUsd: order.amount_cents / 100,
        amountKhr: Math.round((order.amount_cents / 100) * 4100),
        orderId: order.id,
        paymentRef: order.payment_ref || 'CONFIRMED',
      });
    } catch {}

    res.json({ status: 'paid', paid: true });
  } catch (error) {
    console.error('Manual confirm error:', error);
    res.status(500).json({ error: 'CONFIRM_ERROR', message: error.message });
  }
});

// POST /api/v1/orders/:id/cancel — cancel order
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'NOT_FOUND' });

    // If order was already paid, do not mark failed or send cancellation
    if (order.status === 'paid') {
      return res.json({ status: 'paid', paid: true });
    }

    await db.query(`UPDATE sales_orders SET status = 'failed' WHERE id = ?`, [order.id]);

    const user = await db.users.findById(order.user_id);
    const template = await db.templates.findById(order.template_id);

    try {
      await telegramService.sendPaymentNotification({
        status: 'CANCELLED',
        fullName: user?.full_name,
        email: user?.email,
        templateName: template?.name,
        amountUsd: order.amount_cents / 100,
        amountKhr: Math.round((order.amount_cents / 100) * 4100),
        orderId: order.id,
        paymentRef: order.payment_ref,
        reason: 'User canceled or closed payment modal',
      });
    } catch (tgErr) {
      console.warn('[Telegram] Cancel alert error:', tgErr.message);
    }

    res.json({ status: 'canceled' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'CANCEL_ERROR', message: error.message });
  }
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

module.exports = router;
