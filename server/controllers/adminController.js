import { Admin } from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
