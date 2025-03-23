// client/src/features/store/Store.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';
import './Store.css';
import api from '../../utils/api';

const SUBCATEGORIES = {
  'Crop Seeds': ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits'],
  'Fertilizers': ['All', 'Nitrogen-based', 'Phosphorus-based', 'Potassium-based', 'Complex'],
  'Pesticides': ['All', 'Insecticides', 'Fungicides', 'Herbicides', 'Organic'],
  'Farming Equipment': ['All', 'Tillage', 'Planting', 'Irrigation', 'Harvesting']
};

const Store = () => {
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [subcategory, setSubcategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from API
  useEffect(() => {
    api.get('/products')
  .then(res => {
    setProducts(res.data);
    setIsLoading(false);
  })
  .catch(err => {
    console.error(err);
    setError('Failed to load products');
    setIsLoading(false);
  });
  }, []);

  // Get available subcategories based on selected category
  const getSubcategoryOptions = () => {
    if (category === 'All') return [];
    return SUBCATEGORIES[category] || [];
  };

  // Filter products based on user selections
  const filteredProducts = products.filter(prod => {
    const categoryMatch = category === 'All' || prod.category === category;
    const subcategoryMatch = subcategory === 'All' || prod.subCategory === subcategory;
    const priceMatch = (!minPrice || prod.price >= Number(minPrice)) &&
                      (!maxPrice || prod.price <= Number(maxPrice));
    const searchMatch = prod.name.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && subcategoryMatch && priceMatch && searchMatch;
  });

  // Update quantity for a specific product
  const updateQty = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.product._id === product._id);
    const quantity = quantities[product._id] || 1;

    // Check stock availability
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      return;
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} ${product.name} added to cart!`);
    setQuantities(prev => ({
      ...prev,
      [product._id]: 1
    }));
  };

  // Loading skeleton
  const renderSkeletons = () => 
    Array(8).fill().map((_, i) => (
      <div key={i} className="product-card skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
        <div className="skeleton-button"></div>
      </div>
    ));

  return (
    <div>
      <HeroHeader 
        title="Your One-Stop Shop for Farming Essentials!" 
        subtitle="Discover top-quality crop seeds, fertilizers, pesticides, and farm equipment, all in one place."
        backgroundImage="/assets/head/shop.jpg"
      />
      
      <div className="store-container">
        {/* Filter Panel */}
        <div className="filter-panel">
          <div className="filter-section">
            <h3>Filter Products</h3>
            <div className="filter-grid">
              <div className="filter-group">
                <label>Category:</label>
                <div className="select-wrapper">
                  <select 
                    value={category} 
                    onChange={e => {
                      setCategory(e.target.value);
                      setSubcategory('All');
                    }}
                  >
                    <option value="All">All</option>
                    {Object.keys(SUBCATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {getSubcategoryOptions().length > 0 && (
                <div className="filter-group">
                  <label>Subcategory:</label>
                  <div className="select-wrapper">
                    <select
                      value={subcategory}
                      onChange={e => setSubcategory(e.target.value)}
                    >
                      {getSubcategoryOptions().map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="filter-group price-range">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                  />
                  <span className="separator">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group search-group">
                <label>Search</label>
                <div className="search-input">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="products-grid">
          {isLoading ? renderSkeletons() : 
           error ? <div className="error-state">{error}</div> :
           filteredProducts.length === 0 ? (
             <div className="empty-state">
               <img src="/assets/empty-cart.png" alt="No products" />
               <p>No products match your criteria</p>
             </div>
           ) : (
             filteredProducts.map(prod => (
               <div key={prod._id} className="product-card">
                 <div className="image-container">
                   <img 
                     src={prod.imageUrl} 
                     alt={prod.name}
                     onError={(e) => {
                       e.target.onerror = null;
                       e.target.src = '/images/products/default.jpg';
                     }}
                   />
                   <div className="quick-actions">
                     <Link 
                       to={`/store/product/${prod._id}`} 
                       className="quick-view"
                     >
                       Quick View
                     </Link>
                   </div>
                 </div>

                 <div className="product-info">
                   <div className="category-tag">
                     {prod.category}
                   </div>
                   <h3>{prod.name}</h3>
                   <div className="price-stock">
                     <span className="price">₹{prod.price}</span>
                     <span className="stock">
                       {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                     </span>
                   </div>
                   <div className="product-actions">
                     <div className="quantity-selector">
                       <button onClick={() => updateQty(prod._id, -1)}>-</button>
                       <input 
                         value={quantities[prod._id] || 1} 
                         readOnly 
                       />
                       <button onClick={() => updateQty(prod._id, 1)}>+</button>
                     </div>
                     <button 
                       className="add-to-cart"
                       disabled={prod.stock === 0}
                       onClick={() => handleAddToCart(prod)}
                     >
                       {prod.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                     </button>
                   </div>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default Store;