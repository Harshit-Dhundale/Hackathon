import React, { useState } from 'react';
import { storeAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiHome, FiMapPin, FiMaximize, FiPackage, FiBookmark, FiInfo } from 'react-icons/fi';
import styles from './StoreDetailsForm.module.css';

const StoreDetailsForm = ({ storeData, onUpdate, userId }) => {
  const [formData, setFormData] = useState({
    name: storeData?.name || '',
    location: storeData?.location || '',
    size: storeData?.size || '',
    products: storeData?.products ? storeData.products.join(', ') : '',
    storeType: storeData?.storeType || '',
    description: storeData?.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const availableStoreTypes = ["Retail", "Warehouse", "Boutique"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const updatedData = {
        ...formData,
        products: formData.products.split(',').map((product) => product.trim()),
      };

      let response;
      if (storeData && storeData._id) {
        response = await storeAPI.update(storeData._id, updatedData);
      } else {
        response = await storeAPI.create({ ...updatedData, createdBy: userId });
      }

      onUpdate(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.storeDetailsForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>
            <FiHome /> Store Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiMapPin /> Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiMaximize /> Area (sq ft)
          </label>
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiPackage /> Products
          </label>
          <input
            type="text"
            name="products"
            value={formData.products}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiBookmark /> Store Type
          </label>
          <select
            name="storeType"
            value={formData.storeType}
            onChange={handleChange}
            required
          >
            <option value="">Select Store Type</option>
            {availableStoreTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>
            <FiInfo /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? (
            <LoadingSpinner />
          ) : storeData && storeData._id ? (
            'Update Store Details'
          ) : (
            'Create Store Details'
          )}
        </button>
      </form>
    </div>
  );
};

export default StoreDetailsForm;