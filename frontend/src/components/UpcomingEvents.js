import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PublicPage.module.css";

const UpcomingEvents = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/approved");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching approved data:", error);
        setNews([]);
      }
    };

    fetchApprovedData();
  }, []);

  const now = new Date();
  const upcomingEvents = news.filter((item) => new Date(item.date) > now);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUpcomingEvents = upcomingEvents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div><h3 className={styles.header}>Upcoming Events</h3>
    <div>
      
      {currentUpcomingEvents.length > 0 ? (
        currentUpcomingEvents.map((item) => (
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
        <p>No upcoming events available at the moment.</p>
      )}
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= upcomingEvents.length}
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default UpcomingEvents;
