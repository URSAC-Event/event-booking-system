import React, { useState, useEffect } from 'react';
import styles from './Addusermodal.css';  // Assuming you have styles for the modal

const AddUserModal = ({ isOpen, closeModal, addUser }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organizationz, setOrganizationz] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');  // To handle username errors
    const [organizations, setOrganizations] = useState([]);  // To store fetched organizations

    // Fetch organizations from the backend
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/organizations');
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(data);  // Set organizations to state
                } else {
                    console.error('Failed to fetch organizations:', data.message);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, []);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(value)) {
            setPasswordError('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number.');
        } else {
            setPasswordError('');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        setUsernameError('');  // Clear the username error when the user types

        // Check if username exists
        if (value) {
            checkUsernameExistence(value);
        }
    };

    // Function to check if the username exists in the database
    const checkUsernameExistence = async (username) => {
        try {
            const response = await fetch(`http://localhost:5000/api/check-username?username=${username}`);
            const data = await response.json();
            if (data.exists) {
                setUsernameError('Username already exists.');
            } else {
                setUsernameError('');
            }
        } catch (error) {
            console.error('Error checking username:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // If password is valid and username doesn't exist
        if (!passwordError && !usernameError) {
            const user = { name, username, email, password, organizationz };
    
            try {
                const response = await fetch('http://localhost:5000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });
    
                const data = await response.json();
                if (response.ok) {
                    addUser(data);  // Add the user to the state in Admin.js
                    closeModal();  // Close the modal after successful addition
                } else {
                    console.error('Failed to add user:', data.message);
                    alert(`Failed to add user: ${data.message}`);  // Show the error message
                }
            } catch (error) {
                console.error('Error adding user:', error);
                alert(`Error adding user: ${error.message}`);  // Show the error message
            }
        }
    };
    

    return (
        isOpen && (
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <span className={styles.close} onClick={closeModal}>×</span>
                    <h2>Add User</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            {usernameError && <span className={styles.error}>{usernameError}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input type="email" value={email} onChange={handleEmailChange} required />
                            {emailError && <span className={styles.error}>{emailError}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <input type="password" value={password} onChange={handlePasswordChange} required />
                            {passwordError && <span className={styles.error}>{passwordError}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Organization</label>
                            <select value={organizationz} onChange={(e) => setOrganizationz(e.target.value)} required>
                                <option value="">Select Organization</option>
                                {organizations.map((org, index) => (
                                    <option key={index} value={org.organization}>
                                        {org.organization}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={passwordError || usernameError}>Add User</button>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddUserModal;
