import nodemailer from "nodemailer"

// Use environment variables for production. 
// If not provided, it logs a warning but won't crash, allowing local dev to continue.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWelcomeEmail(email: string, name: string, tempPassword: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured. Skipping actual email send.")
    console.log(`[MOCK EMAIL] To: ${email} | Temp Password: ${tempPassword}`)
    return true
  }

  try {
    const info = await transporter.sendMail({
      from: `"SADI CRM" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to SADI CRM - Your Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #060097; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to SADI CRM</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">Hello ${name},</p>
            <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">
              Your account has been created successfully. You can log in to the CRM using the credentials below:
            </p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>
            <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">
              For security purposes, you will be prompted to change this password immediately upon your first login.
            </p>
            <a href="${process.env.NEXTAUTH_URL || 'https://saditraining.co.ke'}/login" 
               style="display: inline-block; background-color: #00b1f8; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Log in to your account
            </a>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Southern Africa Development Institute. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    console.log("Message sent: %s", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}
