import { Router } from 'express';
import nodemailer from 'nodemailer';
import auth from '../middleware/auth.js';

const router = Router();

// ── Nodemailer transporter (reusable) ──────────────────────
// Configure via env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FEEDBACK_TO_EMAIL
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Gmail: use App Password
    },
  });
  return transporter;
}

const FEEDBACK_TO = () => process.env.FEEDBACK_TO_EMAIL || process.env.SMTP_USER;

async function sendFeedbackEmail({ type, subject, description, userEmail, userName }) {
  const typeLabel = type === 'bug' ? '🐛 Bug Report' : '💡 Feature Request';
  const mailOptions = {
    from: `"FitBuddy Feedback" <${process.env.SMTP_USER}>`,
    to: FEEDBACK_TO(),
    replyTo: userEmail,
    subject: `[FitBuddy ${type.toUpperCase()}] ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#e4e4e7;background:#18181b;padding:28px;border-radius:12px;">
        <h2 style="color:#a78bfa;margin-top:0;">${typeLabel}</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr><td style="color:#71717a;padding:4px 8px;width:90px;">From</td><td style="color:#e4e4e7;padding:4px 8px;">${userName} &lt;${userEmail}&gt;</td></tr>
          <tr><td style="color:#71717a;padding:4px 8px;">Subject</td><td style="color:#e4e4e7;padding:4px 8px;font-weight:600;">${subject}</td></tr>
        </table>
        <div style="background:#27272a;padding:16px;border-radius:8px;color:#d4d4d8;line-height:1.6;white-space:pre-wrap;">${description}</div>
        <p style="color:#52525b;font-size:12px;margin-top:16px;margin-bottom:0;">Sent via FitBuddy Feedback System</p>
      </div>
    `,
  };

  await getTransporter().sendMail(mailOptions);
}

// POST /api/feedback/bug
router.post('/bug', auth, async (req, res) => {
  try {
    const { subject, description } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }

    // Always log to console as fallback
    console.log(`[BUG REPORT] User: ${req.user.email} | Subject: ${subject}`);

    // Send email if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendFeedbackEmail({
        type: 'bug',
        subject,
        description,
        userEmail: req.user.email,
        userName: req.user.name,
      });
    }

    res.json({ message: 'Bug report sent. Thank you!' });
  } catch (error) {
    console.error('Feedback bug error:', error);
    // Still return success — we logged it, email is best-effort
    res.json({ message: 'Bug report received. Thank you!' });
  }
});

// POST /api/feedback/feature
router.post('/feature', auth, async (req, res) => {
  try {
    const { subject, description } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }

    console.log(`[FEATURE REQUEST] User: ${req.user.email} | Subject: ${subject}`);

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendFeedbackEmail({
        type: 'feature',
        subject,
        description,
        userEmail: req.user.email,
        userName: req.user.name,
      });
    }

    res.json({ message: 'Feature suggestion sent. Thank you!' });
  } catch (error) {
    console.error('Feedback feature error:', error);
    res.json({ message: 'Feature suggestion received. Thank you!' });
  }
});

export default router;
