import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * POST /api/contact — handles contact form submissions.
 *
 * Validates required fields and sends a richly formatted HTML email
 * to corvus@openpic.in via SMTP (configured via env vars).
 * Falls back to console logging when SMTP isn't configured.
 *
 * Single Responsibility: receive, validate, and email contact form data.
 * Separation: the UI ContactSection component handles presentation only.
 */

// ── SMTP transport (lazy singleton) ──────────────────────────────
let transport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  if (transport) return transport;

  const smtpHost = (process.env.SMTP_HOST ?? '').trim();
  const smtpUser = (process.env.SMTP_USER ?? '').trim();
  const smtpPass = (process.env.SMTP_PASS ?? '').trim();

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.info('[Contact] SMTP not configured — using dev fallback');
    return null; // fall back to console logging
  }

  transport = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (Number(process.env.SMTP_PORT) || 587) === 465,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10000, // fail fast if unreachable
  });

  return transport;
}

// ── HTML email template ──────────────────────────────────────────
function buildEmailHtml({
  name,
  email,
  company,
  message,
}: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): string {
  const companyRow = company
    ? `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.55);font-size:13px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;vertical-align:top;padding-right:20px;">Company</td><td style="padding:6px 0;color:#fff;font-size:15px;">${escHtml(company)}</td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body { margin:0; padding:0; background-color:#0a0a0a; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter",Segoe UI,Helvetica Neue,Arial,sans-serif; }
    .wrap { max-width:560px; margin:0 auto; padding:40px 24px; }
    .header { border-bottom:1px solid rgba(255,255,255,0.10); padding-bottom:24px; margin-bottom:24px; }
    .header h1 { margin:0; font-size:20px; font-weight:600; letter-spacing:-0.02em; color:#c8fffe; }
    .header p { margin:4px 0 0; font-size:13px; color:rgba(255,255,255,0.45); }
    .card { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); border-radius:8px; padding:24px; }
    table { width:100%; border-collapse:collapse; }
    td { padding:6px 0; font-size:14px; color:rgba(255,255,255,0.80); vertical-align:top; }
    td:first-child { width:90px; color:rgba(255,255,255,0.45); font-size:12px; letter-spacing:0.12em; text-transform:uppercase; padding-right:16px; }
    .msg-block { margin-top:20px; padding:16px; background:rgba(255,255,255,0.04); border-radius:6px; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.85); }
    .msg-block strong { display:block; margin-bottom:8px; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.35); }
    .footer { margin-top:24px; font-size:12px; color:rgba(255,255,255,0.25); text-align:center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Corvus</h1>
      <p>New contact form enquiry</p>
    </div>
    <div class="card">
      <table>
        <tr><td>Name</td><td>${escHtml(name)}</td></tr>
        <tr><td>Email</td><td>${escHtml(email)}</td></tr>
        ${companyRow}
      </table>
      <div class="msg-block">
        <strong>Message</strong>
        ${escHtml(message).replace(/\n/g, '<br>')}
      </div>
    </div>
    <div class="footer">
      Sent via Corvus contact form &mdash; openpic.in
    </div>
  </div>
</body>
</html>`;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Route handler ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 },
      );
    }

    const mailPayload = {
      from: process.env.SMTP_FROM
        ? process.env.SMTP_FROM.trim()
        : email,
      to: 'corvus@openpic.in',
      subject: `New enquiry from ${name} via Corvus contact form`,
      html: buildEmailHtml({ name, email, company, message }),
    };

    const t = getTransport();

    if (t) {
      // SMTP configured — actually send
      console.info('[Contact] SMTP transport available — sending email');
      try {
        await t.sendMail(mailPayload);
        console.info('[Contact] Email sent to corvus@openpic.in from', email);
      } catch (sendErr) {
        const sendMsg = sendErr instanceof Error ? sendErr.message : String(sendErr);
        console.error('[Contact] SMTP send failed:', sendMsg);
        // Don't return a 500 — the dev wants to know, but the user's message is
        // logged. Log it as a fallback so it's not lost.
        console.info('[Contact] ══ Fallback: logging enquiry to console ══');
        console.info('[Contact] To:', mailPayload.to);
        console.info('[Contact] Subject:', mailPayload.subject);
        console.info('[Contact] HTML:\n' + mailPayload.html);
      }
    } else {
      // Development fallback — log the email to console
      console.info('[Contact] ══ Enquiry received (SMTP not configured) ══');
      console.info('[Contact] To:', mailPayload.to);
      console.info('[Contact] Subject:', mailPayload.subject);
      console.info('[Contact] HTML:\n' + mailPayload.html);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Contact] Unhandled route error:', msg);
    return NextResponse.json(
      { error: 'Failed to send your message. Please try again later or email us directly.' },
      { status: 500 },
    );
  }
}