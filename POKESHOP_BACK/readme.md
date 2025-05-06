# Pokemon Shop Backend

A Node.js Express backend for a Pokemon e-commerce application.

## Features

- User authentication (login and registration)
- Pokemon management (CRUD operations)
- Shopping cart functionality
- Order processing

## Technologies

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pokeshop
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   ```
4. Initialize the database:
   ```
   psql -U postgres -f src/database/schema.sql
   ```
5. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Pokemon

- `GET /api/pokemon` - Get all Pokemon
- `GET /api/pokemon/:id` - Get Pokemon by ID
- `POST /api/pokemon` - Create new Pokemon (admin only)
- `PUT /api/pokemon/:id` - Update Pokemon (admin only)
- `DELETE /api/pokemon/:id` - Delete Pokemon (admin only)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:cartItemId` - Update cart item quantity
- `DELETE /api/cart/item/:cartItemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders

- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status (admin only)

## User Types

- `client` - Regular user
- `administrator` - Admin user with additional privileges