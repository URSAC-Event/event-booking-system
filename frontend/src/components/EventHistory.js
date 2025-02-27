import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./eventhistory.module.css";
import { FaSearch } from "react-icons/fa";

const EventHistory = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        const response = await axios.get(
          "https://event-booking-system-ckik.onrender.com/api/approvedhistory"
        );
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

  // ✅ Search Filtering Logic
  const filteredEvents = pastEvents.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.historyCont}>
      <h2 className={styles.header}>History</h2>
      <p>View all previous events.</p>

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

      <div className={styles.historyGrid}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item) => (
            <div key={item.id} className={styles.newsItem}>
              <div className={styles.imgCont}>
                <a
                  className={styles.imgCont}
                  href={item.photo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={item.photo} alt={item.name} className={styles.newsImage} />
                </a>
              </div>
              <div className={styles.itemInfo}>
                <h4>{item.name}</h4>
                <p>{item.organization}</p>
                <p>
                  {item.duration} • {new Date(item.date).toLocaleDateString()} -{" "}
                  {new Date(item.datefrom).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No previous events found.</p>
        )}
      </div>
    </div>
  );
};

export default EventHistory;
