
import { authService } from '../services/authService.js';
import { createResponse } from '../utils/response.js';

export const authController = {
  // Login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(createResponse(
          false,
          'Email and password are required'
        ));
      }

      const result = await authService.loginAdmin(email, password);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json(createResponse(
        true,
        'Login successful',
        {
          admin: result.admin,
          accessToken: result.accessToken
        }
      ));
    } catch (error) {
      next(error);
    }
  },

  // Refresh token
  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json(createResponse(
          false,
          'Refresh token required'
        ));
      }

      const result = await authService.refreshToken(refreshToken);

      res.json(createResponse(
        true,
        'Token refreshed successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  },

  // Logout
  logout: async (req, res, next) => {
    try {
      res.clearCookie('refreshToken');
      
      res.json(createResponse(
        true,
        'Logout successful'
      ));
    } catch (error) {
      next(error);
    }
  },

  // Get current admin profile
  getProfile: async (req, res, next) => {
    try {
      res.json(createResponse(
        true,
        'Profile retrieved successfully',
        { admin: req.admin }
      ));
    } catch (error) {
      next(error);
    }
  },

  // Create initial admin (for setup)
  createAdmin: async (req, res, next) => {
    try {
      const { name, email, password, role = 'admin' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json(createResponse(
          false,
          'Name, email and password are required'
        ));
      }

      const admin = await authService.createAdmin({
        name,
        email,
        password,
        role
      });

      res.status(201).json(createResponse(
        true,
        'Admin created successfully',
        { admin }
      ));
    } catch (error) {
      next(error);
    }
  }
};
