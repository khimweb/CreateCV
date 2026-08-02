const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const db = require('../db');

router.use(requireAuth, requireAdmin);

// ---------- Dashboard ----------

// GET /api/v1/admin/dashboard/kpis?from=&to=
router.get('/dashboard/kpis', async (req, res) => {
  const { from, to } = req.query;
  const [totalUsers, totalTemplates, totalSold, totalRevenueCents, totalOrders] = await Promise.all([
    db.users.count(),
    db.templates.count(),
    db.orders.countSoldTemplates(),
    db.orders.totalRevenueCents({ from, to }),
    db.orders.countOrders({ from, to }),
  ]);

  res.json({
    totalUsers,
    totalTemplates,
    totalSold,
    totalRevenue: totalRevenueCents / 100,
    totalOrders,
  });
});

// GET /api/v1/admin/dashboard/users — collapsible "All Users" widget
router.get('/dashboard/users', async (req, res) => {
  const { page, pageSize, search } = req.query;
  const result = await db.users.list({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, search });
  res.json(result);
});

// GET /api/v1/admin/dashboard/top-templates — collapsible widget
router.get('/dashboard/top-templates', async (req, res) => {
  const templates = await db.templates.topSelling(Number(req.query.limit) || 5);
  res.json({ templates });
});

// ---------- Customers ----------

// GET /api/v1/admin/customers
router.get('/customers', async (req, res) => {
  const { page, pageSize, search } = req.query;
  const result = await db.users.list({ page: Number(page) || 1, pageSize: Number(pageSize) || 20, search });
  res.json(result);
});

// GET /api/v1/admin/customers/:id — profile + activity (orders + saved CVs)
router.get('/customers/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });

  const [orders, cvs] = await Promise.all([
    db.orders.findByUser(req.params.id),
    db.userCvs.findByUser(req.params.id),
  ]);

  res.json({
    user: {
      id: user.id, fullName: user.full_name, email: user.email,
      role: user.role, isActive: user.is_active,
      lastLoginAt: user.last_login_at, createdAt: user.created_at,
    },
    activity: { orders, cvs },
  });
});

// PATCH /api/v1/admin/customers/:id — activate/deactivate, change role
router.patch('/customers/:id', async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive === 'boolean') {
    const user = await db.users.setActive(req.params.id, isActive);
    return res.json({ user });
  }
  res.status(400).json({ error: 'NO_SUPPORTED_FIELDS' });
});

// DELETE /api/v1/admin/customers/:id — remove user
router.delete('/customers/:id', async (req, res) => {
  await db.users.remove(req.params.id);
  res.status(204).send();
});

// ---------- Templates ----------

// GET /api/v1/admin/templates — includes inactive, for management table
router.get('/templates', async (req, res) => {
  const { category, search } = req.query;
  const templates = await db.templates.findMany({ category, search, activeOnly: false });
  res.json({ templates });
});

// PATCH /api/v1/admin/templates/:id/toggle-active
router.patch('/templates/:id/toggle-active', async (req, res) => {
  const template = await db.templates.toggleActive(req.params.id);
  res.json({ template });
});

// DELETE /api/v1/admin/templates/:id
router.delete('/templates/:id', async (req, res) => {
  await db.templates.remove(req.params.id);
  res.status(204).send();
});

// ---------- Reports ----------

// GET /api/v1/admin/reports?from=&to=&groupBy=timeOfDay|date
router.get('/reports', async (req, res) => {
  const { from, to, groupBy = 'timeOfDay' } = req.query;
  const rows = groupBy === 'date'
    ? await db.orders.reportByDate({ from, to })
    : await db.orders.reportByTimeOfDay({ from, to });
  res.json({ groupBy, rows });
});

// ---------- Settings ----------

// GET /api/v1/admin/settings/profile
router.get('/settings/profile', async (req, res) => {
  const user = await db.users.findById(req.user.id);
  res.json({
    user: { id: user.id, fullName: user.full_name, email: user.email, avatarUrl: user.avatar_url, coverUrl: user.cover_url, bio: user.bio, themePreference: user.theme_preference },
  });
});

// PUT /api/v1/admin/settings/profile
router.put('/settings/profile', async (req, res) => {
  const { fullName, avatarUrl, coverUrl, bio, themePreference } = req.body;
  const user = await db.users.updateProfile(req.user.id, { fullName, avatarUrl, coverUrl, bio, themePreference });
  res.json({ user });
});

// PUT /api/v1/admin/settings/password
router.put('/settings/password', async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'WEAK_PASSWORD' });
  }
  await db.users.updatePassword(req.user.id, newPassword);
  res.status(204).send();
});

// POST /api/v1/admin/settings/users — create a new admin/staff user
router.post('/settings/users', async (req, res) => {
  const { fullName, email, password } = req.body;
  const existing = await db.users.findByEmail(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'EMAIL_TAKEN' });

  const user = await db.users.create({ fullName, email: email.toLowerCase(), password });
  res.status(201).json({ user });
});

// DELETE /api/v1/admin/settings/users/:id
router.delete('/settings/users/:id', async (req, res) => {
  await db.users.remove(req.params.id);
  res.status(204).send();
});

// DELETE /api/v1/admin/settings/account — admin deletes their own account
router.delete('/settings/account', async (req, res) => {
  await db.users.remove(req.user.id);
  res.status(204).send();
});

// ---------- Security / Activity Log ----------

// GET /api/v1/admin/security/logs
router.get('/security/logs', async (req, res) => {
  const { page, pageSize, search, action } = req.query;
  const result = await db.activityLog.list({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 50,
    search: search || '',
    action: action || '',
  });
  res.json(result);
});

// GET /api/v1/admin/security/online-users
router.get('/security/online-users', async (req, res) => {
  const users = await db.users.getOnlineUsers(10);
  res.json({ users });
});

// DELETE /api/v1/admin/security/logs/:id
router.delete('/security/logs/:id', async (req, res) => {
  await db.activityLog.deleteLog(req.params.id);
  res.status(204).send();
});

// DELETE /api/v1/admin/security/logs — clear all
router.delete('/security/logs', async (req, res) => {
  await db.activityLog.deleteAll();
  res.status(204).send();
});

module.exports = router;
