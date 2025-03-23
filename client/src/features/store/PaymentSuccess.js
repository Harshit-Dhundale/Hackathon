// client/src/features/store/PaymentSuccess.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import HeroHeader from '../../components/common/HeroHeader';
import './PaymentOutcome.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  return (
    <div className="payment-outcome-page">
      <HeroHeader 
        title="Payment Successful" 
        subtitle="Thank you for your purchase!" 
        backgroundImage="/assets/head/success.jpg" 
      />
      <div className="payment-content">
        {orderData ? (
          <div className="order-summary">
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> {orderData.orderId}</p>
            <p><strong>Total Amount:</strong> ₹{orderData.totalAmount}</p>
            {orderData.razorpayPaymentId && (
              <p><strong>Payment ID:</strong> {orderData.razorpayPaymentId}</p>
            )}
            {orderData.shippingAddress && (
              <div>
                <h3>Shipping Address:</h3>
                <p>{orderData.shippingAddress.street}, {orderData.shippingAddress.city}</p>
                <p>{orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}</p>
                <p>{orderData.shippingAddress.country}</p>
              </div>
            )}
          </div>
        ) : (
          <h2>Your order has been placed successfully.</h2>
        )}
        <div className="action-buttons">
          <Link to="/" className="btn">Go to Home</Link>
          <Link to="/order-history" className="btn btn-secondary">View Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;