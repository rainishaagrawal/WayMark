import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT || "2525", 10),
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.SMTP_FROM || '"VoyageAI" <noreply@voyageai.com>',
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CORS_ORIGIN}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to VoyageAI! ✈️</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy this link: ${verifyUrl}</p>
    </div>
  `;
  return sendEmail({ to: email, subject: "Verify your VoyageAI Account", html });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CORS_ORIGIN}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>VoyageAI Password Reset Request 🔑</h2>
      <p>You requested a password reset. Click the button below to set a new password:</p>
      <a href="${resetUrl}" style="background-color: #EF4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: "Password Reset Request - VoyageAI", html });
};
