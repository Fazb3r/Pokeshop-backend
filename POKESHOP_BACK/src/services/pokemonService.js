// POKESHOP_BACK/src/services/pokemonService.js
import { pool } from '../database/connectionPostgreSQL.js';

// Get all Pokemon
export const getAllPokemonService = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM pokemon ORDER BY name'
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all Pokemon:', error);
    throw error;
  }
};

// Get Pokemon by ID
export const getPokemonByIdService = async (id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pokemon WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting Pokemon by ID:', error);
    throw error;
  }
};

// Create new Pokemon
export const createPokemonService = async (pokemonData) => {
  const { name, type, price, stock, image_url, description } = pokemonData;
  
  try {
    const result = await pool.query(
      'INSERT INTO pokemon (name, type, price, stock, image_url, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, type, price, stock || 0, image_url || '', description || '']
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    throw error;
  }
};

// Update Pokemon
export const updatePokemonService = async (id, pokemonData) => {
  const { name, type, price, stock, image_url, description } = pokemonData;
  
  try {
    const result = await pool.query(
      'UPDATE pokemon SET name = $1, type = $2, price = $3, stock = $4, image_url = $5, description = $6 WHERE id = $7 RETURNING *',
      [name, type, price, stock || 0, image_url || '', description || '', id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    throw error;
  }
};

// Delete Pokemon
export const deletePokemonService = async (id) => {
  try {
    const result = await pool.query(
      'DELETE FROM pokemon WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    throw error;
  }
};