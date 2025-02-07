// src/components/EventTable.js
import React, { useState } from 'react';
import styles from './Admin.module.css';

const EventTable = ({ events, handleViewDocument, handleViewImage, handleConfirm, handleDelete, handleButtonHover }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Function to format the date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return !isNaN(parsedDate) ? parsedDate.toLocaleDateString('en-GB') : "";
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Event Requests</h2>
      <input
        type="text"
        placeholder="Search events..."
        className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
                    <button
                      className={styles.button}
                      onClick={() => handleViewDocument(event.documents, event.name)}
                      onMouseEnter={(e) => handleButtonHover(e, true)}
                      onMouseLeave={(e) => handleButtonHover(e, false)}
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
                      onMouseEnter={(e) => handleButtonHover(e, true)}
                      onMouseLeave={(e) => handleButtonHover(e, false)}
                    >
                      View Image
                    </button>
                  )}
                </td>
                <td className={styles.tableCell}>{event.venue}</td>
                <td className={styles.tableCell}>
                  <button
                    className={styles.button}
                    onClick={() => handleConfirm(event.id)}
                  >
                    ✔
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(event.id, event.organization)}
                  >
                    ❌
                  </button>
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
  );
};

export default EventTable;
