import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

const HARDCODED_ADMIN = {
  email: 'tony@fullstacksolutions.in',
  password: 'admin@1234',
  id: '507f1f77bcf86cd799439011',
  name: 'Tony',
  role: 'admin'
};

export const authService = {
  generateToken: (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  loginAdmin: async (email, password) => {
    try {
      if (email !== HARDCODED_ADMIN.email || password !== HARDCODED_ADMIN.password) {
        throw new Error('Invalid credentials');
      }

      const tokenPayload = {
        id: HARDCODED_ADMIN.id,
        email: HARDCODED_ADMIN.email,
        role: HARDCODED_ADMIN.role,
        name: HARDCODED_ADMIN.name
      };

      const accessToken = authService.generateToken(tokenPayload);

      return {
        admin: {
          id: HARDCODED_ADMIN.id,
          email: HARDCODED_ADMIN.email,
          name: HARDCODED_ADMIN.name,
          role: HARDCODED_ADMIN.role,
          lastLogin: new Date()
        },
        accessToken
      };
    } catch (error) {
      throw error;
    }
  }
};