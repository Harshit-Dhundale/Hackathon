import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiCamera, FiX } from 'react-icons/fi';
import { Country, State, City } from 'country-state-city';
import { userAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './EditProfileForm.module.css';

const EditProfileForm = ({ userData, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: userData.fullName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    gender: userData.gender || 'Other',
    country: userData.country || '',
    state: userData.state || '',
    city: userData.city || '',
    pincode: userData.pincode || '',
    dob: userData.dob ? userData.dob.split('T')[0] : '',
    profilePicture: null,
  });

  const [preview, setPreview] = useState(userData.profilePicture || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      const newStates = State.getStatesOfCountry(formData.country);
      setStates(newStates);
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      const newCities = City.getCitiesOfState(formData.country, formData.state);
      setCities(newCities);
    }
  }, [formData.country, formData.state]);

  const handleCountryChange = (e) => {
    setFormData(prev => ({ ...prev, country: e.target.value, state: '', city: '' }));
  };

  const handleStateChange = (e) => {
    setFormData(prev => ({ ...prev, state: e.target.value, city: '' }));
  };

  const handleCityChange = (e) => {
    setFormData(prev => ({ ...prev, city: e.target.value }));
  };

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({ ...prev, profilePicture: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const removeProfilePicture = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }));
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors('');

    try {
      let updateData;
      if (formData.profilePicture) {
        updateData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          updateData.append(key, value);
        });
      } else {
        updateData = { ...formData };
      }

      const res = await userAPI.update(userData._id, updateData);
      onUpdate(res.data);
    } catch (err) {
      setErrors(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      {preview && (
        <div className={styles.profilePreview}>
          <img src={preview} alt="Profile Preview" />
          <button type="button" onClick={removeProfilePicture} className={styles.removeBtn}>
            <FiX /> Remove Profile Picture
          </button>
        </div>
      )}

      <div className={styles.formSection}>
        <h3>Basic Information</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FiUser className={styles.formIcon} />
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            className={styles.inputField}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FiMail className={styles.formIcon} />
            Email
          </label>
          <input
            type="email"
            name="email"
            className={styles.inputField}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FiPhone className={styles.formIcon} />
            Phone
          </label>
          <input
            type="text"
            name="phone"
            className={styles.inputField}
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Gender
          </label>
          <select name="gender" className={styles.inputField} value={formData.gender} onChange={handleChange} required>
            <option value="Other">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Location Information</h3>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Country
          </label>
          <select name="country" className={styles.inputField} value={formData.country} onChange={handleCountryChange} required>
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            State
          </label>
          <select name="state" className={styles.inputField} value={formData.state} onChange={handleStateChange} required>
            <option value="">Select State</option>
            {states.length > 0 ? states.map(s => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            )) : <option disabled>No states available</option>}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            City
          </label>
          <select name="city" className={styles.inputField} value={formData.city} onChange={handleCityChange} required>
            <option value="">Select City</option>
            {cities.length > 0 ? cities.map(ct => (
              <option key={ct.name} value={ct.name}>{ct.name}</option>
            )) : <option disabled>No cities available</option>}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          <FiCalendar className={styles.formIcon} />
          Date of Birth
        </label>
        <input type="date" name="dob" className={styles.inputField} value={formData.dob} onChange={handleChange} required />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          <FiCamera className={styles.formIcon} />
          Profile Picture
        </label>
        <input type="file" name="profilePicture" className={styles.inputField} accept="image/*" onChange={handleChange} />
      </div>

      {errors && <p className={styles.errorMessage}>{errors}</p>}

      <div className={styles.formActions}>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner /> : 'Save Changes'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <FiX /> Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
