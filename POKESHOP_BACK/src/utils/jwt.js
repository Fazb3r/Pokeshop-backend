// POKESHOP_BACK/src/utils/jwt.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'pokeShopSecretKey123!';
const JWT_EXPIRY = '24h'; // Token validity period

/**
 * Generate a JWT token for authenticated user
 * @param {Object} user - User object from database
 * @returns {String} JWT token
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    userType: user.user_type
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};