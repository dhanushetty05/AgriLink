// models/userModel.js

const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'admin'],
      default: 'farmer',
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// Export the model
module.exports = mongoose.model('User', userSchema);
