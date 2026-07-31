const { query } = require('./pool');

async function findById(id) {
    const { rows } = await query('SELECT * FROM sales_orders WHERE id = ?', [id]);
    return rows[0] || null;
  }
  

async function create({ userId, templateId, userCvId, amountCents, currency = 'USD' }) {
    const result = await query(
      `INSERT INTO sales_orders (user_id, template_id, user_cv_id, amount_cents, currency, status)
       VALUES (?,?,?,?,?,'pending')`,
      [userId, templateId, userCvId || null, amountCents, currency]
    );
    const { lastID } = result;
    return findById(lastID);
  }
  
  async function markPaid(id, { paymentProvider, paymentRef }) {
    await query(
      `UPDATE sales_orders SET status = 'paid', payment_provider = ?, payment_ref = ?
       WHERE id = ?`,
      [paymentProvider, paymentRef, id]
    );
    return findById(id);
  }
  
  async function findByUser(userId) {
    const { rows } = await query(
      `SELECT so.*, t.name AS template_name
       FROM sales_orders so JOIN cv_templates t ON t.id = so.template_id
       WHERE so.user_id = ? ORDER BY so.purchased_at DESC`,
      [userId]
    );
    return rows;
  }
  
  /** KPI: total revenue in cents across paid orders */
  async function totalRevenueCents({ from, to } = {}) {
    const { rows } = await query(
      `SELECT COALESCE(SUM(amount_cents), 0) AS total
       FROM sales_orders
       WHERE status = 'paid'
         AND (? IS NULL OR purchased_at >= ?)
         AND (? IS NULL OR purchased_at <= ?)`,
      [from || null, from || null, to || null, to || null]
    );
    return Number(rows[0].total);
  }
  
  async function countOrders({ from, to } = {}) {
    const { rows } = await query(
      `SELECT COUNT(*) AS total FROM sales_orders
       WHERE (? IS NULL OR purchased_at >= ?)
         AND (? IS NULL OR purchased_at <= ?)`,
      [from || null, from || null, to || null, to || null]
    );
    return rows[0].total;
  }
  
  async function countSoldTemplates() {
    const { rows } = await query("SELECT COUNT(*) AS total FROM sales_orders WHERE status = 'paid'");
    return rows[0].total;
  }
  
  /** Sales telemetry grouped by time-of-day bucket for the reports screen */
  async function reportByTimeOfDay({ from, to } = {}) {
    const { rows } = await query(
      `SELECT
         CASE
           WHEN strftime('%H', purchased_at) BETWEEN '05' AND '11' THEN 'morning'
           WHEN strftime('%H', purchased_at) BETWEEN '12' AND '17' THEN 'afternoon'
           ELSE 'evening'
         END AS bucket,
         COUNT(*) AS orders,
         COALESCE(SUM(amount_cents), 0) AS revenue_cents
       FROM sales_orders
       WHERE status = 'paid'
         AND (? IS NULL OR purchased_at >= ?)
         AND (? IS NULL OR purchased_at <= ?)
       GROUP BY bucket`,
      [from || null, from || null, to || null, to || null]
    );
    return rows;
  }
  
  async function reportByDate({ from, to } = {}) {
    const { rows } = await query(
      `SELECT date(purchased_at) AS date, COUNT(*) AS orders,
              COALESCE(SUM(amount_cents), 0) AS revenue_cents
       FROM sales_orders
       WHERE status = 'paid'
         AND (? IS NULL OR purchased_at >= ?)
         AND (? IS NULL OR purchased_at <= ?)
       GROUP BY date ORDER BY date DESC`,
      [from || null, from || null, to || null, to || null]
    );
    return rows;
  }
  
  module.exports = {
    create, markPaid, findByUser, findById,
    totalRevenueCents, countOrders, countSoldTemplates,
    reportByTimeOfDay, reportByDate,
  };
  
