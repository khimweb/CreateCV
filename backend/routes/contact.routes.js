const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/email.service');

// POST /api/v1/contact — public inquiry form -> sokkhim519@gmail.com
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'INVALID_INPUT', message: 'Name, email, and message are required.' });
  }

  try {
    await sendContactEmail({ name, email, subject, message });
    res.status(202).json({ sent: true });
  } catch (err) {
    console.error('Contact email failed:', err.message);
    res.status(502).json({ error: 'EMAIL_SEND_FAILED' });
  }
});

module.exports = router;
