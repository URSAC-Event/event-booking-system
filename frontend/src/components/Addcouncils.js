import React, { useState } from "react";
import styles from "./Addcouncils.module.css"; // Import the styles if needed

const AddCouncils = ({ showAddCouncilForm, setShowAddCouncilForm }) => {
  const [councilFormData, setCouncilFormData] = useState({
    organization: "",
    adviser: "",
    adviserPicture: null, // Added adviser picture state
    president: "",
    vicePresident: "",
    secretary: "",
    treasurer: "",
    auditor: "",
    pro: "",
    rep: "",
    representative: "",
  });

  // Function to handle form submission and send data to the backend
  const handleAddCouncil = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Append form data for all fields
    Object.keys(councilFormData).forEach((key) => {
      if (key === 'adviserPicture' && councilFormData[key]) {
        formData.append(key, councilFormData[key]);
      } else {
        formData.append(key, councilFormData[key]);
      }
    });

    try {
      // Send POST request with form data to the backend
      const response = await fetch('http://localhost:5000/api/councils', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Council data saved successfully!');
        setShowAddCouncilForm(false); // Close the form after successful submission
      } else {
        alert('Error saving council data: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  return (
    // Only show the form if showAddCouncilForm is true
    showAddCouncilForm && (
      <div className={styles.modalWrapper}>
        <div className={styles.sectionBox}>
          <form onSubmit={handleAddCouncil} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Organization/Council:</label>
              <input
                type="text"
                value={councilFormData.organization}
                onChange={(e) => setCouncilFormData({ ...councilFormData, organization: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
  <label>Adviser:</label>
  <div className={styles.adviserGroup}>
    <input
      type="text"
      value={councilFormData.adviser}
      onChange={(e) => setCouncilFormData({ ...councilFormData, adviser: e.target.value })}
      className={styles.input}
      placeholder="Adviser Name"
    />
    <input
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      onChange={(e) =>
        setCouncilFormData({ ...councilFormData, adviserPicture: e.target.files[0] })
      }
      className={styles.fileInput} // Add styling for alignment
    />
  </div>
</div>

            <div className={styles.formGroup}>
              <label>President:</label>
              <input
                type="text"
                value={councilFormData.president}
                onChange={(e) => setCouncilFormData({ ...councilFormData, president: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vice-President:</label>
              <input
                type="text"
                value={councilFormData.vicePresident}
                onChange={(e) => setCouncilFormData({ ...councilFormData, vicePresident: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Secretary:</label>
              <input
                type="text"
                value={councilFormData.secretary}
                onChange={(e) => setCouncilFormData({ ...councilFormData, secretary: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Treasurer:</label>
              <input
                type="text"
                value={councilFormData.treasurer}
                onChange={(e) => setCouncilFormData({ ...councilFormData, treasurer: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Auditor:</label>
              <input
                type="text"
                value={councilFormData.auditor}
                onChange={(e) => setCouncilFormData({ ...councilFormData, auditor: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>P.R.O:</label>
              <input
                type="text"
                value={councilFormData.pro}
                onChange={(e) => setCouncilFormData({ ...councilFormData, pro: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Rep:</label>
              <select
                value={councilFormData.rep}
                onChange={(e) => setCouncilFormData({ ...councilFormData, rep: e.target.value })}
                className={styles.input}
              >
                <option value="">Select Representative</option>
                <option value="Rep1">Rep 1</option>
                <option value="Rep2">Rep 2</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Representative:</label>
              <input
                type="text"
                value={councilFormData.representative}
                onChange={(e) => setCouncilFormData({ ...councilFormData, representative: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>Submit</button>
              <button
                type="button"
                onClick={() => setShowAddCouncilForm(false)}
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

export default AddCouncils;
