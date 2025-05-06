// POKESHOP_BACK/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './src/routes/userRoutes.js';
import pokemonRoutes from './src/routes/pokemonRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/cart', cartRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to the Pokemon Shop API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;