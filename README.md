# Bookstore API

A RESTful API for managing books and authors using Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Documentation](#api-documentation)
  - [Author Endpoints](#author-endpoints)
  - [Book Endpoints](#book-endpoints)
- [Query Parameters](#query-parameters)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- CRUD operations for books and authors
- Advanced filtering, sorting, and pagination
- Relationship handling between books and authors
- Comprehensive error handling
- MVC architecture
- RESTful API design
- MongoDB integration

## Project Structure

```
bookstore-api/
├── config/              # Configuration files
├── controllers/         # API controllers
│   ├── authorController.js
│   └── bookController.js
├── models/              # Database models
│   ├── author.js
│   └── book.js
├── routes/              # API routes
│   ├── authorRoutes.js
│   └── bookRoutes.js
├── middleware/          # Custom middleware
├── utils/               # Utility functions
├── tests/               # Test files
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── api-tests.rest       # REST client test file
├── package.json         # Dependencies and scripts
├── server.js            # Entry point
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookstore-api.git
   cd bookstore-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/bookstore
   NODE_ENV=development
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

The application uses environment variables for configuration. See the `.env` example above for required variables.

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

## Query Parameters

The API supports various query parameters for filtering, sorting, and pagination:

### Pagination

- `page`: Specify the page number (default: 1)
- `limit`: Specify the number of results per page (default: 10)

Example: `/api/books?page=2&limit=20`

### Sorting

- `sort`: Specify fields to sort by (comma-separated)
  - Prefix with `-` for descending order

Example: `/api/books?sort=-publicationYear,title`

### Field Selection

- `select`: Specify fields to include (comma-separated)

Example: `/api/books?select=title,author,price`

### Filtering

- Filter by any field by including it as a query parameter
- Use MongoDB operators (`gt`, `gte`, `lt`, `lte`, `in`) by appending them in square brackets

Examples:
- `/api/books?genre=Fantasy`
- `/api/books?publicationYear[gt]=2000`
- `/api/books?price[lte]=20`

## Testing

The project includes a REST client file (`api-tests.rest`) that can be used with VS Code's REST Client extension to test the API endpoints.

To run tests:
1. Install the REST Client extension in VS Code
2. Open the `api-tests.rest` file
3. Click the "Send Request" link above each request to execute it

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