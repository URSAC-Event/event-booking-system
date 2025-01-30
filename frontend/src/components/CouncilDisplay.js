import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css"; // Adjust path as needed

const CouncilDisplay = () => {
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [councilsAndOrganizations, setCouncilsAndOrganizations] = useState([]);

  // Fetch all councils data on component mount
  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/councilsdisplay"
        );
        setCouncilsAndOrganizations(response.data); // Set all the councils data
      } catch (error) {
        console.error("Error fetching councils:", error);
      }
    };

    fetchCouncils();
  }, []); // Empty dependency array means this will run once on component mount

  // Handler for selecting a council
  const handleCouncilSelect = (organization) => {
    // Find the selected council's full details from the array
    const selected = councilsAndOrganizations.find(
      (council) => council.organization === organization
    );
    setSelectedCouncil(selected);
  };

  return (
    <div className={styles.leftSection}>
      <h2 className={styles.councilHeader}>Councils and Organization List</h2>

      <div className={styles.sidebarContainer}>
        <div className={styles.sidebar}>
          {/* Buttons for Councils and Organizations */}
          {councilsAndOrganizations.map((item) => (
            <button
              key={item.organization}
              onClick={() => handleCouncilSelect(item.organization)}
              className={`${styles.sidebarButton} ${
                selectedCouncil?.organization === item.organization
                  ? styles.selected
                  : ""
              }`}
            >
              {item.organization}
            </button>
          ))}
        </div>

        <div className={styles.sidebarContent}>
          {/* Display dynamic content based on selected council/organization */}
          {selectedCouncil && (
            <div className={styles.details}>
              <div className={styles.head}>
                {selectedCouncil.adviserPIC ? (
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
                ) : (
                  "No Image Available"
                )}
                <h3 className={styles.CouncilTitle}>
                  {selectedCouncil
                    ? selectedCouncil.organization
                    : "Select a Council/Organization"}
                </h3>
              </div>

              <table>
                <tbody> 
                  <tr>
                    <td>
                      <strong>Adviser:</strong>
                    </td>
                    <td>{selectedCouncil.adviser}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>President:</strong>
                    </td>
                    <td>{selectedCouncil.president}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Vice President:</strong>
                    </td>
                    <td>{selectedCouncil.vicePresident}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Secretary:</strong>
                    </td>
                    <td>{selectedCouncil.secretary}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Treasurer:</strong>
                    </td>
                    <td>{selectedCouncil.treasurer}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Auditor:</strong>
                    </td>
                    <td>{selectedCouncil.auditor}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>PRO:</strong>
                    </td>
                    <td>{selectedCouncil.pro}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Representative:</strong>
                    </td>
                    <td>{selectedCouncil.rep}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Representative (Alternate):</strong>
                    </td>
                    <td>{selectedCouncil.representative}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* New section for upcoming events */}
          <div className={styles.rightSection}>
            <h3>Upcoming Events</h3>
            <p>This is for upcoming events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilDisplay;
