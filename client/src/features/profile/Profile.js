import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../utils/api";
import { Country, State } from "country-state-city";
import { FiEdit, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EditProfileForm from "./EditProfileForm";
import HeroHeader from "../../components/common/HeroHeader";
import styles from "./Profile.module.css";

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);

  // Utility to format dob as "DD-MMM-YYYY"
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAPI.get(currentUser._id);
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  if (!userData) return <LoadingSpinner />;

  // Convert country and state codes to names
  const countryName =
    Country.getCountryByCode(userData.country)?.name || userData.country;
  const stateName =
    State.getStateByCodeAndCountry(userData.state, userData.country)?.name ||
    userData.state;
  const formattedDob = userData.dob ? formatDate(userData.dob) : "";

  return (
    <>
      <HeroHeader
        title="My Profile"
        subtitle="View and update your personal information here"
        backgroundImage="/assets/head/profile.jpg"
      />

      <div className={styles.profilePage}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            {/* <h1>My Profile</h1> */}
          </div>
          
          {!editing ? (
            <div className={styles.profileDisplay}>
              <div className={styles.profileImage}>
                {userData.profilePicture ? (
                  <img src={userData.profilePicture} alt="Profile" />
                ) : (
                  <div className={styles.profileAvatar}>
                    {userData.username?.[0]?.toUpperCase() || "A"}
                  </div>
                )}
                <button  
  className={styles.editImageButton}
  onClick={() => setEditing(true)}
>
  ✏️
</button>
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.profileInfoItem}>
                  <FiUser className={styles.profileInfoIcon} />
                  <span>{userData.fullName}</span>
                </div>
                <div className={styles.profileInfoItem}>
                  <FiMail className={styles.profileInfoIcon} />
                  <span>{userData.email}</span>
                </div>
                <div className={styles.profileInfoItem}>
                  <FiPhone className={styles.profileInfoIcon} />
                  <span>{userData.phone || 'Not provided'}</span>
                </div>
                <div className={styles.profileInfoItem}>
                  <FiMapPin className={styles.profileInfoIcon} />
                  <span>{countryName}, {stateName}</span>
                </div>
                <div className={styles.profileInfoItem}>
                  <FiMapPin className={styles.profileInfoIcon} />
                  <span>{userData.city} - {userData.pincode}</span>
                </div>
                <div className={styles.profileInfoItem}>
                  <FiCalendar className={styles.profileInfoIcon} />
                  <span>{formattedDob || 'Not provided'}</span>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  <FiEdit /> Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <EditProfileForm
              userData={userData}
              onUpdate={(updatedData) => {
                setUserData(updatedData);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
