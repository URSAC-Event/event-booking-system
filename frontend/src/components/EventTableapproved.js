import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';

const EventTableApproved = () => {
  const [events, setEvents] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/approved");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return !isNaN(parsedDate) ? parsedDate.toLocaleDateString('en-GB') : "";
  };

  const handleViewDocument = (documentName) => {
    const fullDocumentUrl = `http://localhost:5000/uploads/${documentName}`;
    setSelectedDocument(fullDocumentUrl);
    setSelectedDocumentName(documentName);
    setShowDocumentModal(true);
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
    setSelectedDocumentName(null);
  };

  const handleViewImage = (imageName) => {
    const fullImageUrl = `http://localhost:5000/uploads/${imageName}`;
    setSelectedDocument(fullImageUrl);
    setSelectedDocumentName(imageName);
    setShowDocumentModal(true);
  };

  return (
    <div>
      <h2>Approved Events</h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.tableCell}>Name</th>
            <th className={styles.tableCell}>Organization</th>
            <th className={styles.tableCell}>Date</th>
            <th className={styles.tableCell}>Duration</th>
            <th className={styles.tableCell}>Documents</th>
            <th className={styles.tableCell}>Photo</th>
            <th className={styles.tableCell}>Venue</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{event.name}</td>
                <td className={styles.tableCell}>{event.organization}</td>
                <td className={styles.tableCell}>
                  {formatDate(event.date)} to {formatDate(event.datefrom)}
                </td>
                <td className={styles.tableCell}>{event.duration}</td>
                <td className={styles.tableCell}>
                  {event.documents && (
                    <button
                      className={styles.button}
                      onClick={() => handleViewDocument(event.documents)}
                    >
                      View Document
                    </button>
                  )}
                </td>
                <td className={styles.tableCell}>
                  {event.photo && (
                    <button
                      className={styles.button}
                      onClick={() => handleViewImage(event.photo)}
                    >
                      View Image
                    </button>
                  )}
                </td>
                <td className={styles.tableCell}>{event.venue}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className={styles.noEvents}>No events available</td>
            </tr>
          )}
        </tbody>
      </table>

      {showDocumentModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={handleCloseDocumentModal}>&times;</span>
            <h2>{selectedDocumentName}</h2>
            <iframe src={selectedDocument} title={selectedDocumentName} className={styles.modalIframe}></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTableApproved;
