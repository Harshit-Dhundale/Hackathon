// client/src/features/auth/ForgotPasswordOTP.jsx
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faCircleNotch, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ForgotPasswordOTP = () => {
  const { state } = useLocation();
  const { email } = state || {};
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/users/verify-forgot-password-otp`, { email, otp });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className="auth-header">
          <FontAwesomeIcon icon={faShieldAlt} className="header-icon" />
          <h2>Verify OTP</h2>
          <p>Check your email for the 6-digit code</p>
        </div>

        <form onSubmit={handleVerifyOtp}>
          <div className="input-group">
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} spin />
                <span>Verifying...</span>
              </>
            ) : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;