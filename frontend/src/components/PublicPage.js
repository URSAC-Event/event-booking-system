// src/components/PublicPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import styles from "./PublicPage.module.css";
import logo from "../assets/urslogo.png";
import login from "../assets/log-in.svg";
import coeng from "../assets/coeng.jpg";
import axios from "axios";
import CustomCalendar from "./CustomCalendar";
import Slideshow from "./Slideshow";
import CouncilDisplay from './CouncilDisplay';
import NewsAndInformation from './NewsAndInformation';
import UpcomingEvents from "./UpcomingEvents";
import EventHistory from "./EventHistory";



const PublicPage = () => {
  const [selectedSidebar, setSelectedSidebar] = useState("New Booking");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]); // State for storing events
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [newSidebarSelection, setNewSidebarSelection] = useState(
    "Select an organization to view details."
  ); // New sidebar state
  const navigate = useNavigate();

  //login button

  const handleLoginClick = () => {
    navigate("/login");
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
        <button onClick={handleLoginClick} className={styles.loginButton}>
          <img src={login} className={styles.loginIcon} />
          <p>Login</p>
        </button>
      </nav>

      <div className={styles.container}>
        <div className={styles.SecondContainer}>
          <div className={styles.heroSection}>
            <div className={styles.welcomeCont}>
              <div className={styles.headers}>
                <h1>URSAC Event Booking System</h1>
                <p>Easily book and manage events at URS Antipolo Campus. Plan gatherings, reserve venues, and track schedules in one place.</p>
              </div>
              <button className={styles.getStartedBtn} onClick={handleLoginClick}>Get Started</button>
            </div>
            <Slideshow />
          </div>



          <div className={styles.calendar}>
            <h1>Campus Calendar</h1>
            <CustomCalendar />
          </div>





          {/* News and Information Section (on the right) */}

          <div className={styles.rightSection}>
            <UpcomingEvents />
          </div>

          <div className={styles.layoutContainer}>
            <CouncilDisplay />
          </div>

          <div className={styles.mergedSection}>
            <h3 className={styles.vgmoHeader}>Vision</h3>
            <p className={styles.vgmo}>
              The leading University in human resource development, knowledge and
              technology generation, and environmental stewardship.
            </p>
            <h3 className={styles.vgmoHeader}>Mission</h3>
            <p className={styles.vgmo}>
              The University of Rizal System is committed to nurture and produce
              upright and competent graduates and empowered community through
              relevant and sustainable higher professional and technical
              instruction, research, extension, and production services.
            </p>
            <h3 className={styles.vgmoHeader}>Core Values</h3>
            <p>R – Responsiveness</p>
            <p>I – Integrity</p>
            <p>S – Service</p>
            <p>E – Excellence</p>
            <p className={styles.vgmo}>S – Social Responsibility</p>
            <h3 className={styles.vgmoHeader}>Quality Policy</h3>
            <p className={styles.vgmo}>
              The University of Rizal System commits to deliver excellent products
              and services to ensure total stakeholders’ satisfaction in
              instruction, research, extension, production and dynamic
              administrative support and to continuously improve its Quality
              Management System processes to satisfy all applicable requirements.
            </p>
          </div>
        </div>


        {/* Merged Vision and Mission Section */}

      </div>




      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} University of Rizal Sytem Antipolo
          Campus<br></br> All rights reserved.
        </p>
      </footer>

      {/* Third Divider - Optional */}
    </div>
  );
};

export default PublicPage;
