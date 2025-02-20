import React, { useState } from "react";
import styles from "./UserEdit.module.css"; // Adjust the import based on your file structure

const UserEdit = ({ isOpen, closeModal, userData }) => {
  const [editedUser, setEditedUser] = useState({
    name: userData.name || "",
    username: userData.username || "",
    email: userData.email || "",
    password: userData.password || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement save functionality (e.g., call API to update user data)
    console.log("User data updated:", editedUser);
    closeModal(); // Close modal after save
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Edit User</h2>
        <button className={styles.closeButton} onClick={closeModal}>X</button>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editedUser.username}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
            />
          </div>

          {/* <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={editedUser.password}
              onChange={handleInputChange}
            />
          </div> */}

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
