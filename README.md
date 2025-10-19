# API Node TDD Clean

[![CI](https://github.com/luizcurti/api-node-tdd-clean/actions/workflows/ci.yml/badge.svg)](https://github.com/luizcurti/api-node-tdd-clean/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

This project is an implementation of a robust Node.js API following **Test-Driven Development (TDD)** principles and **Clean Architecture** patterns.

The goal is to create a scalable, maintainable authentication system with comprehensive testing coverage and modern development practices.

## 🚀 Features

- **Test-Driven Development (TDD)** - All features built and tested with TDD methodology
- **Clean Architecture** - Structured using clean architecture principles for maintainability
- **Node.js & Express** - Backend API built with Express framework
- **MongoDB** - Database with Docker setup for easy development
- **Jest** - Comprehensive testing framework with coverage reports
- **ESLint** - Code quality and consistency with StandardJS
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - Bcrypt for secure password hashing
- **Docker Support** - Complete containerized development environment

## 🏗️ Architecture

The project follows Clean Architecture with clear separation of concerns:

```
src/
├── domain/          # Business logic and use cases
├── presentation/    # API routes and controllers  
├── infra/          # Database repositories and helpers
├── utils/          # Shared utilities and helpers
└── main/           # Application setup and entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (>=16.0.0)
- Docker & Docker Compose
- npm or yarn

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/luizcurti/api-node-tdd-clean.git
   cd api-node-tdd-clean
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations if needed
   ```

4. **Start MongoDB with Docker:**
   ```bash
   npm run docker:db
   ```

5. **Run the application:**
   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

The API will be available at `http://localhost:5858`

## 🐳 Docker Environment

### Services Available

| Service | URL | Description |
|---------|-----|-------------|
| **API** | http://localhost:5858 | Node.js API |
| **MongoDB** | mongodb://localhost:27017 | Database |
| **Mongo Express** | http://localhost:8081 | MongoDB Web Interface |

### Docker Commands

```bash
# Database only
npm run docker:db          # Start MongoDB + Mongo Express
npm run docker:db:stop     # Stop services
npm run docker:db:logs     # View MongoDB logs

# Full stack (API + Database)
npm run docker:full        # Everything in containers

# Reset environment
npm run docker:reset       # Stop all and recreate volumes
```

### Database Commands

```bash
# Database setup
npm run db:setup           # Create collections and indexes
npm run db:setup:seed      # Setup with test data
npm run db:reset           # Drop all data
npm run db:reset:setup     # Reset and recreate structure
```

### Database Credentials

**MongoDB Admin:**
- Username: `admin`
- Password: `admin123`
- Database: `clean-node-api`

**Application User:**
- Username: `api-user`
- Password: `api-password`
- Database: `clean-node-api`

## 🧪 Testing

The application follows TDD with comprehensive test coverage:

```bash
# Run all tests
npm test

# Unit tests only (*.spec.js)
npm run test:unit

# Integration tests only (*.test.js)  
npm run test:integration

# Watch mode for development
npm run test:unit:watch
npm run test:integration:watch

# Coverage reports
npm run test:coverage
npm run test:coverage:open  # Opens HTML report in browser

# CI pipeline
npm run test:ci
```

### Test Coverage
Current coverage: **100% statements, 97.36% branches, 100% functions, 100% lines**

## 🔍 Code Quality

```bash
# Lint code
npm run lint

# Auto-fix issues
npm run lint:fix

# Strict linting (no warnings)
npm run lint:check
```

## 📁 Project Structure

```
api-node-tdd-clean/
├── src/
│   ├── domain/usecases/           # Business logic
│   ├── presentation/
│   │   ├── routers/              # API route handlers
│   │   ├── helpers/              # HTTP response helpers
│   │   └── errors/               # Custom error classes
│   ├── infra/
│   │   ├── repositories/         # Database access layer
│   │   └── helpers/              # Infrastructure helpers
│   ├── utils/
│   │   ├── helpers/              # Utilities (validation, crypto)
│   │   └── errors/               # Utility error classes
│   └── main/
│       ├── config/               # Application configuration
│       ├── middlewares/          # Express middlewares
│       ├── routes/               # Route definitions
│       └── index.js              # Application entry point
├── docker/                       # Docker configuration
├── coverage/                     # Test coverage reports
├── docker-compose.yml            # Docker services definition
├── Dockerfile                    # API container definition
└── jest.config.js               # Test configuration
```

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - API health status
  ```json
  {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456,
    "environment": "development",
    "version": "1.0.0"
  }
  ```

### Authentication
- `POST /api/login` - User authentication
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

## 🌟 Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Testing:** Jest + Supertest
- **Authentication:** JWT + Bcrypt
- **Validation:** Validator.js
- **Code Quality:** ESLint + StandardJS
- **Development:** Nodemon
- **Containerization:** Docker + Docker Compose

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  email: String,           // Unique email address (required)
  name: String,            // User display name
  password: String,        // Bcrypt hashed password
  accessToken: String,     // JWT token for authentication
  createdAt: Date,         // Account creation timestamp
  updatedAt: Date,         // Last modification timestamp
  
  // Optional fields (may exist in some records)
  age: Number,             // User age
  state: String            // User state/location
}
```

### Indexes
- `email` (unique) - Primary identifier for login
- `accessToken` - For JWT token validation

### Database Management

```bash
# Setup database structure and indexes
npm run db:setup

# Setup with test data (creates test@example.com / 123456)
npm run db:setup:seed

# Reset database (drops all data)
npm run db:reset

# Reset and recreate structure
npm run db:reset:setup
```

### Manual MongoDB Commands
```javascript
// Connect to database
use clean-node-api

// View all users
db.users.find().pretty()

// Check indexes
db.users.getIndexes()

// Create test user manually
db.users.insertOne({
  email: "test@example.com",
  name: "Test User", 
  password: "$2b$12$...", // bcrypt hash
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🚦 Environment Variables

```bash
# Database
MONGO_URL=mongodb://admin:admin123@localhost:27017/clean-node-api?authSource=admin

# Security
TOKEN_SECRET=your-super-secret-jwt-token

# Server
PORT=5858
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Write tests first (TDD approach)
4. Implement the feature
5. Ensure all tests pass: `npm test`
6. Check code quality: `npm run lint`
7. Commit changes: `git commit -am 'Add new feature'`
8. Push to branch: `git push origin feature/new-feature`
9. Submit a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🎯 Development Workflow

1. **Start development environment:**
   ```bash
   npm run docker:db        # Start database
   npm run db:setup:seed    # Setup database with test data
   npm run dev              # Start API with hot reload
   ```

2. **TDD Workflow:**
   ```bash
   npm run test:unit:watch    # Watch unit tests
   # Write failing test → Implement code → Make test pass → Refactor
   ```

3. **Before committing:**
   ```bash
   npm run lint:fix         # Fix code style
   npm run test             # Run all tests
   npm run test:coverage    # Check coverage
   ```

4. **Database management:**
   ```bash
   npm run db:reset         # Clean database
   npm run db:setup:seed    # Recreate with test data
   ```

### Test User Credentials
After running `npm run db:setup:seed`:
- **Email:** test@example.com
- **Password:** 123456

This project demonstrates modern Node.js development practices with emphasis on code quality, testing, and maintainability.

## 🔄 CI Pipeline

Simple automated pipeline that runs on every push and pull request:

- **Code Quality:** ESLint with StandardJS rules
- **Testing:** Unit and integration tests with MongoDB
- **Node.js 22:** Latest LTS version support

```bash
# Run same checks locally
npm run lint    # Code quality check
npm test        # All tests
```
