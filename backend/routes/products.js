const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getProduct, (req, res) => {
  res.send(res.product);
});

router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    product_pic: req.body.product_pic,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    status: req.body.status,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
    sales: req.body.sales,
    active: req.body.active,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", getProduct, async (req, res) => {
  const data = req.body;
  const product = res.product;
  if (data.name != null) {
    product.name = data.name;
  }
  if (data.product_pic != null) {
    product.product_pic = data.product_pic;
  }
  if (data.description != null) {
    product.description = data.description;
  }
  if (data.price != null) {
    product.price = data.price;
  }
  if (data.stock != null) {
    product.stock = data.stock;
  }
  if (data.status != null) {
    product.status = data.status;
  }
  if (data.created_at != null) {
    product.created_at = data.created_at;
  }
  if (data.updated_at != null) {
    product.updated_at = data.updated_at;
  }
  if (data.sales != null) {
    product.sales = data.sales;
  }
  if (data.active != null) {
    product.active = data.active;
  }
  try {
    const updatedproduct = await product.save();
    res.json(updatedproduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.product.deleteOne();
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;
