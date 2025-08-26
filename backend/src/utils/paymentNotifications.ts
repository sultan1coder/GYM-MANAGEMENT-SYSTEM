import nodemailer from "nodemailer";
import { Payment, Member, Invoice } from "@prisma/client";

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password",
  },
};

const transporter = nodemailer.createTransport(emailConfig);

// Payment Receipt Email
export const sendPaymentReceipt = async (
  payment: Payment & { Member: Member },
  invoice?: Invoice
) => {
  try {
    const mailOptions = {
      from: `"${process.env.GYM_NAME || "Gym Management System"}" <${
        emailConfig.auth.user
      }>`,
      to: payment.Member.email,
      subject: `Payment Receipt - $${payment.amount.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Payment Receipt</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for your payment!</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #28a745; margin-top: 0;">Payment Details:</h3>
              <p style="margin: 5px 0;"><strong>Amount:</strong> $${payment.amount.toFixed(
                2
              )}</p>
              <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${
                payment.id
              }</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(
                payment.createdAt
              ).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Method:</strong> ${
                payment.method
              }</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${
                payment.status
              }</p>
              ${
                payment.description
                  ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${payment.description}</p>`
                  : ""
              }
              ${
                payment.reference
                  ? `<p style="margin: 5px 0;"><strong>Reference:</strong> ${payment.reference}</p>`
                  : ""
              }
            </div>

            ${
              invoice
                ? `
            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #007bff; margin-top: 0;">Invoice Information:</h3>
              <p style="margin: 5px 0;"><strong>Invoice ID:</strong> ${invoice.id}</p>
              <p style="margin: 5px 0;"><strong>Details:</strong> ${invoice.details}</p>
            </div>
            `
                : ""
            }

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>Note:</strong> Please keep this receipt for your records. If you have any questions about this payment, please contact our support team.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This is an automated receipt. Please do not reply to this email.
              <br>
              ${process.env.GYM_NAME || "Gym Management System"}
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Payment receipt sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send payment receipt:", error);
    throw error;
  }
};

// Payment Confirmation Email
export const sendPaymentConfirmation = async (
  payment: Payment & { Member: Member }
) => {
  try {
    const mailOptions = {
      from: `"${process.env.GYM_NAME || "Gym Management System"}" <${
        emailConfig.auth.user
      }>`,
      to: payment.Member.email,
      subject: "Payment Confirmed Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Payment Confirmed!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${
              payment.Member.name
            }!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your payment of <strong>$${payment.amount.toFixed(
                2
              )}</strong> has been successfully processed and confirmed.
            </p>
            
            <div style="background-color: #d4edda; padding: 20px; border-radius: 6px; border: 1px solid #c3e6cb; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">Payment Summary:</h3>
              <p style="margin: 5px 0;"><strong>Amount:</strong> $${payment.amount.toFixed(
                2
              )}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(
                payment.createdAt
              ).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Method:</strong> ${
                payment.method
              }</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${
                payment.status
              }</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your membership is now active and you can enjoy all our gym facilities. Thank you for choosing us!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/members/profile" 
                 style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View My Profile
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This is an automated confirmation. Please do not reply to this email.
              <br>
              ${process.env.GYM_NAME || "Gym Management System"}
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Payment confirmation sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send payment confirmation:", error);
    throw error;
  }
};

// Failed Payment Notification
export const sendFailedPaymentNotification = async (
  payment: Payment & { Member: Member },
  errorMessage: string
) => {
  try {
    const mailOptions = {
      from: `"${process.env.GYM_NAME || "Gym Management System"}" <${
        emailConfig.auth.user
      }>`,
      to: payment.Member.email,
      subject: "Payment Failed - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Payment Failed</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${
              payment.Member.name
            }!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We were unable to process your payment of <strong>$${payment.amount.toFixed(
                2
              )}</strong>. 
              Please review the details below and take action to resolve this issue.
            </p>
            
            <div style="background-color: #f8d7da; padding: 20px; border-radius: 6px; border: 1px solid #f5c6cb; margin: 20px 0;">
              <h3 style="color: #721c24; margin-top: 0;">Payment Details:</h3>
              <p style="margin: 5px 0;"><strong>Amount:</strong> $${payment.amount.toFixed(
                2
              )}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(
                payment.createdAt
              ).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Method:</strong> ${
                payment.method
              }</p>
              <p style="margin: 5px 0;"><strong>Error:</strong> ${errorMessage}</p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">What to do next:</h3>
              <ul style="color: #856404; margin: 5px 0; padding-left: 20px;">
                <li>Check your payment method (credit card, bank account, etc.)</li>
                <li>Ensure you have sufficient funds</li>
                <li>Verify your payment information is correct</li>
                <li>Contact your bank if there are any restrictions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/members/payments" 
                 style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Update Payment Method
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              If you need assistance, please contact our support team.
              <br>
              ${process.env.GYM_NAME || "Gym Management System"}
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "Failed payment notification sent successfully:",
      info.messageId
    );
    return info;
  } catch (error) {
    console.error("Failed to send failed payment notification:", error);
    throw error;
  }
};

// Payment Reminder Email
export const sendPaymentReminder = async (
  member: Member,
  amount: number,
  dueDate: Date,
  daysOverdue: number
) => {
  try {
    const mailOptions = {
      from: `"${process.env.GYM_NAME || "Gym Management System"}" <${
        emailConfig.auth.user
      }>`,
      to: member.email,
      subject: `Payment Reminder - $${amount.toFixed(2)} Due`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffc107; color: #212529; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Payment Reminder</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${
              member.name
            }!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This is a friendly reminder that you have a payment of <strong>$${amount.toFixed(
                2
              )}</strong> 
              ${
                daysOverdue > 0
                  ? `that was due ${daysOverdue} day${
                      daysOverdue > 1 ? "s" : ""
                    } ago`
                  : "due soon"
              }.
            </p>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 6px; border: 1px solid #ffeaa7; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">Payment Details:</h3>
              <p style="margin: 5px 0;"><strong>Amount Due:</strong> $${amount.toFixed(
                2
              )}</p>
              <p style="margin: 5px 0;"><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
              ${
                daysOverdue > 0
                  ? `<p style="margin: 5px 0; color: #dc3545;"><strong>Days Overdue:</strong> ${daysOverdue}</p>`
                  : ""
              }
            </div>
            
            ${
              daysOverdue > 0
                ? `
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 6px; border: 1px solid #f5c6cb; margin: 20px 0;">
              <p style="margin: 0; color: #721c24;">
                <strong>Important:</strong> Late payments may result in service interruption. Please process your payment as soon as possible.
              </p>
            </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/members/payments" 
                 style="background-color: #ffc107; color: #212529; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Make Payment Now
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              If you have already made this payment, please disregard this reminder.
              <br>
              ${process.env.GYM_NAME || "Gym Management System"}
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Payment reminder sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send payment reminder:", error);
    throw error;
  }
};

// Test email configuration
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email server connection verified successfully");
    return true;
  } catch (error) {
    console.error("Email server connection failed:", error);
    return false;
  }
};
