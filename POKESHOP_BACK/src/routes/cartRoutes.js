// POKESHOP_BACK/src/routes/cartRoutes.js
import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:cartItemId', updateCartItem);
router.delete('/item/:cartItemId', removeFromCart);
router.delete('/clear', clearCart);

export default router;