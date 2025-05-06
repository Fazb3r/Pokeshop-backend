// POKESHOP_BACK/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'pokeShopSecretKey123!';

export const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  
  // Verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Set user info in request object for use in controllers
    req.user = user;
    next();
  });
};

// Optional: Role-based authorization middleware
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    
    next();
  };
};