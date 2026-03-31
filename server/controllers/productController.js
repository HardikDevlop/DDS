// File: server/controllers/productController.js
import Product from "../models/Product.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    console.log("📥 Request body:", req.body);
    console.log("📥 Request files:", req.files);

    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ message: "Service name is required" });
    }

    if (!req.body.visitingPrice) {
      return res.status(400).json({ message: "Visiting price is required" });
    }

    // Handle main service images
    const mainImages =
      req.files && req.files.images
        ? req.files.images.map((file) => file.filename)
        : [];

    // Handle subservice images
    const subServiceImages =
      req.files && req.files.subServiceImages
        ? req.files.subServiceImages
        : [];

    // Parse subservices from JSON string
    const parsedSubServices = req.body.subServices
      ? JSON.parse(req.body.subServices)
      : [];

    // ✅ Match by index — order is preserved from frontend
    const updatedSubServices = parsedSubServices.map((subService, index) => ({
      name: subService.name,
      price: subService.price,
      image: subServiceImages[index]?.filename || null,
    }));

    const newProduct = new Product({
      name: req.body.name,
      visitingPrice: Number(req.body.visitingPrice),
      images: mainImages,
      subServices: updatedSubServices,
    });

    await newProduct.save();
    console.log("✅ Product saved successfully");
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("❌ Error in createProduct:", err.message);
    res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err.message);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    console.log("📥 Update Request body:", req.body);
    console.log("📥 Update Request files:", req.files);

    // Handle main service images
    const newMainImages =
      req.files && req.files.images
        ? req.files.images.map((file) => file.filename)
        : [];

    // Handle subservice images
    const subServiceImages =
      req.files && req.files.subServiceImages
        ? req.files.subServiceImages
        : [];

    // Parse subservices from JSON string
    const parsedSubServices = req.body.subServices
      ? JSON.parse(req.body.subServices)
      : [];

    // ✅ Match by index — order is preserved from frontend
    const updatedSubServices = parsedSubServices.map((subService, index) => ({
      name: subService.name,
      price: subService.price,
      // If a new image was uploaded at this index, use it
      // Otherwise keep the existing image filename (already stored in DB)
      image: subServiceImages[index]?.filename || subService.image || null,
    }));

    // Merge existing images with any newly uploaded ones
    const keptImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    const updatedData = {
      name: req.body.name,
      visitingPrice: Number(req.body.visitingPrice),
      subServices: updatedSubServices,
      images: [...keptImages, ...newMainImages],
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ Product updated successfully");
    res.json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ message: "Error deleting product" });
  }
};

// ✅ Get Popular Services (Latest Products)
export const getPopularServices = async (req, res) => {
  try {
    const popular = await Product.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json(popular);
  } catch (err) {
    console.error("❌ Error loading popular services:", err.message);
    res.status(500).json({ message: "Failed to load popular services" });
  }
};