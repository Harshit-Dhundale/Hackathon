import React, { useState } from 'react';
import Slider from "react-slick";
import StoreCard from './StoreCard';
import StoreModal from './StoreModal';
import { storeAPI } from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import styles from './StoreList.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StoreList = ({ stores, setStores, userId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const handleEdit = (store) => {
    setSelectedStore(store);
    setModalOpen(true);
  };

  const handleDeleteStore = async (storeId) => {
    try {
      await storeAPI.delete(storeId);
      setStores(stores.filter(store => store._id !== storeId));
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: stores.length > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: true,
    centerPadding: "0"
  };

  return (
    <div className={styles.storeList}>
      <h2>
        <FontAwesomeIcon icon={faStore} className={styles.storeListIcon} /> My Stores
      </h2>
      {stores.length > 0 ? (
        <Slider {...settings}>
          {stores.map(store => (
            <div key={store._id} className={styles.storeSliderItem}>
              <StoreCard
                storeData={store}
                onUpdate={(data) => {
                  const updatedStores = stores.map(s => 
                    s._id === data._id ? data : s
                  );
                  setStores(updatedStores);
                }}
                onDelete={handleDeleteStore}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p>You haven't added any stores yet.</p>
      )}

      <button 
        className={`${styles.btn} ${styles.addStoreButton}`}
        onClick={() => {
          setSelectedStore(null);
          setModalOpen(true);
        }}
      >
        Add New Store
      </button>

      <StoreModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        storeData={selectedStore}
        onSubmit={(newStore) => {
          if (selectedStore) {
            setStores(stores.map(s => s._id === newStore._id ? newStore : s));
          } else {
            setStores([...stores, newStore]);
          }
        }}
        userId={userId}
      />
    </div>
  );
};

export default StoreList;