// client/src/features/store/PaymentFailure.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import HeroHeader from '../../components/common/HeroHeader';
import './PaymentOutcome.css';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pull `_id` from location.state instead of `orderId`
  const { _id } = location.state || {};

  const handleRetry = async () => {
    if (!_id) {
      alert('Order reference not found');
      return;
    }

    try {

const response = await api.post(`/orders/${_id}/retry`);
navigate(`/retry-payment/${_id}`, {
  state: {
    razorpayOrder: response.data.razorpayOrder,
  },
});

    } catch (error) {
      console.error('Retry Payment error:', error);
      alert(error.response?.data?.error || 'Payment retry failed');
      const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR';

      // Optionally redirect user if order is not found
      if (errorCode === 'ORDER_NOT_FOUND') {
        navigate('/order-history');
      }
    }
  };

  return (
    <div className="payment-outcome-page">
      <HeroHeader
        title="Payment Failed"
        subtitle="There was an issue processing your payment."
        backgroundImage="/assets/head/failure.jpg"
      />
      <div className="payment-content">
        <h2>Payment was not successful.</h2>
        <p>Please verify your payment details and try again.</p>
        <div className="action-buttons">
          <button onClick={handleRetry} className="btn">Retry Payment</button>
          <Link to="/cart" className="btn">Return to Cart</Link>
          <Link to="/store" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;