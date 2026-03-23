import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../config/keys.js"; // config.jwtSecret

// 🔒 Protect user routes
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret || process.env.JWT_SECRET);
      // Accept either userId or id in payload
      const userId = decoded.userId || decoded.id;
      if (!userId) return res.status(401).json({ message: "Invalid token payload" });
      req.user = await User.findById(userId).select("-password");
      req.userId = userId;
      if (!req.user) return res.status(401).json({ message: "User not found" });
      return next();
    } catch (err) {
      const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
      return res.status(401).json({ message: msg });
    }
  }
  return res.status(401).json({ message: "No token, not authorized" });
};

