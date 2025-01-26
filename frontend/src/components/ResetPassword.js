import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || ''; // Get email passed from EnterCode page
  const navigate = useNavigate(); // For navigation to Login page

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false); // To track password update status

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Updated password pattern to include special characters
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Check if the password meets the criteria
    if (!passwordPattern.test(password)) {
      setMessage('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    if (password === confirmPassword) {
      // Send the new password to the backend
      try {
        const response = await fetch('http://localhost:5000/api/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, newPassword: password }),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage('Password successfully updated!');
          setIsPasswordUpdated(true);  // Set flag to indicate successful update
        } else {
          setMessage(result.message || 'Failed to reset password. Please try again.');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        setMessage('Failed to reset password. Please try again.');
      }
    } else {
      setMessage('Passwords do not match. Please try again.');
    }
  };

  const handleGoBackToLogin = () => {
    navigate('/login', { replace: true }); // Redirect to the Login page and replace the current history entry
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <h2>{isPasswordUpdated ? 'Congratulations' : 'Reset Your Password'}</h2> {/* Conditional heading */}

      {!isPasswordUpdated && (
        <p>We sent a verification code to: {email}</p> // Display email only before password update
      )}

      {!isPasswordUpdated ? (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="New password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm password"
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      ) : (
        <div>
          <p>{message}</p>
          <button onClick={handleGoBackToLogin}>Go back to login</button>
        </div>
      )}

      {message && !isPasswordUpdated && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
