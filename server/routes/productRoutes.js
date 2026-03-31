// File: server/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getPopularServices,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ Ensure uploads directory exists before multer tries to use it
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads/ directory");
}

// 🗂️ Multer storage setup for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File upload error", error: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

const uploadFields = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "subServiceImages", maxCount: 10 },
]);

// 🛠️ Routes
router.post("/", uploadFields, handleMulterError, createProduct);
router.get("/", getAllProducts);
router.get("/popular", getPopularServices);
router.get("/:id", getProductById);
router.put("/:id", uploadFields, handleMulterError, updateProduct);
router.delete("/:id", deleteProduct);

export default router;