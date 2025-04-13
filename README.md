# PokeShop Backend 

A RESTful API backend for a Pokémon-themed shop built with Express.js and PostgreSQL.

## Features ✨

- User authentication (JWT)
- Pokémon catalog management
- Shopping cart functionality
- Order processing
- PostgreSQL database integration
- REST API endpoints

## Tech Stack 🛠️

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: pg (node-postgres)
- **Authentication**: JWT
- **Validation**: Joi

## Project Structure 
pokeshop_back/ <br>
├── src/ <br>
│ ├── controllers/ # Route handlers<br>
│ ├── models/ # Database models<br>
│ ├── services/ # Business logic<br>
│ ├── routes/ # API endpoints<br>
│ ├── database/ # DB connection & migrations<br>
├── package.json<br>
└── index.js # App entry point<br>
