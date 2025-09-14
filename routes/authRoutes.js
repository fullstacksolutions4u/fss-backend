import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateLogin, validateCreateAdmin } from '../middleware/validation.js';

const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/setup', validateCreateAdmin, authController.createAdmin);
router.get('/profile', authenticateToken, authController.getProfile);

export default router;