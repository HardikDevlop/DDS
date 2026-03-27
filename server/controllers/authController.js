import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await user.save();
    res.status(201).json({ message: "Signup successful. You can now log in." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials. User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "Server configuration error." });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { _id, name, privacyAccepted, termsAccepted } = user;
    res.json({ token, user: { _id, name, privacyAccepted, termsAccepted } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Forgot Password — placeholder, implement later
export const forgotPassword = async (req, res) => {
  res.status(200).json({ message: "Forgot password coming soon." });
};

// Reset Password — placeholder, implement later
export const resetPassword = async (req, res) => {
  res.status(200).json({ message: "Reset password coming soon." });
};