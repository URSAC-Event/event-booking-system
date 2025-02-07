import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css"; // Adjust path as needed

const CouncilDisplay = () => {
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [approvedData, setApprovedData] = useState(null);
  const [councilsAndOrganizations, setCouncilsAndOrganizations] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0); // State to track the current event

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

  // Fetch approved data when a council is selected
  useEffect(() => {
    const fetchApprovedData = async () => {
      if (selectedCouncil) {
        try {
          const orgString = String(selectedCouncil.organization);
          const response = await axios.get('http://localhost:5000/api/getApprovedData', {
            params: { organization: orgString },
          });

          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            // Filter out events with past dates
            const filteredEvents = response.data.filter(event => {
              const eventDate = new Date(event.date);
              const currentDate = new Date();
              return eventDate >= currentDate; // Only keep events that are today or in the future
            });

            setApprovedData(filteredEvents); // Set filtered approved data
          } else {
            setApprovedData(null); // Set to null if no valid event data is found
          }
        } catch (error) {
          console.error("Error fetching approved data:", error);
          setApprovedData(null); // Set to null if there's an error fetching data
        }
      }
    };

    fetchApprovedData();
  }, [selectedCouncil]);

  // Handler for selecting a council
  const handleCouncilSelect = (organization) => {
    const selected = councilsAndOrganizations.find(council => council.organization === organization);
    setSelectedCouncil(selected);
  };

  // Format date to remove the time part
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  };

  // Go to next event
  const nextEvent = () => {
    if (approvedData && currentEventIndex < approvedData.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  // Go to previous event
  const previousEvent = () => {
    if (approvedData && currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
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
              onClick={() => handleCouncilSelect(item.organization)}
              className={`${styles.sidebarButton} ${
                selectedCouncil?.organization === item.organization ? styles.selected : ''
              }`}
            >
              {item.organization}
            </button>
          ))}
        </div>

        <div className={styles.sidebarContent}>
          <h3>{selectedCouncil ? selectedCouncil.organization : 'Select a Council/Organization'}</h3>

          {selectedCouncil && (
            <div className={styles.details}>
              <table>
              <tbody>
                <tr>
              
              <td>
                <a href={selectedCouncil.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`http://localhost:5000/adviserpic/${selectedCouncil.adviserPIC}`}
                    alt="Adviser"
                    className={styles.adviserImage}
                  />
                </a>
              </td>
            </tr>
                  <tr>
                    <td><strong>Adviser:</strong></td>
                    <td>{selectedCouncil.adviser}</td>
                  </tr>
                  <tr>
                    <td><strong>President:</strong></td>
                    <td>{selectedCouncil.president}</td>
                  </tr>
                  <tr>
                    <td><strong>Vice President:</strong></td>
                    <td>{selectedCouncil.vicePresident}</td>
                  </tr>
                  <tr>
                    <td><strong>Secretary:</strong></td>
                    <td>{selectedCouncil.secretary}</td>
                  </tr>
                  <tr>
                    <td><strong>Treasurer:</strong></td>
                    <td>{selectedCouncil.treasurer}</td>
                  </tr>
                  <tr>
                    <td><strong>Auditor:</strong></td>
                    <td>{selectedCouncil.auditor}</td>
                  </tr>
                  <tr>
                    <td><strong>PRO:</strong></td>
                    <td>{selectedCouncil.pro}</td>
                  </tr>
                  <tr>
                    <td><strong>Representative:</strong></td>
                    <td>{selectedCouncil.rep}</td>
                  </tr>
                  <tr>
                    <td><strong>Representative (Alternate):</strong></td>
                    <td>{selectedCouncil.representative}</td>
                  </tr>
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>

      {/* Conditionally render the floating display */}
      {approvedData && approvedData.length > 0 && (
        <div className={styles.floatingDisplay}>
          {selectedCouncil && approvedData && (
            <div className={styles.floatingContent}>
              <button
                className={styles.closeButton}
                onClick={() => setApprovedData(null)} // Close the floating display
              >
                X
              </button>
              <h3>Upcoming Event</h3>
              <p><strong>Adviser:</strong> {selectedCouncil.adviser}</p>
              {selectedCouncil.adviserPIC && (
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
              )}
              <p><strong>Venue:</strong> {approvedData[currentEventIndex].venue}</p>
              <p><strong>Organization:</strong> {approvedData[currentEventIndex].organization}</p>
              <p><strong>Duration:</strong> {approvedData[currentEventIndex].duration}</p>
              <p><strong>Date:</strong> {formatDate(approvedData[currentEventIndex].date)} to {formatDate(approvedData[currentEventIndex].datefrom)}</p>

              <div className={styles.navigationButtons}>
                <button onClick={previousEvent} disabled={currentEventIndex === 0} className={styles.navButton}>Back</button>
                <button onClick={nextEvent} disabled={currentEventIndex === approvedData.length - 1} className={styles.navButton}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouncilDisplay;
