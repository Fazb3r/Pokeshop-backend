// POKESHOP_BACK/src/routes/pokemonRoutes.js
import express from 'express';
import { 
  getAllPokemon, 
  getPokemonById, 
  createPokemon, 
  updatePokemon, 
  deletePokemon 
} from '../controllers/pokemonController.js';
import { 
  authenticateToken, 
  authorizeRole 
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPokemon);
router.get('/:id', getPokemonById);

// Protected routes (admin only)
router.post('/', authenticateToken, authorizeRole(['administrator']), createPokemon);
router.put('/:id', authenticateToken, authorizeRole(['administrator']), updatePokemon);
router.delete('/:id', authenticateToken, authorizeRole(['administrator']), deletePokemon);

export default router;