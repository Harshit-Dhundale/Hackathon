// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true, default: '/images/products/default.jpg' },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    stock: { type: Number, required: true },
    quantityUnit: {
      type: String,
      required: true,
      enum: ['kg', 'liter', 'packet', 'unit', 'bag', 'bottle'],
      default: 'kg'
    },
    quantityValue: {
      type: Number,
      required: true,
      default: 1
    },
    specifications: {
      weight: { type: String },
      composition: { type: String },
      usageInstructions: { type: String },
      suitableFor: { type: String }
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 }
      }
    ],
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);