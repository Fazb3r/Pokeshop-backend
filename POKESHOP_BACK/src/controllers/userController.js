// POKESHOP_BACK/src/controllers/userController.js
import { getUserByUsername, createUser, getUserByIdService, updateUserService } from '../services/userService.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

// Login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user info and token
    return res.status(200).json({
      id: user.id,
      username: user.username,
      userType: user.user_type,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Register controller
export const register = async (req, res) => {
  try {
    const { username, password, userType = 'client' } = req.body;
    
    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = await createUser({
      username,
      password: hashedPassword,
      user_type: userType
    });
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Return user info and token
    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      userType: newUser.user_type,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by ID controller
export const getUserById = async (req, res) => {
  try {
    // Get user ID from token (set in auth middleware)
    const userId = req.user.id;
    
    const user = await getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user info (except password)
    return res.status(200).json({
      id: user.id,
      username: user.username,
      userType: user.user_type
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user controller
export const updateUser = async (req, res) => {
  try {
    // Get user ID from token (set in auth middleware)
    const userId = req.user.id;
    const { username, password } = req.body;
    
    // If updating password, hash it
    let updatedFields = { username };
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatedFields.password = hashedPassword;
    }
    
    const updatedUser = await updateUserService(userId, updatedFields);
    
    // Return updated user info
    return res.status(200).json({
      id: updatedUser.id,
      username: updatedUser.username,
      userType: updatedUser.user_type
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};