const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  location: String,
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // this line is critical
  },
});

module.exports = mongoose.model("Product", productSchema);
