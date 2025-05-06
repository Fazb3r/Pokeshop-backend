// POKESHOP_BACK/src/routes/orderRoutes.js
import express from 'express';
import { 
  createOrderFromCartService, 
  getOrderByIdService, 
  getUserOrdersService, 
  updateOrderStatusService 
} from '../services/orderService.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Create order from cart
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await createOrderFromCartService(userId);
    
    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.message === 'Cannot create order from empty cart') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.startsWith('Not enough stock')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getUserOrdersService(userId);
    
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user (unless admin)
    if (order.user_id !== req.user.id && req.user.userType !== 'administrator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, authorizeRole(['administrator']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status required: pending, completed, or cancelled' });
    }
    
    const order = await getOrderByIdService(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const updatedOrder = await updateOrderStatusService(id, status);
    
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;