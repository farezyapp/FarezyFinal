// Simple SendGrid test using minimal code
import sgMail from '@sendgrid/mail';

// Use environment variable for API key
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey || !apiKey.startsWith('SG.')) {
  console.error('❌ SENDGRID_API_KEY environment variable not set or invalid');
  process.exit(1);
}
sgMail.setApiKey(apiKey);

const msg = {
  to: 'test@example.com', // Replace with your test email
  from: 'noreply@farezy.co.uk', // Must be verified in SendGrid
  subject: 'Farezy Registration Test Email',
  text: 'This is a test email from Farezy to verify SendGrid integration.',
  html: '<strong>This is a test email from Farezy to verify SendGrid integration.</strong>',
};

console.log('Testing SendGrid email...');

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
  })
  .catch((error) => {
    console.error('❌ SendGrid error:', error.response?.body || error.message);
    if (error.response?.body?.errors) {
      error.response.body.errors.forEach(err => {
        console.error('Error detail:', err.message);
      });
    }
  });