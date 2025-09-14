// services/emailService.js - Complete email service
import nodemailer from 'nodemailer';
import { emailTemplates } from '../utils/emailTemplates.js';

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
};

// Create transporter
let transporter = null;

const createTransporter = () => {
  if (!transporter) {
    try {
      transporter = nodemailer.createTransporter(emailConfig);
    } catch (error) {
      console.error('Failed to create email transporter:', error);
      return null;
    }
  }
  return transporter;
};

// Verify email configuration
const verifyEmailConfig = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. Email notifications disabled.');
    return false;
  }

  const transport = createTransporter();
  if (!transport) return false;

  try {
    await transport.verify();
    console.log('✅ Email service configured successfully');
    return true;
  } catch (error) {
    console.warn('⚠️  Email service verification failed:', error.message);
    return false;
  }
};

// Generic send email function
const sendEmail = async (to, subject, html, text = null) => {
  try {
    const transport = createTransporter();
    if (!transport) {
      throw new Error('Email transporter not available');
    }

    const mailOptions = {
      from: {
        name: 'Full Stack Solutions',
        address: process.env.EMAIL_USER || 'noreply@fullstacksolutions.com'
      },
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const result = await transport.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', {
      to,
      subject,
      messageId: result.messageId
    });

    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };
  } catch (error) {
    console.error('❌ Email sending failed:', {
      to,
      subject,
      error: error.message
    });

    throw {
      success: false,
      error: error.message,
      details: error
    };
  }
};

// Email service methods
export const emailService = {
  // Initialize email service
  initialize: async () => {
    return await verifyEmailConfig();
  },

  // Send new enquiry notification to admin
  sendNewEnquiryNotification: async (enquiry) => {
    try {
      if (!await verifyEmailConfig()) {
        console.log('📧 Skipping admin notification - email not configured');
        return { success: true, skipped: true };
      }

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@fullstacksolutions.com';
      const subject = `🆕 New Enquiry: ${enquiry.service} - ${enquiry.name}`;
      
      const html = emailTemplates.newEnquiryAdmin({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        service: enquiry.service,
        subject: enquiry.subject,
        message: enquiry.message,
        enquiryId: enquiry._id,
        createdAt: enquiry.createdAt,
        dashboardUrl: `${process.env.FRONTEND_URL}/admin/enquiry/${enquiry._id}`
      });

      return await sendEmail(adminEmail, subject, html);
    } catch (error) {
      console.error('Admin notification error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send confirmation email to customer
  sendCustomerConfirmation: async (enquiry) => {
    try {
      if (!await verifyEmailConfig()) {
        console.log('📧 Skipping customer confirmation - email not configured');
        return { success: true, skipped: true };
      }

      const subject = `✅ Thank you for contacting Full Stack Solutions!`;
      
      const html = emailTemplates.customerConfirmation({
        name: enquiry.name,
        service: enquiry.service,
        enquiryId: enquiry._id,
        supportPhone: '+91 7907278704',
        supportEmail: process.env.EMAIL_USER || 'info@fullstacksolutions.com'
      });

      return await sendEmail(enquiry.email, subject, html);
    } catch (error) {
      console.error('Customer confirmation error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send status update notification to customer
  sendStatusUpdateNotification: async (enquiry, newStatus) => {
    try {
      if (!await verifyEmailConfig()) {
        console.log('📧 Skipping status update - email not configured');
        return { success: true, skipped: true };
      }

      const statusEmojis = {
        'New': '🆕',
        'In Progress': '⏳',
        'Completed': '✅',
        'Closed': '🔒'
      };

      const subject = `${statusEmojis[newStatus] || '📢'} Update: Your enquiry status changed to "${newStatus}"`;
      
      const html = emailTemplates.statusUpdate({
        name: enquiry.name,
        enquiryId: enquiry._id,
        service: enquiry.service,
        oldStatus: enquiry.statusHistory?.[enquiry.statusHistory.length - 2]?.status || 'New',
        newStatus: newStatus,
        statusEmoji: statusEmojis[newStatus] || '📢',
        supportPhone: '+91 7907278704',
        supportEmail: process.env.EMAIL_USER || 'info@fullstacksolutions.com'
      });

      return await sendEmail(enquiry.email, subject, html);
    } catch (error) {
      console.error('Status update notification error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send follow-up reminder to admin
  sendFollowUpReminder: async (enquiries) => {
    try {
      if (!await verifyEmailConfig() || !enquiries.length) {
        return { success: true, skipped: true };
      }

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@fullstacksolutions.com';
      const subject = `🔔 Follow-up Reminder: ${enquiries.length} enquir${enquiries.length === 1 ? 'y' : 'ies'} need attention`;
      
      const html = emailTemplates.followUpReminder({
        enquiries: enquiries.map(e => ({
          id: e._id,
          name: e.name,
          email: e.email,
          service: e.service,
          followUpDate: e.followUpDate,
          daysPast: Math.floor((new Date() - new Date(e.followUpDate)) / (1000 * 60 * 60 * 24))
        })),
        dashboardUrl: `${process.env.FRONTEND_URL}/admin/dashboard`
      });

      return await sendEmail(adminEmail, subject, html);
    } catch (error) {
      console.error('Follow-up reminder error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send welcome email to new admin
  sendAdminWelcome: async (admin, temporaryPassword) => {
    try {
      if (!await verifyEmailConfig()) {
        return { success: true, skipped: true };
      }

      const subject = `🎉 Welcome to Full Stack Solutions Admin Panel`;
      
      const html = emailTemplates.adminWelcome({
        name: admin.name,
        email: admin.email,
        temporaryPassword,
        loginUrl: `${process.env.FRONTEND_URL}/admin/login`,
        role: admin.role
      });

      return await sendEmail(admin.email, subject, html);
    } catch (error) {
      console.error('Admin welcome email error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send weekly report to admin
  sendWeeklyReport: async (reportData) => {
    try {
      if (!await verifyEmailConfig()) {
        return { success: true, skipped: true };
      }

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@fullstacksolutions.com';
      const subject = `📊 Weekly Report: ${reportData.weekStart} - ${reportData.weekEnd}`;
      
      const html = emailTemplates.weeklyReport(reportData);

      return await sendEmail(adminEmail, subject, html);
    } catch (error) {
      console.error('Weekly report error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send custom email (generic function for admin use)
  sendCustomEmail: async (to, subject, message, isHtml = false) => {
    try {
      if (!await verifyEmailConfig()) {
        throw new Error('Email service not configured');
      }

      const html = isHtml ? message : emailTemplates.customMessage({
        message,
        senderName: 'Full Stack Solutions Team'
      });

      return await sendEmail(to, subject, html);
    } catch (error) {
      console.error('Custom email error:', error);
      throw error;
    }
  },

  // Test email function
  sendTestEmail: async (testEmail) => {
    try {
      if (!await verifyEmailConfig()) {
        throw new Error('Email service not configured');
      }

      const subject = '🧪 FSS Email Service Test';
      const html = emailTemplates.testEmail({
        testTime: new Date().toISOString(),
        serverInfo: {
          nodeVersion: process.version,
          env: process.env.NODE_ENV || 'development'
        }
      });

      return await sendEmail(testEmail, subject, html);
    } catch (error) {
      console.error('Test email error:', error);
      throw error;
    }
  },

  // Bulk email function (for newsletters, etc.)
  sendBulkEmail: async (recipients, subject, html, batchSize = 50) => {
    try {
      if (!await verifyEmailConfig()) {
        throw new Error('Email service not configured');
      }

      const results = [];
      const batches = [];
      
      // Split recipients into batches
      for (let i = 0; i < recipients.length; i += batchSize) {
        batches.push(recipients.slice(i, i + batchSize));
      }

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        console.log(`📧 Sending batch ${batchIndex + 1}/${batches.length} (${batch.length} emails)`);

        const batchPromises = batch.map(async (recipient) => {
          try {
            const result = await sendEmail(recipient, subject, html);
            return { email: recipient, success: true, result };
          } catch (error) {
            return { email: recipient, success: false, error: error.message };
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map(r => r.value || r.reason));

        // Add delay between batches to avoid rate limiting
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      console.log(`📊 Bulk email completed: ${successful} sent, ${failed} failed`);

      return {
        success: true,
        total: recipients.length,
        sent: successful,
        failed,
        results
      };
    } catch (error) {
      console.error('Bulk email error:', error);
      throw error;
    }
  },

  // Get email service status
  getStatus: async () => {
    try {
      const isConfigured = await verifyEmailConfig();
      return {
        configured: isConfigured,
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        user: process.env.EMAIL_USER ? 
          process.env.EMAIL_USER.replace(/(.{2}).*(@.*)/, '$1***$2') : 
          'Not configured'
      };
    } catch (error) {
      return {
        configured: false,
        error: error.message
      };
    }
  }
};

// Initialize email service on startup
emailService.initialize().catch(console.error);

export default emailService;