// seedProducts.js
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust the path if necessary
require('dotenv').config();

// Use your MongoDB connection URI; if not set in environment, fallback to a local URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketmitra';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });

// Array of product objects to seed into the database
const products = [
  {
    name: "Wheat Seeds",
    description: "High quality wheat seeds for a bountiful harvest.",
    price: 34,
    imageUrl: "/assets/products/wheat-seeds.jpg",
    category: "Crop Seeds",
    subCategory: "Cereals",
    stock: 56,
    quantityUnit: "kg",
    quantityValue: 1,
    specifications: {
      weight: "500g",
      composition: "100% pure wheat seeds",
      usageInstructions: "Plant in well-irrigated soil",
      suitableFor: "Wheat farming"
    },
    createdBy: "67a872f99e7f1266492bee73"
  },
  {
    name: "Corn Seeds",
    description: "Premium corn seeds perfect for both small and large farms.",
    price: 45,
    imageUrl: "/assets/products/corn-seeds.jpg",
    category: "Crop Seeds",
    subCategory: "Cereals",
    stock: 80,
    quantityUnit: "kg",
    quantityValue: 1,
    specifications: {
      weight: "1kg",
      composition: "High yield corn variety",
      usageInstructions: "Sow during the spring season",
      suitableFor: "Corn cultivation"
    },
    createdBy: "67a872f99e7f1266492bee73"
  },
  {
    name: "Organic Fertilizer",
    description: "Eco-friendly organic fertilizer to boost soil health.",
    price: 60,
    imageUrl: "/assets/products/organic-fertilizer.jpg",
    category: "Fertilizers",
    subCategory: "Organic",
    stock: 120,
    quantityUnit: "bag",
    quantityValue: 1,
    specifications: {
      weight: "10kg",
      composition: "Natural compost, manure, and bio-stimulants",
      usageInstructions: "Spread evenly across fields",
      suitableFor: "Organic farming"
    },
    createdBy: "67a872f99e7f1266492bee73"
  },
  {
    name: "Pesticide Spray",
    description: "Effective pesticide spray for crop protection.",
    price: 150,
    imageUrl: "/assets/products/pesticide-spray.jpg",
    category: "Pesticides",
    subCategory: "Sprays",
    stock: 200,
    quantityUnit: "bottle",
    quantityValue: 1,
    specifications: {
      weight: "500ml",
      composition: "Blend of natural and chemical agents",
      usageInstructions: "Spray on crops during early morning",
      suitableFor: "Insect control"
    },
    createdBy: "67a872f99e7f1266492bee73"
  },
  {
    name: "Garden Shovel",
    description: "Durable garden shovel for all your digging needs.",
    price: 120,
    imageUrl: "/assets/products/garden-shovel.jpg",
    category: "Agricultural Tools",
    subCategory: "Hand Tools",
    stock: 35,
    quantityUnit: "unit",
    quantityValue: 1,
    specifications: {
      weight: "1.5kg",
      composition: "Stainless steel blade with ergonomic handle",
      usageInstructions: "Ideal for garden and farm use",
      suitableFor: "Digging and planting"
    },
    createdBy: "67a872f99e7f1266492bee73"
  },
  {
    name: "Rice Seeds",
    description: "Premium quality rice seeds to ensure a healthy yield.",
    price: 50,
    imageUrl: "/assets/products/rice-seeds.jpg",
    category: "Crop Seeds",
    subCategory: "Grains",
    stock: 70,
    quantityUnit: "kg",
    quantityValue: 1,
    specifications: {
      weight: "1kg",
      composition: "High germination rate rice seeds",
      usageInstructions: "Sow in flooded fields",
      suitableFor: "Rice farming"
    },
    createdBy: "67a872f99e7f1266492bee73"
  }
];

async function seedProducts() {
  try {
    // Remove all existing products
    await Product.deleteMany({});
    console.log("Existing products removed.");

    // Bulk insert the new products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products have been added!`);
    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();