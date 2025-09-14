import { body, param, query, validationResult } from 'express-validator';


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};



export const validateCreateEnquiry = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('phone')
    .trim()
    .matches(/^[\+]?[1-9][\d]{9,14}$/)
    .withMessage('Please provide a valid phone number'),
    
  body('service')
    .isIn(['Software Development', 'Digital Marketing', 'Video Editing', 'Mentoring', 'Other'])
    .withMessage('Please select a valid service'),
    
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .escape(),
    
  handleValidationErrors
];

export const validateUpdateStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),
    
  body('status')
    .isIn(['New', 'In Progress', 'Completed', 'Closed'])
    .withMessage('Invalid status value'),
    
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
    .escape(),
    
  handleValidationErrors
];

export const validateAddNote = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),
    
  body('note')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note must be between 1 and 1000 characters')
    .escape(),
    
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
    
  handleValidationErrors
];

export const validateAssignEnquiry = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),
    
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid admin ID'),
    
  handleValidationErrors
];

export const validateUpdatePriority = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),
    
  body('priority')
    .isIn(['Low', 'Medium', 'High', 'Urgent'])
    .withMessage('Invalid priority value'),
    
  handleValidationErrors
];

export const validateAddTags = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),
    
  body('tags')
    .isArray({ min: 1, max: 10 })
    .withMessage('Tags must be an array with 1-10 items'),
    
  body('tags.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
    .escape(),
    
  handleValidationErrors
];

export const validateFollowUpDate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),
    
  body('followUpDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid follow-up date'),
    
  handleValidationErrors
];



export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
    
  handleValidationErrors
];

export const validateCreateAdmin = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('role')
    .optional()
    .isIn(['admin', 'super-admin'])
    .withMessage('Role must be either admin or super-admin'),
    
  handleValidationErrors
];





export const validatePaginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name', 'email', 'status', 'service', 'priority'])
    .withMessage('Invalid sort field'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
    
  handleValidationErrors
];

export const validateEnquiryFilters = [
  query('status')
    .optional()
    .isIn(['New', 'In Progress', 'Completed', 'Closed'])
    .withMessage('Invalid status filter'),
    
  query('service')
    .optional()
    .isIn(['Software Development', 'Digital Marketing', 'Video Editing', 'Mentoring', 'Other'])
    .withMessage('Invalid service filter'),
    
  query('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent'])
    .withMessage('Invalid priority filter'),
    
  query('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid admin ID'),
    
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .escape(),
    
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid dateFrom format'),
    
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid dateTo format'),
    
  handleValidationErrors
];

export const validateAnalyticsQuery = [
  query('period')
    .optional()
    .isIn(['7d', '30d', '3m', '6m', '1y'])
    .withMessage('Invalid period. Must be 7d, 30d, 3m, 6m, or 1y'),
    
  query('service')
    .optional()
    .isIn(['Software Development', 'Digital Marketing', 'Video Editing', 'Mentoring', 'Other'])
    .withMessage('Invalid service filter'),
    
  query('status')
    .optional()
    .isIn(['New', 'In Progress', 'Completed', 'Closed'])
    .withMessage('Invalid status filter'),
    
  handleValidationErrors
];

export const validateExportQuery = [
  query('format')
    .optional()
    .isIn(['json', 'csv'])
    .withMessage('Format must be json or csv'),
    
  query('status')
    .optional()
    .isIn(['New', 'In Progress', 'Completed', 'Closed'])
    .withMessage('Invalid status filter'),
    
  query('service')
    .optional()
    .isIn(['Software Development', 'Digital Marketing', 'Video Editing', 'Mentoring', 'Other'])
    .withMessage('Invalid service filter'),
    
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid startDate format'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid endDate format'),
    
  handleValidationErrors
];

export const validateEmail = [
  body('testEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  handleValidationErrors
];

export const validateCustomEmail = [
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
  handleValidationErrors
];

export { handleValidationErrors };


export const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
    
  handleValidationErrors
];


export default {
  validateCreateEnquiry,
  validateUpdateStatus,
  validateAddNote,
  validateAssignEnquiry,
  validateUpdatePriority,
  validateAddTags,
  validateFollowUpDate,
  validateLogin,
  validateCreateAdmin,
  validatePaginationQuery,
  validateEnquiryFilters,
  validateAnalyticsQuery,
  validateExportQuery,
  validateMongoId,
  handleValidationErrors,
  validateEmail,
  validateCustomEmail,
};