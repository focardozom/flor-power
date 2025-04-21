import nodemailer from 'nodemailer';

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Get email configuration from environment variables
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const from = process.env.EMAIL_FROM || 'your-email@example.com';

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Flor Power" <${from}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function generateWelcomeEmail(email: string) {
  return {
    subject: 'Report on THC and CBD analysis from our recent study. Flor Power',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f5a623;
            color: white;
            padding: 10px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #f5a623;
            color: white;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for subscribing!</h1>
          </div>
          <div class="content">
            <p>Hello ${email},</p>
            <p>Thank you for subscribing to Flor Power!</p>
            <p>As a subscriber, we'd like to share our expanded report on THC and CBD analysis from our recent study.</p>
            <p>This comprehensive analysis covers THC and CBD distributions, temporal trends, and geographical variations across Colombia.</p>
            <p>
              <a href="https://focardozom.github.io/thc-analysis-col/" class="button">View the Full Report</a>
            </p>
            <p>Key findings from our study of 533 cannabis samples include:</p>
            <ul>
              <li>Average THC content: 12.8%</li>
              <li>Average CBD content: 0.9%</li>
              <li>Increasing THC levels in recent samples</li>
            </ul>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Flor Power. All rights reserved.</p>
            <p>
              If you didn't subscribe, please send an email to
              <a href="mailto:hola@figura1.com.co">hola@figura1.com.co</a>.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
} 