import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All dashboard routes require authentication (for now we'll bypass)
// router.use(authenticateToken);

// Dashboard routes
router.get('/overview', dashboardController.getOverview);
router.get('/analytics', dashboardController.getAnalytics);
router.get('/performance', dashboardController.getPerformanceMetrics);
router.get('/export', dashboardController.exportEnquiries);

export default router;