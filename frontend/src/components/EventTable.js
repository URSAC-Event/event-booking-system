// src/components/EventTable.js
import React from 'react';
import styles from './Admin.module.css'; // Make sure the CSS file is correctly imported

const EventTable = ({ events, handleViewDocument, handleViewImage, handleConfirm, handleDelete, handleButtonHover }) => {
     // Function to format the date as YYYY-MM-DD
     const formatDate = (date) => {
        if (!date) return "";
      
        // Parse the date and convert it to the correct format
        const parsedDate = new Date(date);
        // Check if parsedDate is a valid date object
        if (!isNaN(parsedDate)) {
          return parsedDate.toLocaleDateString('en-GB'); // Format to "dd/mm/yyyy" or "yyyy-mm-dd"
        } else {
          return "";
        }
      };
  return (
    <div>
      <h2>Event requests</h2>
      <div className={styles.addEventButtonContainer}>
        {/* You can add a button or a link for adding an event here */}
      </div>
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
          {events.length > 0 ? (
            events.map((event) => (
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
                    onClick={() => {
                      console.log('Approve button clicked for event ID:', event.id);
                      handleConfirm(event.id);
                    }}
                  >
                    ✔
                  </button>

                  <button
                    className={styles.button}
                    onClick={() => {
                      console.log('Delete button clicked for event ID:', event.id);
                      handleDelete(event.id);
                    }}
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
