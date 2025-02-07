import React, { useState, useEffect, useMemo } from "react";
import styles from "./PublicPage.module.css";

const Slideshow = () => {
  const [imageFiles, setImageFiles] = useState([]); // State to hold image filenames
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Fetch the image filenames from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/slideshow-images") // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setImageFiles(data); // Set the filenames from backend
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  // Memoize the image URLs based on the filenames fetched
  const images = useMemo(() => {
    return imageFiles.map((image) => `http://localhost:5000/uploads/${image}`);
  }, [imageFiles]); // Recalculate when imageFiles changes

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        setIsFading(false);
      }, 900); // Duration of fade-out matches CSS
    }, 6000); // Change slides every 7 seconds

    return () => clearInterval(interval);
  }, [images.length]); // Only reset the interval when images change

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
          <p>Loading images...</p> // Fallback if images are not yet loaded
        )}
      </div>
  );
};

export default Slideshow;
