import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEnvelope, faCircleNotch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './OTPVerification.css';

const OTPVerification = ({ email, formData, navigate }) => {
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(30);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("OTP must be 6 digits");
            return;
        }
        setIsSubmitting(true);
        setError("");

        try {
            const response = await axios.post(`https://hackathon-backend-6c9z.onrender.com/api/users/verify-otp`, {
                email,
                otp,
                userData: formData,
            });

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await axios.post(`https://hackathon-backend-6c9z.onrender.com/api/users/resend-otp`, { email });
            setResendDisabled(true);
            setCountdown(30);
        } catch (error) {
            setError("Failed to resend OTP. Please try again.");
        }
    };

    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
        return () => clearInterval(timer);
    }, [resendDisabled, countdown]);

    return (
        <div className="otp-container">
            <div className="otp-card">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                
                <div className="otp-header">
                    <FontAwesomeIcon icon={faCheckCircle} className="shield-icon" />
                    <h2>Secure Verification</h2>
                    <p>We've sent a 6-digit code to <strong>{email}</strong></p>
                </div>

                <form onSubmit={handleVerifyOtp}>
                    <div className="otp-input-group">
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        <input
                            type="number"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => {
                                if (e.target.value.length <= 6) setOtp(e.target.value);
                            }}
                            onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className="verify-button"
                        disabled={isSubmitting || otp.length !== 6}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faCircleNotch} spin />
                                <span>Verifying...</span>
                            </>
                        ) : "Verify OTP"}
                    </button>
                </form>

                <div className="resend-section">
                    <p>Didn't receive the code?</p>
                    <button
                        onClick={handleResendOTP}
                        disabled={resendDisabled}
                        className={resendDisabled ? "resend-disabled" : ""}
                    >
                        {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;