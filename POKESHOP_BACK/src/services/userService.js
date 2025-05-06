// POKESHOP_BACK/src/services/userService.js
import { pool } from '../database/connectionPostgreSQL.js';

// Get user by username
export const getUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      'SELECT id, username, password, user_type FROM "user" WHERE username = $1',
      [username]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
};

// Get user by ID
export const getUserByIdService = async (id) => {
  try {
    const result = await pool.query(
      'SELECT id, username, user_type FROM "user" WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Create new user
export const createUser = async (userData) => {
  const { username, password, user_type } = userData;
  
  try {
    const result = await pool.query(
      'INSERT INTO "user" (username, password, user_type) VALUES ($1, $2, $3) RETURNING id, username, user_type',
      [username, password, user_type]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user
export const updateUserService = async (id, userData) => {
  try {
    // Create dynamic query based on provided fields
    let queryFields = [];
    let queryValues = [];
    let valueIndex = 1;
    
    // Add each field to query
    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined) {
        queryFields.push(`${key} = $${valueIndex}`);
        queryValues.push(userData[key]);
        valueIndex++;
      }
    });
    
    // Add ID as the last parameter
    queryValues.push(id);
    
    // Execute query
    const result = await pool.query(
      `UPDATE "user" SET ${queryFields.join(', ')} WHERE id = $${valueIndex} RETURNING id, username, user_type`,
      queryValues
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Get all users (admin function)
export const getAllUsers = async () => {
  try {
    const result = await pool.query(
      'SELECT id, username, user_type FROM "user" ORDER BY username'
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};