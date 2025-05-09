import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { useAuth } from '../../context/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from './Home.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      title: "Real-Time Inventory Tracking",
      image: "/assets/home/inventory.png",
      description: "Monitor your stock levels across multiple locations with up-to-the-minute updates.",
      path: "/inventory-tracking"
    },
    {
      title: "Analytics Dashboard",
      image: "/assets/home/analytics.png",
      description: "Gain actionable insights with data-driven reports and dynamic visual analytics.",
      path: "/analytics"
    },
    {
      title: "Automated Reordering",
      image: "/assets/home/reorder.png",
      description: "Never run out of stock with intelligent, automated reorder suggestions.",
      path: "/automated-reordering"
    },
    {
      title: "Multi-Channel Management",
      image: "/assets/home/multichannel.png",
      description: "Seamlessly integrate inventory across all your sales channels and warehouses.",
      path: "/multichannel-management"
    },
    {
      title: "Supplier Integration",
      image: "/assets/home/supplier.png",
      description: "Connect effortlessly with suppliers for a streamlined procurement process.",
      path: "/supplier-integration"
    },
    {
      title: "Customizable Reports",
      image: "/assets/home/reports.png",
      description: "Tailor your reporting to meet your business needs with flexible report generation.",
      path: "/custom-reports"
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles.homeContainer}>
        <section className={styles.heroSection} data-aos="fade-in">
          <div className={styles.heroOverlay}>
            <h1 className={styles.brandTitle} data-aos="zoom-in">Welcome to Stockly</h1>
            <p className={styles.tagline} data-aos="fade-up" data-aos-delay="200">
              Intelligent Inventory Management for Modern Businesses
            </p>
            <p className={styles.welcomeMessage} data-aos="fade-up" data-aos-delay="400">
              Streamline your inventory operations with real-time tracking, smart analytics, and automated processes. Optimize your stock, reduce waste, and maximize efficiency—all in one platform.
            </p>
            {!currentUser && (
              <div className={styles.heroButtons} data-aos="fade-up" data-aos-delay="600">
                <Link to="/register" className={styles.btnPrimary}>Get Started</Link>
                <Link to="/login" className={styles.btnSecondary}>Existing User? Login</Link>
              </div>
            )}
          </div>
        </section>

        <section className={styles.featuresSection} data-aos="fade-up">
          <h2 className={styles.sectionTitle}>Our Features</h2>
          <div className={styles.featuresSlider}>
            <Slider {...sliderSettings}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureSlide}>
                  <div className={styles.featureCard} data-aos="zoom-in" data-aos-delay={`${index * 100}`}>
                    <div className={styles.featureImageContainer}>
                      <img src={feature.image} alt={feature.title} className={styles.featureImage} />
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                    <Link to={feature.path} className={styles.featureLink}>Learn More</Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Home;