import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css"; // For dashboard styles
// import styles from "./CouncilDisplayedit.module.css"
import { FaAngleDown } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";
import { FaUsers } from "react-icons/fa";

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
          {selectedCouncil ? "" : <div className={styles.placeholderCont}>
            <FaUsers className={styles.placholderIcon} />
            <p>Select a Council/Organization</p>
          </div>}
          {selectedCouncil && (
            <div className={styles.details}>
              <div className={styles.profileCont}>
                <div className={styles.profile}>
                  <a
                    href={selectedCouncil.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Click to visit page"
                  >
                    <img
                      src={selectedCouncil.adviserPIC}
                      alt="Adviser"
                      className={styles.adviserImage}
                    />
                  </a>
                  <a
                    href={selectedCouncil.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className={styles.councilSubheader}>
                      {selectedCouncil ? selectedCouncil.organization : ""}
                    </h3>
                  </a>
                  <a
                    href={selectedCouncil.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className={styles.councilSubheaderMobile}>
                      {selectedCouncil ? selectedCouncil.organization : ""}
                    </h3>
                  </a>

                </div>
                {selectedCouncil.organization === organization && (<div className={styles.iconCont}>
                  <FaPen className={styles.editIcon} onClick={openEditModal} />
                </div>)}
              </div>
              <div className={styles.membersCont}>
                <p>
                  <strong>Adviser:</strong> <span>{selectedCouncil.adviser}</span>
                </p>
                <p>
                  <strong>President:</strong> <span>{selectedCouncil.president}</span>
                </p>
                <p>
                  <strong>Vice President:</strong>{" "}
                  <span>{selectedCouncil.vicePresident}</span>
                </p>
                <p>
                  <strong>Secretary:</strong> <span>{selectedCouncil.secretary}</span>
                </p>
                <p>
                  <strong>Treasurer:</strong> <span>{selectedCouncil.treasurer}</span>
                </p>
                <p>
                  <strong>Auditor:</strong> <span>{selectedCouncil.auditor}</span>
                </p>
                <p>
                  <strong>PRO:</strong> <span>{selectedCouncil.pro}</span>
                </p>
                <p>
                  <strong>First Year Representative:</strong>{" "}
                  <span>{selectedCouncil.rep}</span>
                </p>
                <p>
                  <strong>Second Year Representative:</strong>{" "}
                  <span>{selectedCouncil.representative}</span>
                </p>
                <p>
                  <strong>Third Year Representative:</strong>{" "}
                  <span>{selectedCouncil.trdrepresentative}</span>
                </p>
                <p>
                  <strong>Fourth Year Representative:</strong>{" "}
                  <span>{selectedCouncil.frthrepresentative}</span>
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
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Check file type
                      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                      if (!allowedTypes.includes(file.type)) {
                        toast.error("Only JPG, JPEG, and PNG files are allowed!", { duration: 4000 });
                        e.target.value = ""; // Reset input
                        return;
                      }

                      // Check file size (max 10MB)
                      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                      if (file.size > maxSize) {
                        toast.error("File size must be less than 10MB!", { duration: 4000 });
                        e.target.value = ""; // Reset input
                        return;
                      }

                      // If all checks pass, update the state
                      setFormData({ ...formData, adviserPIC: file });
                    }
                  }}
                  className={styles.input}
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
