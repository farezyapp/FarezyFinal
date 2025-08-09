import sgMail from '@sendgrid/mail';

// Initialize SendGrid with environment variable API key
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey || !apiKey.startsWith('SG.')) {
  console.warn('SENDGRID_API_KEY environment variable not set or invalid. Email notifications will not work.');
} else {
  sgMail.setApiKey(apiKey);
  console.log('SendGrid API key configured successfully');
}

const FROM_EMAIL = 'noreply@farezy.co.uk'; // Replace with your verified sender email
const COMPANY_NAME = 'Farezy';

export async function sendVerificationEmail(
  email: string, 
  firstName: string, 
  verificationToken: string
): Promise<void> {

  // Use farezy.co.uk for verification URLs
  const baseUrl = 'https://farezy.co.uk';
  
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

  const emailContent = {
    to: email,
    from: FROM_EMAIL,
    subject: `Welcome to ${COMPANY_NAME} - Please verify your email`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316; margin: 0;">🚗 ${COMPANY_NAME}</h1>
          <p style="color: #666; margin: 5px 0;">Your ride comparison platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${firstName}! 👋</h2>
          <p style="color: #666; line-height: 1.6;">
            Thanks for signing up for ${COMPANY_NAME}! We're excited to help you find the best ride options 
            and save money on your travels.
          </p>
          <p style="color: #666; line-height: 1.6;">
            To get started, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #f97316;">${verificationUrl}</a>
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; color: #666; font-size: 14px;">
          <p><strong>What's next?</strong></p>
          <ul style="line-height: 1.6;">
            <li>Compare prices across multiple ride services</li>
            <li>Get real-time arrival estimates</li>
            <li>Save your favorite locations</li>
            <li>Track your ride savings</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            If you didn't create an account with ${COMPANY_NAME}, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(emailContent);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(
  email: string, 
  firstName: string
): Promise<void> {

  const emailContent = {
    to: email,
    from: FROM_EMAIL,
    subject: `Welcome to ${COMPANY_NAME}! Your account is ready 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316; margin: 0;">🚗 ${COMPANY_NAME}</h1>
          <p style="color: #666; margin: 5px 0;">Your ride comparison platform</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
          <h2 style="margin: 0 0 15px 0;">Welcome to ${COMPANY_NAME}, ${firstName}! 🎉</h2>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">
            Your email has been verified and your account is ready to use!
          </p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 20px;">Here's what you can do now:</h3>
          
          <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            <div style="flex: 1; min-width: 250px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h4 style="color: #f97316; margin: 0 0 10px 0;">🔍 Compare Rides</h4>
              <p style="color: #666; margin: 0; line-height: 1.5;">
                Enter your destination and instantly compare prices across Uber, Bolt, and local taxis.
              </p>
            </div>
            
            <div style="flex: 1; min-width: 250px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h4 style="color: #f97316; margin: 0 0 10px 0;">📍 Save Locations</h4>
              <p style="color: #666; margin: 0; line-height: 1.5;">
                Add shortcuts for home, work, and other frequent destinations for quick booking.
              </p>
            </div>
            
            <div style="flex: 1; min-width: 250px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h4 style="color: #f97316; margin: 0 0 10px 0;">📊 Track Savings</h4>
              <p style="color: #666; margin: 0; line-height: 1.5;">
                See how much money you're saving by choosing the best ride options.
              </p>
            </div>
            
            <div style="flex: 1; min-width: 250px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h4 style="color: #f97316; margin: 0 0 10px 0;">🚗 Real-time Updates</h4>
              <p style="color: #666; margin: 0; line-height: 1.5;">
                Get live pricing and arrival times for all available ride services.
              </p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}" 
             style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; 
                    border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
            Start Using ${COMPANY_NAME}
          </a>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #333; margin: 0 0 15px 0;">💡 Pro Tips:</h4>
          <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Check prices during different times to find the best deals</li>
            <li>Save your frequent routes for instant price comparisons</li>
            <li>Enable location access for accurate pickup locations</li>
            <li>Join our taxi partner network if you're a driver or company</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            Need help? Reply to this email or visit our support page.
          </p>
          <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
            © 2025 ${COMPANY_NAME}. Making transportation smarter for everyone.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(emailContent);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string, 
  firstName: string, 
  resetToken: string
): Promise<void> {

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;

  const emailContent = {
    to: email,
    from: FROM_EMAIL,
    subject: `Reset your ${COMPANY_NAME} password`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316; margin: 0;">🚗 ${COMPANY_NAME}</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${firstName},</h2>
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password for your ${COMPANY_NAME} account.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, you can safely ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2025 ${COMPANY_NAME}</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(emailContent);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

export async function sendPartnerSignupNotification(partnerData: any): Promise<boolean> {
  console.log('📧 Sending partner signup notification for:', partnerData.companyName);
  console.log('📧 API Key status:', process.env.SENDGRID_API_KEY ? 'Present' : 'Missing');
  console.log('📧 From email:', FROM_EMAIL);
  console.log('📧 To email: cian@farezy.co.uk');
  
  const msg = {
    to: 'cian@farezy.co.uk',
    from: 'noreply@farezy.co.uk',
    subject: '🚖 New Partner Application - Farezy Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Partner Application - Farezy</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .email-container { 
            max-width: 700px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          }
          .header { 
            background: linear-gradient(135deg, #f97316 0%, #eab308 100%); 
            padding: 40px 30px; 
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 36px; 
            font-weight: bold; 
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
          }
          .header p {
            color: rgba(255,255,255,0.9);
            margin: 10px 0 0 0;
            font-size: 18px;
            position: relative;
            z-index: 1;
          }
          .content { 
            padding: 40px 30px; 
            background: white;
          }
          .alert-banner {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
            font-weight: 600;
            font-size: 18px;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          }
          .section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .section h3 {
            color: #000000;
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: 700;
            border-bottom: 3px solid #f97316;
            padding-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
          }
          .info-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f97316;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .info-label {
            font-weight: 700;
            color: #000000;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .info-value {
            color: #000000;
            font-size: 16px;
            font-weight: 500;
            word-break: break-word;
          }
          .highlight {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
          }
          .description-box {
            background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
            border: 1px solid #c4b5fd;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .description-box h3 {
            color: #000000;
            border-bottom: 2px solid #8b5cf6;
          }
          .description-text {
            color: #000000;
            line-height: 1.7;
            font-size: 15px;
            margin: 0;
          }
          .action-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            border: 2px solid #0ea5e9;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
            transition: all 0.3s ease;
            border: none;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(249, 115, 22, 0.6);
          }
          .footer {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #94a3b8;
            padding: 30px;
            text-align: center;
            font-size: 14px;
          }
          .footer p {
            margin: 5px 0;
          }
          .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          @media (max-width: 640px) {
            .email-container { margin: 10px; }
            .content { padding: 25px 20px; }
            .info-grid { grid-template-columns: 1fr; }
            .header h1 { font-size: 28px; }
            .cta-button { padding: 15px 30px; font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🚖 Farezy</h1>
            <p>Ride Comparison Platform</p>
          </div>
          
          <div class="content">
            <div class="alert-banner">
              🎉 New Partner Application Received!
            </div>
            
            <p style="font-size: 18px; color: #000000; line-height: 1.6; margin-bottom: 30px;">
              A taxi company has submitted a partnership application and is ready for your review.
            </p>

            <div class="section">
              <h3>
                🏢 Company Overview
                <span class="badge">New Application</span>
              </h3>
              <div class="info-grid">
                <div class="info-item highlight">
                  <div class="info-label">Company Name</div>
                  <div class="info-value">${partnerData.companyName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Contact Person</div>
                  <div class="info-value">${partnerData.contactName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email Address</div>
                  <div class="info-value">${partnerData.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">${partnerData.phone}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Primary City</div>
                  <div class="info-value">${partnerData.city}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Operating Area</div>
                  <div class="info-value">${partnerData.operatingArea}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>🚗 Fleet & Operations</h3>
              <div class="info-grid">
                <div class="info-item highlight">
                  <div class="info-label">Fleet Size</div>
                  <div class="info-value">${partnerData.fleetSize} vehicles</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Operating Hours</div>
                  <div class="info-value">${partnerData.operatingHours}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Response Time</div>
                  <div class="info-value">${partnerData.averageResponseTime}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Service Types</div>
                  <div class="info-value">${Array.isArray(partnerData.serviceTypes) ? partnerData.serviceTypes.join(', ') : partnerData.serviceTypes}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>💷 Pricing Structure</h3>
              <div class="info-grid">
                <div class="info-item highlight">
                  <div class="info-label">Base Rate</div>
                  <div class="info-value">£${partnerData.baseRate}</div>
                </div>
                <div class="info-item highlight">
                  <div class="info-label">Per KM Rate</div>
                  <div class="info-value">£${partnerData.perKmRate}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">License Number</div>
                  <div class="info-value">${partnerData.licenseNumber}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Insurance Provider</div>
                  <div class="info-value">${partnerData.insuranceProvider}</div>
                </div>
              </div>
            </div>

            ${partnerData.description ? `
            <div class="description-box">
              <h3>📋 Company Description</h3>
              <p class="description-text">${partnerData.description}</p>
            </div>
            ` : ''}

            ${partnerData.website ? `
            <div class="section">
              <h3>🌐 Website</h3>
              <div class="info-item">
                <div class="info-label">Company Website</div>
                <div class="info-value"><a href="${partnerData.website}" style="color: #000000; text-decoration: underline;">${partnerData.website}</a></div>
              </div>
            </div>
            ` : ''}

            <div class="action-section">
              <h3 style="color: #000000; margin-bottom: 20px; border: none;">⚡ Quick Action Required</h3>
              <p style="color: #000000; margin-bottom: 25px; font-size: 16px;">
                Review this application in your admin dashboard to approve or reject the partnership request.
              </p>
              <a href="${process.env.APP_URL || 'https://farezy.co.uk'}/secret-admin-dashboard-xyz789" class="cta-button">
                Review Application Now
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p style="font-weight: 600; font-size: 16px; color: white;">© 2025 Farezy Platform</p>
            <p>Making transport accessible for everyone, everywhere.</p>
            <p style="margin-top: 15px; font-size: 12px;">This is an automated notification from the Farezy partner management system.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log('📧 Attempting to send email via SendGrid...');
    const result = await sgMail.send(msg);
    console.log('📧 ✅ Email sent successfully with status:', result[0].statusCode);
    console.log('📧 SendGrid message ID:', result[0].headers['x-message-id']);
    console.log('📧 Partner signup notification email sent successfully');
    return true;
  } catch (error) {
    console.error('📧 ❌ Error sending partner signup notification email:', error);
    if (error instanceof Error && error.message) {
      console.error('📧 Error message:', error.message);
    }
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('📧 SendGrid error details:', (error as any).response?.body);
      console.error('📧 SendGrid status code:', (error as any).response?.statusCode);
    }
    throw error;
  }
}