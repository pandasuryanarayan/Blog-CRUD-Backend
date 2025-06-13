// Import statements for ES Modules
import express from 'express';
import jwt from 'jsonwebtoken';
import morgan from 'morgan'; // For request logging
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import config from './config.js'; // Note the .js extension for local module imports
import initialPosts from './sampleblogposts.json' with { type: 'json' }; // Import initial blog post data

const app = express();
const PORT = 3000;

// --- Middleware ---

// 1. Body Parser Middleware: Parses incoming request bodies in JSON format.
app.use(express.json());

// 2. Logging Middleware (using morgan): Logs HTTP requests to the console.
//    'dev' format provides concise colored output for development.
app.use(morgan('dev'));

// --- In-Memory Database for Blog Posts ---
// Initialize posts with data from the JSON file.
// Using `let` because we'll modify this array (add/delete posts).
// In a real application, this would be connected to a persistent database.
// Data will still be lost when the server restarts as it's in-memory.
let posts = [...initialPosts]; // Create a mutable copy of the imported data

// --- Custom Error Handler Middleware ---
// This middleware catches errors from preceding middleware and route handlers.
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the stack trace to the console for debugging
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        statusCode: err.statusCode || 500
    });
});

// --- Authentication Middleware ---
// This middleware function verifies the JWT token from the Authorization header.
const authenticateToken = (req, res, next) => {
    // Get the Authorization header value (e.g., "Bearer YOUR_TOKEN_HERE")
    const authHeader = req.headers['authorization'];
    // Extract the token (second part after "Bearer ")
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // If no token is provided, return 401 Unauthorized
        const error = new Error('Authorization token is missing');
        error.statusCode = 401;
        return next(error);
    }

    // Verify the token using the secret key
    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            // If verification fails (e.g., token expired, invalid signature), return 403 Forbidden
            // (or 401 Unauthorized, depending on specific JWT library error handling)
            const error = new Error('Authorization token is invalid or expired');
            error.statusCode = 401; // Changed to 401 as it's an auth issue
            return next(error);
        }
        // If token is valid, attach the decoded user payload to the request object
        req.user = user;
        next(); // Proceed to the next middleware/route handler
    });
};

// --- Authentication Route ---
app.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    // In a real application, you would check these credentials against a database
    // and use password hashing (e.g., bcrypt).
    if (username === 'user' && password === 'password') {
        // Create a JWT token with the username as the payload
        const token = jwt.sign({ username: username }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
        console.log(`User '${username}' logged in successfully.`);
        res.json({ token });
    } else {
        // If credentials don't match, return 401 Unauthorized
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        next(error);
    }
});

// --- RESTful API Routes for Blog Posts ---

// GET all blog posts
app.get('/posts', (req, res) => {
    console.log("Fetching all blog posts.");
    res.json(posts);
});

// GET a single blog post by ID
app.get('/posts/:id', (req, res, next) => {
    const { id } = req.params;
    console.log(`Fetching post with ID: ${id}`);
    const post = posts.find(p => p.id === id);

    if (post) {
        res.json(post);
    } else {
        // If post not found, pass a 404 error to the error handling middleware
        const error = new Error('Blog post not found');
        error.statusCode = 404;
        next(error);
    }
});

// POST a new blog post (Protected route)
app.post('/posts', authenticateToken, (req, res, next) => {
    const { title, content, author } = req.body;
    console.log(`User '${req.user.username}' attempting to create a new post.`);

    if (!title || !content || !author) {
        // If required fields are missing, pass a 400 error
        const error = new Error("Missing 'title', 'content', or 'author' in request body");
        error.statusCode = 400;
        return next(error);
    }

    const newPost = {
        id: uuidv4(), // Generate a unique ID
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    posts.push(newPost);
    console.log(`Post created by '${req.user.username}' with ID: ${newPost.id}`);
    res.status(201).json({ message: "Blog post created successfully", post: newPost });
});

// PUT update an existing blog post (Protected route)
app.put('/posts/:id', authenticateToken, (req, res, next) => {
    const { id } = req.params;
    const { title, content, author } = req.body;
    console.log(`User '${req.user.username}' attempting to update post with ID: ${id}`);

    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
        // If post not found, pass a 404 error
        const error = new Error('Blog post not found');
        error.statusCode = 404;
        return next(error);
    }

    // Update fields if they are provided in the request body
    if (title) posts[postIndex].title = title;
    if (content) posts[postIndex].content = content;
    if (author) posts[postIndex].author = author;

    posts[postIndex].updatedAt = new Date().toISOString(); // Update timestamp

    console.log(`Post with ID '${id}' updated by '${req.user.username}'.`);
    res.json({ message: "Blog post updated successfully", post: posts[postIndex] });
});

// DELETE a blog post (Protected route)
app.delete('/posts/:id', authenticateToken, (req, res, next) => {
    const { id } = req.params;
    console.log(`User '${req.user.username}' attempting to delete post with ID: ${id}`);

    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== id);

    if (posts.length < initialLength) {
        console.log(`Post with ID '${id}' deleted by '${req.user.username}'.`);
        res.status(200).json({ message: `Post deleted successfully. ID: ${id}` });
    } else {
        // If post not found, pass a 404 error
        const error = new Error('Blog post not found');
        error.statusCode = 404;
        next(error);
    }
});

// --- Handle 404 Not Found (last middleware) ---
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error); // Pass to the central error handler
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Blog CRUD Backend Service is by Suryanarayan Panda");
    
});
