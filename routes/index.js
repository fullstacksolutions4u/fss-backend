// routes/index.js - Fixed main router
import express from 'express';
import enquiryRoutes from './enquiryRoutes.js';
import authRoutes from './authRoutes.js';
import emailRoutes from './emailRoutes.js';
import dashboardRoutes from "./dashboardRoutes.js";

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    services: {
      database: 'Connected',
      email: process.env.EMAIL_USER ? 'Configured' : 'Not configured'
    }
  });
});

// Routes
router.use('/enquiries', enquiryRoutes);
router.use('/auth', authRoutes);
router.use('/emails', emailRoutes);
router.use("/dashboard",dashboardRoutes);

export default router;