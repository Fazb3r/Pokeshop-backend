// POKESHOP_BACK/src/controllers/cartController.js
import {
    getOrCreateCartService,
    getCartItemsService,
    addItemToCartService,
    updateCartItemService,
    removeCartItemService,
    clearCartService
  } from '../services/cartService.js';
  
  // Get user's cart
  export const getCart = async (req, res) => {
    try {
      // Get user ID from token (set in auth middleware)
      const userId = req.user.id;
      
      // Get or create cart
      const cart = await getOrCreateCartService(userId);
      
      // Get cart items
      const cartItems = await getCartItemsService(cart.id);
      
      // Calculate total
      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      
      return res.status(200).json({
        id: cart.id,
        items: cartItems,
        total,
        itemCount: cartItems.length
      });
    } catch (error) {
      console.error('Error getting cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Add item to cart
  export const addToCart = async (req, res) => {
    try {
      // Get user ID from token
      const userId = req.user.id;
      
      // Get pokemon ID and quantity from request
      const { pokemonId, quantity = 1 } = req.body;
      
      if (!pokemonId) {
        return res.status(400).json({ message: 'Pokemon ID is required' });
      }
      
      // Validate quantity
      if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
      }
      
      // Get or create cart
      const cart = await getOrCreateCartService(userId);
      
      // Add item to cart
      await addItemToCartService(cart.id, pokemonId, quantity);
      
      // Return updated cart
      const cartItems = await getCartItemsService(cart.id);
      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      
      return res.status(200).json({
        id: cart.id,
        items: cartItems,
        total,
        itemCount: cartItems.length
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message === 'Pokemon not found') {
        return res.status(404).json({ message: 'Pokemon not found' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update cart item
  export const updateCartItem = async (req, res) => {
    try {
      // Get user ID from token
      const userId = req.user.id;
      
      // Get cart item ID and new quantity
      const { cartItemId } = req.params;
      const { quantity } = req.body;
      
      if (quantity === undefined) {
        return res.status(400).json({ message: 'Quantity is required' });
      }
      
      // Get cart
      const cart = await getOrCreateCartService(userId);
      
      // Update cart item
      await updateCartItemService(cartItemId, quantity);
      
      // Return updated cart
      const cartItems = await getCartItemsService(cart.id);
      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      
      return res.status(200).json({
        id: cart.id,
        items: cartItems,
        total,
        itemCount: cartItems.length
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Remove item from cart
  export const removeFromCart = async (req, res) => {
    try {
      // Get user ID from token
      const userId = req.user.id;
      
      // Get cart item ID
      const { cartItemId } = req.params;
      
      // Get cart
      const cart = await getOrCreateCartService(userId);
      
      // Remove item from cart
      await removeCartItemService(cartItemId);
      
      // Return updated cart
      const cartItems = await getCartItemsService(cart.id);
      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      
      return res.status(200).json({
        id: cart.id,
        items: cartItems,
        total,
        itemCount: cartItems.length
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Clear cart
  export const clearCart = async (req, res) => {
    try {
      // Get user ID from token
      const userId = req.user.id;
      
      // Get cart
      const cart = await getOrCreateCartService(userId);
      
      // Clear cart
      await clearCartService(cart.id);
      
      return res.status(200).json({
        id: cart.id,
        items: [],
        total: 0,
        itemCount: 0
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };