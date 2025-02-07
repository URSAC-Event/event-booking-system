import React, { useState, useEffect, useMemo } from "react";
import styles from "./PublicPage.module.css";

const Slideshow = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Fetch the image filenames from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/slideshow-images")
      .then((response) => response.json())
      .then((data) => {
        setImageFiles(data); // Set the filenames from backend
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  // Memoize the image URLs based on the filenames fetched
  const images = useMemo(() => {
    return imageFiles.map((image) => `http://localhost:5000/uploads/${image}`);
  }, [imageFiles]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        setIsFading(false);
      }, 900); // Duration of fade-out matches CSS
    }, 6000); // Change slides every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
      <div
        className={`${styles.upcomingEventsImageContainer} ${
          isFading ? styles.fade : ""
        }`}
      >
        {images.length > 0 ? (
          <img
            src={images[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className={styles.upcomingEventImage}
          />
        ) : (
          <p>No upcoming events</p> // Fallback if no images are available
        )}
      </div>
  );
};

export default Slideshow;
