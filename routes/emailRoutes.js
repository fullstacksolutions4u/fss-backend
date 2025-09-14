// routes/emailRoutes.js - Email routes
import express from 'express';
import { emailController } from '../controllers/emailController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateMongoId } from '../middleware/validation.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Email validation middleware
const validateEmail = [
  body('testEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateCustomEmail = [
  body('to')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid recipient email is required'),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject is required and must be less than 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message is required and must be less than 5000 characters'),
  body('isHtml')
    .optional()
    .isBoolean()
    .withMessage('isHtml must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// All email routes require authentication
router.use(authenticateToken);

// Email service management
router.get('/status', emailController.getEmailStatus);
router.post('/test', validateEmail, emailController.testEmailService);

// Admin-only routes
router.post('/custom', requireRole(['admin', 'super-admin']), validateCustomEmail, emailController.sendCustomEmail);
router.post('/follow-up-reminders', requireRole(['admin', 'super-admin']), emailController.sendFollowUpReminders);
router.post('/weekly-report', requireRole(['admin', 'super-admin']), emailController.sendWeeklyReport);

// Enquiry-specific emails
router.post('/resend-confirmation/:enquiryId', validateMongoId, emailController.resendConfirmation);
router.post('/status-notification/:enquiryId', validateMongoId, emailController.sendStatusNotification);

export default router;