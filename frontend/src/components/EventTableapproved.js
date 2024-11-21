import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css'; // Make sure the CSS file is correctly imported

const EventTableApproved = () => {
  const [events, setEvents] = useState([]);

  // Fetch events data from your database on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/approved"); // Adjust the endpoint accordingly
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

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
                      onClick={() => console.log("View Document:", event.documents)}
                    >
                      View Document
                    </button>
                  )}
                </td>
                <td className={styles.tableCell}>
                  {event.photo && (
                    <button
                      className={styles.button}
                      onClick={() => console.log("View Image:", event.photo)}
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
    </div>
  );
};

export default EventTableApproved;
