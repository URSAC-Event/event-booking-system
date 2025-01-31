import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
import axios from 'axios'; // Import Axios
import styles from './Login.module.css';
import logo from '../assets/urslogo.png'
import back from '../assets/close-outline.svg'
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate function
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to the user login endpoint
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });

            if (response.data.success) {
                // If login is successful, redirect to Dashboard
                navigate('/dashboard');
            } else {
                // Display an error message if login failed
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Login failed. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <img className={styles.backButton} src={back} onClick={() => navigate('/')}/>
                <img src={logo} className={styles.logo}/>
                <h2 className={styles.title}>Welcome Back</h2>
                <p className={styles.subtext}>Please enter your details to sign in</p>
                <form onSubmit={handleLogin} className={styles.form}>
                    <p className={styles.label}>Your Username</p>
                    <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <p className={styles.label}>Password</p>
                    <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {/* Eye Icon Button Inside the Input */}
            <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
        

             
            </button> </div>
            <div className={styles.linksContainer}>
                    <p
                        className={styles.forgotPassword}
                        onClick={() => navigate('/forgotpassword')} // Navigate to Forgot Password
                    >
                        Forgot Password?
                    </p>
            </div>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <button type="submit" className={styles.button}>Login</button>
                </form>
 
                <div className={styles.adminCont}>
                    <p className={styles.ask}>Are you an admin?</p>
                    <p
                        className={styles.admin}
                        onClick={() => navigate('/adminlogin')} // Navigate to AdminLogin
                    >
                        Click Here
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
