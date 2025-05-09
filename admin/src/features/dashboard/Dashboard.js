import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faBoxes,
  faShoppingCart,
  faExclamationTriangle,
  faStar,
  faRocket,
  faPlus,
  faChartLine,
  faBox,
  faClock,
  faShoppingBag,
  faReceipt,
  faFire,
} from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/api';
import api from '../../utils/api';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import HeroHeader from '../../components/common/HeroHeader';

import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [adminProducts, setAdminProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Metric states
  const [totalAdminOrders, setTotalAdminOrders] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  // ---------------------------------------
  // Fetch user data, products, orders
  // ---------------------------------------
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await userAPI.get(currentUser._id);
        setUserData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load user data.');
      }
    };

    const loadAdminProducts = async () => {
      try {
        // Fetch only products created by the current admin
        const res = await api.get(`/products?createdBy=${encodeURIComponent(currentUser._id)}`);
        setAdminProducts(res.data);
      } catch (err) {
        console.error('Error fetching admin products:', err);
      }
    };

    const loadOrders = async () => {
      try {
        // Fetch all orders
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    if (currentUser) {
      Promise.all([loadUserData(), loadAdminProducts(), loadOrders()])
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  // ---------------------------------------
  // Compute metrics after data is loaded
  // ---------------------------------------
  useEffect(() => {
    if (adminProducts.length && orders.length) {
      const adminProductIds = adminProducts.map(p => p._id.toString());

      // Total orders that include at least one admin product
      const adminOrders = orders.filter(order =>
        order.products.some(item =>
          adminProductIds.includes(item.product.toString())
        )
      );
      setTotalAdminOrders(adminOrders.length);

      // Identify low-stock products (stock < 20)
      const lowStock = adminProducts.filter(p => p.stock < 20);
      setLowStockProducts(lowStock);

      // Identify popular products (ordered > 4 times)
      const productOrderCounts = {};
      orders.forEach(order => {
        order.products.forEach(item => {
          const prodId = item.product.toString();
          if (adminProductIds.includes(prodId)) {
            productOrderCounts[prodId] = (productOrderCounts[prodId] || 0) + item.quantity;
          }
        });
      });
      const popular = adminProducts.filter(p =>
        (productOrderCounts[p._id.toString()] || 0) > 4
      );
      setPopularProducts(popular);
    }
  }, [adminProducts, orders]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.dashboardError}>{error}</p>;

  // ---------------------------------------
  // Carousel settings for product thumbnails
  // ---------------------------------------
  const productCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <>
      <HeroHeader
        title={
          <>
            <FontAwesomeIcon icon={faBoxOpen} /> Welcome, {userData?.username || userData?.fullName}!
          </>
        }
        subtitle="Your Retail Management Hub"
        backgroundImage="/assets/head/dash.jpg"
      />

      <div className={styles.dashboardContainer}>
        {/* ======================= */}
        {/* Stats Row */}
        {/* ======================= */}
        <div className={styles.statsRow}>
          {/* Total Products */}
          <div className={styles.statCard}>
            <div className={styles.cardIcon}>
              <FontAwesomeIcon icon={faBoxes} />
            </div>
            <div className={styles.cardContent}>
              <h3>{adminProducts.length}</h3>
              <p>Total Products</p>
              {adminProducts.length > 0 && (
                <div className={styles.carouselContainer}>
                  <Slider {...productCarouselSettings}>
                    {adminProducts.map(product => (
                      <div key={product._id} className={styles.carouselItem}>
                        <img src={product.imageUrl} alt={product.name} className={styles.productImg} />
                        <span className={styles.productLabel}>{product.name}</span>
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>
          </div>

          {/* Total Orders */}
          <div className={styles.statCard}>
            <div className={styles.cardIcon}>
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <div className={styles.cardContent}>
              <h3>{totalAdminOrders}</h3>
              <p>Total Orders</p>
              <div className={styles.orderPreview}>
                {orders
                  .filter(order =>
                    order.products.some(item =>
                      adminProducts.some(p => p._id === item.product.toString())
                    )
                  )
                  .slice(0, 5)
                  .map(order => (
                    <div key={order._id} className={styles.orderItem}>
                      <FontAwesomeIcon icon={faReceipt} className={styles.orderIcon} />
                      <div className={styles.orderInfo}>
                        <span>Order #{order.orderId}</span>
                        <span className={styles.orderDate}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className={`${styles.statCard} ${lowStockProducts.length ? styles.warning : ''}`}>
            <div className={styles.cardIcon}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div className={styles.cardContent}>
              <h3>{lowStockProducts.length}</h3>
              <p>Low Stock Alerts</p>
              {lowStockProducts.length > 0 && (
                <div className={styles.alertList}>
                  {lowStockProducts.map(product => (
                    <div key={product._id} className={styles.alertItem}>
                      <img src={product.imageUrl} alt={product.name} className={styles.alertImg} />
                      <div className={styles.alertDetails}>
                        <span>{product.name}</span>
                        <div className={styles.stockBar}>
                          <div className={styles.stockFill} style={{ width: `${(product.stock / 20) * 100}%` }} />
                        </div>
                        <span className={styles.stockText}>{product.stock} left</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Popular Products */}
          <div className={styles.statCard}>
            <div className={styles.cardIcon}>
              <FontAwesomeIcon icon={faStar} />
            </div>
            <div className={styles.cardContent}>
              <h3>{popularProducts.length}</h3>
              <p>Popular Products</p>
              {popularProducts.length > 0 && (
                <div className={styles.popularList}>
                  {popularProducts.map(product => (
                    <div key={product._id} className={styles.popularItem}>
                      <img src={product.imageUrl} alt={product.name} className={styles.popularImg} />
                      <div className={styles.popularDetails}>
                        <span>{product.name}</span>
                        <div className={styles.hotBadge}>
                          <FontAwesomeIcon icon={faFire} />
                          <span>Hot Seller</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================= */}
        {/* Additional Sections */}
        {/* ======================= */}
        <div className={styles.dashboardGrid}>
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h2>
              <FontAwesomeIcon icon={faRocket} /> Quick Actions
            </h2>
            <div className={styles.actions}>
              <button className={styles.actionBtn}>
                <FontAwesomeIcon icon={faPlus} /> Add New Product
              </button>
              <button className={styles.actionBtn}>
                <FontAwesomeIcon icon={faChartLine} /> View Sales Report
              </button>
              <button className={styles.actionBtn}>
                <FontAwesomeIcon icon={faBox} /> Manage Inventory
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className={styles.recentOrders}>
            <h2>
              <FontAwesomeIcon icon={faClock} /> Recent Orders
            </h2>
            <div className={styles.recentList}>
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className={styles.recentItem}>
                  <div className={styles.recentIcon}>
                    <FontAwesomeIcon icon={faShoppingBag} />
                  </div>
                  <div className={styles.recentInfo}>
                    <span className={styles.orderId}>Order #{order.orderId}</span>
                    <span className={styles.orderStatus}>Status: {order.deliveryStatus}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={styles.orderAmount}>₹{order.totalAmount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;