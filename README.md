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
pokeshop_back/
├── src/
│ ├── controllers/ # Route handlers
│ ├── models/ # Database models
│ ├── services/ # Business logic
│ ├── routes/ # API endpoints
│ ├── middlewares/ # Auth & validation
│ ├── database/ # DB connection & migrations
│ └── utils/ # Helpers & constants
├── tests/ # Integration/unit tests
├── .env.example # Environment variables template
├── package.json
└── index.js # App entry point
