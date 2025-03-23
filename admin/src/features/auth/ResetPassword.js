// client/src/features/auth/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCircleNotch, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import "./Auth.css";

const ResetPassword = () => {
  const { state } = useLocation();
  const { email } = state || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/users/reset-password`, {
        email,
        newPassword,
      });
      // Optionally, save token and navigate to dashboard
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
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
          <FontAwesomeIcon icon={faLock} className="header-icon" />
          <h2>New Password</h2>
          <p>Create a strong new password</p>
        </div>

        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Updating...</span>
              </>
            ) : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;