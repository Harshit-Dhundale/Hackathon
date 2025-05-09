import React from 'react';
import HeroHeader from '../../components/common/HeroHeader';
import { FiShoppingBag, FiShield, FiPackage } from 'react-icons/fi';
import styles from './About.module.css';

const About = () => {
  return (
    <>
      <HeroHeader
        title="About MarketMitra"
        subtitle="MarketMitra revolutionizes Ecommerce with an integrated platform that brings together seamless shopping, secure authentication, and comprehensive order management."
        backgroundImage="/assets/head/about.jpg"
      />

      <div className={styles.aboutContainer}>
        <section className={styles.featureSection}>
          <h2>Our Platform Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <FiShoppingBag className={styles.featureIcon} />
              <h3>Seamless Shopping & Checkout</h3>
              <ul>
                <li>Explore a wide range of products</li>
                <li>Secure payments with Razorpay integration</li>
                <li>Intuitive cart and streamlined checkout</li>
              </ul>
            </div>

            <div className={styles.featureCard}>
              <FiShield className={styles.featureIcon} />
              <h3>Secure Authentication & Order Tracking</h3>
              <ul>
                <li>OTP-based user verification for enhanced security</li>
                <li>Real-time order tracking and delivery status</li>
                <li>Detailed order history with email invoices</li>
              </ul>
            </div>

            <div className={styles.featureCard}>
              <FiPackage className={styles.featureIcon} />
              <h3>Comprehensive Retail Management</h3>
              <ul>
                <li>Manage your orders and product listings effortlessly</li>
                <li>Personalized dashboard for optimized control</li>
                <li>Easy support and communication for your farming needs</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className={styles.aboutFooter}>
          <p>Join thousands of farmers transforming their agricultural journey with MarketMitra</p>
          <p>&copy; 2025 MarketMitra. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default About;