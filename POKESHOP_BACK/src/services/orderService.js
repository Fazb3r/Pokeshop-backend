// POKESHOP_BACK/src/services/orderService.js
import { pool } from '../database/connectionPostgreSQL.js';
import { getOrCreateCartService, getCartItemsService, clearCartService } from './cartService.js';
import { getPokemonByIdService, updatePokemonService } from './pokemonService.js';

// Create order from cart
export const createOrderFromCartService = async (userId) => {
  // Use a transaction to ensure data consistency
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get user's cart
    const cart = await getOrCreateCartService(userId);
    const cartItems = await getCartItemsService(cart.id);
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      throw new Error('Cannot create order from empty cart');
    }
    
    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.price_at_time * item.quantity);
    }, 0);
    
    // Create order
    const orderResult = await client.query(
      'INSERT INTO "order" (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, totalAmount, 'pending']
    );
    
    const order = orderResult.rows[0];
    
    // Add items to the order
    for (const item of cartItems) {
      // Get latest pokemon data
      const pokemon = await getPokemonByIdService(item.pokemon_id);
      
      // Check stock
      if (pokemon.stock < item.quantity) {
        throw new Error(`Not enough stock for ${pokemon.name}`);
      }
      
      // Add item to order
      await client.query(
        'INSERT INTO order_item (order_id, pokemon_id, pokemon_name, quantity, price) VALUES ($1, $2, $3, $4, $5)',
        [order.id, pokemon.id, pokemon.name, item.quantity, item.price_at_time]
      );
      
      // Update pokemon stock
      const newStock = pokemon.stock - item.quantity;
      await updatePokemonService(pokemon.id, { ...pokemon, stock: newStock });
    }
    
    // Clear the cart
    await clearCartService(cart.id);
    
    // Complete the transaction
    await client.query('COMMIT');
    
    return order;
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    throw error;
  } finally {
    // Release the client
    client.release();
  }
};

// Get order by ID
export const getOrderByIdService = async (orderId) => {
  try {
    // Get order details
    const orderResult = await pool.query(
      'SELECT * FROM "order" WHERE id = $1',
      [orderId]
    );
    
    const order = orderResult.rows[0];
    
    if (!order) {
      return null;
    }
    
    // Get order items
    const itemsResult = await pool.query(
      'SELECT * FROM order_item WHERE order_id = $1',
      [orderId]
    );
    
    const items = itemsResult.rows;
    
    return {
      ...order,
      items
    };
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrdersService = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "order" WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatusService = async (orderId, status) => {
  try {
    const result = await pool.query(
      'UPDATE "order" SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};