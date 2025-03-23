import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import StoreDetailsForm from './StoreDetailsForm';
import styles from './StoreModal.module.css';

const modalRoot = document.getElementById('modal-root');

const StoreModal = ({ isOpen, onClose, storeData, onSubmit, userId }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{storeData ? 'Edit Store' : 'New Store'}</h2>
          <button className={styles.closeButton} onClick={onClose}></button>
        </div>
        <div className={styles.modalBody}>
          <StoreDetailsForm
            storeData={storeData}
            onUpdate={(data) => {
              onSubmit(data);
              onClose();
            }}
            userId={userId}
          />
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default StoreModal;