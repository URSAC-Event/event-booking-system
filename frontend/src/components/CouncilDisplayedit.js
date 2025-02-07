import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css"; // For dashboard styles
// import styles from "./CouncilDisplayedit.module.css"
import { FaAngleDown } from "react-icons/fa";
import { FaPen } from "react-icons/fa";


const CouncilDisplayedit = () => {
  const [councilsAndOrganizations, setCouncilsAndOrganizations] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch all councils data on component mount
  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/councils");
        setCouncilsAndOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching councils:", error);
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
      const response = await axios.put(
        `http://localhost:5000/api/councilsedit/${formData.id}`,
        formData
      ); // formData shouldn't include 'created_at'
      if (response.status === 200) {
        alert("Council details updated successfully!");
        setIsEditModalOpen(false);
      } else {
        alert("Failed to update council details.");
      }
    } catch (error) {
      console.error("Error updating council:", error);
      alert("An error occurred while updating council details.");
    }
  };

  return (
    <div className={styles.leftSection}>
      <h2 className={styles.councilMainHeader}>Councils and Organization List</h2>

      <div className={styles.sidebarContainer}>
        <div className={styles.sidebar}>
          {councilsAndOrganizations.map((item) => (
            <button
              key={item.organization}
              onClick={() => setSelectedCouncil(item)}
              className={`${styles.sidebarButton} ${selectedCouncil?.organization === item.organization
                ? styles.selected
                : ""
                }`}
            >
              {item.organization}
            </button>
          ))}
        </div>

        <div className={styles.mobileDropdownCont}>
          <select
            id="council"
            value={selectedCouncil?.organization || ""}
            onChange={(e) => {
              const selected = councilsAndOrganizations.find(
                (org) => org.organization === e.target.value
              );
              setSelectedCouncil(selected);
            }}
            className={styles.mobileDropdown}
          >
            <option value="" disabled>
              Select a Council
            </option>
            {councilsAndOrganizations.map((item) => (
              <option key={item.organization} value={item.organization}>
                {item.organization}
              </option>
            ))}
          </select>
          <FaAngleDown className={styles.downIcon} />
        </div>

        <div className={styles.sidebarContent}>
          <h3 className={styles.councilSubheader}>
            {selectedCouncil
              ? ""
              : "Select a Council/Organization"}
          </h3>
          {selectedCouncil && (
            <div className={styles.details}>
              <div className={styles.profileCont}>
                <div className={styles.profile}>
                  <a
                    href={selectedCouncil.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`http://localhost:5000/adviserpic/${selectedCouncil.adviserPIC}`}
                      alt="Adviser"
                      className={styles.adviserImage}
                    />
                  </a>
                  <h3 className={styles.councilSubheader}>
                    {selectedCouncil
                      ? selectedCouncil.organization
                      : ""}
                  </h3>
                  <h3 className={styles.councilSubheaderMobile}>
                    {selectedCouncil ? selectedCouncil.organization : ""}
                  </h3>

                </div>
                <div className={styles.iconCont}>
                  <FaPen className={styles.editIcon} onClick={openEditModal} />
                </div>
              </div>
              <div className={styles.membersCont}>
                <p>
                  <strong>Adviser:</strong> {selectedCouncil.adviser}
                </p>
                <p>
                  <strong>President:</strong> {selectedCouncil.president}
                </p>
                <p>
                  <strong>Vice President:</strong> {selectedCouncil.vicePresident}
                </p>
                <p>
                  <strong>Secretary:</strong> {selectedCouncil.secretary}
                </p>
                <p>
                  <strong>Treasurer:</strong> {selectedCouncil.treasurer}
                </p>
                <p>
                  <strong>Auditor:</strong> {selectedCouncil.auditor}
                </p>
                <p>
                  <strong>PRO:</strong> {selectedCouncil.pro}
                </p>
                <p>
                  <strong>First Year Representative:</strong>{" "}
                  {selectedCouncil.rep}
                </p>
                <p>
                  <strong>Second Year Representative (Alternate):</strong>{" "}
                  {selectedCouncil.representative}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedCouncil && (
        <div className={styles.modalWrapper}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalHeader}>Edit Council Details</h3>
            <form onSubmit={handleEditCouncil} className={styles.form}>
              {Object.keys(formData).map(
                (field) =>
                  field !== "id" && ( // We already removed 'createdAt' in the previous step
                    <div key={field} className={styles.formGroup}>
                      <label>{field.replace(/([A-Z])/g, " $1")}:</label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                  )
              )}

              <div className={styles.formButtons}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>

                <button type="submit" className={styles.submitButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilDisplayedit;
