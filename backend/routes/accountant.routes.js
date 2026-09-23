const express = require('express');
const router = express.Router();
const { requireAuth, requireAccountantOrAdmin } = require('../middleware/auth');
const { query } = require('../db/pool');
const activityLog = require('../db/activityLog.db');

router.use(requireAuth, requireAccountantOrAdmin);

// ═════════════════════════════════════════════════════════════════════════════
// 1. GET /api/v1/accountant/overview
// ═════════════════════════════════════════════════════════════════════════════
router.get('/overview', async (req, res, next) => {
  try {
    const [kpiRes, todayRes, recentRes, statusRes] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as totalOrders,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_cents ELSE 0 END), 0) as paidRevenueCents,
          COALESCE(SUM(CASE WHEN status = 'paid' AND amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as paidIncomeCents,
          COALESCE(SUM(CASE WHEN status = 'paid' AND amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as paidExpenseCents,
          COALESCE(SUM(amount_cents), 0) as grossRevenueCents,
          COUNT(CASE WHEN status = 'paid' THEN 1 END) as paidCount,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingCount,
          COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refundedCount,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failedCount
        FROM sales_orders
      `),
      query(`
        SELECT 
          COUNT(*) as todayOrders,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_cents ELSE 0 END), 0) as todayRevenueCents,
          COALESCE(SUM(CASE WHEN status = 'paid' AND amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as todayIncomeCents,
          COALESCE(SUM(CASE WHEN status = 'paid' AND amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as todayExpenseCents
        FROM sales_orders
        WHERE DATE(purchased_at) = DATE('now')
      `),
      query(`
        SELECT 
          so.id, so.user_id, so.template_id, so.amount_cents, so.currency, so.status, 
          so.payment_provider, so.payment_ref, so.notes, so.entry_type, so.purchased_at,
          u.full_name as customer_name, u.email as customer_email, 
          COALESCE(t.name, 'Custom Career Service') as template_name
        FROM sales_orders so
        LEFT JOIN users u ON so.user_id = u.id
        LEFT JOIN cv_templates t ON so.template_id = t.id
        ORDER BY so.purchased_at DESC, so.id DESC
        LIMIT 12
      `),
      query(`
        SELECT COALESCE(payment_provider, 'Standard Checkout') as provider, COUNT(*) as orderCount, 
               COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_cents ELSE 0 END), 0) as totalCents
        FROM sales_orders 
        GROUP BY payment_provider
      `)
    ]);

    const kpi = kpiRes.rows[0] || {};
    const today = todayRes.rows[0] || {};
    const paidRevenue = (kpi.paidRevenueCents || 0) / 100;
    const paidIncome = (kpi.paidIncomeCents || 0) / 100;
    const paidExpense = (kpi.paidExpenseCents || 0) / 100;
    const paidCount = kpi.paidCount || 0;
    const aov = paidCount > 0 ? Number((paidIncome / paidCount).toFixed(2)) : 0;
    const gatewayFees = Number((paidIncome * 0.015).toFixed(2));
    const netProfit = Number((paidRevenue - gatewayFees).toFixed(2));

    res.json({
      kpis: {
        totalRevenue: paidRevenue,
        totalIncome: paidIncome,
        totalExpense: paidExpense,
        grossRevenue: (kpi.grossRevenueCents || 0) / 100,
        totalOrders: kpi.totalOrders || 0,
        paidOrders: paidCount,
        pendingOrders: kpi.pendingCount || 0,
        refundedOrders: kpi.refundedCount || 0,
        failedOrders: kpi.failedCount || 0,
        averageOrderValue: aov,
        todayRevenue: (today.todayRevenueCents || 0) / 100,
        todayIncome: (today.todayIncomeCents || 0) / 100,
        todayExpense: (today.todayExpenseCents || 0) / 100,
        todayOrders: today.todayOrders || 0,
        estimatedFees: gatewayFees,
        estimatedNetProfit: netProfit,
      },
      paymentProviders: statusRes.rows.map(r => ({
        provider: r.provider,
        count: r.orderCount,
        revenue: (r.totalCents || 0) / 100
      })),
      recentTransactions: recentRes.rows.map(r => ({
        ...r,
        amount: (r.amount_cents || 0) / 100,
        entry_type: r.entry_type || (r.amount_cents < 0 ? 'expense' : 'income')
      })),
    });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. GET /api/v1/accountant/transactions (Filtered & Paginated Ledger)
// ═════════════════════════════════════════════════════════════════════════════
router.get('/transactions', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
    const offset = (page - 1) * pageSize;
    const { status, type, search, from, to } = req.query;

    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
      conditions.push('so.status = ?');
      params.push(status);
    }

    if (type === 'income') {
      conditions.push("(so.entry_type = 'income' OR (so.entry_type IS NULL AND so.amount_cents >= 0))");
    } else if (type === 'expense') {
      conditions.push("(so.entry_type = 'expense' OR so.amount_cents < 0)");
    }

    if (search) {
      conditions.push('(u.full_name LIKE ? OR u.email LIKE ? OR so.payment_ref LIKE ? OR so.notes LIKE ? OR t.name LIKE ?)');
      const s = '%' + search + '%';
      params.push(s, s, s, s, s);
    }

    if (from) {
      conditions.push('DATE(so.purchased_at) >= DATE(?)');
      params.push(from);
    }
    if (to) {
      conditions.push('DATE(so.purchased_at) <= DATE(?)');
      params.push(to);
    }

    const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countRes = await query(
      `SELECT COUNT(*) as total FROM sales_orders so 
       LEFT JOIN users u ON so.user_id = u.id 
       LEFT JOIN cv_templates t ON so.template_id = t.id ${whereClause}`,
      params
    );

    const dataRes = await query(
      `SELECT 
         so.id, so.user_id, so.template_id, so.amount_cents, so.currency, so.status, 
         so.payment_provider, so.payment_ref, so.notes, so.entry_type, so.purchased_at,
         u.full_name as customer_name, u.email as customer_email, 
         COALESCE(t.name, 'Custom Career Service') as template_name
       FROM sales_orders so
       LEFT JOIN users u ON so.user_id = u.id
       LEFT JOIN cv_templates t ON so.template_id = t.id
       ${whereClause}
       ORDER BY so.purchased_at DESC, so.id DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const total = countRes.rows[0]?.total || 0;
    res.json({
      items: dataRes.rows.map(r => ({
        ...r,
        amount: (r.amount_cents || 0) / 100,
        entry_type: r.entry_type || (r.amount_cents < 0 ? 'expense' : 'income')
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1
      }
    });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. GET /api/v1/accountant/users (For customer picker dropdown)
// ═════════════════════════════════════════════════════════════════════════════
router.get('/users', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, email, full_name, role FROM users ORDER BY full_name ASC, email ASC'
    );
    res.json({ users: rows });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. GET /api/v1/accountant/templates (For service/product picker dropdown)
// ═════════════════════════════════════════════════════════════════════════════
router.get('/templates', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, name, price_cents FROM cv_templates ORDER BY id ASC'
    );
    res.json({ templates: rows });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. POST /api/v1/accountant/transactions (Add Money [+] / Deduct Money [-])
// ═════════════════════════════════════════════════════════════════════════════
router.post('/transactions', async (req, res, next) => {
  try {
    const {
      type = 'income', // 'income' | 'expense'
      amount,
      userId,
      templateId,
      paymentProvider = 'bakong_khqr',
      paymentRef,
      status = 'paid',
      notes = '',
      purchasedAt
    } = req.body;

    const numAmount = Math.abs(Number(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'INVALID_AMOUNT', message: 'Amount must be a positive number.' });
    }

    const isExpense = type === 'expense';
    const amountCents = isExpense ? -Math.round(numAmount * 100) : Math.round(numAmount * 100);
    const assignedUserId = Number(userId) || req.user.id;
    const assignedTemplateId = Number(templateId) || 1;
    const dateValue = purchasedAt ? new Date(purchasedAt).toISOString().replace('T', ' ').slice(0, 19) : null;

    let insertQuery;
    let insertParams;

    if (dateValue) {
      insertQuery = `
        INSERT INTO sales_orders 
          (user_id, template_id, amount_cents, currency, status, payment_provider, payment_ref, notes, entry_type, purchased_at)
        VALUES (?, ?, ?, 'USD', ?, ?, ?, ?, ?, ?)
      `;
      insertParams = [assignedUserId, assignedTemplateId, amountCents, status, paymentProvider, paymentRef || null, notes || null, type, dateValue];
    } else {
      insertQuery = `
        INSERT INTO sales_orders 
          (user_id, template_id, amount_cents, currency, status, payment_provider, payment_ref, notes, entry_type)
        VALUES (?, ?, ?, 'USD', ?, ?, ?, ?, ?)
      `;
      insertParams = [assignedUserId, assignedTemplateId, amountCents, status, paymentProvider, paymentRef || null, notes || null, type];
    }

    const result = await query(insertQuery, insertParams);
    const createdId = result.lastID;

    // Fetch the newly created record with joined customer and template name
    const fetchRes = await query(`
      SELECT 
        so.id, so.user_id, so.template_id, so.amount_cents, so.currency, so.status, 
        so.payment_provider, so.payment_ref, so.notes, so.entry_type, so.purchased_at,
        u.full_name as customer_name, u.email as customer_email, 
        COALESCE(t.name, 'Custom Career Service') as template_name
      FROM sales_orders so
      LEFT JOIN users u ON so.user_id = u.id
      LEFT JOIN cv_templates t ON so.template_id = t.id
      WHERE so.id = ?
    `, [createdId]);

    const record = fetchRes.rows[0];

    // Log to activity log
    try {
      await activityLog.log({
        userId: req.user.id,
        email: req.user.email,
        action: isExpense ? 'accountant_deduct_money' : 'accountant_add_money',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (_) {}

    res.status(201).json({
      success: true,
      message: isExpense ? 'Deduction recorded successfully.' : 'Payment added successfully.',
      transaction: {
        ...record,
        amount: (record.amount_cents || 0) / 100,
        entry_type: record.entry_type || type
      }
    });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. PUT /api/v1/accountant/transactions/:id (Edit Transaction)
// ═════════════════════════════════════════════════════════════════════════════
router.put('/transactions/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await query('SELECT * FROM sales_orders WHERE id = ?', [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Transaction record not found.' });
    }

    const {
      type,
      amount,
      status,
      paymentProvider,
      paymentRef,
      notes,
      userId,
      templateId,
      purchasedAt
    } = req.body;

    const current = existing.rows[0];
    const newType = type || current.entry_type || (current.amount_cents < 0 ? 'expense' : 'income');
    const isExpense = newType === 'expense';

    let amountCents = current.amount_cents;
    if (amount !== undefined && amount !== null) {
      const numAmount = Math.abs(Number(amount));
      if (!isNaN(numAmount)) {
        amountCents = isExpense ? -Math.round(numAmount * 100) : Math.round(numAmount * 100);
      }
    } else if (type && (isExpense ? current.amount_cents > 0 : current.amount_cents < 0)) {
      amountCents = -current.amount_cents;
    }

    const newStatus = status || current.status;
    const newProvider = paymentProvider !== undefined ? paymentProvider : current.payment_provider;
    const newRef = paymentRef !== undefined ? paymentRef : current.payment_ref;
    const newNotes = notes !== undefined ? notes : current.notes;
    const newUserId = userId ? Number(userId) : current.user_id;
    const newTemplateId = templateId ? Number(templateId) : current.template_id;
    const newPurchasedAt = purchasedAt ? new Date(purchasedAt).toISOString().replace('T', ' ').slice(0, 19) : current.purchased_at;

    await query(`
      UPDATE sales_orders SET
        user_id = ?,
        template_id = ?,
        amount_cents = ?,
        status = ?,
        payment_provider = ?,
        payment_ref = ?,
        notes = ?,
        entry_type = ?,
        purchased_at = ?
      WHERE id = ?
    `, [newUserId, newTemplateId, amountCents, newStatus, newProvider, newRef, newNotes, newType, newPurchasedAt, id]);

    const fetchRes = await query(`
      SELECT 
        so.id, so.user_id, so.template_id, so.amount_cents, so.currency, so.status, 
        so.payment_provider, so.payment_ref, so.notes, so.entry_type, so.purchased_at,
        u.full_name as customer_name, u.email as customer_email, 
        COALESCE(t.name, 'Custom Career Service') as template_name
      FROM sales_orders so
      LEFT JOIN users u ON so.user_id = u.id
      LEFT JOIN cv_templates t ON so.template_id = t.id
      WHERE so.id = ?
    `, [id]);

    const record = fetchRes.rows[0];

    try {
      await activityLog.log({
        userId: req.user.id,
        email: req.user.email,
        action: 'accountant_edit_transaction',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (_) {}

    res.json({
      success: true,
      message: 'Transaction updated successfully.',
      transaction: {
        ...record,
        amount: (record.amount_cents || 0) / 100,
        entry_type: record.entry_type || newType
      }
    });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. DELETE /api/v1/accountant/transactions/:id (Delete Transaction)
// ═════════════════════════════════════════════════════════════════════════════
router.delete('/transactions/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await query('SELECT * FROM sales_orders WHERE id = ?', [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Transaction record not found.' });
    }

    await query('DELETE FROM sales_orders WHERE id = ?', [id]);

    try {
      await activityLog.log({
        userId: req.user.id,
        email: req.user.email,
        action: 'accountant_delete_transaction',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (_) {}

    res.json({
      success: true,
      message: 'Transaction permanently deleted from database.',
      id
    });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. GET /api/v1/accountant/analytics (Period: day, week, month, year)
// ═════════════════════════════════════════════════════════════════════════════
router.get('/analytics', async (req, res, next) => {
  try {
    const period = (req.query.period || 'month').toLowerCase(); // 'day' | 'week' | 'month' | 'year'
    const targetDate = req.query.date || null; // e.g. '2026-09-23'

    let series = [];
    let whereCondition = "status = 'paid'";
    let params = [];

    if (period === 'day') {
      const selectedDay = targetDate || "date('now')";
      const hourlyRes = await query(`
        SELECT 
          strftime('%H', purchased_at) as hour,
          COUNT(*) as orders,
          COALESCE(SUM(CASE WHEN amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as incomeCents,
          COALESCE(SUM(CASE WHEN amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as expenseCents,
          COALESCE(SUM(amount_cents), 0) as netCents
        FROM sales_orders
        WHERE status = 'paid' AND DATE(purchased_at) = ${targetDate ? 'DATE(?)' : "DATE('now')"}
        GROUP BY hour
        ORDER BY hour ASC
      `, targetDate ? [targetDate] : []);

      const hourMap = new Map();
      hourlyRes.rows.forEach(r => {
        hourMap.set(r.hour, {
          orders: r.orders,
          revenue: (r.netCents || 0) / 100,
          income: (r.incomeCents || 0) / 100,
          expense: (r.expenseCents || 0) / 100,
        });
      });

      for (let h = 0; h < 24; h++) {
        const hh = String(h).padStart(2, '0');
        const data = hourMap.get(hh) || { orders: 0, revenue: 0, income: 0, expense: 0 };
        series.push({
          label: `${hh}:00`,
          key: hh,
          orders: data.orders,
          revenue: data.revenue,
          income: data.income,
          expense: data.expense
        });
      }
      whereCondition += targetDate ? " AND DATE(purchased_at) = DATE(?)" : " AND DATE(purchased_at) = DATE('now')";
      if (targetDate) params.push(targetDate);

    } else if (period === 'week') {
      const dailyRes = await query(`
        SELECT 
          DATE(purchased_at) as dayStr,
          COUNT(*) as orders,
          COALESCE(SUM(CASE WHEN amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as incomeCents,
          COALESCE(SUM(CASE WHEN amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as expenseCents,
          COALESCE(SUM(amount_cents), 0) as netCents
        FROM sales_orders
        WHERE status = 'paid' AND purchased_at >= date('now', '-6 days')
        GROUP BY dayStr
        ORDER BY dayStr ASC
      `);

      const dayMap = new Map();
      dailyRes.rows.forEach(r => {
        dayMap.set(r.dayStr, {
          orders: r.orders,
          revenue: (r.netCents || 0) / 100,
          income: (r.incomeCents || 0) / 100,
          expense: (r.expenseCents || 0) / 100,
        });
      });

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ymd = d.toISOString().slice(0, 10);
        const dayLabel = `${dayNames[d.getDay()]} (${d.getMonth() + 1}/${d.getDate()})`;
        const data = dayMap.get(ymd) || { orders: 0, revenue: 0, income: 0, expense: 0 };
        series.push({
          label: dayLabel,
          key: ymd,
          orders: data.orders,
          revenue: data.revenue,
          income: data.income,
          expense: data.expense
        });
      }
      whereCondition += " AND purchased_at >= date('now', '-6 days')";

    } else if (period === 'year') {
      const monthlyRes = await query(`
        SELECT 
          strftime('%Y-%m', purchased_at) as month,
          COUNT(*) as orders,
          COALESCE(SUM(CASE WHEN amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as incomeCents,
          COALESCE(SUM(CASE WHEN amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as expenseCents,
          COALESCE(SUM(amount_cents), 0) as netCents
        FROM sales_orders
        WHERE status = 'paid' AND purchased_at >= date('now', '-11 months', 'start of month')
        GROUP BY month
        ORDER BY month ASC
      `);

      const monthMap = new Map();
      monthlyRes.rows.forEach(r => {
        monthMap.set(r.month, {
          orders: r.orders,
          revenue: (r.netCents || 0) / 100,
          income: (r.incomeCents || 0) / 100,
          expense: (r.expenseCents || 0) / 100,
        });
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
        const data = monthMap.get(ym) || { orders: 0, revenue: 0, income: 0, expense: 0 };
        series.push({
          label,
          key: ym,
          orders: data.orders,
          revenue: data.revenue,
          income: data.income,
          expense: data.expense
        });
      }
      whereCondition += " AND purchased_at >= date('now', '-11 months', 'start of month')";

    } else {
      // Default: 'month' (last 30 days)
      const dailyRes = await query(`
        SELECT 
          DATE(purchased_at) as dayStr,
          COUNT(*) as orders,
          COALESCE(SUM(CASE WHEN amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as incomeCents,
          COALESCE(SUM(CASE WHEN amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as expenseCents,
          COALESCE(SUM(amount_cents), 0) as netCents
        FROM sales_orders
        WHERE status = 'paid' AND purchased_at >= date('now', '-29 days')
        GROUP BY dayStr
        ORDER BY dayStr ASC
      `);

      const dayMap = new Map();
      dailyRes.rows.forEach(r => {
        dayMap.set(r.dayStr, {
          orders: r.orders,
          revenue: (r.netCents || 0) / 100,
          income: (r.incomeCents || 0) / 100,
          expense: (r.expenseCents || 0) / 100,
        });
      });

      for (let i = 29; i >= 0; i -= 2) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ymd = d.toISOString().slice(0, 10);
        const label = `${d.getMonth() + 1}/${d.getDate()}`;
        const data = dayMap.get(ymd) || { orders: 0, revenue: 0, income: 0, expense: 0 };
        series.push({
          label,
          key: ymd,
          orders: data.orders,
          revenue: data.revenue,
          income: data.income,
          expense: data.expense
        });
      }
      whereCondition += " AND purchased_at >= date('now', '-29 days')";
    }

    // Top services & provider distribution
    const [serviceRes, providerRes, summaryRes] = await Promise.all([
      query(`
        SELECT COALESCE(t.name, 'Custom Career Service') as serviceName, 
               COUNT(*) as salesCount, 
               COALESCE(SUM(so.amount_cents), 0) as totalCents
        FROM sales_orders so 
        LEFT JOIN cv_templates t ON so.template_id = t.id 
        WHERE ${whereCondition}
        GROUP BY serviceName 
        ORDER BY totalCents DESC 
        LIMIT 6
      `, params),
      query(`
        SELECT 
          CASE 
            WHEN payment_provider LIKE '%bakong%' THEN 'Bakong KHQR'
            WHEN payment_provider LIKE '%stripe%' OR payment_provider LIKE '%card%' THEN 'Card / Visa'
            WHEN payment_provider LIKE '%cash%' THEN 'Cash In-Person'
            WHEN payment_provider LIKE '%aba%' THEN 'ABA Bank'
            ELSE 'Direct / Other'
          END as providerCategory, 
          COUNT(*) as count, 
          COALESCE(SUM(amount_cents), 0) as totalCents
        FROM sales_orders 
        WHERE ${whereCondition}
        GROUP BY providerCategory
      `, params),
      query(`
        SELECT 
          COUNT(*) as orderCount,
          COALESCE(SUM(CASE WHEN amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as incomeCents,
          COALESCE(SUM(CASE WHEN amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as expenseCents,
          COALESCE(SUM(amount_cents), 0) as netCents
        FROM sales_orders 
        WHERE ${whereCondition}
      `, params)
    ]);

    const sum = summaryRes.rows[0] || {};
    const totalRev = (sum.netCents || 0) / 100;
    const totalInc = (sum.incomeCents || 0) / 100;
    const totalExp = (sum.expenseCents || 0) / 100;
    const orderCount = sum.orderCount || 0;
    const aov = orderCount > 0 ? Number((totalInc / orderCount).toFixed(2)) : 0;

    res.json({
      period,
      series,
      summary: {
        totalRevenue: totalRev,
        totalIncome: totalInc,
        totalExpense: totalExp,
        orderCount,
        averageOrderValue: aov,
      },
      topServices: serviceRes.rows.map(r => ({
        name: r.serviceName,
        count: r.salesCount,
        revenue: (r.totalCents || 0) / 100
      })),
      providers: providerRes.rows.map(r => ({
        name: r.providerCategory,
        count: r.count,
        revenue: (r.totalCents || 0) / 100
      })),
    });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 9. GET /api/v1/accountant/reports (Financial Statement)
// ═════════════════════════════════════════════════════════════════════════════
router.get('/reports', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const conditions = ["status = 'paid'"];
    const params = [];

    if (from) {
      conditions.push('DATE(purchased_at) >= DATE(?)');
      params.push(from);
    }
    if (to) {
      conditions.push('DATE(purchased_at) <= DATE(?)');
      params.push(to);
    }

    const whereClause = 'WHERE ' + conditions.join(' AND ');

    const summaryRes = await query(`
      SELECT 
        COUNT(*) as totalTransactions, 
        COALESCE(SUM(CASE WHEN amount_cents > 0 THEN amount_cents ELSE 0 END), 0) as grossRevenueCents,
        COALESCE(SUM(CASE WHEN amount_cents < 0 THEN ABS(amount_cents) ELSE 0 END), 0) as deductionsCents,
        COALESCE(SUM(amount_cents), 0) as netRevenueCents,
        COALESCE(AVG(CASE WHEN amount_cents > 0 THEN amount_cents ELSE NULL END), 0) as avgOrderCents 
      FROM sales_orders ${whereClause}
    `, params);

    const summary = summaryRes.rows[0] || {};
    const grossRev = (summary.grossRevenueCents || 0) / 100;
    const manualDeductions = (summary.deductionsCents || 0) / 100;
    const feeRate = 0.015;
    const gatewayFees = Number((grossRev * feeRate).toFixed(2));
    const hostingEstimate = 15.00;
    const netOperatingIncome = Math.max(0, Number((grossRev - gatewayFees - hostingEstimate - manualDeductions).toFixed(2)));

    res.json({
      period: { from: from || 'All time', to: to || 'Today' },
      summary: {
        totalTransactions: summary.totalTransactions || 0,
        grossRevenue: grossRev,
        gatewayFees,
        infrastructureCosts: hostingEstimate,
        manualDeductions,
        netOperatingIncome,
        taxWithheld10Pct: Number((netOperatingIncome * 0.10).toFixed(2)),
        netIncomeAfterTax: Number((netOperatingIncome * 0.90).toFixed(2)),
      },
    });
  } catch (err) { next(err); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 10. POST /api/v1/accountant/calculate (Live Tax / Margin Engine)
// ═════════════════════════════════════════════════════════════════════════════
router.post('/calculate', (req, res) => {
  const {
    grossSales = 0,
    costOfGoods = 0,
    operatingExpenses = 0,
    taxRate = 10,
    exchangeRateKhr = 4100,
    discountPercent = 0
  } = req.body;

  const discountedGross = grossSales * (1 - (discountPercent / 100));
  const grossProfit = discountedGross - costOfGoods;
  const netBeforeTax = grossProfit - operatingExpenses;
  const taxAmount = Math.max(0, netBeforeTax * (taxRate / 100));
  const netIncome = netBeforeTax - taxAmount;
  const profitMarginPercent = discountedGross > 0 ? (netIncome / discountedGross) * 100 : 0;

  res.json({
    discountedGross: Number(discountedGross.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    netBeforeTax: Number(netBeforeTax.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    netIncome: Number(netIncome.toFixed(2)),
    profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
    inKhr: {
      netIncomeKhr: Math.round(netIncome * exchangeRateKhr),
      grossSalesKhr: Math.round(discountedGross * exchangeRateKhr),
      taxAmountKhr: Math.round(taxAmount * exchangeRateKhr),
    }
  });
});

module.exports = router;