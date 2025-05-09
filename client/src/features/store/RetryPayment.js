import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import HeroHeader from '../../components/common/HeroHeader';
import {
  FiArrowLeft,
  FiAlertTriangle,
  FiCreditCard,
  FiInfo,
  FiClock,
  FiDollarSign,
  FiRefreshCw,
} from 'react-icons/fi';
import './RetryPayment.css';

const RetryPayment = () => {
  // `orderId` is the MongoDB _id from the URL
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Fetch the original order details using `orderId` (the MongoDB _id)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${orderId}`);
        setOrderData(data);
      } catch (err) {
        console.error('Error fetching order for retry:', err);
        setError('Failed to load order data');
      } finally {
        setLoading(false);
      }
    };

   if (orderId) fetchOrder();
  }, [orderId]);

  // 2) Handle the “Retry Payment” button
  const handleRetryPayment = () => {
    if (!orderData) return;
    /**
     * Navigate to Checkout, passing the entire order
     * in location.state so Checkout can read and use it.
     */
    navigate('/checkout', {
      state: {
        retryOrder: orderData,
      },
    });
  };

  if (loading) {
    return (
      <div className="retry-payment-page">
        <p>Loading order...</p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="retry-payment-page">
        <p>{error || 'Order not found.'}</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  // 3) Render the Retry Payment UI
  return (
    <div className="retry-payment-page">
      <HeroHeader
        title="Complete Your Payment"
        subtitle={`Order ID: ${orderId}`}
        backgroundImage="/assets/head/failure.jpg"
      />

      <div className="retry-payment-content">
        <h2>
          <FiAlertTriangle /> Payment Required
        </h2>

        <div className="order-details-card">
          <div className="order-detail-item">
            <span className="detail-label">
              <FiClock /> Order Date
            </span>
            <span className="detail-value">
              {new Date(orderData.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="order-detail-item">
            <span className="detail-label">
              <FiInfo /> Items
            </span>
            <span className="detail-value">
              {orderData.products.length} items
            </span>
          </div>

          <div className="order-detail-item">
            <span className="detail-label">
              <FiDollarSign /> Total Amount
            </span>
            <span className="detail-value order-total">
              ₹{orderData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="payment-instruction">
          <FiInfo /> Please check your payment details and try again.
          <br />We support all major credit/debit cards and UPI.
        </p>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleRetryPayment}>
            <FiCreditCard /> Retry Payment Now
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate('/order-history')}
          >
            <FiRefreshCw /> View Order History
          </button>
        </div>

        <div className="support-info">
          <FiInfo /> Need help? Contact our support team at support@farmiculture.com
        </div>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Safety
      </button>
    </div>
  );
};

export default RetryPayment;