import React, { useState } from "react";
import axios from "axios";
import styles from "./Addcouncils.module.css"; // Adjust the path if necessary

const ReportForm = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = 1; // Static user ID, replace with actual logic for logged-in user
  
    // Log the data before sending it to the backend
    console.log("Sending data:", { userId, message, name, org });
  
    try {
      await axios.post("http://localhost:5000/submitReport", {
        userId,
        message,
        name,
        org,
      });
    
      setMessage(""); // Reset the message field after submission
      setName(""); // Reset the name field after submission
      setOrg(""); // Reset the organization field after submission
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className={styles.reportContent}>
      <input
        className={styles.inputField}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        required
      />
      <input
        className={styles.inputField}
        type="text"
        value={org}
        onChange={(e) => setOrg(e.target.value)}
        placeholder="Enter your organization"
        required
      />
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
