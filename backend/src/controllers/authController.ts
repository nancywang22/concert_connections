import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_secret";

// Register a new user
export async function registerHandler(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, passwordHash });
  await user.save();

  // Generate JWT
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user._id, username, email } });
}

// Login user
export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user._id, username: user.username, email } });
}
