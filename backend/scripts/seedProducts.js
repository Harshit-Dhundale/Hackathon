const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const categories = {
  CROPS: 'Crop Seeds',
  FERTILIZERS: 'Fertilizers',
  PESTICIDES: 'Pesticides',
  EQUIPMENT: 'Farming Equipment'
};

// Helper function to build local image paths
const getImagePath = (category, name) => {
  const basePath = '/assets/products/';
  // Convert "Crop Seeds" -> "crop-seeds"
  const categoryFolder = category.toLowerCase().replace(/ /g, '-');
  // Convert "Wheat Seeds" -> "wheat-seeds.jpg"
  const imageName = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
  return `${basePath}${categoryFolder}/${imageName}`;
};

const products = {
  // -----------------------------------------------
  // CROP SEEDS
  // -----------------------------------------------
  [categories.CROPS]: [
    {
      name: 'Wheat Seeds',
      category: categories.CROPS,
      subCategory: 'Cereals',
      quantityUnit: 'kg',         // 1kg pack of seeds
      quantityValue: 1,
      description: 'High-yield hybrid wheat seeds suitable for Indian climate. Optimal for Rabi season.',
      price: 450,
      stock: 1000,
      imageUrl: getImagePath(categories.CROPS, 'Wheat Seeds')
    },
    {
      name: 'Apple Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Quality apple seeds suited for cooler climates. Requires well-drained soil and moderate watering.',
      price: 120,
      stock: 500,
      imageUrl: getImagePath(categories.CROPS, 'Apple Seeds')
    },
    {
      name: 'Banana Rhizomes',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Select banana rhizomes for high yield. Best grown in tropical and subtropical regions.',
      price: 180,
      stock: 300,
      imageUrl: getImagePath(categories.CROPS, 'Banana Rhizomes')
    },
    {
      name: 'Blackgram Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Popular pulse crop (urad dal). Grows well in warm climates with moderate rainfall.',
      price: 220,
      stock: 600,
      imageUrl: getImagePath(categories.CROPS, 'Blackgram Seeds')
    },
    {
      name: 'Chickpea Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'High protein chickpea variety. Suitable for semi-arid regions, needs moderate irrigation.',
      price: 240,
      stock: 400,
      imageUrl: getImagePath(categories.CROPS, 'Chickpea Seeds')
    },
    {
      name: 'Coconut Seedlings',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Tall variety coconut seedlings. Requires tropical climate with good coastal humidity.',
      price: 300,
      stock: 200,
      imageUrl: getImagePath(categories.CROPS, 'Coconut Seedlings')
    },
    {
      name: 'Coffee Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Arabica coffee seeds, ideal for hilly regions. Needs shade and well-distributed rainfall.',
      price: 350,
      stock: 100,
      imageUrl: getImagePath(categories.CROPS, 'Coffee Seeds')
    },
    {
      name: 'Cotton Seeds',
      category: categories.CROPS,
      subCategory: 'Oilseeds',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Long-staple cotton seeds. Requires sunny weather and well-drained soil. Good fiber yield.',
      price: 500,
      stock: 800,
      imageUrl: getImagePath(categories.CROPS, 'Cotton Seeds')
    },
    {
      name: 'Grape Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'High-quality vine seeds for table and wine grapes. Prefers mild climate and trellis support.',
      price: 190,
      stock: 250,
      imageUrl: getImagePath(categories.CROPS, 'Grape Seeds')
    },
    {
      name: 'Jute Seeds',
      category: categories.CROPS,
      subCategory: 'Oilseeds',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Popular fiber crop seeds. Thrives in warm, humid climates with ample rainfall.',
      price: 150,
      stock: 400,
      imageUrl: getImagePath(categories.CROPS, 'Jute Seeds')
    },
    {
      name: 'Kidney Bean Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Rich in protein, bright red kidney bean seeds. Needs moderate rainfall, well-drained soils.',
      price: 220,
      stock: 320,
      imageUrl: getImagePath(categories.CROPS, 'Kidney Bean Seeds')
    },
    {
      name: 'Lentil Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'High-quality lentil seeds. Grows best in cool season, requiring low to moderate rainfall.',
      price: 230,
      stock: 410,
      imageUrl: getImagePath(categories.CROPS, 'Lentil Seeds')
    },
    {
      name: 'Maize Seeds',
      category: categories.CROPS,
      subCategory: 'Cereals',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Hybrid maize seeds with high yield potential. Grows in varied climates with moderate watering.',
      price: 280,
      stock: 900,
      imageUrl: getImagePath(categories.CROPS, 'Maize Seeds')
    },
    {
      name: 'Mango Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Alphonso variety. Requires tropical/subtropical climate. Produces juicy, aromatic mangoes.',
      price: 260,
      stock: 200,
      imageUrl: getImagePath(categories.CROPS, 'Mango Seeds')
    },
    {
      name: 'Mothbean Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Drought-tolerant pulse crop. Suitable for arid and semi-arid regions. Good fodder value.',
      price: 210,
      stock: 200,
      imageUrl: getImagePath(categories.CROPS, 'Mothbean Seeds')
    },
    {
      name: 'Mungbean Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Commonly known as green gram. Short duration crop, high in protein.',
      price: 230,
      stock: 600,
      imageUrl: getImagePath(categories.CROPS, 'Mungbean Seeds')
    },
    {
      name: 'Muskmelon Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Sweet melon variety. Prefers warm climate and moderately rich soils.',
      price: 150,
      stock: 350,
      imageUrl: getImagePath(categories.CROPS, 'Muskmelon Seeds')
    },
    {
      name: 'Orange Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Citrus variety seeds. Requires warm weather, regular watering, and well-drained soil.',
      price: 160,
      stock: 280,
      imageUrl: getImagePath(categories.CROPS, 'Orange Seeds')
    },
    {
      name: 'Papaya Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Fast-growing papaya variety. Yields fruit in 9-11 months. Needs warm climate.',
      price: 200,
      stock: 450,
      imageUrl: getImagePath(categories.CROPS, 'Papaya Seeds')
    },
    {
      name: 'Pigeonpea Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Also called tur or arhar dal. Medium-duration variety, suitable for semi-arid regions.',
      price: 220,
      stock: 360,
      imageUrl: getImagePath(categories.CROPS, 'Pigeonpea Seeds')
    },
    {
      name: 'Pomegranate Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'High-juice variety. Prefers semi-arid to subtropical climate with regular watering.',
      price: 300,
      stock: 190,
      imageUrl: getImagePath(categories.CROPS, 'Pomegranate Seeds')
    },
    {
      name: 'Rice Seeds',
      category: categories.CROPS,
      subCategory: 'Cereals',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Irrigated variety, suited for paddy fields. High tillering and good milling quality.',
      price: 250,
      stock: 800,
      imageUrl: getImagePath(categories.CROPS, 'Rice Seeds')
    },
    {
      name: 'Watermelon Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Large-fruit variety, sweet and juicy. Needs hot summers and adequate irrigation.',
      price: 140,
      stock: 270,
      imageUrl: getImagePath(categories.CROPS, 'Watermelon Seeds')
    },
    {
      name: 'Barley Seeds',
      category: categories.CROPS,
      subCategory: 'Cereals',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Early-maturing barley, suitable for fodder or grain. Tolerates cold climates.',
      price: 150,
      stock: 400,
      imageUrl: getImagePath(categories.CROPS, 'Barley Seeds')
    },
    {
      name: 'Groundnut Seeds',
      category: categories.CROPS,
      subCategory: 'Oilseeds',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'High oil-content peanuts. Requires well-drained sandy soil and warm weather.',
      price: 280,
      stock: 500,
      imageUrl: getImagePath(categories.CROPS, 'Groundnut Seeds')
    },
    {
      name: 'Millet Seeds',
      category: categories.CROPS,
      subCategory: 'Cereals',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Drought-resistant millets (pearl/bajra). Ideal for arid regions, good fodder crop.',
      price: 190,
      stock: 600,
      imageUrl: getImagePath(categories.CROPS, 'Millet Seeds')
    },
    {
      name: 'Oilseed Mix',
      category: categories.CROPS,
      subCategory: 'Oilseeds',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Mixed pack of mustard, sunflower, and other oilseed varieties. Good for rotation crops.',
      price: 320,
      stock: 220,
      imageUrl: getImagePath(categories.CROPS, 'Oilseed Mix')
    },
    {
      name: 'Paddy Seeds',
      category: categories.CROPS,
      subCategory: 'Cereals',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Short-duration paddy for intensive rice cultivation. Suitable for Kharif or some Rabi seasons.',
      price: 220,
      stock: 600,
      imageUrl: getImagePath(categories.CROPS, 'Paddy Seeds')
    },
    {
      name: 'Pulse Mix Seeds',
      category: categories.CROPS,
      subCategory: 'Pulses',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Assorted lentils, peas, and beans. Ideal for multi-cropping or home gardens.',
      price: 400,
      stock: 300,
      imageUrl: getImagePath(categories.CROPS, 'Pulse Mix Seeds')
    },
    {
      name: 'Sugarcane Setts',
      category: categories.CROPS,
      subCategory: 'Vegetables',
      quantityUnit: 'kg',
      quantityValue: 5,
      description: 'High-sucrose variety. Requires ample water supply and fertile soil. Good for tropical regions.',
      price: 500,
      stock: 150,
      imageUrl: getImagePath(categories.CROPS, 'Sugarcane Setts')
    },
    {
      name: 'Tobacco Seeds',
      category: categories.CROPS,
      subCategory: 'Vegetables',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Nicotine-rich variety, grown under regulated conditions. Requires well-drained soils.',
      price: 300,
      stock: 100,
      imageUrl: getImagePath(categories.CROPS, 'Tobacco Seeds')
    },
    {
      name: 'Strawberry Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Premium variety for cooler climates or greenhouse cultivation. Produces sweet strawberries.',
      price: 350,
      stock: 220,
      imageUrl: getImagePath(categories.CROPS, 'Strawberry Seeds')
    },
    {
      name: 'Potato Seeds (Tubers)',
      category: categories.CROPS,
      subCategory: 'Vegetables',
      quantityUnit: 'kg',
      quantityValue: 5,
      description: 'Early-maturing variety with high starch content. Performs well in mild climates.',
      price: 270,
      stock: 450,
      imageUrl: getImagePath(categories.CROPS, 'Potato Seeds Tubers')
    },
    {
      name: 'Corn Seeds',
      category: categories.CROPS,
      subCategory: 'Cereals',
      quantityUnit: 'kg',
      quantityValue: 1,
      description: 'Sweet corn variety, excellent for fresh consumption. Requires moderate irrigation.',
      price: 260,
      stock: 500,
      imageUrl: getImagePath(categories.CROPS, 'Corn Seeds')
    },
    {
      name: 'Cherry Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Temperate variety, needs cold winters. Produces sweet cherries in well-drained soils.',
      price: 310,
      stock: 150,
      imageUrl: getImagePath(categories.CROPS, 'Cherry Seeds')
    },
    {
      name: 'Peach Seeds',
      category: categories.CROPS,
      subCategory: 'Fruits',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Low-chill peach variety. Performs well in moderate climates with occasional frost.',
      price: 280,
      stock: 120,
      imageUrl: getImagePath(categories.CROPS, 'Peach Seeds')
    },
    {
      name: 'Pepper Seeds',
      category: categories.CROPS,
      subCategory: 'Vegetables',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Hot chili pepper seeds. Suited for warm climates, requires consistent moisture.',
      price: 190,
      stock: 250,
      imageUrl: getImagePath(categories.CROPS, 'Pepper Seeds')
    },
    {
      name: 'Tomato Seeds',
      category: categories.CROPS,
      subCategory: 'Vegetables',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Hybrid seeds for high yield. Requires staking, regular watering, and fertilization.',
      price: 200,
      stock: 350,
      imageUrl: getImagePath(categories.CROPS, 'Tomato Seeds')
    }
  ],

  // -----------------------------------------------
  // FERTILIZERS
  // -----------------------------------------------
  [categories.FERTILIZERS]: [
    {
      name: 'DAP (18-46-0)',
      category: categories.FERTILIZERS,
      subCategory: 'Phosphorus-based',
      quantityUnit: 'bag',       // 50kg bag
      quantityValue: 50,
      description: 'Di-ammonium Phosphate. Promotes root development. Apply 100-150kg/acre.',
      price: 1200,
      stock: 500,
      imageUrl: getImagePath(categories.FERTILIZERS, 'DAP (18-46-0)')
    },
    {
      name: 'Urea (46% N)',
      category: categories.FERTILIZERS,
      subCategory: 'Nitrogen-based',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'High-nitrogen fertilizer. Boosts vegetative growth in cereals and other crops.',
      price: 950,
      stock: 600,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Urea (46% N)')
    },
    {
      name: 'NPK 10-26-26',
      category: categories.FERTILIZERS,
      subCategory: 'Complex',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'Balanced complex fertilizer with high phosphorus and potassium content.',
      price: 1400,
      stock: 400,
      imageUrl: getImagePath(categories.FERTILIZERS, 'NPK 10-26-26')
    },
    {
      name: 'NPK 14-35-14',
      category: categories.FERTILIZERS,
      subCategory: 'Complex',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'Helps flowering and fruit setting in horticultural crops.',
      price: 1500,
      stock: 350,
      imageUrl: getImagePath(categories.FERTILIZERS, 'NPK 14-35-14')
    },
    {
      name: 'NPK 17-17-17',
      category: categories.FERTILIZERS,
      subCategory: 'Complex',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'All-around triple 17 formula for balanced nutrition. Used across many crop stages.',
      price: 1450,
      stock: 380,
      imageUrl: getImagePath(categories.FERTILIZERS, 'NPK 17-17-17')
    },
    {
      name: 'NPK 20-20-0',
      category: categories.FERTILIZERS,
      subCategory: 'Nitrogen-based',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'High nitrogen and phosphorus, minimal potassium. Suitable for early plant stages.',
      price: 1300,
      stock: 250,
      imageUrl: getImagePath(categories.FERTILIZERS, 'NPK 20-20-0')
    },
    {
      name: 'NPK 28-28-0',
      category: categories.FERTILIZERS,
      subCategory: 'Nitrogen-based',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'Specialized mix for cereal grains. Encourages robust growth and healthy foliage.',
      price: 1600,
      stock: 200,
      imageUrl: getImagePath(categories.FERTILIZERS, 'NPK 28-28-0')
    },
    {
      name: 'Muriate of Potash (MOP)',
      category: categories.FERTILIZERS,
      subCategory: 'Potassium-based',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'High-potassium fertilizer (60% K2O). Improves crop quality and stress tolerance.',
      price: 1100,
      stock: 500,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Muriate of Potash (MOP)')
    },
    {
      name: 'Single Super Phosphate (SSP)',
      category: categories.FERTILIZERS,
      subCategory: 'Phosphorus-based',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'Improves root growth and overall yield. Often used in leguminous crops.',
      price: 900,
      stock: 320,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Single Super Phosphate (SSP)')
    },
    {
      name: 'Ammonium Sulphate (21-0-0 +24S)',
      category: categories.FERTILIZERS,
      subCategory: 'Nitrogen-based',
      quantityUnit: 'bag',
      quantityValue: 50,
      description: 'Provides both nitrogen and sulphur, improving protein synthesis in plants.',
      price: 800,
      stock: 220,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Ammonium Sulphate (21-0-0 +24S)')
    },
    {
      name: 'Calcium Nitrate',
      category: categories.FERTILIZERS,
      subCategory: 'Nitrogen-based',
      quantityUnit: 'bag',
      quantityValue: 25,
      description: 'Nitrogen-calcium fertilizer enhancing cell wall strength and fruit quality.',
      price: 1050,
      stock: 300,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Calcium Nitrate')
    },
    {
      name: 'Epsom Salt (MgSO4)',
      category: categories.FERTILIZERS,
      subCategory: 'Other',
      quantityUnit: 'bag',
      quantityValue: 25,
      description: 'Rich in magnesium and sulphur. Corrects Mg-deficiencies in potatoes and tomatoes.',
      price: 450,
      stock: 150,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Epsom Salt (MgSO4)')
    },
    {
      name: 'Zinc Sulphate',
      category: categories.FERTILIZERS,
      subCategory: 'Other',
      quantityUnit: 'bag',
      quantityValue: 25,
      description: 'Corrects zinc deficiency. Vital for enzyme activation and healthy crop development.',
      price: 650,
      stock: 180,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Zinc Sulphate')
    },
    {
      name: 'Bio-Fertilizer (Rhizobium)',
      category: categories.FERTILIZERS,
      subCategory: 'Organic',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Nitrogen-fixing bacteria, boosts legume growth. Eco-friendly soil enrichment.',
      price: 700,
      stock: 100,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Bio-Fertilizer (Rhizobium)')
    },
    {
      name: 'Vermicompost',
      category: categories.FERTILIZERS,
      subCategory: 'Organic',
      quantityUnit: 'bag',
      quantityValue: 25,
      description: 'Nutrient-rich organic fertilizer produced by earthworms. Improves soil structure.',
      price: 500,
      stock: 100,
      imageUrl: getImagePath(categories.FERTILIZERS, 'Vermicompost')
    }
  ],

  // -----------------------------------------------
  // PESTICIDES
  // -----------------------------------------------
  [categories.PESTICIDES]: [
    {
      name: 'Neem Oil',
      category: categories.PESTICIDES,
      subCategory: 'Organic',
      quantityUnit: 'liter',
      quantityValue: 1,
      description: 'Organic pesticide from neem seeds. Controls 200+ pests. Mix 5ml per liter of water.',
      price: 350,
      stock: 200,
      imageUrl: getImagePath(categories.PESTICIDES, 'Neem Oil')
    },
    {
      name: 'Imidacloprid',
      category: categories.PESTICIDES,
      subCategory: 'Insecticides',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Systemic insecticide effective against sucking pests like aphids, jassids, and thrips.',
      price: 400,
      stock: 180,
      imageUrl: getImagePath(categories.PESTICIDES, 'Imidacloprid')
    },
    {
      name: 'Chlorpyrifos',
      category: categories.PESTICIDES,
      subCategory: 'Insecticides',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Broad-spectrum insecticide for soil and foliar applications. Controls termites and borers.',
      price: 380,
      stock: 250,
      imageUrl: getImagePath(categories.PESTICIDES, 'Chlorpyrifos')
    },
    {
      name: 'Malathion',
      category: categories.PESTICIDES,
      subCategory: 'Insecticides',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Commonly used for fruit flies and mosquito control. Ideal for orchard pests.',
      price: 360,
      stock: 200,
      imageUrl: getImagePath(categories.PESTICIDES, 'Malathion')
    },
    {
      name: 'Mancozeb',
      category: categories.PESTICIDES,
      subCategory: 'Fungicides',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Contact fungicide for blight, mildew, and leaf spot. Protects a wide range of crops.',
      price: 450,
      stock: 150,
      imageUrl: getImagePath(categories.PESTICIDES, 'Mancozeb')
    },
    {
      name: 'Copper Oxychloride',
      category: categories.PESTICIDES,
      subCategory: 'Fungicides',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Broad-spectrum fungicide. Effective for fungal leaf spots, rusts, and blights.',
      price: 500,
      stock: 100,
      imageUrl: getImagePath(categories.PESTICIDES, 'Copper Oxychloride')
    },
    {
      name: 'Carbendazim',
      category: categories.PESTICIDES,
      subCategory: 'Fungicides',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Systemic fungicide controlling various fungal diseases in cereals and fruits.',
      price: 460,
      stock: 130,
      imageUrl: getImagePath(categories.PESTICIDES, 'Carbendazim')
    },
    {
      name: 'Tricyclazole',
      category: categories.PESTICIDES,
      subCategory: 'Fungicides',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Highly effective against blast disease in paddy. Quick absorption and residual action.',
      price: 550,
      stock: 90,
      imageUrl: getImagePath(categories.PESTICIDES, 'Tricyclazole')
    },
    {
      name: 'Propiconazole',
      category: categories.PESTICIDES,
      subCategory: 'Fungicides',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Systemic fungicide for rust, leaf spot, and powdery mildew in multiple crops.',
      price: 600,
      stock: 70,
      imageUrl: getImagePath(categories.PESTICIDES, 'Propiconazole')
    },
    {
      name: 'Glyphosate',
      category: categories.PESTICIDES,
      subCategory: 'Herbicides',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Non-selective herbicide for broad-spectrum weed control. Used in fallow land and plantations.',
      price: 480,
      stock: 300,
      imageUrl: getImagePath(categories.PESTICIDES, 'Glyphosate')
    },
    {
      name: 'Paraquat',
      category: categories.PESTICIDES,
      subCategory: 'Herbicides',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Contact herbicide, fast-acting weed control for non-crop areas. Handle with care.',
      price: 470,
      stock: 200,
      imageUrl: getImagePath(categories.PESTICIDES, 'Paraquat')
    },
    {
      name: 'Pretilachlor',
      category: categories.PESTICIDES,
      subCategory: 'Herbicides',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Pre-emergence herbicide in rice fields. Controls broadleaf weeds and sedges.',
      price: 520,
      stock: 180,
      imageUrl: getImagePath(categories.PESTICIDES, 'Pretilachlor')
    },
    {
      name: 'Bacillus thuringiensis (Bt)',
      category: categories.PESTICIDES,
      subCategory: 'Organic',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Biological pesticide targeting caterpillars and moth larvae. Safe for beneficial insects.',
      price: 650,
      stock: 120,
      imageUrl: getImagePath(categories.PESTICIDES, 'Bacillus thuringiensis (Bt)')
    },
    {
      name: 'Pyrethrin',
      category: categories.PESTICIDES,
      subCategory: 'Organic',
      quantityUnit: 'bottle',
      quantityValue: 1,
      description: 'Natural insecticide from chrysanthemum flowers. Effective on many soft-bodied insects.',
      price: 680,
      stock: 100,
      imageUrl: getImagePath(categories.PESTICIDES, 'Pyrethrin')
    },
    {
      name: 'Sulphur Dust',
      category: categories.PESTICIDES,
      subCategory: 'Fungicides',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Controls powdery mildew and mites. Can be used in organic farming for grapes and cucurbits.',
      price: 350,
      stock: 90,
      imageUrl: getImagePath(categories.PESTICIDES, 'Sulphur Dust')
    }
  ],

  // -----------------------------------------------
  // FARMING EQUIPMENT
  // -----------------------------------------------
  [categories.EQUIPMENT]: [
    {
      name: 'Rotavator',
      category: categories.EQUIPMENT,
      subCategory: 'Tillage',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: '3-blade heavy-duty rotavator for soil preparation. Compatible with 45-50HP tractors.',
      price: 185000,
      stock: 15,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Rotavator')
    },
    {
      name: 'Disc Harrow',
      category: categories.EQUIPMENT,
      subCategory: 'Tillage',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Robust disc harrow for breaking clods and mixing crop residues into the soil.',
      price: 75000,
      stock: 10,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Disc Harrow')
    },
    {
      name: 'Cultivator',
      category: categories.EQUIPMENT,
      subCategory: 'Tillage',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Mounted cultivator with adjustable tines for secondary tillage and weed control.',
      price: 50000,
      stock: 20,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Cultivator')
    },
    {
      name: 'Seed Drill',
      category: categories.EQUIPMENT,
      subCategory: 'Planting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Precision seed drill ensuring uniform seed placement and proper depth control.',
      price: 90000,
      stock: 8,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Seed Drill')
    },
    {
      name: 'Planter',
      category: categories.EQUIPMENT,
      subCategory: 'Planting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Row crop planter with adjustable row spacing. Ideal for maize, cotton, and soybean.',
      price: 140000,
      stock: 5,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Planter')
    },
    {
      name: 'Sprinkler Irrigation System',
      category: categories.EQUIPMENT,
      subCategory: 'Irrigation',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Full-set sprinkler system covering up to 1 acre. Easy to install and maintain.',
      price: 38000,
      stock: 25,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Sprinkler Irrigation System')
    },
    {
      name: 'Drip Irrigation Kit',
      category: categories.EQUIPMENT,
      subCategory: 'Irrigation',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Efficient water-saving drip kit for 1 acre. Reduces wastage and improves crop yield.',
      price: 25000,
      stock: 30,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Drip Irrigation Kit')
    },
    {
      name: 'Water Pump (5 HP)',
      category: categories.EQUIPMENT,
      subCategory: 'Irrigation',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Diesel engine water pump suitable for small to medium fields. High flow rate.',
      price: 45000,
      stock: 12,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Water Pump (5 HP)')
    },
    {
      name: 'Combine Harvester',
      category: categories.EQUIPMENT,
      subCategory: 'Harvesting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Multi-crop harvester for wheat, paddy, and soybean. Reduces labor cost significantly.',
      price: 1500000,
      stock: 2,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Combine Harvester')
    },
    {
      name: 'Reaper Binder',
      category: categories.EQUIPMENT,
      subCategory: 'Harvesting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Walk-behind reaper binder, ideal for harvesting cereals and binding them in one operation.',
      price: 180000,
      stock: 3,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Reaper Binder')
    },
    {
      name: 'Power Tiller',
      category: categories.EQUIPMENT,
      subCategory: 'Tillage',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Versatile power tiller with multiple attachments. Suitable for small and marginal farms.',
      price: 120000,
      stock: 6,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Power Tiller')
    },
    {
      name: 'Tractor Mounted Sprayer',
      category: categories.EQUIPMENT,
      subCategory: 'Planting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'High-capacity sprayer (500L) mountable on a tractor. Efficient pesticide/fertilizer application.',
      price: 70000,
      stock: 5,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Tractor Mounted Sprayer')
    },
    {
      name: 'Seedling Tray',
      category: categories.EQUIPMENT,
      subCategory: 'Planting',
      quantityUnit: 'packet',
      quantityValue: 1,
      description: 'Durable plastic tray with 98 cells for raising healthy seedlings.',
      price: 100,
      stock: 500,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Seedling Tray')
    },
    {
      name: 'Greenhouse Tunnel',
      category: categories.EQUIPMENT,
      subCategory: 'Planting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Portable greenhouse tunnel kit for off-season cultivation of vegetables and flowers.',
      price: 200000,
      stock: 4,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Greenhouse Tunnel')
    },
    {
      name: 'Sugarcane Harvester',
      category: categories.EQUIPMENT,
      subCategory: 'Harvesting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Specialized machine for cutting and partial cleaning of sugarcane. Saves extensive labor.',
      price: 2500000,
      stock: 1,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Sugarcane Harvester')
    },
    {
      name: 'Potato Digger',
      category: categories.EQUIPMENT,
      subCategory: 'Harvesting',
      quantityUnit: 'unit',
      quantityValue: 1,
      description: 'Tractor-drawn digger for efficient potato harvesting, reducing damage to tubers.',
      price: 85000,
      stock: 4,
      imageUrl: getImagePath(categories.EQUIPMENT, 'Potato Digger')
    }
  ]
};

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Clear existing products
    await Product.deleteMany();
    console.log('Cleared existing products');

    // Flatten all products
    const allProducts = Object.values(products).flat();

    // Insert new products
    await Product.insertMany(allProducts);
    console.log(`Seeded ${allProducts.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
