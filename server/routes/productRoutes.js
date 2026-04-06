// File: server/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
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

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer
const storage = multer.memoryStorage();

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

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

router.post("/", uploadFields, handleMulterError, async (req, res, next) => {
  try {
    // Upload main images to Cloudinary
    const mainImageUrls = [];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadToCloudinary(file.buffer, "products/main");
        mainImageUrls.push(url);
      }
    }

    // Upload sub-service images to Cloudinary
    const subServiceImageUrls = [];
    if (req.files && req.files.subServiceImages) {
      for (const file of req.files.subServiceImages) {
        const url = await uploadToCloudinary(file.buffer, "products/subservices");
        subServiceImageUrls.push(url);
      }
    }

    // Attach URLs to req
    req.cloudinaryUrls = {
      mainImages: mainImageUrls,
      subServiceImages: subServiceImageUrls,
    };

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Image upload failed", error: error.message });
  }
}, createProduct);

router.put("/:id", uploadFields, handleMulterError, async (req, res, next) => {
  try {
    // Upload new main images to Cloudinary
    const newMainImageUrls = [];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadToCloudinary(file.buffer, "products/main");
        newMainImageUrls.push(url);
      }
    }

    // Upload new sub-service images to Cloudinary
    const newSubServiceImageUrls = [];
    if (req.files && req.files.subServiceImages) {
      for (const file of req.files.subServiceImages) {
        const url = await uploadToCloudinary(file.buffer, "products/subservices");
        newSubServiceImageUrls.push(url);
      }
    }

    // Attach URLs to req
    req.cloudinaryUrls = {
      mainImages: newMainImageUrls,
      subServiceImages: newSubServiceImageUrls,
    };

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Image upload failed", error: error.message });
  }
}, updateProduct);

router.get("/", getAllProducts);
router.get("/popular", getPopularServices);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
