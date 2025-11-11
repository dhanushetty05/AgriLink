// ------------------------------------------
// 🌾 AGRILINK ADMIN DASHBOARD ROUTES
// ------------------------------------------

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');

// ------------------------------------------
// 📊 GET ADMIN DASHBOARD STATS
// ------------------------------------------
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Only allow admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Total revenue (sum of all order prices)
    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Orders grouped by status
    const orderStatusData = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Top 3 farmers by total sales
    const topFarmers = await Order.aggregate([
      {
        $group: {
          _id: '$farmer',
          totalSales: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'users', // join with users collection
          localField: '_id',
          foreignField: '_id',
          as: 'farmerDetails'
        }
      },
      { $unwind: '$farmerDetails' },
      {
        $project: {
          _id: 1,
          totalSales: 1,
          orders: 1,
          farmerName: '$farmerDetails.name',
          email: '$farmerDetails.email'
        }
      }
    ]);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      orderStatusData,
      topFarmers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
});

module.exports = router;
