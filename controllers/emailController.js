import { createResponse } from '../utils/response.js';

export const emailController = {
  // Test email configuration
  testEmailService: async (req, res, next) => {
    try {
      const { testEmail } = req.body;
      
      console.log(`📧 Test email would be sent to: ${testEmail}`);
      
      // For now, just simulate success
      res.json(createResponse(
        true,
        'Test email functionality working (email service not yet configured)',
        { 
          testEmail,
          note: 'Configure EMAIL_USER and EMAIL_PASS in .env to enable actual email sending'
        }
      ));
    } catch (error) {
      next(error);
    }
  },

  // Get email service status
  getEmailStatus: async (req, res, next) => {
    try {
      const status = {
        configured: !!process.env.EMAIL_USER,
        host: 'smtp.gmail.com',
        user: process.env.EMAIL_USER ? 
          process.env.EMAIL_USER.replace(/(.{2}).*(@.*)/, '$1***$2') : 
          'Not configured'
      };

      res.json(createResponse(
        true,
        'Email service status retrieved',
        status
      ));
    } catch (error) {
      next(error);
    }
  },

  // Send custom email
  sendCustomEmail: async (req, res, next) => {
    try {
      const { to, subject, message } = req.body;

      console.log(`📧 Custom email would be sent:`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message.substring(0, 100)}...`);

      res.json(createResponse(
        true,
        'Custom email simulated successfully (configure email service to send actual emails)',
        { to, subject }
      ));
    } catch (error) {
      next(error);
    }
  },

  // Send follow-up reminders
  sendFollowUpReminders: async (req, res, next) => {
    try {
      console.log('📧 Follow-up reminders would be sent');

      res.json(createResponse(
        true,
        'Follow-up reminders simulated',
        { count: 0 }
      ));
    } catch (error) {
      next(error);
    }
  },

  // Generate and send weekly report
  sendWeeklyReport: async (req, res, next) => {
    try {
      console.log('📧 Weekly report would be sent to admin');

      res.json(createResponse(
        true,
        'Weekly report simulated',
        { reportGenerated: true }
      ));
    } catch (error) {
      next(error);
    }
  },

  // Resend enquiry confirmation
  resendConfirmation: async (req, res, next) => {
    try {
      const { enquiryId } = req.params;

      console.log(`📧 Confirmation email would be resent for enquiry: ${enquiryId}`);

      res.json(createResponse(
        true,
        'Confirmation email simulated',
        { enquiryId }
      ));
    } catch (error) {
      next(error);
    }
  },

  // Send status update notification
  sendStatusNotification: async (req, res, next) => {
    try {
      const { enquiryId } = req.params;

      console.log(`📧 Status notification would be sent for enquiry: ${enquiryId}`);

      res.json(createResponse(
        true,
        'Status notification simulated',
        { enquiryId }
      ));
    } catch (error) {
      next(error);
    }
  }
};