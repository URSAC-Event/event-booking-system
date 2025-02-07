import React, { useState } from "react";
import axios from "axios";
import styles from "./Addcouncils.module.css"; // Adjust the path if necessary

const ReportForm = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = 1; // Static user ID, replace with actual logic for logged-in user

    try {
      await axios.post("http://localhost:5000/submitReport", {
        userId,
        message,
      });
      alert("Report submitted successfully");
      setMessage(""); // Reset the message field after submission
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reportContent}>
      <textarea
        className={styles.messageInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        required
      />
      <button className={styles.reportButton} type="submit">
        Send Message
      </button>
    </form>
  );
};

export default ReportForm;
