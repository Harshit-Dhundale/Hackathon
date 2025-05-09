// client/src/features/dashboard/OrdersSummary.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiCheckCircle, FiClock } from 'react-icons/fi';
import styles from './OrdersSummary.module.css';
import api from '../../utils/api';

const OrdersSummary = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

const fetchOrders = async () => {
  try {
    const { data } = await api.get(`/orders/user/${currentUser._id}`);
    setOrders(data);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  } finally {
    setLoading(false);
  }
};

    if (currentUser && currentUser._id) {
      fetchOrders();
    }
  }, [currentUser]);

  // Calculate summary stats
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(
    (order) => order.deliveryStatus && order.deliveryStatus.toLowerCase() === 'delivered'
  ).length;
  const pendingOrders = totalOrders - deliveredOrders;

  return (
    <div className={`${styles.ordersSummary} card`}>
      <h2>
        <FiShoppingBag /> My Orders Summary
      </h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : totalOrders === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className={styles.ordersStats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>
              <FiShoppingBag />
            </span>
            <div className={styles.statDetails}>
              <p className={styles.statNumber}>{totalOrders}</p>
              <p className={styles.statLabel}>Total Orders</p>
            </div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>
              <FiCheckCircle />
            </span>
            <div className={styles.statDetails}>
              <p className={styles.statNumber}>{deliveredOrders}</p>
              <p className={styles.statLabel}>Delivered</p>
            </div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>
              <FiClock />
            </span>
            <div className={styles.statDetails}>
              <p className={styles.statNumber}>{pendingOrders}</p>
              <p className={styles.statLabel}>Pending</p>
            </div>
          </div>
        </div>
      )}

      <button className={styles.btn} onClick={() => navigate('/order-history')}>
        View Order History
      </button>
    </div>
  );
};

export default OrdersSummary;