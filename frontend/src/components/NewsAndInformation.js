import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PublicPage.module.css"; // Adjust to your CSS file path

const NewsAndInformation = () => {
  const [news, setNews] = useState([]); // Store all the news
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage] = useState(5); // Number of items to display per page

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.rightSection}>
      <h3 className={styles.header}>News and Information</h3>
      {currentNews.length > 0 ? (
        currentNews.map((item) => (
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
        <p>No news available at the moment.</p>
      )}

      {/* Pagination Controls */}
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
          disabled={indexOfLastItem >= news.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsAndInformation;
