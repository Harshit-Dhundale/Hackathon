// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

// GET /products route with explicit ObjectId conversion for createdBy
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.createdBy) {
      // Validate the provided value is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.query.createdBy)) {
        return res.status(400).json({ message: 'Invalid createdBy value' });
      }
      // Convert the query parameter to an ObjectId using the "new" operator
      filter.createdBy = new mongoose.Types.ObjectId(req.query.createdBy);
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error("Error in GET /products:", err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// POST /products - Create a new product (for admin use)
router.post('/', async (req, res) => {
  try {
    const { name, price, category, subCategory, stock, quantityUnit, quantityValue, imageUrl } = req.body;
    if (!name || !price || !category || !subCategory || !stock || !quantityUnit || !quantityValue) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const product = new Product({
      ...req.body,
      // Use provided imageUrl or fallback to default
      imageUrl: imageUrl || '/images/products/default.jpg',
    });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// DELETE /products/:id - Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// PUT /products/:id - Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated product
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Product-specific upload configuration
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/products');
    fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const uploadProduct = multer({ storage: productStorage });

// POST /products/upload - Upload a product image
router.post('/upload', uploadProduct.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ imageUrl: `https://hackathon-backend-6c9z.onrender.com/uploads/products/${req.file.filename}` });
});

module.exports = router;