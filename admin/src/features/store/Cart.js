// client/src/features/store/Cart.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';
import './Cart.css';
import { FiTrash2, FiChevronLeft } from 'react-icons/fi';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    const updated = cart.map(item => {
      if(item.product._id === id) {
        return { 
          ...item, 
          quantity: Math.min(Math.max(1, newQuantity), item.product.stock)
        };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.product._id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  if(cart.length === 0) {
    return (
      <div className="cart-empty">
        <HeroHeader 
          title="Your Cart" 
          subtitle="Your cart is currently empty" 
          backgroundImage="/assets/head/cart.jpg"
        />
        <div className="empty-state">
          <div className="empty-content">
            <img src="/assets/empty-cart.png" alt="Empty cart" />
            <h2>Your Cart Feels Lonely</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <Link to="/store" className="btn btn-primary">
              <FiChevronLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <HeroHeader 
        title="Your Cart" 
        subtitle="Review the items in your cart" 
        backgroundImage="/assets/head/cart.jpg"
      />
      <div className="cart-container">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.product._id} className="cart-item">
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name} 
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <div className="item-header">
                  <h3 className="item-title">{item.product.name}</h3>
                  <button 
                    onClick={() => removeFromCart(item.product._id)} 
                    className="btn-remove"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                <p className="item-subtitle">
                  {item.product.quantityValue} {item.product.quantityUnit}
                </p>
                
                <div className="quantity-controls">
                  <button 
                    className="btn-quantity"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                  />
                  <button 
                    className="btn-quantity"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-pricing">
                  <span className="price">₹{item.product.price}</span>
                  <span className="subtotal">
                    Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({cart.length})</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')} 
              className="btn-checkout"
            >
              Proceed to Checkout
            </button>
            <Link to="/store" className="btn-continue">
              <FiChevronLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;