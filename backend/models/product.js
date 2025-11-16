const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  product_pic: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sales: {
    type: Number,
    required: true,
  },
  active: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
