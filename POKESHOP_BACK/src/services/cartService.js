// POKESHOP_BACK/src/services/cartService.js
import { pool } from '../database/connectionPostgreSQL.js';
import { getPokemonByIdService } from './pokemonService.js';

// Get user's active cart or create one if it doesn't exist
export const getOrCreateCartService = async (userId) => {
  try {
    // Check if user has an active cart
    const cartResult = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    
    let cart = cartResult.rows[0];
    
    // If no cart exists, create a new one
    if (!cart) {
      const newCartResult = await pool.query(
        'INSERT INTO cart (user_id) VALUES ($1) RETURNING *',
        [userId]
      );
      
      cart = newCartResult.rows[0];
    }
    
    return cart;
  } catch (error) {
    console.error('Error getting or creating cart:', error);
    throw error;
  }
};

// Get cart items
export const getCartItemsService = async (cartId) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, ci.pokemon_id, ci.quantity, ci.price_at_time, 
              p.name, p.type, p.image_url, p.description
       FROM cart_item ci
       JOIN pokemon p ON ci.pokemon_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
};

// Add item to cart
export const addItemToCartService = async (cartId, pokemonId, quantity) => {
  try {
    // Get pokemon details to store current price
    const pokemon = await getPokemonByIdService(pokemonId);
    if (!pokemon) {
      throw new Error('Pokemon not found');
    }
    
    // Check if item already exists in cart
    const existingItemResult = await pool.query(
      'SELECT * FROM cart_item WHERE cart_id = $1 AND pokemon_id = $2',
      [cartId, pokemonId]
    );
    
    const existingItem = existingItemResult.rows[0];
    
    if (existingItem) {
      // Update quantity if item already exists
      const newQuantity = existingItem.quantity + quantity;
      
      const result = await pool.query(
        'UPDATE cart_item SET quantity = $1 WHERE id = $2 RETURNING *',
        [newQuantity, existingItem.id]
      );
      
      return result.rows[0];
    } else {
      // Add new item to cart
      const result = await pool.query(
        'INSERT INTO cart_item (cart_id, pokemon_id, quantity, price_at_time) VALUES ($1, $2, $3, $4) RETURNING *',
        [cartId, pokemonId, quantity, pokemon.price]
      );
      
      return result.rows[0];
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemService = async (cartItemId, quantity) => {
  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await pool.query('DELETE FROM cart_item WHERE id = $1', [cartItemId]);
      return null;
    } else {
      // Update quantity
      const result = await pool.query(
        'UPDATE cart_item SET quantity = $1 WHERE id = $2 RETURNING *',
        [quantity, cartItemId]
      );
      
      return result.rows[0];
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Remove item from cart
export const removeCartItemService = async (cartItemId) => {
  try {
    await pool.query('DELETE FROM cart_item WHERE id = $1', [cartItemId]);
    return true;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Clear cart
export const clearCartService = async (cartId) => {
  try {
    await pool.query('DELETE FROM cart_item WHERE cart_id = $1', [cartId]);
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};