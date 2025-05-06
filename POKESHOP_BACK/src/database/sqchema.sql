-- POKESHOP_BACK/src/database/schema.sql

-- Users table
CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL -- 'administrator' or 'client'
);

-- Pokemon table
CREATE TABLE IF NOT EXISTS pokemon (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_item (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
  pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS "order" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_item (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES "order"(id) ON DELETE CASCADE,
  pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE SET NULL,
  pokemon_name VARCHAR(100) NOT NULL, -- Store name in case pokemon is deleted
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at fields
CREATE TRIGGER update_pokemon_timestamp
BEFORE UPDATE ON pokemon
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_order_timestamp
BEFORE UPDATE ON "order"
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Insert some sample Pokemon data
INSERT INTO pokemon (name, type, price, stock, image_url, description)
VALUES 
  ('Pikachu', 'Electric', 25.99, 10, 'pikachu.png', 'The most famous Pokemon with electric powers'),
  ('Charizard', 'Fire/Flying', 49.99, 5, 'charizard.png', 'A fierce dragon-like Pokemon with fire abilities'),
  ('Bulbasaur', 'Grass/Poison', 19.99, 15, 'bulbasaur.png', 'A gentle plant Pokemon with a bulb on its back'),
  ('Squirtle', 'Water', 19.99, 12, 'squirtle.png', 'A turtle-like Pokemon that shoots water'),
  ('Mewtwo', 'Psychic', 99.99, 2, 'mewtwo.png', 'A powerful genetically engineered Pokemon');