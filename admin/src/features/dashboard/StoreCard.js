import React from 'react';
import { FiEdit, FiTrash, FiMapPin, FiPackage, FiLayout, FiInfo, FiHome } from 'react-icons/fi';
import styles from './StoreCard.module.css';

const StoreCard = ({ storeData, onUpdate, onDelete, onEdit }) => {
  return (
    <div className={styles.storeCard}>
      <div className={styles.storeHeader}>
        <FiHome className={styles.storeIcon} />
        <h3>{storeData.name || "Unnamed Store"}</h3>
        <span className={`${styles.storeType} ${styles[storeData.storeType.toLowerCase()]}`}>
          {storeData.storeType}
        </span>
      </div>
      
      <div className={styles.storeDetailsGrid}>
        <div className={styles.detailItem}>
          <FiMapPin />
          <div>
            <label>Location</label>
            <p>{storeData.location}</p>
          </div>
        </div>
        
        <div className={styles.detailItem}>
          <FiLayout />
          <div>
            <label>Area</label>
            <p>{storeData.size} sq ft</p>
          </div>
        </div>

        <div className={styles.detailItem}>
          <FiPackage />
          <div>
            <label>Products</label>
            <div className={styles.productsList}>
              {storeData.products.map((product, index) => (
                <span key={index} className={styles.productTag}>{product}</span>
              ))}
            </div>
          </div>
        </div>

        {storeData.description && (
          <div className={styles.detailItem}>
            <FiInfo />
            <div>
              <label>Description</label>
              <p className={styles.storeDescription}>{storeData.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.storeActions}>
        <button onClick={() => onEdit(storeData)} className={styles.btnEdit}>
          <FiEdit /> Edit
        </button>
        <button onClick={() => onDelete(storeData._id)} className={styles.btnDelete}>
          <FiTrash /> Delete
        </button>
      </div>
    </div>
  );
};

export default StoreCard;