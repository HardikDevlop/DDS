// File: server/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getPopularServices,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
    fileSize: 5 * 1024 * 1024,
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File upload error", error: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
};

const uploadFields = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "subServiceImages", maxCount: 10 },
]);

router.post("/", uploadFields, handleMulterError, createProduct);
router.get("/", getAllProducts);
router.get("/popular", getPopularServices);
router.get("/:id", getProductById);
router.put("/:id", uploadFields, handleMulterError, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
