import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import OTPVerification from "./OTPVerification"; // Ensure this component is implemented
import { FiUser, FiMail, FiLock, FiPhone, FiCalendar, FiGlobe, FiMapPin } from "react-icons/fi";
import styles from "./Register.module.css";  // Using CSS modules

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    gender: "Other",
    phone: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    dob: ""
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const { username, fullName, email, password, gender, phone, country, state, city, pincode, dob } = formData;

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({ ...formData, country: selectedCountry, state: "", city: "" });
    const allStates = State.getStatesOfCountry(selectedCountry);
    setStates(allStates);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, city: "" });
    const allCities = City.getCitiesOfState(formData.country, selectedState);
    setCities(allCities);
  };

  const handleCityChange = (e) => {
    setFormData({ ...formData, city: e.target.value });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name !== "country" && name !== "state" && name !== "city") {
      setFormData({ ...formData, [name]: value });
    }
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!fullName) errors.fullName = "Full name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!country) errors.country = "Country is required";
    if (!state) errors.state = "State is required";
    if (!city) errors.city = "City is required";
    if (!pincode) errors.pincode = "Pincode is required";
    return errors;
  };

  // Send OTP endpoint
  const sendOtp = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`https://hackathon-backend-6c9z.onrender.com/api/users/send-otp`, { email: formData.email });
      setOtpSent(true);
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Error sending OTP" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      {!otpSent ? (
        <div className={styles.registerForm}>
          {/* Header: Copied from Login with animation */}
          <div className={styles.authModuleHeader}>
            <h1 className={styles.authModuleBrand}>
              <span className={styles.authModuleLogo}>🛍</span>
              <span style={{ color: "#7AC752" }}>MarketMitra</span>
            </h1>
            <p className={styles.authModuleTagline}>Cultivating Digital Farm Communities</p>
          </div>
          {errors.form && <p className={styles.error}>{errors.form}</p>}
          <form onSubmit={sendOtp}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                  />
                </div>
                {errors.username && <p className={styles.error}>{errors.username}</p>}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={fullName}
                    onChange={onChange}
                    required
                  />
                </div>
                {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                {errors.password && <p className={styles.error}>{errors.password}</p>}
              </div>
              <div className={styles.formGroup}>
                <select name="gender" value={gender} onChange={onChange} required>
                  <option value="Other">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiCalendar className={styles.inputIcon} />
                  <input type="date" name="dob" value={dob} onChange={onChange} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiPhone className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiGlobe className={styles.inputIcon} />
                  <select name="country" value={country} onChange={handleCountryChange} required>
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && <p className={styles.error}>{errors.country}</p>}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiMapPin className={styles.inputIcon} />
                  <select name="state" value={state} onChange={handleStateChange} required>
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.state && <p className={styles.error}>{errors.state}</p>}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiMapPin className={styles.inputIcon} />
                  <select name="city" value={city} onChange={handleCityChange} required>
                    <option value="">Select City</option>
                    {cities.map((ct) => (
                      <option key={ct.name} value={ct.name}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.city && <p className={styles.error}>{errors.city}</p>}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <FiMapPin className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Pincode"
                    name="pincode"
                    value={pincode}
                    onChange={onChange}
                    required
                  />
                </div>
                {errors.pincode && <p className={styles.error}>{errors.pincode}</p>}
              </div>
              <div className={`${styles.formGroup} ${styles.passwordGroup} ${styles.fullWidth}`}>
                <div className={styles.passwordStrength}>
                  <div
                    className={styles.strengthBar}
                    style={{ width: `${passwordStrength * 20}%` }}
                  ></div>
                </div>
                <p className={styles.passwordStrengthText}>
                  Password Strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][passwordStrength]}
                </p>
              </div>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isSubmitting}>
                {isSubmitting ? "Sending OTP..." : "Register"}
              </button>
            </div>
          </form>
          <Link to="/login" className={styles.link}>
            Already have an account? Log in
          </Link>
        </div>
      ) : (
        <OTPVerification email={formData.email} formData={formData} navigate={navigate} />
      )}
    </div>
  );
};

export default Register;