# Bookstore API

A RESTful API for managing books and authors using Node.js, Express, MongoDB Atlas, and Docker.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Running with Docker](#running-with-docker)
  - [Prerequisites for Docker](#prerequisites-for-docker)
  - [Running in Development Mode](#running-in-development-mode)
  - [Running in Production Mode](#running-in-production-mode)
- [API Documentation](#api-documentation)
  - [Author Endpoints](#author-endpoints)
  - [Book Endpoints](#book-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
- [Query Parameters](#query-parameters)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- CRUD operations for books and authors
- User authentication and authorization
- Advanced filtering, sorting, and pagination
- Relationship handling between books and authors
- Comprehensive error handling
- MVC architecture
- RESTful API design
- MongoDB Atlas integration
- Docker support for easy deployment

## Project Structure

```
bookstore-api/
├── config/              # Configuration files
│   └── db.js            # Database connection
├── controllers/         # API controllers
│   ├── authController.js
│   ├── authorController.js
│   └── bookController.js
├── models/              # Database models
│   ├── author.js
│   ├── book.js
│   └── user.js
├── middlewares/         # Custom middleware
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── authorRoutes.js
│   └── bookRoutes.js
├── tests/               # Test files
├── .dockerignore        # Docker ignore file
├── .env                 # Environment variables (gitignored)
├── .gitignore           # Git ignore file
├── app.js               # Express app setup
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose for development
├── docker-compose.prod.yml # Docker Compose for production
├── package.json         # Dependencies and scripts
├── server.js            # Entry point
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone -b Linux-Fix https://github.com/caw083/Book-Management.git
   cd Book-Management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `config.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   ```

   Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your MongoDB Atlas credentials.

   or using the configuration of
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://christopher083ade:TCjue30K0kDvEuYt@bookmanagement.76ttklh.mongodb.net/BookManagement?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with nodemon:
   ```bash
   npm run dev
   ```

### Configuration

The application uses environment variables for configuration. See the `config.env` example above for required variables.

## Running with Docker

### Prerequisites for Docker

- Docker Desktop installed on your machine
- Docker Compose installed (included with Docker Desktop)

### Running in Development Mode

1. Make sure you have the following files in your project root:
   - `Dockerfile`
   - `.dockerignore`
   - `docker-compose.yml`

2. Run the application in development mode:
   ```bash
   docker-compose up
   ```

   This will:
   - Build the Docker image for the application
   - Start the containers for the app and MongoDB
   - Mount your local code to the container for hot-reloading
   - Expose the API on port 3000

3. To run in background mode:
   ```bash
   docker-compose up -d
   ```

4. To stop the containers:
   ```bash
   docker-compose down
   ```

### Running in Production Mode

1. Create a `.env` file with production values:
   ```
   JWT_SECRET=your_secure_jwt_secret
   MONGO_USERNAME=admin
   MONGO_PASSWORD=secure_password
   ```

2. Run with production configuration:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. To stop the production containers:
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

## API Documentation

### Author Endpoints

| Method | Endpoint                | Description                      | Access    |
|--------|-------------------------|----------------------------------|-----------|
| GET    | /api/authors            | Get all authors                  | Public    |
| GET    | /api/authors/:id        | Get a single author by ID        | Public    |
| GET    | /api/authors/:id/books  | Get all books by a specific author | Public |
| POST   | /api/authors            | Create a new author              | Private   |
| PUT    | /api/authors/:id        | Update an author                 | Private   |
| DELETE | /api/authors/:id        | Delete an author                 | Private   |

**Note:** Authors with associated books cannot be deleted. You must delete all associated books first.

### Book Endpoints

| Method | Endpoint            | Description                      | Access    |
|--------|---------------------|----------------------------------|-----------|
| GET    | /api/books          | Get all books                    | Public    |
| GET    | /api/books/:id      | Get a single book by ID          | Public    |
| POST   | /api/books          | Create a new book                | Private   |
| PUT    | /api/books/:id      | Update a book                    | Private   |
| DELETE | /api/books/:id      | Delete a book                    | Private   |

### Authentication Endpoints

| Method | Endpoint            | Description                      | Access    |
|--------|---------------------|----------------------------------|-----------|
| POST   | /api/auth/register  | Register a new user              | Public    |
| POST   | /api/auth/login     | Login a user                     | Public    |
| GET    | /api/auth/me        | Get current user                 | Private   |

## Query Parameters

The API supports various query parameters for filtering, sorting, and pagination:

### Pagination

- `page`: Specify the page number (default: 1)
- `limit`: Specify the number of results per page (default: 10)

Example: `/api/books?page=2&limit=20`

### Sorting

- `sort`: Specify fields to sort by (comma-separated)
  - Prefix with `-` for descending order

Example: `/api/books?sort=-publishedDate,title`

### Field Selection

- `select`: Specify fields to include (comma-separated)

Example: `/api/books?select=title,author,description`

### Filtering

- Filter by any field by including it as a query parameter
- Use MongoDB operators (`gt`, `gte`, `lt`, `lte`, `in`) by appending them in square brackets

Examples:
- `/api/books?title=Harry%20Potter`
- `/api/books?publishedDate[gt]=2000-01-01`
- `/api/books?isbn=1234567890`

## Testing

To test the API endpoints, you can use tools like:
- Postman
- Insomnia
- cURL
- VS Code's REST Client extension with a .rest file

## API Request Examples (REST Client)
You can test this API using [VS Code's REST Client Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). Save the following into a file named bookstore.http or bookstore.rest:

<details> <summary>Click to expand sample REST requests</summary>
```http
  @baseUrl = http://ec2-107-21-140-191.compute-1.amazonaws.com:3000/api

### REGISTER USER
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "name": "user1",
  "email": "user1@example.com",
  "password": "securepassword"
}

### LOGIN USER
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "user1@example.com",
  "password": "securepassword"
}

### CREATE AUTHOR
POST {{baseUrl}}/authors
Content-Type: application/json
Authorization: Bearer {{jwt_token}}

{
  "name": "John Doe",
  "bio": "Author of several books"
}

### GET AUTHORS
GET {{baseUrl}}/authors

### CREATE BOOK
POST {{baseUrl}}/books
Content-Type: application/json
Authorization: Bearer {{jwt_token}}

{
  "title": "Harry Potter and the Chamber of Secrets",
  "description": "The second book in the Harry Potter series",
  "isbn": "9780747538486",
  "author": "68225a54f9f5f748df31b32f",
  "publishedDate": "1998-07-02"
}

### GET BOOKS PAGE 1
GET {{baseUrl}}/books?page=1&limit=20

### GET BOOKS PAGE 2
GET {{baseUrl}}/books?page=2&limit=20```

 
📝Replace {{jwt_token}} with the token returned from the login request when accessing protected endpoints like author or book creation.

Or just using the book-api.rest in the folder real_life_test_data
</details>

## Error Handling

The API provides detailed error responses in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error codes:
- `400` - Bad request (validation errors, malformed requests)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Server error

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
