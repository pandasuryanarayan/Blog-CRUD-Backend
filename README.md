# Blog CRUD Backend  
**Author: Suryanarayan Panda**

## Objective  
This project provides a basic RESTful API for managing blog posts, built with Node.js and Express.js, featuring authentication, logging, and error handling middleware.

## Features

* **RESTful API**: Standard CRUD operations for blog posts (GET, POST, PUT, DELETE).
* **Authentication**: JWT-based authentication to protect write operations (Create, Update, Delete).
* **Logging Middleware**: Logs incoming requests to the console.
* **Error Handling Middleware**: Centralized error handling for consistent JSON responses.
* **In-Memory Storage**: Simple in-memory data store for blog posts (data resets on server restart).

## Project Structure

```
blog-crud-backend/
├── index.js              # Main Express.js application with routes and middleware
├── config.js             # Configuration settings (e.g., JWT secret)
├── sampleblogposts.json  # Sample in-memory blog data used by the application
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Automatically generated for exact dependency versions
└── README.md             # This file contains setuo instructions and usage of API
```

## Setup and Installation

### Prerequisites  
Ensure the following software is installed:

- **Node.js**: Version 22.x or later (LTS recommended)  
  Download: [https://nodejs.org/](https://nodejs.org/)  
- **npm**: Comes bundled with Node.js  

Verify installation:
```bash
node -v
npm -v
````
### Steps

#### 1. Obtain the Project Files

**Option A: Clone the Repository**

```bash
git clone [YOUR_REPOSITORY_URL_HERE]
```

**Option B: Download Manually**
Download `index.js`, `package.json` and `config.js` into a folder (e.g., `blog-crud-backend`).

#### 2. Navigate to the Project Directory

```bash
cd /path/to/your/project-folder
```

#### 3. Install Dependencies

```bash
npm install
```

## Running the Server

Start the server with:

```bash
npm start
```
or

```bash
npm dev
```

You should see:

```
Server is running on http://localhost:3000  
Blog CRUD Backend Service by Suryanarayan Panda
```

## API Usage

All responses are in JSON format.
Base URL: `http://localhost:3000`

### Authentication

#### 1. Login

* **Endpoint:** `POST /login`
* **Description:** Authenticates a user and returns an access token.
* **Request Body:**

```json
{
  "username": "user",
  "password": "password"
}
```

* **Response (Success):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

* **Response (Failure):**

```json
{
  "message": "Invalid credentials",
  "statusCode": 401
}
```

* **Usage Example (cURL):**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"username": "user", "password": "password"}' http://localhost:3000/login
```

---

### Blog Post Operations

#### 2. Get All Blog Posts

* **Endpoint:** `GET /posts`
* **Description:** Retrieves a list of all blog posts.
* **Response:**

```json
[
  {
    "id": "a1b2c3d4",
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "author": "Alice",
    "createdAt": "2023-01-01T10:00:00.000Z",
    "updatedAt": "2023-01-01T10:00:00.000Z"
  },
  ...
]
```

* **Usage Example:**

```bash
curl http://localhost:3000/posts
```

#### 3. Get a Single Blog Post

* **Endpoint:** `GET /posts/:id`
* **Description:** Retrieves a single blog post by its ID.
* **Response (Success):**

```json
{
  "id": "a1b2c3d4",
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "author": "Alice",
  "createdAt": "2023-01-01T10:00:00.000Z",
  "updatedAt": "2023-01-01T10:00:00.000Z"
}
```

* **Response (Not Found):**

```json
{
  "message": "Blog post not found",
  "statusCode": 404
}
```

* **Usage Example:**

```bash
curl http://localhost:3000/posts/a1b2c3d4
```

#### 4. Create a New Blog Post (Protected)

* **Endpoint:** `POST /posts`
* **Description:** Creates a new blog post.
* **Authorization:** `Bearer <token>`
* **Request Body:**

```json
{
  "title": "New Blog Post Title",
  "content": "This is the content of the new blog post.",
  "author": "Jane Doe"
}
```

* **Response (Success):**

```json
{
  "message": "Blog post created successfully",
  "post": {
    "id": "f9g0h1i2",
    "title": "New Blog Post Title",
    "content": "This is the content of the new blog post.",
    "author": "Jane Doe",
    "createdAt": "2023-01-10T09:00:00.000Z",
    "updatedAt": "2023-01-10T09:00:00.000Z"
  }
}
```

* **Response (Failure - 400/401):** Appropriate error messages.

* **Usage Example:**

```bash
TOKEN="<your_jwt_token>"
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"title": "My Third Post", "content": "This is my third post.", "author": "Charlie"}' http://localhost:3000/posts
```

#### 5. Update an Existing Blog Post (Protected)

* **Endpoint:** `PUT /posts/:id`
* **Description:** Updates an existing blog post.
* **Authorization:** `Bearer <token>`
* **Request Body (Partial Allowed):**

```json
{
  "title": "Updated Title",
  "content": "Updated content."
}
```

* **Response (Success):**

```json
{
  "message": "Blog post updated successfully",
  "post": {
    "id": "a1b2c3d4",
    "title": "Updated Title",
    "content": "Updated content.",
    "author": "Alice",
    "createdAt": "2023-01-01T10:00:00.000Z",
    "updatedAt": "2023-01-11T12:00:00.000Z"
  }
}
```

* **Usage Example:**

```bash
TOKEN="<your_jwt_token>"
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"content": "Updated content."}' http://localhost:3000/posts/a1b2c3d4
```

#### 6. Delete a Blog Post (Protected)

* **Endpoint:** `DELETE /posts/:id`

* **Description:** Deletes a blog post.

* **Authorization:** `Bearer <token>`

* **Response (Success - 204):** No body.

* **Usage Example:**

```bash
TOKEN="<your_jwt_token>"
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/posts/e5f6g7h8 -v
```

## Sample Test Data

The `index.js` file is initialized with the following sample blog posts from `sampleblogposts.json`:

```json
[
  {
    "id": "a1b2c3d4",
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "author": "Alice",
    "createdAt": "2023-01-01T10:00:00.000Z",
    "updatedAt": "2023-01-01T10:00:00.000Z"
  },
  {
    "id": "e5f6g7h8",
    "title": "Thoughts on AI",
    "content": "Exploring the impact of artificial intelligence on society and its future.",
    "author": "Bob",
    "createdAt": "2023-01-05T14:30:00.000Z",
    "updatedAt": "2023-01-05T14:30:00.000Z"
  },
  {
    "id": "i9j0k1l2",
    "title": "Cooking Adventures: Pasta Perfection",
    "content": "A step-by-step guide to making the perfect homemade pasta from scratch.",
    "author": "Alice",
    "createdAt": "2023-01-10T11:00:00.000Z",
    "updatedAt": "2023-01-10T11:00:00.000Z"
  }
]
```

## Error Handling

The API provides standardized JSON error responses:

```json
{
  "message": "Detailed error message",
  "statusCode": 400
}
```

### Error Codes

* **400 Bad Request**: Invalid or missing parameters.
* **401 Unauthorized**: Missing or invalid authentication.
* **403 Forbidden**: Unauthorized access (not commonly used here).
* **404 Not Found**: Resource not found.
* **500 Internal Server Error**: Unexpected error.

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch:

   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit changes:

   ```bash
   git commit -m 'Add Your Feature'
   ```
4. Push to GitHub:

   ```bash
   git push origin feature/YourFeatureName
   ```
5. Open a Pull Request

## License

This project is licensed under the [Apache License 2.0](LICENSE). See the LICENSE file in this repository for full details.

## Support

If you encounter any issues, open an issue on the GitHub repo or contact **Suryanarayan Panda** directly.

## Acknowledgments

This project utilizes the following open-source technologies to build the blog CRUD backend API:

- **[Express.js](https://expressjs.com/)**: A fast, unopinionated, minimalist web framework used for building the server and defining API routes.

- **[jsonwebtoken (JWT)](https://github.com/auth0/node-jsonwebtoken)**: A library for implementing JSON Web Token (JWT) based authentication, securing protected routes.

- **[morgan](https://github.com/expressjs/morgan)**: An HTTP request logger middleware for Node.js, used here for logging incoming API requests.

- **[uuid](https://github.com/uuidjs/uuid)**: A simple and fast utility for generating universally unique IDs (UUIDs) for blog posts.