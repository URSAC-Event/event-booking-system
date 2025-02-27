import React, { useState, useEffect } from "react";
import styles from "./PublicPage.module.css";
import placeholder from "../assets/placeholder.png";

const Slideshow = () => {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    fetch("https://event-booking-system-ckik.onrender.com/api/slideshow-images")
      .then((response) => response.json())
      .then((data) => {
        setImages(data); // Directly use Cloudinary URLs
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        setIsFading(false);
      }, 300); // Fade duration
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.slideshowCont}>
      <div className={`${styles.upcomingEventsImageContainer} ${isFading ? styles.fade : ""}`}>
        {images.length > 0 ? (
          <img src={images[currentSlide]} alt={`Slide ${currentSlide + 1}`} className={styles.upcomingEventImage} />
        ) : (
          <img src={placeholder} alt="Placeholder Image" className={styles.upcomingEventImage} />
        )}
      </div>
    </div>
  );
};

export default Slideshow;
