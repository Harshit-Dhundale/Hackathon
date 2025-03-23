// // About.js (Admin-focused)
// import React from 'react';
// import HeroHeader from '../../components/common/HeroHeader';
// import { 
//   FiUsers, 
//   FiShoppingCart, 
//   FiPieChart, 
//   FiMessageSquare,
//   FiShield,
//   FiSettings
// } from 'react-icons/fi';
// import styles from './About.module.css';

// const About = () => {
//   return (
//     <>
//       <HeroHeader
//         title="About AdminHub Pro"
//         subtitle="Empowering Administrators with Comprehensive Management Tools"
//         backgroundImage="/assets/head/about-admin.jpg"
//       />

//       <div className={styles.aboutContainer}>
//         <section className={styles.featureSection}>
//           <h2>Core Administrative Capabilities</h2>
//           <div className={styles.featureGrid}>
//             <div className={styles.featureCard}>
//               <FiUsers className={styles.featureIcon} />
//               <h3>User Management Suite</h3>
//               <ul>
//                 <li><FiSettings /> Granular role-based access control</li>
//                 <li><FiShield /> Real-time activity monitoring</li>
//                 <li><FiPieChart /> Detailed user behavior analytics</li>
//               </ul>
//             </div>

//             <div className={styles.featureCard}>
//               <FiShoppingCart className={styles.featureIcon} />
//               <h3>Order Intelligence</h3>
//               <ul>
//                 <li>Real-time transaction monitoring</li>
//                 <li>Customer interaction tracking</li>
//                 <li>Automated fraud detection</li>
//               </ul>
//             </div>

//             <div className={styles.featureCard}>
//               <FiMessageSquare className={styles.featureIcon} />
//               <h3>Customer Support Integration</h3>
//               <ul>
//                 <li>Unified support ticket management</li>
//                 <li>Customer interaction history</li>
//                 <li>AI-powered response suggestions</li>
//               </ul>
//             </div>
//           </div>
//         </section>

//         <section className={styles.modelSection}>
//           <h2>Administrative Security Features</h2>
//           <p>Enterprise-grade security infrastructure with:</p>

//           <div className={styles.modelGrid}>
//             <div className={styles.modelCard}>
//               <h3><span className={styles.modelIcon}>🔒</span>Auth System</h3>
//               <div>
//                 <p className={styles.modelAlgorithm}>OAuth 2.0 & JWT</p>
//                 <p>Secure authentication with role-based permissions and MFA support</p>
//               </div>
//             </div>

//             <div className={styles.modelCard}>
//               <h3><span className={styles.modelIcon}>📊</span>Analytics Engine</h3>
//               <div>
//                 <p className={styles.modelAlgorithm}>Elasticsearch + Kibana</p>
//                 <p>Real-time dashboard with custom reporting capabilities</p>
//               </div>
//             </div>

//             <div className={styles.modelCard}>
//               <h3><span className={styles.modelIcon}>🤖</span>Support AI</h3>
//               <div>
//                 <p className={styles.modelAlgorithm}>NLP Processing</p>
//                 <p>Automated ticket categorization and priority scoring</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <footer className={styles.aboutFooter}>
//           <p>Trusted by 5,000+ administrators managing enterprise operations</p>
//           <p>&copy; 2024 AdminHub Pro. All rights reserved.</p>
//         </footer>
//       </div>
//     </>
//   );
// };

// export default About; 


// About.js (Admin-focused)
import React from 'react';
import HeroHeader from '../../components/common/HeroHeader';
import { 
  FiUsers, 
  FiShoppingCart, 
  FiPieChart, 
  FiMessageSquare,
  FiShield,
  FiSettings,
  FiLayers
} from 'react-icons/fi';
import styles from './About.module.css';

const About = () => {
  return (
    <>
      <HeroHeader
        title="About STOCKLY"
        subtitle="Empowering Administrators with Comprehensive Inventory and Management Tools"
        backgroundImage="/assets/head/about.jpg"
      />

      <div className={styles.aboutContainer}>
        <section className={styles.featureSection}>
          <h2>Core Administrative Capabilities</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <FiUsers className={styles.featureIcon} />
              <h3>User Management Suite</h3>
              <ul>
                <li><FiSettings /> Granular role-based access control</li>
                <li><FiShield /> Real-time activity monitoring</li>
                <li><FiPieChart /> Detailed user behavior analytics</li>
              </ul>
            </div>

            <div className={styles.featureCard}>
              <FiShoppingCart className={styles.featureIcon} />
              <h3>Order Intelligence</h3>
              <ul>
                <li>Real-time transaction monitoring</li>
                <li>Customer interaction tracking</li>
                <li>Automated fraud detection</li>
              </ul>
            </div>

            {/* <div className={styles.featureCard}>
              <FiMessageSquare className={styles.featureIcon} />
              <h3>Customer Support Integration</h3>
              <ul>
                <li>Unified support ticket management</li>
                <li>Customer interaction history</li>
                <li>AI-powered response suggestions</li>
              </ul>
            </div> */}
            
            <div className={styles.featureCard}>
              <FiLayers className={styles.featureIcon} />
              <h3>Inventory Management</h3>
              <ul>
                <li>Real-time stock tracking</li>
                <li>Automated reorder alerts</li>
                <li>Supplier and vendor integration</li>
                <li>And more inventory optimization tools</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.modelSection}>
          <h2>Administrative Security Features</h2>
          <p>Enterprise-grade security infrastructure with:</p>

          <div className={styles.modelGrid}>
            <div className={styles.modelCard}>
              <h3><span className={styles.modelIcon}>🔒</span>Auth System</h3>
              <div>
                <p className={styles.modelAlgorithm}>OAuth 2.0 & JWT</p>
                <p>Secure authentication with role-based permissions and MFA support</p>
              </div>
            </div>

            <div className={styles.modelCard}>
              <h3><span className={styles.modelIcon}>📊</span>Analytics Engine</h3>
              <div>
                <p className={styles.modelAlgorithm}>Elasticsearch + Kibana</p>
                <p>Real-time dashboard with custom reporting capabilities</p>
              </div>
            </div>

            <div className={styles.modelCard}>
              <h3><span className={styles.modelIcon}>🤖</span>Support AI</h3>
              <div>
                <p className={styles.modelAlgorithm}>NLP Processing</p>
                <p>Automated ticket categorization and priority scoring</p>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.aboutFooter}>
          <p>Trusted by 5,000+ administrators managing enterprise operations</p>
          <p>&copy; 2024 STOCKLY. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default About;