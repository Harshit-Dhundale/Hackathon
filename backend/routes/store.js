const express = require('express');
const router = express.Router();
const Store = require('../models/Store'); // You'll need to create this model
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const handleValidationErrors = require('../middleware/errorHandler');

// Create a new store
router.post(
  '/',
  authMiddleware,
  [
    body('name').notEmpty().withMessage('Store name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('size').isNumeric().withMessage('Size must be a number'),
    body('products').isArray({ min: 1 }).withMessage('At least one product is required'),
    body('storeType').notEmpty().withMessage('Store type is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, location, size, products, storeType, description } = req.body;
      const newStore = new Store({
        name,
        location,
        size,
        products,
        storeType,
        description,
        createdBy: req.user._id
      });
      await newStore.save();
      res.status(201).json(newStore);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all stores for a user
router.get('/:userId', async (req, res) => {
  try {
    const stores = await Store.find({ createdBy: req.params.userId });
    res.json(stores || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a store
router.put('/:storeId', authMiddleware, async (req, res) => {
  try {
    const { name, location, size, products, storeType, description } = req.body;
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.storeId,
      { name, location, size, products, storeType, description },
      { new: true, runValidators: true }
    );
    if (!updatedStore) return res.status(404).json({ message: 'Store not found' });
    res.json(updatedStore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a store
router.delete('/:storeId', authMiddleware, async (req, res) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.storeId);
    if (!deleted) return res.status(404).json({ message: 'Store not found' });
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;