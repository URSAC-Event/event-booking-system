import React, { useState } from "react";
import EditCouncilModal from "./EditCouncilModal";
import Addcouncils from "./Addcouncils";
import styles from "./Admin.module.css";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";



const CouncilsAndOrganizations = ({ councils, setCouncils, showAddCouncilForm, setShowAddCouncilForm, handleAddCouncil }) => {
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this council?")) return;

    try {
      const response = await fetch(`http://localhost:5000/delete-council/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCouncils(councils.filter((council) => council.id !== id));
      } else {
        console.error("Failed to delete council");
      }
    } catch (error) {
      console.error("Error deleting council:", error);
    }
  };

  const handleEdit = (council) => {
    setSelectedCouncil(council);
    setShowEditModal(true);
  };

  const handleUpdateCouncil = async (updatedCouncilData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/update-council/${selectedCouncil.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedCouncilData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setCouncils((prevCouncils) =>
          prevCouncils.map((council) =>
            council.id === selectedCouncil.id ? { ...council, ...updatedCouncilData } : council
          )
        );
        setShowEditModal(false);
      } else {
        console.error("Failed to update council");
      }
    } catch (error) {
      console.error("Error updating council:", error);
    }
  };

  // Filter councils based on search input
  const filteredCouncils = councils.filter((council) =>
    Object.values(council).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className={styles.councilsCont}>
      <h2>Councils and Organizations</h2>
      <p>View, add, edit, search, and delete councils and organizations.</p>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search councils..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
        <button className={styles.addCouncilButton} onClick={() => setShowAddCouncilForm(true)}>
          <FaPlus /><span>Add New Council / Organization </span>
        </button>
      </div>

      <div className={styles.sectionBox}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableCell}>Organization</th>
              <th className={styles.tableCell}>Adviser</th>
              <th className={styles.tableCell}>President</th>
              <th className={styles.tableCell}>Vice President</th>
              <th className={styles.tableCell}>Secretary</th>
              <th className={styles.tableCell}>Treasurer</th>
              <th className={styles.tableCell}>Auditor</th>
              <th className={styles.tableCell}>P.R.O</th>
              <th className={styles.tableCell}>1st Year Representative</th>
              <th className={styles.tableCell}>2nd Year Representative</th>
              <th className={styles.tableCell}>3rd Year Representative</th>
              <th className={styles.tableCell}>4th Year Representative</th>
              <th className={styles.tableCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCouncils.length > 0 ? (
              filteredCouncils.map((council) => (
                <tr key={council.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{council.organization}</td>
                  <td className={styles.tableCell}>{council.adviser}</td>
                  <td className={styles.tableCell}>{council.president}</td>
                  <td className={styles.tableCell}>{council.vicePresident}</td>
                  <td className={styles.tableCell}>{council.secretary}</td>
                  <td className={styles.tableCell}>{council.treasurer}</td>
                  <td className={styles.tableCell}>{council.auditor}</td>
                  <td className={styles.tableCell}>{council.pro}</td>
                  <td className={styles.tableCell}>{council.representative}</td>
                  <td className={styles.tableCell}>{council.rep}</td>
                  <td className={styles.tableCell}>{council.trdrepresentative}</td>
                  <td className={styles.tableCell}>{council.frthrepresentative}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actions}>
                      <button className={styles.editButton} onClick={() => handleEdit(council)}>
                        <FaPen className={styles.pen} />
                      </button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(council.id)}>
                        <FaTrash className={styles.trash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className={styles.noEvents}>No council available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditCouncilModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        selectedCouncil={selectedCouncil}
        handleUpdateCouncil={handleUpdateCouncil}
      />

      <Addcouncils
        showAddCouncilForm={showAddCouncilForm}
        setShowAddCouncilForm={setShowAddCouncilForm}
        handleAddCouncil={handleAddCouncil}
      />
    </div>
  );
};

export default CouncilsAndOrganizations;
