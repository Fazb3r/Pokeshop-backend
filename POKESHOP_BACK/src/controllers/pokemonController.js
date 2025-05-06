// POKESHOP_BACK/src/controllers/pokemonController.js
import { 
  getAllPokemonService, 
  getPokemonByIdService, 
  createPokemonService, 
  updatePokemonService, 
  deletePokemonService 
} from '../services/pokemonService.js';

// Get all Pokemon
export const getAllPokemon = async (req, res) => {
  try {
    const pokemon = await getAllPokemonService();
    return res.status(200).json(pokemon);
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Pokemon by ID
export const getPokemonById = async (req, res) => {
  try {
    const { id } = req.params;
    const pokemon = await getPokemonByIdService(id);
    
    if (!pokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    return res.status(200).json(pokemon);
  } catch (error) {
    console.error('Error fetching Pokemon by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new Pokemon (admin only)
export const createPokemon = async (req, res) => {
  try {
    const { name, type, price, stock, image_url, description } = req.body;
    
    // Validate required fields
    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Name, type and price are required' });
    }
    
    const newPokemon = await createPokemonService({
      name,
      type,
      price,
      stock: stock || 0,
      image_url: image_url || '',
      description: description || ''
    });
    
    return res.status(201).json(newPokemon);
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Pokemon (admin only)
export const updatePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, stock, image_url, description } = req.body;
    
    // Check if Pokemon exists
    const existingPokemon = await getPokemonByIdService(id);
    if (!existingPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    // Update Pokemon
    const updatedPokemon = await updatePokemonService(id, {
      name: name || existingPokemon.name,
      type: type || existingPokemon.type,
      price: price || existingPokemon.price,
      stock: stock !== undefined ? stock : existingPokemon.stock,
      image_url: image_url || existingPokemon.image_url,
      description: description || existingPokemon.description
    });
    
    return res.status(200).json(updatedPokemon);
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Pokemon (admin only)
export const deletePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if Pokemon exists
    const existingPokemon = await getPokemonByIdService(id);
    if (!existingPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    
    // Delete Pokemon
    const deleted = await deletePokemonService(id);
    
    if (deleted) {
      return res.status(200).json({ message: 'Pokemon deleted successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to delete Pokemon' });
    }
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};