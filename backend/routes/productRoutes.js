const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");

// Middleware: Verify token
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id, email, role }
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
}

// ----------------------------------
// ➕ Add New Product (Farmer Only)
// ----------------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Only allow farmers
    if (req.user.role !== "Farmer") {
      return res.status(403).json({ message: "Access denied: Only farmers can add products" });
    }

    const { name, price, quantity, location } = req.body;
    if (!name || !price || !quantity || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      price,
      quantity,
      location,
      farmer: req.user.id, // farmer who added it
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error while adding product" });
  }
});

// ----------------------------------
// 📦 Get All Products (for marketplace)
// ----------------------------------
// ✅ Get all products (with farmer details)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("farmerId", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// ----------------------------------
// 👨‍🌾 Get Products by Farmer
// ----------------------------------
router.get("/farmer/:id", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching farmer's products" });
  }
});

// ----------------------------------
// 🗑 Delete Product
// ----------------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only farmer who created it can delete
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
