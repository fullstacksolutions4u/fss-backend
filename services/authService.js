import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '7d';

export const authService = {
  // Generate JWT token
  generateToken: (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  },

  // Generate refresh token
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Login admin
  loginAdmin: async (email, password) => {
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email, isActive: true });
      
      if (!admin) {
        throw new Error('Invalid credentials');
      }

      // Check if account is locked
      if (admin.isLocked) {
        throw new Error('Account temporarily locked due to too many failed attempts');
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        // Increment login attempts
        await admin.incLoginAttempts();
        throw new Error('Invalid credentials');
      }

      // Reset login attempts and update last login
      await admin.resetLoginAttempts();
      await admin.updateLastLogin();

      // Generate tokens
      const tokenPayload = {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      };

      const accessToken = authService.generateToken(tokenPayload);
      const refreshToken = authService.generateRefreshToken(tokenPayload);

      return {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin
        },
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const decoded = authService.verifyToken(refreshToken);
      
      // Find admin to ensure still active
      const admin = await Admin.findById(decoded.id);
      if (!admin || !admin.isActive) {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token
      const tokenPayload = {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      };

      const newAccessToken = authService.generateToken(tokenPayload);

      return {
        accessToken: newAccessToken,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  // Create admin (for initial setup)
  createAdmin: async (adminData) => {
    try {
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      if (existingAdmin) {
        throw new Error('Admin already exists with this email');
      }

      const admin = new Admin(adminData);
      await admin.save();

      return {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      };
    } catch (error) {
      throw error;
    }
  }
};