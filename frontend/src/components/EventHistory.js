import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PublicPage.module.css";

const EventHistory = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/approvedhistory");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching approved data:", error);
        setNews([]);
      }
    };

    fetchApprovedData();
  }, []);

  const now = new Date();
  const pastEvents = news.filter((item) => new Date(item.date) <= now);

  return (
    <div>
      <h3 className={styles.header}>Event History</h3>
      {pastEvents.length > 0 ? (
        pastEvents.map((item) => (
          <div key={item.id} className={styles.newsItem}>
            <img
              src={`http://localhost:5000/uploads/${item.photo}`}
              alt={item.name}
              className={styles.newsImage}
            />
            <h4>{item.name}</h4>
            <p>
              Venue: {item.venue} <br />
              Organization: {item.organization} <br />
              Duration: {item.duration} hours <br />
              Date: {new Date(item.date).toLocaleDateString()} -{" "}
              {new Date(item.datefrom).toLocaleDateString()}
            </p>
            <a
              href={`http://localhost:5000/uploads/${item.documents}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.documentLink}
            >
              View Document
            </a>
          </div>
        ))
      ) : (
        <p>No past events available at the moment.</p>
      )}
    </div>
  );
};

export default EventHistory;
