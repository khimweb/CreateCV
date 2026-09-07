const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const db = require('../db');
const { query } = require('../db/pool');

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
  const { isActive, isApproved, role } = req.body;
  if (typeof isActive === 'boolean') {
    const user = await db.users.setActive(req.params.id, isActive);
    return res.json({ user });
  }
  if (typeof isApproved === 'boolean') {
    const user = await db.users.setApproved(req.params.id, isApproved);
    return res.json({ user });
  }
  if (role && ['user', 'admin'].includes(role)) {
    const user = await db.users.setRole(req.params.id, role);
    return res.json({ user });
  }
  res.status(400).json({ error: 'NO_SUPPORTED_FIELDS' });
});

// DELETE /api/v1/admin/customers/:id — remove a regular user and their linked data
router.delete('/customers/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
  if (String(user.id) === String(req.user.id)) {
    return res.status(400).json({ error: 'CANNOT_REMOVE_SELF', message: 'Use account settings to remove your own account.' });
  }
  if (user.role === 'admin') {
    return res.status(403).json({ error: 'CANNOT_REMOVE_ADMIN', message: 'Administrator accounts cannot be removed from Users.' });
  }

  await db.users.remove(user.id);
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

// PATCH /api/v1/admin/templates/:id/price
router.patch('/templates/:id/price', async (req, res) => {
  const { priceCents } = req.body;
  if (priceCents === undefined || isNaN(priceCents) || priceCents < 0) {
    return res.status(400).json({ error: 'INVALID_PRICE' });
  }
  const template = await db.templates.update(req.params.id, { priceCents: Math.round(priceCents) });
  res.json({ template });
});

// DELETE /api/v1/admin/templates/:id
router.delete('/templates/:id', async (req, res) => {
  await db.templates.remove(req.params.id);
  res.status(204).send();
});

// ---------- Reports & Analytics ----------

// GET /api/v1/admin/analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = 'weekly', from, to, userId } = req.query;
    const targetUserId = userId ? parseInt(userId, 10) : null;

    const conditions = [];
    const params = [];

    if (targetUserId) {
      conditions.push('so.user_id = ?');
      params.push(targetUserId);
    }

    // Date range filtering
    if (from && to) {
      conditions.push('date(so.purchased_at) >= ? AND date(so.purchased_at) <= ?');
      params.push(from, to);
    } else if (from) {
      conditions.push('date(so.purchased_at) >= ?');
      params.push(from);
    } else if (to) {
      conditions.push('date(so.purchased_at) <= ?');
      params.push(to);
    } else {
      if (period === 'today') {
        conditions.push("date(so.purchased_at) = date('now')");
      } else if (period === 'weekly') {
        conditions.push("date(so.purchased_at) >= date('now', '-6 days')");
      } else if (period === 'monthly') {
        conditions.push("date(so.purchased_at) >= date('now', '-29 days')");
      } else if (period === 'yearly') {
        conditions.push("date(so.purchased_at) >= date('now', '-364 days')");
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 1. Overall KPIs
    const kpiSql = `
      SELECT
        COALESCE(SUM(CASE WHEN so.status = 'paid' THEN so.amount_cents ELSE 0 END), 0) AS total_revenue_cents,
        COUNT(CASE WHEN so.status = 'paid' THEN 1 END) AS paid_orders,
        COUNT(*) AS total_orders,
        COUNT(DISTINCT CASE WHEN so.status = 'paid' THEN so.user_id END) AS paying_users,
        COALESCE(SUM(CASE WHEN so.status != 'paid' THEN so.amount_cents ELSE 0 END), 0) AS unpaid_cents
      FROM sales_orders so
      ${whereClause}
    `;
    const { rows: kpiRows } = await query(kpiSql, params);
    const kpis = kpiRows[0] || {};
    const totalRevCents = Number(kpis.total_revenue_cents || 0);
    const paidOrders = Number(kpis.paid_orders || 0);
    const avgOrderCents = paidOrders > 0 ? Math.round(totalRevCents / paidOrders) : 0;

    // 2. Time of Day breakdown (Morning, Afternoon, Evening, Night)
    const todConditions = ["so.status = 'paid'", ...conditions];
    const todParams = [...params];
    const todSql = `
      SELECT
        CASE
          WHEN CAST(strftime('%H', so.purchased_at) AS INT) BETWEEN 5 AND 11 THEN 'morning'
          WHEN CAST(strftime('%H', so.purchased_at) AS INT) BETWEEN 12 AND 16 THEN 'afternoon'
          WHEN CAST(strftime('%H', so.purchased_at) AS INT) BETWEEN 17 AND 21 THEN 'evening'
          ELSE 'night'
        END AS bucket,
        COUNT(*) AS orders,
        COALESCE(SUM(so.amount_cents), 0) AS revenue_cents
      FROM sales_orders so
      WHERE ${todConditions.join(' AND ')}
      GROUP BY bucket
    `;
    const { rows: todRows } = await query(todSql, todParams);
    const timeOfDay = {
      morning: { orders: 0, revenue_cents: 0, percent: 0 },
      afternoon: { orders: 0, revenue_cents: 0, percent: 0 },
      evening: { orders: 0, revenue_cents: 0, percent: 0 },
      night: { orders: 0, revenue_cents: 0, percent: 0 },
    };
    todRows.forEach((r) => {
      if (timeOfDay[r.bucket]) {
        timeOfDay[r.bucket].orders = Number(r.orders || 0);
        timeOfDay[r.bucket].revenue_cents = Number(r.revenue_cents || 0);
        timeOfDay[r.bucket].percent =
          totalRevCents > 0 ? Math.round((Number(r.revenue_cents || 0) / totalRevCents) * 100) : 0;
      }
    });

    // 3. Trendline series (Daily or Hourly)
    let trend = [];
    if (period === 'today') {
      const todayStr = new Date().toISOString().slice(0, 10);
      const hourSql = `
        SELECT strftime('%H', so.purchased_at) AS hour,
               COUNT(*) AS orders,
               COALESCE(SUM(so.amount_cents), 0) AS revenue_cents
        FROM sales_orders so
        WHERE so.status = 'paid' AND date(so.purchased_at) = date('now')
          ${targetUserId ? 'AND so.user_id = ?' : ''}
        GROUP BY hour
      `;
      const { rows: hourRows } = await query(hourSql, targetUserId ? [targetUserId] : []);
      const hourMap = new Map(hourRows.map((r) => [r.hour, r]));
      for (let h = 0; h < 24; h++) {
        const hh = String(h).padStart(2, '0');
        const match = hourMap.get(hh);
        const rev = Number(match?.revenue_cents || 0);
        trend.push({
          label: `${hh}:00`,
          date: `${todayStr} ${hh}:00`,
          orders: Number(match?.orders || 0),
          revenueCents: rev,
          revenueDollars: Number((rev / 100).toFixed(2)),
        });
      }
    } else {
      const numDays = period === 'weekly' ? 7 : period === 'monthly' ? 30 : 30;
      const daySql = `
        SELECT date(so.purchased_at) AS day,
               COUNT(*) AS orders,
               COALESCE(SUM(so.amount_cents), 0) AS revenue_cents
        FROM sales_orders so
        WHERE so.status = 'paid'
          ${whereClause ? 'AND ' + conditions.join(' AND ') : ''}
        GROUP BY day
        ORDER BY day ASC
      `;
      const { rows: dayRows } = await query(daySql, params);
      const dayMap = new Map(dayRows.map((r) => [r.day, r]));

      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const match = dayMap.get(dayStr);
        const rev = Number(match?.revenue_cents || 0);
        trend.push({
          label:
            numDays === 7
              ? d.toLocaleDateString('en-US', { weekday: 'short' })
              : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: dayStr,
          fullLabel: dayName,
          orders: Number(match?.orders || 0),
          revenueCents: rev,
          revenueDollars: Number((rev / 100).toFixed(2)),
        });
      }
    }

    // 4. Top Paying Users
    const topUsersSql = `
      SELECT u.id, u.full_name, u.email, u.avatar_url, u.role,
             COUNT(so.id) AS orders_count,
             COALESCE(SUM(so.amount_cents), 0) AS total_paid_cents,
             MAX(so.purchased_at) AS last_payment_at
      FROM users u
      JOIN sales_orders so ON so.user_id = u.id AND so.status = 'paid'
      GROUP BY u.id
      ORDER BY total_paid_cents DESC
      LIMIT 10
    `;
    const { rows: topUsersRows } = await query(topUsersSql);
    const topPayingUsers = topUsersRows.map((u) => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      avatarUrl: u.avatar_url,
      role: u.role,
      ordersCount: Number(u.orders_count || 0),
      totalPaidCents: Number(u.total_paid_cents || 0),
      totalPaidDollars: Number(((u.total_paid_cents || 0) / 100).toFixed(2)),
      lastPaymentAt: u.last_payment_at,
    }));

    // 5. Recent Transactions
    const txSql = `
      SELECT so.id, so.user_id, so.amount_cents, so.currency, so.status,
             so.payment_provider, so.payment_ref, so.purchased_at,
             u.full_name, u.email,
             t.name AS template_name
      FROM sales_orders so
      LEFT JOIN users u ON u.id = so.user_id
      LEFT JOIN cv_templates t ON t.id = so.template_id
      ${whereClause}
      ORDER BY so.purchased_at DESC
      LIMIT 25
    `;
    const { rows: txRows } = await query(txSql, params);

    // 6. Selected User Details (if drilldown)
    let selectedUser = null;
    if (targetUserId) {
      const userObj = await db.users.findById(targetUserId);
      if (userObj) {
        selectedUser = {
          id: userObj.id,
          fullName: userObj.full_name,
          email: userObj.email,
          role: userObj.role,
          avatarUrl: userObj.avatar_url,
          createdAt: userObj.created_at,
        };
      }
    }

    res.json({
      period,
      from,
      to,
      userId: targetUserId,
      selectedUser,
      kpis: {
        totalRevenueCents: totalRevCents,
        totalRevenueDollars: Number((totalRevCents / 100).toFixed(2)),
        paidOrders,
        totalOrders: Number(kpis.total_orders || 0),
        payingUsers: Number(kpis.paying_users || 0),
        unpaidPotentialCents: Number(kpis.unpaid_cents || 0),
        unpaidPotentialDollars: Number(((kpis.unpaid_cents || 0) / 100).toFixed(2)),
        avgOrderCents,
        avgOrderDollars: Number((avgOrderCents / 100).toFixed(2)),
      },
      timeOfDay,
      trend,
      topPayingUsers,
      recentTransactions: txRows,
    });
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({ error: 'ANALYTICS_ERROR', message: error.message });
  }
});

// GET /api/v1/admin/reports — detailed financial reports and export data
router.get('/reports', async (req, res) => {
  try {
    const { search = '', status = 'all', period = 'all', from, to, month, year } = req.query;

    const conditions = [];
    const params = [];

    // Search
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        `(u.full_name LIKE ? OR u.email LIKE ? OR so.payment_ref LIKE ? OR t.name LIKE ? OR CAST(so.id AS TEXT) LIKE ?)`
      );
      params.push(q, q, q, q, q);
    }

    // Status filter: 'all', 'paid', 'unpaid'
    if (status === 'paid') {
      conditions.push("so.status = 'paid'");
    } else if (status === 'unpaid') {
      conditions.push("so.status != 'paid'");
    }

    // Date / Period filter
    if (from && to) {
      conditions.push('date(so.purchased_at) >= ? AND date(so.purchased_at) <= ?');
      params.push(from, to);
    } else if (from) {
      conditions.push('date(so.purchased_at) >= ?');
      params.push(from);
    } else if (to) {
      conditions.push('date(so.purchased_at) <= ?');
      params.push(to);
    } else if (month && year) {
      const formattedMonth = String(month).includes('-') ? month : `${year}-${String(month).padStart(2, '0')}`;
      conditions.push("strftime('%Y-%m', so.purchased_at) = ?");
      params.push(formattedMonth);
    } else if (month) {
      if (String(month).includes('-')) {
        conditions.push("strftime('%Y-%m', so.purchased_at) = ?");
        params.push(month);
      } else {
        conditions.push("strftime('%m', so.purchased_at) = ?");
        params.push(String(month).padStart(2, '0'));
      }
    } else if (year) {
      conditions.push("strftime('%Y', so.purchased_at) = ?");
      params.push(String(year));
    } else if (period === 'today') {
      conditions.push("date(so.purchased_at) = date('now')");
    } else if (period === 'week') {
      conditions.push("date(so.purchased_at) >= date('now', '-6 days')");
    } else if (period === 'month') {
      conditions.push("date(so.purchased_at) >= date('now', '-29 days')");
    } else if (period === 'year') {
      conditions.push("date(so.purchased_at) >= date('now', '-364 days')");
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Compute KPIs
    const kpiSql = `
      SELECT
        COALESCE(SUM(CASE WHEN so.status = 'paid' THEN so.amount_cents ELSE 0 END), 0) AS total_paid_cents,
        COUNT(CASE WHEN so.status = 'paid' THEN 1 END) AS paid_count,
        COALESCE(SUM(CASE WHEN so.status != 'paid' THEN so.amount_cents ELSE 0 END), 0) AS total_unpaid_cents,
        COUNT(CASE WHEN so.status != 'paid' THEN 1 END) AS unpaid_count,
        COALESCE(SUM(so.amount_cents), 0) AS total_money_cents,
        COUNT(*) AS total_count
      FROM sales_orders so
      LEFT JOIN users u ON u.id = so.user_id
      LEFT JOIN cv_templates t ON t.id = so.template_id
      ${whereClause}
    `;
    const { rows: kpiRows } = await query(kpiSql, params);
    const kpi = kpiRows[0] || {};

    const totalPaidCents = Number(kpi.total_paid_cents || 0);
    const totalUnpaidCents = Number(kpi.total_unpaid_cents || 0);
    const totalMoneyCents = Number(kpi.total_money_cents || 0);
    const paidCount = Number(kpi.paid_count || 0);
    const unpaidCount = Number(kpi.unpaid_count || 0);
    const totalCount = Number(kpi.total_count || 0);

    // Fetch matching orders
    const ordersSql = `
      SELECT
        so.id, so.user_id, so.amount_cents, so.currency, so.status,
        so.payment_provider, so.payment_ref, so.purchased_at,
        u.full_name, u.email,
        t.name AS template_name,
        uc.title AS cv_title
      FROM sales_orders so
      LEFT JOIN users u ON u.id = so.user_id
      LEFT JOIN cv_templates t ON t.id = so.template_id
      LEFT JOIN user_cvs uc ON uc.id = so.user_cv_id
      ${whereClause}
      ORDER BY so.purchased_at DESC
    `;
    const { rows: orders } = await query(ordersSql, params);

    res.json({
      filters: { search, status, period, from, to, month, year },
      kpis: {
        totalPaidCents,
        totalPaidDollars: Number((totalPaidCents / 100).toFixed(2)),
        paidCount,
        totalUnpaidCents,
        totalUnpaidDollars: Number((totalUnpaidCents / 100).toFixed(2)),
        unpaidCount,
        totalMoneyCents,
        totalMoneyDollars: Number((totalMoneyCents / 100).toFixed(2)),
        totalCount,
        paidPercentage: totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0,
        unpaidPercentage: totalCount > 0 ? Math.round((unpaidCount / totalCount) * 100) : 0,
        avgPaidDollars: paidCount > 0 ? Number((totalPaidCents / paidCount / 100).toFixed(2)) : 0,
      },
      orders,
    });
  } catch (err) {
    console.error('Reports endpoint error:', err);
    res.status(500).json({ error: 'REPORTS_ERROR', message: err.message });
  }
});


// ---------- Settings ----------

// GET /api/v1/admin/settings/profile
router.get('/settings/profile', async (req, res) => {
  const user = await db.users.findById(req.user.id);
  const recentActivity = await db.activityLog.list({
    pageSize: 8,
    userId: req.user.id,
  });
  const { rows: userCountRows } = await query('SELECT COUNT(*) as total FROM users');
  const { rows: cvCountRows } = await query('SELECT COUNT(*) as total FROM user_cvs');
  const { rows: loginCountRows } = await query(
    "SELECT COUNT(*) as total FROM activity_log WHERE user_id = ? AND action = 'login'",
    [req.user.id]
  );

  res.json({
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar_url,
      coverUrl: user.cover_url,
      bio: user.bio,
      themePreference: user.theme_preference,
      phone: user.phone,
      jobTitle: user.job_title,
      location: user.location,
      timezone: user.timezone,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    },
    recentActivity: recentActivity.logs || [],
    stats: {
      totalUsers: userCountRows[0]?.total || 0,
      totalDrafts: cvCountRows[0]?.total || 0,
      totalLogins: loginCountRows[0]?.total || 0,
    },
  });
});

// PUT /api/v1/admin/settings/profile
router.put('/settings/profile', async (req, res) => {
  const { fullName, avatarUrl, coverUrl, bio, themePreference, phone, jobTitle, location, timezone } = req.body;
  const user = await db.users.updateProfile(req.user.id, {
    fullName,
    avatarUrl,
    coverUrl,
    bio,
    themePreference,
    phone,
    jobTitle,
    location,
    timezone,
  });
  res.json({
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar_url,
      coverUrl: user.cover_url,
      bio: user.bio,
      themePreference: user.theme_preference,
      phone: user.phone,
      jobTitle: user.job_title,
      location: user.location,
      timezone: user.timezone,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    },
  });
});


// GET /api/v1/admin/settings/system — get platform configuration
router.get('/settings/system', async (req, res) => {
  const { rows } = await query('SELECT key, value FROM system_settings');
  const settings = {};
  rows.forEach((r) => {
    settings[r.key] = r.value;
  });
  res.json({ settings });
});

// PUT /api/v1/admin/settings/system — update platform configuration
router.put('/settings/system', async (req, res) => {
  const { settings } = req.body;
  if (settings && typeof settings === 'object') {
    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO system_settings (key, value, updated_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
        [key, String(value)]
      );
    }
  }
  const { rows } = await query('SELECT key, value FROM system_settings');
  const updated = {};
  rows.forEach((r) => {
    updated[r.key] = r.value;
  });
  res.json({ settings: updated });
});

// GET /api/v1/admin/pricing — get current homepage pricing configuration
router.get('/pricing', async (req, res) => {
  try {
    const { DEFAULT_HOMEPAGE_PRICING } = require('../config/pricing.default');
    const { rows } = await query("SELECT value FROM system_settings WHERE key = 'homepage_pricing'");
    if (rows && rows.length > 0 && rows[0].value) {
      try {
        const parsed = JSON.parse(rows[0].value);
        return res.json({ pricing: parsed });
      } catch (e) {}
    }
    res.json({ pricing: DEFAULT_HOMEPAGE_PRICING });
  } catch (err) {
    console.error('Error fetching admin pricing:', err);
    res.status(500).json({ error: 'PRICING_ERROR', message: err.message });
  }
});

// PUT /api/v1/admin/pricing — save updated homepage pricing configuration
router.put('/pricing', async (req, res) => {
  try {
    const { pricing } = req.body;
    if (!pricing || typeof pricing !== 'object') {
      return res.status(400).json({ error: 'INVALID_PRICING_PAYLOAD' });
    }

    const valueStr = JSON.stringify(pricing);
    await query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ('homepage_pricing', ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
      [valueStr]
    );

    // Synchronize cv_templates default prices in database
    const coverLetterPrice = Number(pricing.plans?.coverLetter?.priceUsd);
    const cvPrice = Number(pricing.plans?.professionalCv?.priceUsd);

    if (!isNaN(coverLetterPrice) && coverLetterPrice > 0) {
      const clCents = Math.round(coverLetterPrice * 100);
      await query(
        "UPDATE cv_templates SET price_cents = ? WHERE category = 'Cover Letter' OR name LIKE '%Cover Letter%'",
        [clCents]
      );
    }
    if (!isNaN(cvPrice) && cvPrice > 0) {
      const cvCents = Math.round(cvPrice * 100);
      await query(
        "UPDATE cv_templates SET price_cents = ? WHERE category != 'Cover Letter' AND name NOT LIKE '%Cover Letter%'",
        [cvCents]
      );
    }

    res.json({ ok: true, pricing });
  } catch (err) {
    console.error('Error saving admin pricing:', err);
    res.status(500).json({ error: 'PRICING_SAVE_ERROR', message: err.message });
  }
});

// GET /api/v1/admin/settings/users — list all admin/staff users
router.get('/settings/users', async (req, res) => {
  const { rows } = await query(
    `SELECT id, full_name, email, role, avatar_url, is_active, is_approved, last_login_at, created_at
     FROM users
     WHERE role = 'admin' OR role = 'staff'
     ORDER BY created_at ASC`
  );
  res.json({ users: rows });
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
  const { fullName, email, password, role = 'admin' } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'INVALID_INPUT', message: 'Email and password (min 8 chars) required.' });
  }
  const existing = await db.users.findByEmail(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'EMAIL_TAKEN' });

  const user = await db.users.create({
    fullName: fullName || 'Admin Team Member',
    email: email.toLowerCase(),
    password,
  });
  if (role) {
    await db.users.setRole(user.id, role === 'staff' ? 'staff' : 'admin');
    await db.users.setApproved(user.id, 1);
  }
  const updatedUser = await db.users.findById(user.id);
  res.status(201).json({ user: updatedUser });
});

// DELETE /api/v1/admin/settings/users/:id
router.delete('/settings/users/:id', async (req, res) => {
  if (parseInt(req.params.id, 10) === req.user.id) {
    return res.status(400).json({ error: 'CANNOT_REMOVE_SELF', message: 'You cannot remove your own active admin account here.' });
  }
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
  const { page, pageSize, search, action, userId } = req.query;
  const result = await db.activityLog.list({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 50,
    search: search || '',
    action: action || '',
    userId: userId ? Number(userId) : null,
  });
  const stats = await db.activityLog.getStats();
  const onlineUsers = await db.users.getOnlineUsers(15);
  stats.online = onlineUsers.filter((u) => u.is_online === 1).length;
  res.json({ ...result, stats });
});

// GET /api/v1/admin/security/stats
router.get('/security/stats', async (req, res) => {
  const stats = await db.activityLog.getStats();
  const onlineUsers = await db.users.getOnlineUsers(15);
  stats.online = onlineUsers.filter((u) => u.is_online === 1).length;
  res.json({ stats });
});

// GET /api/v1/admin/security/online-users
router.get('/security/online-users', async (req, res) => {
  const minutes = parseInt(req.query.minutes, 10) || 15;
  const users = await db.users.getOnlineUsers(minutes);
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


// ---------- Drafts & User CVs ----------

// GET /api/v1/admin/drafts
router.get('/drafts', async (req, res) => {
  try {
    const isAll = req.query.all === 'true';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = isAll ? 500 : Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 24));
    const offset = (page - 1) * pageSize;
    const search = (req.query.search || '').trim();
    const userId = req.query.userId ? parseInt(req.query.userId, 10) : null;
    const paymentStatus = req.query.paymentStatus || 'all'; // 'all', 'paid', 'unpaid'
    const draftStatus = req.query.draftStatus || 'all';     // 'all', 'draft', 'finalized'

    let whereClauses = [];
    let params = [];

    if (search) {
      whereClauses.push('(u.full_name LIKE ? OR u.email LIKE ? OR uc.title LIKE ? OR t.name LIKE ?)');
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    if (userId) {
      whereClauses.push('uc.user_id = ?');
      params.push(userId);
    }

    if (draftStatus === 'finalized') {
      whereClauses.push('uc.is_finalized = 1');
    } else if (draftStatus === 'draft') {
      whereClauses.push('uc.is_finalized = 0');
    }

    const paidExpression = `(uc.is_paid = 1 OR u.role = 'admin' OR (u.role = 'staff' AND u.is_approved = 1) OR EXISTS (
      SELECT 1 FROM sales_orders so WHERE so.status = 'paid' AND (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id))
    ))`;

    if (paymentStatus === 'paid') {
      whereClauses.push(paidExpression);
    } else if (paymentStatus === 'unpaid') {
      whereClauses.push(`NOT ${paidExpression}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(*) AS total
      FROM user_cvs uc
      JOIN users u ON u.id = uc.user_id
      JOIN cv_templates t ON t.id = uc.template_id
      ${whereSql}
    `;
    const countResult = await query(countSql, params);
    const totalItems = countResult.rows[0]?.total || 0;

    const dataSql = `
      SELECT uc.id, uc.user_id, u.full_name AS user_name, u.email AS user_email, u.avatar_url AS user_avatar, u.role AS user_role,
             t.id AS template_id, t.name AS template_name, t.category AS template_category, t.thumbnail_url, t.price_cents,
             uc.title, uc.selected_color, uc.content, uc.pdf_url, uc.is_finalized, uc.created_at, uc.updated_at,
             CASE WHEN ${paidExpression} THEN 1 ELSE 0 END AS is_paid,
             (SELECT so.id FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS order_id,
             (SELECT so.status FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS order_status,
             (SELECT so.payment_provider FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS payment_provider,
             (SELECT so.purchased_at FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS paid_at
      FROM user_cvs uc
      JOIN users u ON u.id = uc.user_id
      JOIN cv_templates t ON t.id = uc.template_id
      ${whereSql}
      ORDER BY uc.updated_at DESC
      LIMIT ? OFFSET ?
    `;

    const dataResult = await query(dataSql, [...params, pageSize, offset]);

    const drafts = dataResult.rows.map(row => {
      let parsedContent = {};
      try {
        parsedContent = typeof row.content === 'string' ? JSON.parse(row.content || '{}') : (row.content || {});
      } catch (e) {
        parsedContent = {};
      }
      return {
        ...row,
        content: parsedContent,
        is_paid: Boolean(row.is_paid),
        is_finalized: Boolean(row.is_finalized),
      };
    });

    const statsSql = `
      SELECT
        COUNT(*) AS totalDrafts,
        SUM(CASE WHEN ${paidExpression} THEN 1 ELSE 0 END) AS totalPaid,
        SUM(CASE WHEN NOT ${paidExpression} THEN 1 ELSE 0 END) AS totalUnpaid,
        COUNT(DISTINCT uc.user_id) AS totalUsersWithDrafts,
        SUM(CASE WHEN uc.is_finalized = 1 THEN 1 ELSE 0 END) AS totalFinalized
      FROM user_cvs uc
      JOIN users u ON u.id = uc.user_id
      JOIN cv_templates t ON t.id = uc.template_id
    `;
    const statsResult = await query(statsSql);
    const stats = statsResult.rows[0] || {};

    const usersSql = `
      SELECT u.id, u.full_name, u.email, u.avatar_url, u.role,
             COUNT(uc.id) AS total_drafts,
             SUM(CASE WHEN ${paidExpression} THEN 1 ELSE 0 END) AS paid_drafts,
             SUM(CASE WHEN NOT ${paidExpression} THEN 1 ELSE 0 END) AS unpaid_drafts
      FROM users u
      JOIN user_cvs uc ON uc.user_id = u.id
      JOIN cv_templates t ON t.id = uc.template_id
      GROUP BY u.id
      ORDER BY total_drafts DESC, u.full_name ASC
    `;
    const usersResult = await query(usersSql);

    res.json({
      drafts,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize) || 1,
      },
      stats: {
        totalDrafts: Number(stats.totalDrafts || 0),
        totalPaid: Number(stats.totalPaid || 0),
        totalUnpaid: Number(stats.totalUnpaid || 0),
        totalUsersWithDrafts: Number(stats.totalUsersWithDrafts || 0),
        totalFinalized: Number(stats.totalFinalized || 0),
      },
      creators: usersResult.rows.map(u => ({
        ...u,
        total_drafts: Number(u.total_drafts || 0),
        paid_drafts: Number(u.paid_drafts || 0),
        unpaid_drafts: Number(u.unpaid_drafts || 0),
      })),
    });
  } catch (error) {
    console.error('Admin drafts fetch error:', error);
    res.status(500).json({ error: 'FETCH_DRAFTS_FAILED', message: error.message });
  }
});

// GET /api/v1/admin/drafts/:id — get a single draft with full details
router.get('/drafts/:id', async (req, res) => {
  try {
    const paidExpression = `(uc.is_paid = 1 OR u.role = 'admin' OR (u.role = 'staff' AND u.is_approved = 1) OR EXISTS (
      SELECT 1 FROM sales_orders so WHERE so.status = 'paid' AND (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id))
    ))`;

    const sql = `
      SELECT uc.id, uc.user_id, u.full_name AS user_name, u.email AS user_email, u.avatar_url AS user_avatar, u.role AS user_role,
             t.id AS template_id, t.name AS template_name, t.category AS template_category, t.thumbnail_url, t.price_cents,
             uc.title, uc.selected_color, uc.content, uc.pdf_url, uc.is_finalized, uc.created_at, uc.updated_at,
             CASE WHEN ${paidExpression} THEN 1 ELSE 0 END AS is_paid,
             (SELECT so.id FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS order_id,
             (SELECT so.status FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS order_status,
             (SELECT so.payment_provider FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS payment_provider,
             (SELECT so.purchased_at FROM sales_orders so WHERE (so.user_cv_id = uc.id OR (so.user_id = uc.user_id AND so.template_id = uc.template_id)) ORDER BY so.purchased_at DESC LIMIT 1) AS paid_at
      FROM user_cvs uc
      JOIN users u ON u.id = uc.user_id
      JOIN cv_templates t ON t.id = uc.template_id
      WHERE uc.id = ?
    `;
    const result = await query(sql, [req.params.id]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'NOT_FOUND' });

    let parsedContent = {};
    try {
      parsedContent = typeof row.content === 'string' ? JSON.parse(row.content || '{}') : (row.content || {});
    } catch (e) {
      parsedContent = {};
    }

    res.json({
      draft: {
        ...row,
        content: parsedContent,
        is_paid: Boolean(row.is_paid),
        is_finalized: Boolean(row.is_finalized),
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'FETCH_DRAFT_FAILED', message: error.message });
  }
});

// PATCH /api/v1/admin/drafts/:id/toggle-paid
router.patch('/drafts/:id/toggle-paid', async (req, res) => {
  try {
    const { isPaid } = req.body;
    const targetStatus = isPaid ? 1 : 0;
    await query('UPDATE user_cvs SET is_paid = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [targetStatus, req.params.id]);
    res.json({ success: true, is_paid: Boolean(targetStatus) });
  } catch (error) {
    res.status(500).json({ error: 'UPDATE_FAILED', message: error.message });
  }
});

// DELETE /api/v1/admin/drafts/:id
router.delete('/drafts/:id', async (req, res) => {
  try {
    await query('DELETE FROM user_cvs WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'DELETE_FAILED', message: error.message });
  }
});

module.exports = router;
