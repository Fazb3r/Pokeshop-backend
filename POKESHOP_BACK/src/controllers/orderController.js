// POKESHOP_BACK/src/controllers/orderController.js
import {
    createOrderFromCartService,
    getOrderByIdService,
    getUserOrdersService,
    updateOrderStatusService
  } from '../services/orderService.js';
  
  // Create new order from cart
  export const createOrder = async (req, res) => {
    try {
      const userId = req.user.id;
      
      const newOrder = await createOrderFromCartService(userId);
      
      return res.status(201).json(newOrder);
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
  };
  
  // Get order by ID
  export const getOrderById = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const isAdmin = req.user.userType === 'administrator';
      
      const order = await getOrderByIdService(id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Only allow users to view their own orders (admins can view all)
      if (!isAdmin && order.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error('Error getting order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get all orders for current user
  export const getUserOrders = async (req, res) => {
    try {
      const userId = req.user.id;
      
      const orders = await getUserOrdersService(userId);
      
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error getting user orders:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update order status (admin only)
  export const updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Valid status required: pending, completed, or cancelled' });
      }
      
      // Check if order exists
      const order = await getOrderByIdService(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Update order status
      const updatedOrder = await updateOrderStatusService(id, status);
      
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };