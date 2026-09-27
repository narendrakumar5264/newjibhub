import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (email, username) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
      <div style="background: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-top: 0;">Welcome to JobHub, ${username}! 👋</h2>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          Thank you for joining <strong>JobHub</strong> — your AI-powered career launchpad.
        </p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          Your account is fully activated. You can now practice verbal AI mock interviews, audit your resume against corporate ATS standards, and apply directly to top employers.
        </p>
        <div style="margin: 28px 0;">
          <a href="${frontendUrl}"
             style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Start Exploring Opportunities →
          </a>
        </div>
        <div style="border-top: 1px solid #e2e8f0; margin-top: 28px; padding-top: 20px; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">JobHub Career Platform • AI Recruitment Suite</p>
        </div>
      </div>
    </div>
  `;

  // 1. Try Resend if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'JobHub <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to JobHub! 🚀',
        html: htmlContent,
      });
      console.log(`[Email Service] Welcome email successfully sent via Resend to ${email}`);
      return true;
    } catch (resendErr) {
      console.warn('[Email Service] Resend attempt failed:', resendErr.message);
    }
  }

  // 2. Try Nodemailer if EMAIL_PASS is configured (Gmail)
  if (process.env.EMAIL_PASS) {
    try {
      const user = process.env.EMAIL_USER || 'Anishbalkhi1@gmail.com';
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"JobHub" <${user}>`,
        to: email,
        subject: 'Welcome to JobHub! 🚀',
        html: htmlContent,
      });
      console.log(`[Email Service] Welcome email successfully sent via Gmail to ${email}`);
      return true;
    } catch (mailErr) {
      console.warn('[Email Service] Nodemailer attempt failed:', mailErr.message);
    }
  }

  console.log(`[Email Service] Neither RESEND_API_KEY nor EMAIL_PASS is configured in .env. Email simulation completed for ${email}.`);
  return false;
};

export const sendPasswordResetEmail = async (email, username, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
      <div style="background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          Hello ${username}, we received a request to reset your JobHub password.
        </p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          Click the link below to set a new password. This link is valid for 1 hour.
        </p>
        <div style="margin: 28px 0;">
          <a href="${resetLink}"
             style="display: inline-block; background: #0891b2; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Reset My Password
          </a>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">If you did not request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'JobHub <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your JobHub password',
        html: htmlContent,
      });
      return true;
    } catch (e) {
      console.warn('Resend password reset email failed:', e.message);
    }
  }

  if (process.env.EMAIL_PASS) {
    try {
      const user = process.env.EMAIL_USER || 'Anishbalkhi1@gmail.com';
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"JobHub" <${user}>`,
        to: email,
        subject: 'Reset your JobHub password',
        html: htmlContent,
      });
      return true;
    } catch (e) {
      console.warn('Nodemailer password reset email failed:', e.message);
    }
  }

  return false;
};
