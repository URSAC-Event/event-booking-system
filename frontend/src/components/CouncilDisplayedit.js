import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css"; // For dashboard styles
// import styles from "./CouncilDisplayedit.module.css"
import { FaAngleDown } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";

const CouncilDisplayedit = () => {
  const [councilsAndOrganizations, setCouncilsAndOrganizations] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [organization, setOrganization] = useState('');
  const [refresh, setRefresh] = useState(false); // Add a refresh state

  useEffect(() => {
    const storedOrganization = localStorage.getItem('userOrganization');
    if (storedOrganization) {
      setOrganization(storedOrganization);
    }

    const fetchCouncils = async () => {
      try {
        const response = await axios.get('https://event-booking-system-ckik.onrender.com/api/councils');
        setCouncilsAndOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching councils:', error);
      }
    };

    fetchCouncils();
  }, [refresh]); // Add refresh state as dependency

  // Call this function after a successful edit
  const handleEditSuccess = () => {
    setRefresh(prev => !prev); // Toggle refresh to trigger useEffect
  };


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

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.put(
        `https://event-booking-system-ckik.onrender.com/api/councilsedit/${formData.id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setCouncilsAndOrganizations((prevCouncils) =>
          prevCouncils.map((council) =>
            council.id === formData.id ? { ...council, ...formData } : council
          )
        );

        setSelectedCouncil((prevCouncil) =>
          prevCouncil && prevCouncil.id === formData.id ? { ...prevCouncil, ...formData } : prevCouncil
        );

        toast.success("Council details updated successfully!", { duration: 4000 });
        setIsEditModalOpen(false);
        handleEditSuccess();
      } else {
        toast.error("Failed to update council details.", { duration: 4000 });
      }
    } catch (error) {
      console.error("Error updating council:", error);
      toast.error("An error occurred while updating council details.", { duration: 4000 });
    }
  };



  return (
    <div className={styles.leftSection}>
      <h2 className={styles.councilMainHeader}>
        Councils and Organization List
      </h2>

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
            {selectedCouncil ? "" : "Select a Council/Organization"}
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
                      src={selectedCouncil.adviserPIC}
                      alt="Adviser"
                      className={styles.adviserImage}
                    />
                  </a>
                  <h3 className={styles.councilSubheader}>
                    {selectedCouncil ? selectedCouncil.organization : ""}
                  </h3>
                  <h3 className={styles.councilSubheaderMobile}>
                    {selectedCouncil ? selectedCouncil.organization : ""}
                  </h3>
                </div>
                {selectedCouncil.organization === organization && (<div className={styles.iconCont}>
                  <FaPen className={styles.editIcon} onClick={openEditModal} />
                </div>)}
              </div>
              <div className={styles.membersCont}>
                <p>
                  <strong>Adviser:</strong> {selectedCouncil.adviser}
                </p>
                <p>
                  <strong>President:</strong> {selectedCouncil.president}
                </p>
                <p>
                  <strong>Vice President:</strong>{" "}
                  {selectedCouncil.vicePresident}
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
                  <strong>Second Year Representative:</strong>{" "}
                  {selectedCouncil.representative}
                </p>
                <p>
                  <strong>Third Year Representative:</strong>{" "}
                  {selectedCouncil.trdrepresentative}
                </p>
                <p>
                  <strong>Fourth Year Representative:</strong>{" "}
                  {selectedCouncil.frthrepresentative}
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

              {/* Logo */}
              <div className={styles.formGroup1}>
                <label>Logo:</label>
                <input
                  type="file"
                  name="adviserPIC"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, adviserPIC: e.target.files[0] })}
                  className={styles.input}
                />
              </div>

              {/* Adviser */}
              <div className={styles.formGroup1}>
                <label>Adviser:</label>
                <input
                  type="text"
                  name="adviser"
                  value={formData.adviser || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* President */}
              <div className={styles.formGroup1}>
                <label>President:</label>
                <input
                  type="text"
                  name="president"
                  value={formData.president || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Vice President */}
              <div className={styles.formGroup1}>
                <label>Vice President:</label>
                <input
                  type="text"
                  name="vicePresident"
                  value={formData.vicePresident || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Secretary */}
              <div className={styles.formGroup1}>
                <label>Secretary:</label>
                <input
                  type="text"
                  name="secretary"
                  value={formData.secretary || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Treasurer */}
              <div className={styles.formGroup1}>
                <label>Treasurer:</label>
                <input
                  type="text"
                  name="treasurer"
                  value={formData.treasurer || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Auditor */}
              <div className={styles.formGroup1}>
                <label>Auditor:</label>
                <input
                  type="text"
                  name="auditor"
                  value={formData.auditor || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* PRO */}
              <div className={styles.formGroup1}>
                <label>Public Relations Officer (PRO):</label>
                <input
                  type="text"
                  name="pro"
                  value={formData.pro || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Representatives */}
              <div className={styles.formGroup1}>
                <label>First Year Representative:</label>
                <input
                  type="text"
                  name="rep"
                  value={formData.rep || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup1}>
                <label>Second Year Representative:</label>
                <input
                  type="text"
                  name="representative"
                  value={formData.representative || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup1}>
                <label>Third Year Representative:</label>
                <input
                  type="text"
                  name="trdrepresentative"
                  value={formData.trdrepresentative || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup1}>
                <label>Fourth Year Representative:</label>
                <input
                  type="text"
                  name="frthrepresentative"
                  value={formData.frthrepresentative || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Buttons */}
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
