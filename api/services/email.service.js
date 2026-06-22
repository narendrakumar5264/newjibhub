import { Resend } from 'resend';

export const sendWelcomeEmail = async (email, username) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'JobHub <onboarding@resend.dev>',
    to: email,
    subject: 'Welcome to JobHub!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f4f4f9;border-radius:8px;">
        <div style="background:#fff;padding:30px;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
          <h2 style="color:#333;">Hello ${username} 👋</h2>
          <p style="font-size:16px;color:#555;line-height:1.6;">
            Thank you for signing up with us! We're excited to have you onboard.
          </p>
          <p style="font-size:16px;color:#555;line-height:1.6;">
            Explore our platform and find your perfect Job/Internship with ease.
          </p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
             style="display:inline-block;background:#4CAF50;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:16px;">
            Start Exploring
          </a>
          <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;color:#777;font-size:13px;">
            <p>Best regards,</p>
            <p><strong>TeamEagle (Anis &amp; Narendra)</strong></p>
            <p>Contact: <a href="mailto:jangidnarendra858@gmail.com" style="color:#4CAF50;">jangidnarendra858@gmail.com</a></p>
          </div>
        </div>
      </div>
    `,
  });
};
