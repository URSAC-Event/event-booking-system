import React, { useState } from 'react';
import styles from './Addusermodal.css';  // Assuming you have styles for the modal

const AddUserModal = ({ isOpen, closeModal, addUser }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [organizationz, setOrganizationz] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If password is valid
        if (!passwordError) {
            const user = { name, username, password, organizationz };

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
                }
            } catch (error) {
                console.error('Error adding user:', error);
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
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <input type="password" value={password} onChange={handlePasswordChange} required />
                            {passwordError && <span className={styles.error}>{passwordError}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Organization</label>
                            <input type="text" value={organizationz} onChange={(e) => setOrganizationz(e.target.value)} required />
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={passwordError}>Add User</button>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddUserModal;
