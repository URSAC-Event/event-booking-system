import React, { useState, useEffect } from "react";
import styles from "./EditCouncilModal.module.css"; // Import styles for the modal

const EditCouncilModal = ({ showModal, setShowModal, selectedCouncil, handleUpdateCouncil }) => {
  const [editCouncilData, setEditCouncilData] = useState({
    organization: "",
    adviser: "",
    link: "",
    president: "",
    vicePresident: "",
    secretary: "",
    treasurer: "",
    auditor: "",
    pro: "",
    rep: "",
    representative: "",
    trdrepresentative: "",
    frthrepresentative: "",
  });

  useEffect(() => {
    if (selectedCouncil) {
      setEditCouncilData({ ...selectedCouncil });
    }
  }, [selectedCouncil]);

  const handleChange = (e) => {
    setEditCouncilData({ ...editCouncilData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleUpdateCouncil(editCouncilData);
      setShowModal(false); // Close modal after successful submission
    } catch (error) {
      console.error("Error updating council:", error);
    }
  };

  return (
    showModal && (
      <div className={styles.modalWrapper}>
        <div className={styles.modalContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Edit Council</h2>
            <div className={styles.formGroup}>
              <label>Organization:</label>
              <input
                type="text"
                name="organization"
                value={editCouncilData.organization}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Adviser:</label>
              <input
                type="text"
                name="adviser"
                value={editCouncilData.adviser}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Link:</label>
              <input
                type="text"
                name="link"
                value={editCouncilData.link}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>President:</label>
              <input
                type="text"
                name="president"
                value={editCouncilData.president}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vice-President:</label>
              <input
                type="text"
                name="vicePresident"
                value={editCouncilData.vicePresident}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Secretary:</label>
              <input
                type="text"
                name="secretary"
                value={editCouncilData.secretary}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Treasurer:</label>
              <input
                type="text"
                name="treasurer"
                value={editCouncilData.treasurer}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Auditor:</label>
              <input
                type="text"
                name="auditor"
                value={editCouncilData.auditor}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>P.R.O:</label>
              <input
                type="text"
                name="pro"
                value={editCouncilData.pro}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>First year representative:</label>
              <input
                type="text"
                name="rep"
                value={editCouncilData.rep}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Second year representative:</label>
              <input
                type="text"
                name="representative"
                value={editCouncilData.representative}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Third year representative:</label>
              <input
                type="text"
                name="trdrepresentative"
                value={editCouncilData.trdrepresentative}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Fourth year representative:</label>
              <input
                type="text"
                name="frthrepresentative"
                value={editCouncilData.frthrepresentative}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>Save</button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditCouncilModal;
