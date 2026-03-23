import jwt from "jsonwebtoken";

export const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      console.log("Not an admin");
      return res.status(403).json({ message: "Forbidden" });
    }

    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    console.error("Admin token error:", err);
    res.status(500).json({ message: "Invalid token" });
  }
};