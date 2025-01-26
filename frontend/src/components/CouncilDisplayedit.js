import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css'; // For dashboard styles

const CouncilDisplay = () => {
  const [councilsAndOrganizations, setCouncilsAndOrganizations] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch all councils data on component mount
  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/councils');
        setCouncilsAndOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching councils:', error);
      }
    };

    fetchCouncils();
  }, []);

  // Open edit modal and populate form with selected council data
  const openEditModal = () => {
    if (selectedCouncil) {
      // Remove 'createdAt' from selected council data
      const { createdAt, ...filteredData } = selectedCouncil;
      setFormData(filteredData); // Set formData without 'createdAt'
      setIsEditModalOpen(true); // Open the modal
    }
  };

  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for editing
  const handleEditCouncil = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(`http://localhost:5000/api/councilsedit/${formData.id}`, formData); // formData shouldn't include 'created_at'
      if (response.status === 200) {
        alert('Council details updated successfully!');
        setIsEditModalOpen(false);
      } else {
        alert('Failed to update council details.');
      }
    } catch (error) {
      console.error('Error updating council:', error);
      alert('An error occurred while updating council details.');
    }
  };
  

  return (
    <div className={styles.leftSection}>
      <h2 className={styles.header}>Councils and Organization List</h2>

      <div className={styles.sidebarContainer}>
        <div className={styles.sidebar}>
          {councilsAndOrganizations.map((item) => (
            <button
              key={item.organization}
              onClick={() => setSelectedCouncil(item)}
              className={`${styles.sidebarButton} ${selectedCouncil?.organization === item.organization ? styles.selected : ''}`}
            >
              {item.organization}
            </button>
          ))}
        </div>

        <div className={styles.sidebarContent}>
          <h3>{selectedCouncil ? selectedCouncil.organization : 'Select a Council/Organization'}</h3>

          {selectedCouncil && (
            <div className={styles.details}>
              <button className={styles.editButton} onClick={openEditModal}>Edit</button>
              <table>
                <tbody>
                  {Object.entries(selectedCouncil).map(([key, value]) => (
                    key !== 'id' && ( // Skip ID field from display
                      <tr key={key}>
                        <td><strong>{key.replace(/([A-Z])/g, ' $1')}:</strong></td>
                        <td>{value}</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modalWrapper}>
          <div className={styles.modalContent}>
            <h3>Edit Council Details</h3>
            <form onSubmit={handleEditCouncil} className={styles.form}>
           
            {Object.keys(formData).map((field) => (
  field !== 'id' && ( // We already removed 'createdAt' in the previous step
    <div key={field} className={styles.formGroup}>
      <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
      <input
        type="text"
        name={field}
        value={formData[field]}
        onChange={handleInputChange}
        className={styles.input}
      />
    </div>
  )
))}

              <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>Save</button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilDisplay;
