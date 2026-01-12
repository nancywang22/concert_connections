import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

/*
|--------------------------------------------------------------------------
| JWT Secret
|--------------------------------------------------------------------------
| This value is used to sign and verify JSON Web Tokens (JWTs).
| In production, this should always come from an environment variable
| to keep authentication secure.
|
| The fallback string exists only to prevent crashes during development.
|--------------------------------------------------------------------------
*/
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_secret";

/*
|--------------------------------------------------------------------------
| Register Handler
|--------------------------------------------------------------------------
| Handles new user registration.
| Steps:
| 1. Validate required fields
| 2. Check for existing user by email
| 3. Hash the user's password
| 4. Save the new user to MongoDB
| 5. Generate a JWT for authentication
| 6. Return the token and basic user info
|
| Route example:
| POST /auth/register
|--------------------------------------------------------------------------
*/
export async function registerHandler(req: Request, res: Response) {
  // Destructure user credentials from the request body
  const { username, email, password } = req.body;

  // Ensure all required fields are present
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  // Check if a user with the same email already exists
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ error: "Email already in use" });

  /*
    Hash the password before saving it.
    The number 10 represents the salt rounds,
    balancing security and performance.
  */
  const passwordHash = await bcrypt.hash(password, 10);

  // Create a new User document with the hashed password
  const user = new User({ username, email, passwordHash });

  // Save the new user to the database
  await user.save();

  /*
    Generate a JWT that stores the user's ID.
    This token will be used by the frontend to authenticate future requests.
  */
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  // Respond with the token and non-sensitive user data
  res.json({
    token,
    user: {
      id: user._id,
      username,
      email,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Login Handler
|--------------------------------------------------------------------------
| Authenticates an existing user.
| Steps:
| 1. Find the user by email
| 2. Compare the provided password with the stored hash
| 3. Generate a JWT if credentials are valid
| 4. Return the token and user info
|
| Route example:
| POST /auth/login
|--------------------------------------------------------------------------
*/
export async function loginHandler(req: Request, res: Response) {
  // Extract login credentials from the request body
  const { email, password } = req.body;

  // Look up the user by email
  const user = await User.findOne({ email });

  // If no user is found, return a generic error
  if (!user)
    return res.status(400).json({ error: "Invalid credentials" });

  /*
    Compare the provided password with the stored hash.
    bcrypt handles salting and hashing internally.
  */
  const valid = await bcrypt.compare(password, user.passwordHash);

  // If the password does not match, deny access
  if (!valid)
    return res.status(400).json({ error: "Invalid password" });

  /*
    Generate a JWT for the authenticated user.
    The token includes the user ID and has a 7-day expiration.
  */
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  // Debug logs to verify authentication flow (useful during development)
  console.log("User found:", user);
  console.log("Password hash:", user?.passwordHash);

  // Respond with the token and public user information
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email,
    },
  });
}
