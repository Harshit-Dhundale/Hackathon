import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCrop, FiLock, FiArrowRight } from "react-icons/fi";
import { authAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { data } = await authAPI.login(formData);
      await login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-module__container">
      <div className="auth-module__wrapper">
        {/* Login Card */}
        <div className="auth-module__card">
          <div className="auth-module__header">
            <h1 className="auth-module__brand">
              <span className="auth-module__logo">
              🌱
              </span>
              MarketMitra
            </h1>
            <p className="auth-module__tagline">Cultivating Digital Farm Communities</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-module__form">
            <div className="auth-module__input-group">
              <FiCrop className="auth-module__input-icon" />
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Email or Username"
                className="auth-module__input"
                autoComplete="username"
                required
              />
              <div className="auth-module__input-border"></div>
            </div>

            <div className="auth-module__input-group">
              <FiLock className="auth-module__input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="auth-module__input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-module__password-toggle"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <div className="auth-module__input-border"></div>
            </div>

            {error && (
              <div className="auth-module__error">
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="auth-module__submit"
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                <>
                  Continue
                  <FiArrowRight className="auth-module__submit-icon" />
                </>
              )}
            </button>

            <div className="auth-module__secondary-actions">
              <Link to="/forgot-password" className="auth-module__link">
                Forgot Password?
              </Link>
              <Link to="/register" className="auth-module__link">
                Create New Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;