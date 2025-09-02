import nodemailer from "nodemailer";

// Email configuration
const createTransporter = () => {
  // For development, use a test account or configure with your email service
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "your-email@gmail.com",
      pass: process.env.SMTP_PASS || "your-app-password",
    },
  });
};

// Send welcome email with verification
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/verify-email/${verificationToken}`;

    const mailOptions = {
      from: `"BILKHAYR Premium Fitness" <${
        process.env.SMTP_USER || "noreply@bilkhayr-gym.com"
      }>`,
      to: email,
      subject: "🏋️ Welcome to BILKHAYR Premium Fitness - Verify Your Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to BILKHAYR Premium Fitness</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
              <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="m6.5 6.5 11 11"/>
                  <path d="m21 21-1-1"/>
                  <path d="m3 3 1 1"/>
                  <path d="m18 22 4-4"/>
                  <path d="m2 6 4-4"/>
                  <path d="m3 10 7-7"/>
                  <path d="m14 21 7-7"/>
                </svg>
              </div>
              <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Welcome to BILKHAYR
              </h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0;">
                Premium Fitness Experience
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 20px 0;">
                Welcome, ${name}! 🎉
              </h2>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Congratulations on taking the first step towards your fitness transformation! 
                You've joined an elite community of 5000+ members who are crushing their goals every day.
              </p>
              
              <!-- Verification CTA -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                <h3 style="color: #065f46; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                  🔐 Verify Your Account
                </h3>
                <p style="color: #047857; font-size: 14px; margin: 0 0 20px 0;">
                  Click the button below to verify your email and activate your premium membership:
                </p>
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                  Verify My Account ✨
                </a>
              </div>
              
              <!-- Features Preview -->
              <div style="margin: 30px 0;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 20px 0;">
                  🚀 What's Next?
                </h3>
                
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981;">
                    <div style="background: #10b981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
                    <div>
                      <h4 style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0;">Complete Your Profile</h4>
                      <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Add fitness goals and preferences</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #06b6d4;">
                    <div style="background: #06b6d4; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
                    <div>
                      <h4 style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0;">Access Your Dashboard</h4>
                      <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Track workouts and progress</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <div style="background: #8b5cf6; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
                    <div>
                      <h4 style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0;">Start Your Journey</h4>
                      <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Begin achieving your fitness goals</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Support -->
              <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                <h3 style="color: #1e293b; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                  Need Help? We're Here for You! 💪
                </h3>
                <p style="color: #64748b; font-size: 14px; margin: 0 0 15px 0;">
                  Our premium support team is available 24/7 to help you succeed.
                </p>
                <a href="mailto:support@bilkhayr-gym.com" style="color: #0ea5e9; text-decoration: none; font-weight: bold;">
                  support@bilkhayr-gym.com
                </a>
              </div>
            </div>
            
            <!-- Footer -->}
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                <strong>BILKHAYR Premium Fitness</strong><br>
                123 Fitness Street, Downtown District<br>
                City, State 12345
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © 2024 BILKHAYR Premium Fitness. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

// Send invitation email for staff
export const sendInvitationEmail = async (
  email: string,
  name: string,
  role: string,
  tempPassword: string
) => {
  try {
    const transporter = createTransporter();

    const loginUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/staff/login`;

    const mailOptions = {
      from: `"BILKHAYR Premium Fitness" <${
        process.env.SMTP_USER || "noreply@bilkhayr-gym.com"
      }>`,
      to: email,
      subject: "🏢 Welcome to BILKHAYR Team - Your Staff Account is Ready",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to BILKHAYR Team</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0;">
                Welcome to the BILKHAYR Team! 🎉
              </h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0;">
                Your professional account is ready
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 20px 0;">
                Hello ${name}! 👋
              </h2>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Congratulations! You've been added to the BILKHAYR Premium Fitness team as a <strong>${role}</strong>. 
                Your professional account gives you access to our comprehensive gym management platform.
              </p>
              
              <!-- Login Credentials -->}
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                <h3 style="color: #1e40af; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                  🔐 Your Login Credentials
                </h3>
                <div style="background: white; border-radius: 8px; padding: 20px; margin: 15px 0;">
                  <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="color: #374151; font-size: 14px; margin: 0 0 15px 0;"><strong>Temporary Password:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>
                  <p style="color: #ef4444; font-size: 12px; margin: 0;"><strong>⚠️ Please change this password after your first login</strong></p>
                </div>
                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Access Staff Portal 🚀
                </a>
              </div>
              
              <!-- Platform Features -->}
              <div style="margin: 30px 0;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 20px 0;">
                  🎯 Your Platform Access
                </h3>
                
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <div>
                      <h4 style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0;">Member Management</h4>
                      <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Full CRUD operations, analytics, and insights</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981;">
                    <div>
                      <h4 style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0;">Analytics Dashboard</h4>
                      <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Real-time business intelligence and reporting</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <div>
                      <h4 style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0;">Attendance Tracking</h4>
                      <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Live member check-ins and attendance monitoring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                <strong>BILKHAYR Premium Fitness</strong><br>
                Professional Gym Management Platform
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                If you have any questions, contact us at support@bilkhayr-gym.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Staff invitation email sent to ${email}`);
  } catch (error) {
    console.error("Staff invitation email error:", error);
    throw error;
  }
};

export default { sendWelcomeEmail, sendInvitationEmail };
