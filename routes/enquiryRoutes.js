import express from 'express';
import { createEnquiry, getAllEnquiries, deleteEnquiry } from '../controllers/enquiryController.js';
import { validateCreateEnquiry } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateCreateEnquiry, createEnquiry);
router.get('/', getAllEnquiries);
router.delete('/:id', deleteEnquiry);

export default router;