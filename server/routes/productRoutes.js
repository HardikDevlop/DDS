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

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("[Cloudinary] Missing Cloudinary environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.");
}

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
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] upload error details:", {
            message: error.message,
            name: error.name,
            http_code: error.http_code,
            details: error.error,
          });
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
};

const uploadMultipleToCloudinary = (files, folder) => {
  return Promise.all(
    files.map((file) => uploadToCloudinary(file.buffer, folder))
  );
};

router.post("/", uploadFields, handleMulterError, async (req, res, next) => {
  try {
    // Upload all main images in parallel to Cloudinary
    const mainImageUrls = req.files && req.files.images
      ? await uploadMultipleToCloudinary(req.files.images, "products/main")
      : [];

    // Upload all sub-service images in parallel to Cloudinary
    const subServiceImageUrls = req.files && req.files.subServiceImages
      ? await uploadMultipleToCloudinary(req.files.subServiceImages, "products/subservices")
      : [];

    // Attach URLs to req
    req.cloudinaryUrls = {
      mainImages: mainImageUrls,
      subServiceImages: subServiceImageUrls,
    };

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
      cloudinary: error.error ? error.error.message : undefined,
    });
  }
}, createProduct);

router.put("/:id", uploadFields, handleMulterError, async (req, res, next) => {
  try {
    // Upload all new main images in parallel to Cloudinary
    const newMainImageUrls = req.files && req.files.images
      ? await uploadMultipleToCloudinary(req.files.images, "products/main")
      : [];

    // Upload all new sub-service images in parallel to Cloudinary
    const newSubServiceImageUrls = req.files && req.files.subServiceImages
      ? await uploadMultipleToCloudinary(req.files.subServiceImages, "products/subservices")
      : [];

    // Attach URLs to req
    req.cloudinaryUrls = {
      mainImages: newMainImageUrls,
      subServiceImages: newSubServiceImageUrls,
    };

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
      cloudinary: error.error ? error.error.message : undefined,
    });
  }
}, updateProduct);

router.get("/", getAllProducts);
router.get("/popular", getPopularServices);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
