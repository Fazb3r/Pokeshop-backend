// POKESHOP_BACK/src/routes/userRoutes.js
import express from 'express';
import { login, register, getUserById, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/register', register);

// User routes (protected by authentication)
router.get('/profile', authenticateToken, getUserById);
router.put('/profile', authenticateToken, updateUser);

export default router;