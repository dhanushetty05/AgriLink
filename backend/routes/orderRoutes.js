// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id, email, role }
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

// -----------------------------
// 🛒 PLACE ORDER (Buyer)
// -----------------------------
router.post('/place', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      product: product._id,
      buyer: req.user.id,
      farmer: product.farmer,
      quantity,
      totalPrice,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order' });
  }
});

// -----------------------------
// 👨‍🌾 VIEW ORDERS FOR FARMER
// -----------------------------
router.get('/farmer/:id', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.params.id })
      .populate('product', 'name price')
      .populate('buyer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farmer orders' });
  }
});

// -----------------------------
// 👤 VIEW BUYER’S ORDER HISTORY
// -----------------------------
router.get('/buyer/:id', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.id })
      .populate('product', 'name price')
      .populate('farmer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buyer orders' });
  }
});

module.exports = router;

// ------------------------------------------
// 🚚 UPDATE ORDER STATUS (Farmer/Admin)
// ------------------------------------------
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed status options
    const validStatus = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permission (only farmer or admin can update)
    if (order.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own orders' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: `Order status updated to '${status}' successfully`,
      order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
});


