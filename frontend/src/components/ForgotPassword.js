import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Forgotpassword.module.css'; // Import your CSS module
import back from '../assets/close-outline.svg'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
      if (email) {
        try {
          // Make the API call to check if email exists
          const response = await axios.post('http://localhost:5000/check-email', { email });

          if (response.status === 200) {
            // Email exists, navigate to verify-email page
            navigate('/verify-email', { state: { email } });
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setError('Email not found.');
          } else {
            setError('Something went wrong. Please try again.');
          }
        }
      } else {
        setError('Please enter your email.');
      }
    };

    return (
      <div className={styles.forgotPasswordContainer}>
        <div className={styles.formCont}>
          <img className={styles.backButton} src={back} onClick={() => navigate('/login')}/>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>} {/* Display error if any */}
          <button 
            onClick={handleSubmit} 
            className={styles.button}
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

export default ForgotPassword;
