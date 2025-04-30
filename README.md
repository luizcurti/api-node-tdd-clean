# API Node TDD Clean
This project is an implementation of an API in Node.js following the principles of Test-Driven Development (TDD) and Clean Architecture.

The goal of the project is to create a robust, scalable, and maintainable system by focusing on clean code practices and ensuring that all business logic is thoroughly tested. It leverages TypeScript and Node.js to build a clean, well-structured, and testable API.

## Features
- Test-Driven Development (TDD): All features are built and tested with TDD methodology to ensure code quality.
- Clean Architecture: Structured using clean architecture principles to separate concerns and make the codebase easy to maintain and extend.
- Node.js & Express: Backend API built using Node.js and Express framework.
- TypeScript: Full TypeScript support for type safety and better development experience.
- Jest: Testing framework used to ensure the application is thoroughly tested.
- Database: (Insert database technology here, e.g., PostgreSQL, MongoDB, etc.)

## Installation
Before running the application, make sure you have the following installed:
- Node.js (>=16.0.0)
- npm or yarn (for package management)
- PostgreSQL (or another database, if applicable)

## Steps
1. Clone the repository:
- git clone https://github.com/luizcurti/api-node-TDD-clean.git

2. Navigate to the project directory:
- cd api-node-TDD-clean

3. Install dependencies:
- npm install or yarn install

Set up environment variables:
Create a .env file at the root of the project and add your environment variables. You can use .env.example as a reference.

* DATABASE_URL=your_database_url
* PORT=your_app_port

## Run the application:
- npm start or yarn start

The API will be available at http://localhost:3000 (or whichever port you specified).

## Running Tests
To run the tests and ensure that everything is working correctly, use the following command:
- npm test or yarn test

This will run all the unit tests and integration tests to ensure the application behaves as expected.

## Running Linter
To check the code for any linting issues:
- npm run lint or yarn lint

## Folder Structure
The project follows Clean Architecture principles, which ensure that business logic is decoupled from the frameworks and tools.

## Technologies Used
- Node.js: Runtime environment to build the API.
- Express: Web framework for building the API.
- TypeScript: Superset of JavaScript that allows for static typing.
- Jest: Testing framework to write unit and integration tests.
- ESLint/Prettier: Tools for code linting and formatting.
- Sequelize (or other ORM): ORM for interacting with the database (or another ORM if applicable).
- PostgreSQL (or other database): Database to store data.

## Testing
The application follows the Test-Driven Development (TDD) approach. Tests are written first, and the code is implemented to make the tests pass. This ensures that the system behaves as expected.

## Running Tests
To run the tests:
- npm test or yarn test

## Test Coverage
You can check the test coverage report by running:
- npm run coverage or yarn coverage
