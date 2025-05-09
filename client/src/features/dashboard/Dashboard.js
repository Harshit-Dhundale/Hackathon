import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, forumAPI } from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import ForumPostsList from './ForumPostsList';
import OrdersSummary from './OrdersSummary'; // Keep OrdersSummary
import LoadingSpinner from '../../components/common/LoadingSpinner';
import HeroHeader from '../../components/common/HeroHeader';
import api from '../../utils/api'; 
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [forumPosts, setForumPosts] = useState([]);
  const [orders, setOrders] = useState([]); // Keep orders if needed by OrdersSummary
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user data
    const loadUserData = async () => {
      try {
        const res = await userAPI.get(currentUser._id);
        setUserData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load user data.');
      }
    };

    // Fetch user’s forum posts
    const loadForumPosts = async () => {
      try {
        const res = await forumAPI.getUserPosts(currentUser._id);
        setForumPosts(res.data);
      } catch (err) {
        setForumPosts([]);
      }
    };

    // Fetch orders (if OrdersSummary relies on them)
    const loadOrders = async () => {
      try {
        const { data } = await api.get(`/orders/user/${currentUser._id}`);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (currentUser) {
      Promise.all([
        loadUserData(),
        loadForumPosts(),
        loadOrders(),
      ]).finally(() => setLoading(false));
    }
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.dashboardError}>{error}</p>;

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
        {/* Removed the stats row that included Active Stores, Total Predictions, and Pending Orders */}
        
        {/* Removed the StoreList (My Stores) section */}

        {/* Keep the OrdersSummary section */}
        <div className={styles.dashboardSection}>
          <OrdersSummary />
        </div>

        <div className={styles.dashboardSection}>
          <ForumPostsList forumPosts={forumPosts} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;