import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLogin.module.css";
import logo from "../assets/urslogo.png";
import back from "../assets/close-outline.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request with username and password for admin login
      const response = await axios.post("https://event-booking-system-ckik.onrender.com/api/adminlogin", {
        username,
        password,
      });

      if (response.data.success) {
        // If login is successful, show success toast and redirect to the admin dashboard
        toast.success("Admin login successful!", { duration: 4000 });
        localStorage.setItem("adminUsername", username); // Store admin session
        navigate("/admin");
      } else {
        toast.error(response.data.message, { duration: 4000 });
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
          toast.error("Too many failed attempts. Try again later.", { duration: 4000 });
        } else if (status === 401 && data.attempts !== undefined) {
          // Display exact remaining attempts based on backend count
          const remainingAttempts = 5 - data.attempts;
          if (remainingAttempts > 0) {
            toast.error(`Invalid credentials. ${remainingAttempts} attempts remaining.`, { duration: 4000 });
          } else {
            toast.error("Too many failed attempts. Try again later.", { duration: 4000 });
          }
        } else {
          toast.error("Login failed. Please try again.", { duration: 4000 });
        }
      } else {
        toast.error("Login failed. Please try again.", { duration: 4000 });
      }
    }
  };


  // Function to handle Sign Up button click
  const handleSignUpClick = () => {
    navigate("/signup"); // Navigate to the Signup page
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <img
          className={styles.backButton}
          src={back}
          onClick={() => navigate("/")}
        />
        <img src={logo} className={styles.logo} />
        <h2 className={styles.title}>Welcome Admin</h2>
        <p className={styles.subtext}>Please enter your details to sign in</p>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className={styles.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />{" "}
            {/* Eye Icon Button Inside the Input */}
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div
            className={`${styles.linksContainer} ${[
              errorMessage && <p className={styles.error}>{errorMessage}</p>,
              <p className={styles.forgotPassword}>Forgot Password?</p>,
            ].filter(Boolean).length === 1
              ? styles.singleChild
              : styles.multiChild
              }`}
          >
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <p
              className={styles.forgotPassword}
              onClick={() => navigate("/forgotpasswordadmin")}
            >
              Forgot Password?
            </p>
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <div className={styles.adminCont}>
          <p className={styles.ask}>Not an admin?</p>
          <p
            className={styles.admin}
            onClick={() => navigate("/login")} // Navigate to Login
          >
            Click Here
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
