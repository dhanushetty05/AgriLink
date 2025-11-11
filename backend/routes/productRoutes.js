// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function authMiddleware(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info (id, role)
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

// ----------------------
// 🌾 ADD PRODUCT (Farmer)
// ----------------------
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, category, quantity, price, description } = req.body;

    const product = await Product.create({
      name,
      category,
      quantity,
      price,
      description,
      farmer: req.user.id, // linked to logged-in farmer
    });

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error while adding product' });
  }
});

// ----------------------
// 🛒 GET ALL PRODUCTS
// ----------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name email');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

module.exports = router;
