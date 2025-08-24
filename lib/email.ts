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
      from: `"Flower Power" <${from}>`,
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

export function generateWelcomeEmail(email: string, language: 'en' | 'es' = 'es') {
  const content = language === 'es' ? {
    subject: 'Reporte de análisis de THC y CBD de nuestro estudio reciente. Flower Power',
    greeting: 'Hola',
    thankYou: '¡Gracias por suscribirte a Flower Power!',
    shareReport: 'Como suscriptor, nos gustaría compartir nuestro reporte extendido sobre el análisis de THC y CBD de nuestro estudio reciente.',
    description: 'Este análisis comprensivo cubre las distribuciones de THC y CBD, tendencias temporales y variaciones geográficas a través de Colombia.',
    viewReport: 'Ver el Reporte Completo',
    keyFindings: 'Hallazgos clave de nuestro estudio de 533 muestras de cannabis incluyen:',
    avgThc: 'Contenido promedio de THC: 12.8%',
    avgCbd: 'Contenido promedio de CBD: 0.9%',
    increasingThc: 'Niveles crecientes de THC en muestras recientes',
    copyright: 'Todos los derechos reservados.',
    unsubscribe: 'Si no te suscribiste, por favor envía un email a'
  } : {
    subject: 'Report on THC and CBD analysis from our recent study. Flower Power',
    greeting: 'Hello',
    thankYou: 'Thank you for subscribing to Flower Power!',
    shareReport: 'As a subscriber, we\'d like to share our expanded report on THC and CBD analysis from our recent study.',
    description: 'This comprehensive analysis covers THC and CBD distributions, temporal trends, and geographical variations across Colombia.',
    viewReport: 'View the Full Report',
    keyFindings: 'Key findings from our study of 533 cannabis samples include:',
    avgThc: 'Average THC content: 12.8%',
    avgCbd: 'Average CBD content: 0.9%',
    increasingThc: 'Increasing THC levels in recent samples',
    copyright: 'All rights reserved.',
    unsubscribe: 'If you didn\'t subscribe, please send an email to'
  };

  return {
    subject: content.subject,
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
            <h1>${content.thankYou}</h1>
          </div>
          <div class="content">
            <p>${content.greeting} ${email},</p>
            <p>${content.thankYou}</p>
            <p>${content.shareReport}</p>
            <p>${content.description}</p>
            <p>
              <a href="https://focardozom.github.io/thc-analysis-col/" class="button">${content.viewReport}</a>
            </p>
            <p>${content.keyFindings}</p>
            <ul>
              <li>${content.avgThc}</li>
              <li>${content.avgCbd}</li>
              <li>${content.increasingThc}</li>
            </ul>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Flower Power. ${content.copyright}</p>
            <p>
              ${content.unsubscribe}
              <a href="mailto:hola@figura1.com.co">hola@figura1.com.co</a>.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
} 