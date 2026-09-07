const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/email.service');
const { sendTicketNotification } = require('../services/telegram.service');

// POST /api/v1/contact — public inquiry & support ticket form
router.post('/', async (req, res) => {
  const { name, email, subject, message, orderId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'INVALID_INPUT', message: 'Message content is required.' });
  }

  const senderName = (name && name.trim()) || 'Website Customer';
  const senderEmail = (email && email.trim()) || 'Not provided';
  const senderSubject = (subject && subject.trim()) || 'Help Inquiry';

  // 1. Dispatch directly to user's Telegram Ticket Bot (@cqticketproblemreport_bot)
  let telegramSent = false;
  let telegramResult = null;
  try {
    telegramResult = await sendTicketNotification({
      name: senderName,
      email: senderEmail,
      subject: senderSubject,
      message,
      orderId,
    });
    telegramSent = !!telegramResult?.ok;
    console.log('[Contact] Ticket notification sent to Telegram bot:', telegramSent ? 'SUCCESS' : 'WARN', telegramResult?.description || '');
  } catch (tgErr) {
    console.warn('[Contact] Telegram ticket notification error:', tgErr.message);
  }

  // 2. Dispatch email if SMTP configured (optional)
  try {
    await sendContactEmail({ name: senderName, email: senderEmail, subject: senderSubject, message });
  } catch (emailErr) {
    console.warn('[Contact] Contact email delivery skipped/failed:', emailErr.message);
  }

  // Acknowledge ticket acceptance
  res.status(202).json({
    sent: true,
    telegramDelivered: telegramSent,
    ticketId: telegramResult?.result?.message_id || Date.now(),
    message: 'Ticket received and forwarded to support team successfully.'
  });
});

module.exports = router;

