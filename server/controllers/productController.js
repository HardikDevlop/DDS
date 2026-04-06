// File: server/controllers/productController.js
import Product from "../models/Product.js";

const parseJsonField = (value, fallback) => {
  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    if (!req.body.name) {
      return res.status(400).json({ message: "Service name is required" });
    }

    if (!req.body.visitingPrice) {
      return res.status(400).json({ message: "Visiting price is required" });
    }

    const mainImages =
      req.files && req.files.images
        ? req.files.images.map((file) => file.filename)
        : [];

    const subServiceImages =
      req.files && req.files.subServiceImages
        ? req.files.subServiceImages
        : [];

    const parsedSubServices = parseJsonField(req.body.subServices, []);

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
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("Error in createProduct:", err.message);
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err.message);
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    console.log("Update request files:", req.files);

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newMainImages =
      req.files && req.files.images
        ? req.files.images.map((file) => file.filename)
        : [];

    const subServiceImages =
      req.files && req.files.subServiceImages
        ? req.files.subServiceImages
        : [];

    const parsedSubServices = parseJsonField(req.body.subServices, []);

    const updatedSubServices = parsedSubServices.map((subService, index) => ({
      name: subService.name,
      price: subService.price,
      image: subServiceImages[index]?.filename || subService.image || null,
    }));

    const keptImages =
      typeof req.body.existingImages === "string"
        ? parseJsonField(req.body.existingImages, existingProduct.images || [])
        : existingProduct.images || [];

    const updatedData = {
      name: req.body.name,
      visitingPrice: Number(req.body.visitingPrice),
      subServices: updatedSubServices,
      images: [...keptImages, ...newMainImages],
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ message: "Error deleting product" });
  }
};

export const getPopularServices = async (req, res) => {
  try {
    const popular = await Product.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json(popular);
  } catch (err) {
    console.error("Error loading popular services:", err.message);
    res.status(500).json({ message: "Failed to load popular services" });
  }
};
