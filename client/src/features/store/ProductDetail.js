// client/src/features/store/ProductDetail.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import HeroHeader from '../../components/common/HeroHeader';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

api.get(`/products/${id}`)
  .then(res => {
    setProduct(res.data);
    setLoading(false);
  })
  .catch(err => {
    console.error("Error fetching product:", err);
    setLoading(false);
  });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.product._id === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({ product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} ${product.name} added to cart`);
  };

  const calculateAverageRating = () => {
    if (!product || !product.ratings || product.ratings.length === 0) return 'No ratings';
    const total = product.ratings.reduce((sum, r) => sum + r.value, 0);
    return (total / product.ratings.length).toFixed(1);
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <HeroHeader 
        title="Product Details" 
        subtitle={`Learn more about ${product.name}`} 
        backgroundImage="/assets/head/shop.jpg"
      />
      <div className="product-detail">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="product-detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/products/default.jpg';
          }}
        />
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <div className="product-meta">
            <span className="category-badge">{product.category}</span>
            <span className="subcategory">{product.subCategory}</span>
          </div>
          <div className="rating">
            <span>Average Rating: {calculateAverageRating()}</span>
          </div>
          <div className="quantity-info">
            <p>
              Package: {product.quantityValue} {product.quantityUnit}
            </p>
            <p>Stock: {product.stock} available</p>
          </div>
          <p className="product-description">{product.description}</p>
          {product.specifications && (
            <div className="product-specifications">
              <h3>Specifications</h3>
              {product.specifications.weight && <p><strong>Weight:</strong> {product.specifications.weight}</p>}
              {product.specifications.composition && <p><strong>Composition:</strong> {product.specifications.composition}</p>}
              {product.specifications.usageInstructions && <p><strong>Usage:</strong> {product.specifications.usageInstructions}</p>}
              {product.specifications.suitableFor && <p><strong>Suitable For:</strong> {product.specifications.suitableFor}</p>}
            </div>
          )}
          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(Math.max(1, Number(e.target.value)), product.stock))
                }
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? `Add to Cart (₹${quantity * product.price})` : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorFallback = ({ error }) => (
  <div className="error-state">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>Try Again</button>
  </div>
);

const ProductDetailWrapper = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ProductDetail />
  </ErrorBoundary>
);

export default ProductDetailWrapper;