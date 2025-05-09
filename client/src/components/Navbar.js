import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [, setIsToolsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const userDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);

  // Update dark mode class and localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout with redirection
  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        {/* New container for title and dark mode toggle */}
        <div className={styles.brandContainer}>
          <Link to="/" className={styles.logo}>MarketMitra</Link>
          {/* <button
            className={styles.themeToggleBtn}
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button> */}
        </div>
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>

      <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
        <li className={styles.navItem}>
          <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
            About Us
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
            Contact Us
          </Link>
        </li>
        {currentUser && (
          <>
            <li className={styles.navItem}>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? styles.active : ''}>
                Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/store" className={location.pathname === '/store' ? styles.active : ''}>
                Shop
              </Link>
            </li>
            {/* <li className={`${styles.navItem} ${styles.authDropdown}`} ref={toolsDropdownRef}>
              <div 
                className={styles.dropdownToggle} 
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              >
                <span className={styles.navbarUsername}>Smart Tools</span>
                <span className={styles.dropdownArrow}></span>
              </div>
              {isToolsDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => navigate('/crop-recommendation')} className={styles.dropdownItem}>
                    Smart Crop Advisor
                  </button>
                  <button onClick={() => navigate('/fertilizer-recommendation')} className={styles.dropdownItem}>
                    Smart Fertilizer Advisor
                  </button>
                  <button onClick={() => navigate('/disease-detection')} className={styles.dropdownItem}>
                    Crop Health Guardian
                  </button>
                </div>
              )}
            </li> */}
            <li className={styles.navItem}>
              <Link to="/forum" className={location.pathname === '/forum' ? styles.active : ''}>
                Forum
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/cart" className={location.pathname === '/cart' ? styles.active : ''}>
                Cart
              </Link>
            </li>
          </>
        )}

        <div className={styles.authLinks}>
          {currentUser ? (
            <li className={`${styles.navItem} ${styles.authDropdown}`} ref={userDropdownRef}>
              <div 
                className={styles.dropdownToggle} 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="User Avatar"
                    className={styles.navbarAvatar}
                  />
                ) : (
                  <div className={styles.navbarAvatar}>
                    {(currentUser.username || currentUser.fullName)[0].toUpperCase()}
                  </div>
                )}
                <span className={styles.navbarUsername}>
                  {currentUser.username || currentUser.fullName}
                </span>
                <span className={styles.dropdownArrow}></span>
              </div>
              {isUserDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => navigate('/profile')} className={styles.dropdownItem}>
                    My Profile
                  </button>
                  <button onClick={() => navigate('/order-history')} className={styles.dropdownItem}>
                    My Orders
                  </button>
                  {/* {currentUser.isAdmin && (
                    <button onClick={() => navigate('/admin')} className={styles.dropdownItem}>
                      Admin Panel
                    </button>
                  )} */}
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li className={styles.navItem}>
                <Link to="/register" className={location.pathname === '/register' ? styles.active : ''}>
                  Register
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/login" className={location.pathname === '/login' ? styles.active : ''}>
                  Login
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
