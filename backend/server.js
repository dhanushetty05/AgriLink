// server.js

// 1️⃣ Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 2️⃣ Load environment variables
dotenv.config();

// 3️⃣ Create express app
const app = express();

// 4️⃣ Middleware
app.use(express.json()); // parse JSON data
app.use(cors()); // allow cross-origin requests

// 5️⃣ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// 6️⃣ Basic test route
app.get('/', (req, res) => {
  res.send('🌾 AgriLink API is running successfully...');
});
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);





// 7️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
