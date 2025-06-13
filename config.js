/**
 * Configuration file for the Node.js Express application.
 * Manages sensitive keys and settings.
 */
// Use 'export default' for ES module export
export default {
  // JWT secret key used for signing and verifying tokens.
  // It's recommended to use an environment variable (process.env.JWT_SECRET_KEY)
  // in production for security. A fallback is provided for development.
  jwtSecret: 'blog-CRUD-backend-api@1.0.0', // Replace with your actual secret key

  // Expiration time for JWT tokens.
  // '1h' means 1 hour. Other examples: '2d' (2 days), '120s' (120 seconds).
  jwtExpiresIn: '1h'
};