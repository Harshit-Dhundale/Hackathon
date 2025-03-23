// OrderHistory.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../../utils/api';
import { 
  FiPackage, 
  FiCalendar, 
  FiDollarSign, 
  FiTruck, 
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiShoppingBag
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import HeroHeader from "../../components/common/HeroHeader";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

const fetchOrders = async () => {
  try {
    const response = await api.get(`/orders/user/${currentUser._id}`);
    setOrders(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

    if (currentUser && currentUser._id) {
      fetchOrders();
    }
  }, [currentUser]);

  const getStatusBadge = (order) => {
    const statusConfig = {
      paid: { color: '#2e7d32', icon: <FiCheckCircle /> },
      failed: { color: '#c62828', icon: <FiAlertCircle /> },
      pending: { color: '#ff9800', icon: <FiPackage /> }
    };

    const { color, icon } = statusConfig[order.paymentStatus] || {};
    
    return (
      <span className="status-badge" style={{ backgroundColor: color }}>
        {icon}
        {order.paymentStatus.toUpperCase()}
      </span>
    );
  };

  const renderTimeline = (order) => {
    const steps = [
      { status: 'ordered', label: 'Ordered', icon: <FiPackage /> },
      { status: 'processing', label: 'Processing', icon: <FiPackage /> },
      { status: 'shipped', label: 'Shipped', icon: <FiTruck /> },
      { status: 'delivered', label: 'Delivered', icon: <FiCheckCircle /> }
    ];

    return (
      <div className="delivery-timeline">
        {steps.map((step, index) => (
          <div 
            key={step.status}
            className={`timeline-step ${
              order.deliveryStatus === step.status ? 'active' : 
              index < steps.findIndex(s => s.status === order.deliveryStatus) ? 'completed' : ''
            }`}
          >
            <div className="timeline-icon">
              {step.icon}
              {index < steps.length - 1 && <div className="timeline-line"></div>}
            </div>
            <span className="timeline-label">{step.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="order-history">
      <HeroHeader
        title="Your Order History"
        subtitle="Review your past orders and track their status."
        backgroundImage="/assets/head/order-history.jpg"
      />
      
      <div className="order-history-container">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <FiShoppingBag className="empty-icon" />
            <h3>No Orders Found</h3>
            <p>Start exploring our products and place your first order!</p>
            <Link to="/store" className="btn-primary">
              Start Shopping <FiArrowRight />
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <span className="order-number">
                    <FiPackage /> Order #{order.orderId}
                  </span>
                  {getStatusBadge(order)}
                </div>
                <div className="order-dates">
                  <p>
                    <FiCalendar /> Ordered: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <FiCalendar /> Estimated: {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {renderTimeline(order)}

              <div className="order-summary">
                <div className="summary-item">
                  <FiDollarSign />
                  <span>Total Amount:</span>
                  <strong>₹{order.totalAmount.toFixed(2)}</strong>
                </div>
                
                <Link 
                  to={`/order-details/${order._id}`} 
                  className="view-details-btn"
                >
                  View Details <FiArrowRight />
                </Link>
              </div>

              {order.paymentStatus === "failed" && (
                <button 
                  onClick={() => navigate(`/retry-payment/${order._id}`)}
                  className="retry-button"
                >
                  <FiAlertCircle /> Retry Payment
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;