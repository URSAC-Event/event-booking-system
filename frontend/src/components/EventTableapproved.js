import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import { FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const EventTableApproved = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  // Fetch events function
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/approved");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
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

  const handleDeleteApproved = async (id) => {
    console.log("Sending delete request for ID:", id); // Debugging
    try {
      const response = await axios.delete(`http://localhost:5000/api/approved-table/${id}`);
      if (response.status === 200) {
        setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));
        alert('Event deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error);
      alert('Failed to delete event');
    }
  };




  // Filter events based on the search term
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.upcomingEventsCont}>
      <h2>Upcoming Events</h2>
      <p>Check documents, view banners, cancel, and search upcoming events.</p>
      <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search events..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className={styles.searchIcon} />
      </div>
      <div className={styles.sectionBox}>
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
              <th className={styles.tableCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{event.name}</td>
                  <td className={styles.tableCell}>{event.organization}</td>
                  <td className={styles.tableCell}>{formatDate(event.date)} to {formatDate(event.datefrom)}</td>
                  <td className={styles.tableCell}>{event.duration}</td>
                  <td className={styles.tableCell}>
                    {event.documents && (
                      <a className={styles.viewDocs} href={`http://localhost:5000/uploads/${event.documents}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        View Document
                      </a>
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    {event.photo && (
                      <a className={styles.viewDocs} href={`http://localhost:5000/uploads/${event.photo}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        View Image
                      </a>
                    )}
                  </td>
                  <td className={styles.tableCell}>{event.venue}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionFlex}>
                      <button className={styles.approvedActions} onClick={() => handleDeleteApproved(event.id)} title='Cancel Eventa'>
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noEvents}>No events available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


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
