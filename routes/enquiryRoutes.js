import express from 'express';
import { createEnquiry, getAllEnquiries, getEnquiryById, updateEnquiryStatus, addNote, getStats } from '../controllers/enquiryController.js';
import { validateCreateEnquiry } from '../middleware/validation.js';

const router = express.Router();

// Public route
router.post('/', validateCreateEnquiry, createEnquiry);

// Admin routes (without auth for now)
router.get('/stats', getStats);
router.get('/', getAllEnquiries);
router.get('/:id', getEnquiryById);
router.patch('/:id/status', updateEnquiryStatus);
router.post('/:id/notes', addNote);

export default router;