// Import Express types:
// - Request: the standard incoming HTTP request object
// - Response: the HTTP response object used to send data back to the client
// - NextFunction: used to pass control to the next middleware in the stack
import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

// Load the JWT secret from environment variables for token verification
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_secret";

// Extend the Express Request type to include a userId field
// This allows downstream handlers to safely access req.userId
export interface AuthRequest extends Request {
  userId?: string;
}

// Middleware that protects routes by requiring a valid JWT
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Read the Authorization header (expected format: "Bearer <token>")
  const authHeader = req.headers.authorization;

  // If no Authorization header is present, the user is not authenticated
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Split the header to extract the token portion
  // Example: "Bearer abc.def.ghi" → ["Bearer", "abc.def.ghi"]
  const token = authHeader.split(" ")[1];

  // If the token is missing or malformed, reject the request
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    // Verify the token using the JWT secret
    // If valid, jwt.verify returns the decoded payload
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Attach the user ID from the token payload to the request object
    // This makes the authenticated user's ID available to later handlers
    req.userId = decoded.id;

    // Pass control to the next middleware or route handler
    next();
  } catch {
    // If token verification fails (expired, invalid signature, etc.),
    // respond with an unauthorized error
    return res.status(401).json({ error: "Invalid token" });
  }
}
