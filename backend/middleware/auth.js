const jwt = require('jsonwebtoken');

/**
 * requireAuth — verifies the Bearer JWT and attaches req.user.
 * Any protected route (template select, make-cv, my-cv, orders, admin/*)
 * uses this. Returns 401 so the Angular AuthGuard/HTTP interceptor can
 * redirect the user to /login.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'UNAUTHENTICATED', message: 'Login required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'UNAUTHENTICATED', message: 'Invalid or expired session.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHENTICATED' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'FORBIDDEN', message: 'Admin access only.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
