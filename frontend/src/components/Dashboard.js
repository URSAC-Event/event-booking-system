// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SteestImage from "../assets/steest.PNG";
import SttImage from "../assets/stt.jpg";
import "react-calendar/dist/Calendar.css";
import { Building2, CalendarPlus } from "lucide-react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import CustomCalendar from "./CustomCalendar";
import logo from "../assets/urslogo.png";
import logout from "../assets/logout.svg";
import EventModal from './EventModal';
import Slideshow from "./Slideshow";
import CouncilDisplayedit from './CouncilDisplayedit';
import ReportForm from "./ReportForm";

const Dashboard = () => {
  const loggedInUser = { id: 1 };
  const navigate = useNavigate();
  const userDetails = {
    username: "exampleUser",
    loggedInTime: new Date().toLocaleString(),
  };

 
 
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSidebar, setSelectedSidebar] = useState("New Booking");
  const [newSidebarSelection, setNewSidebarSelection] =
    useState("Dashboard Overview");
  const [eventData, setEventData] = useState({
    fromHour: "",
    fromMinute: "00",
    fromAmPm: "", // No default AM/PM
    toHour: "",
    toMinute: "00",
    toAmPm: "", // No default AM/PM
    venue: "",
    name: "",
    organization: "",
    fromDate: "",
    toDate: "",
    duration: "",
    document: null,
    poster: null,
  });

 

  const renderSidebarContent = () => {
    switch (selectedSidebar) {
      case "New Booking":
        return <p>Form to create a new booking.</p>;
      case "Events":
        return (
          <div>
            <p>Upcoming events information.</p>
            <button
              className={styles.addEventButton}
              onClick={() => setModalOpen(true)}
            >
              Add Event
            </button>
          </div>
        );
      case "Report":
        return <div>
    >
        <ReportForm userId={loggedInUser.id} /> {/* Pass userId to the ReportForm */}
      </div>
      default:
        return null;
    }
  };

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure all time values are selected before proceeding
    if (
      eventData.fromHour && eventData.fromMinute && eventData.fromAmPm &&
      eventData.toHour && eventData.toMinute && eventData.toAmPm
    ) {
      // Format the start and end times into a string like "12:00 AM to 1:00 PM"
      const fromTime = eventData.fromHour && eventData.fromMinute && eventData.fromAmPm
        ? `${String(eventData.fromHour).padStart(2, '0')}:${String(eventData.fromMinute).padStart(2, '0')} ${eventData.fromAmPm || 'AM'}`
        : '00:00 AM'; // Default to 00:00 AM if no value for hour/minute/AM/PM
  
      const toTime = eventData.toHour && eventData.toMinute && eventData.toAmPm
        ? `${String(eventData.toHour).padStart(2, '0')}:${String(eventData.toMinute).padStart(2, '0')} ${eventData.toAmPm || 'AM'}`
        : '00:00 AM'; // Default to 00:00 AM if no value for hour/minute/AM/PM
  
      const duration = `${fromTime} to ${toTime}`; // Combine them into a duration string
  
      // Now append the formatted duration to the formData
      const formData = new FormData();
      formData.append("venue", eventData.venue);
      formData.append("name", eventData.name);
      formData.append("organization", eventData.organization);
      formData.append("date", eventData.fromDate);  // Store fromDate in 'date'
      formData.append("datefrom", eventData.toDate);  // Store toDate in 'datefrom'
      formData.append("duration", duration); // Use the formatted duration string
      formData.append("document", eventData.document);
      formData.append("poster", eventData.poster);
  
      try {
        const response = await axios.post("http://localhost:5000/api/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          alert("Event added successfully!");
          setModalOpen(false); // Close the modal after successful submission
        }
      } catch (error) {
        console.error("Error uploading the event:", error);
        alert("Failed to add event!");
      }
    } else {
      alert("Please fill in all time fields correctly.");
    }
  };
  
  
  
  

  return (
    <div>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <div className={styles.titleflex}>
            <h1 className={styles.title}>
              University of Rizal System - Antipolo Campus
            </h1>
            <h1 className={styles.subtitle}>Event Booking System</h1>
          </div>
        </div>
        <button className={styles.logoutButton} onClick={() => navigate("/")}>
            <img src={logout} className={styles.loginIcon} />
            Log Out
        </button>
      </nav>
      <div className={styles.container}>
        <div className={styles.firstContainer}>
          {/* Upcoming Events Section */}
          <Slideshow />
       

          <div className={styles.calendar}>
            <h1>Campus Calendar</h1>
            <CustomCalendar />
          </div>
        </div>
        <div className={styles.SecondContainer}>
  <div className={styles.venueBooklistContainer}>
    <h2 className={styles.header}>
      <CalendarPlus size={20} color="#063970" /> Venue Booklist
    </h2>
    <div className={styles.sidebarLayout}>
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarr}>
          {["Events", "Report"].map((item) => (
            <button
              key={item}
              onClick={() => setSelectedSidebar(item)}
              className={{
                ...styles.sidebarButton,
                backgroundColor:
                  selectedSidebar === item ? "#0e4296" : "transparent",
                color: selectedSidebar === item ? "#fff" : "#0e4296",
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className={styles.sidebarContent}>
          <h3>{selectedSidebar}</h3>
          {renderSidebarContent()}
        </div>
      </div>
    </div>
  </div>

  {/* News and Information Section (on the right) */}
  <div className={styles.layoutContainer}>
    <CouncilDisplayedit />
  </div>


  <div>
      <h2>Reportform</h2>
      <ReportForm userId={loggedInUser.id} /> {/* Pass userId to the ReportForm */}
    </div>


  {/* Merged Vision and Mission Section */}
  <div className={styles.mergedSection}>
    <h3 className={styles.vgmoHeader}>VISION</h3>
    <p className={styles.vgmo}>
      The leading University in human resource development, knowledge and
      technology generation, and environmental stewardship.
    </p>
    <h3 className={styles.vgmoHeader}>MISSION</h3>
    <p className={styles.vgmo}>
      The University of Rizal System is committed to nurture and produce
      upright and competent graduates and empowered community through
      relevant and sustainable higher professional and technical
      instruction, research, extension, and production services.
    </p>
    <h3 className={styles.vgmoHeader}>CORE VALUES</h3>
    <p>R – Responsiveness</p>
    <p>I – Integrity</p>
    <p>S – Service</p>
    <p>E – Excellence</p>
    <p className={styles.vgmo}>S – Social Responsibility</p>
    <h3 className={styles.vgmoHeader}>QUALITY POLICY</h3>
    <p className={styles.vgmo}>
      The University of Rizal System commits to deliver excellent products
      and services to ensure total stakeholders’ satisfaction in
      instruction, research, extension, production and dynamic
      administrative support and to continuously improve its Quality
      Management System processes to satisfy all applicable requirements.
    </p>
  </div>

<div className={styles.rightSection}>
            <h3 className={styles.header}>News and Information</h3>
            {/* Add news and info content here */}
            <div className={styles.newsItem}>
              <h4>Upcoming Event: CoEng Week</h4>
              <p>Join us for CoEng Week from November 11-15, 2024!</p>
            </div>
            {/* Add more news items as necessary */}
          </div>


</div>

        {/* Event Modal */}
      <EventModal 
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        eventData={eventData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleModalSubmit={handleModalSubmit}
      />
      </div>
      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} University of Rizal Sytem Antipolo
          Campus<br></br> All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
