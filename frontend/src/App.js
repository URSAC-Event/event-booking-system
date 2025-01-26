import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import PublicPage from './components/PublicPage'; // Import your PublicPage component
import Dashboard from './components/Dashboard'; // Import your Dashboard component
import AdminLogin from './components/AdminLogin'; // Import your AdminLogin component
import Admin from './components/Admin'; // Import your Admin component
import ForgotPassword from './components/ForgotPassword';
import ForgotPasswordadmin from './components/ForgotPasswordadmin';
import VerifyEmail from './components/VerifyEmail';
import Verifyemailadmin from './components/Verifyemailadmin';
import EnterCode from './components/EnterCode';
import entercodeadmin from './components/Entercodeadmin';
import ResetPassword from './components/ResetPassword';
import ResetPasswordadmin from './components/ResetPasswordadmin';
import EnterCodeadmin from './components/Entercodeadmin';
const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} /> {/* Add this route */}
                <Route path="/forgotpasswordadmin" element={<ForgotPasswordadmin />}/>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verifyemailadmin" element={<Verifyemailadmin />} />
                <Route path="/enter-code" element={<EnterCode />} />
                <Route path="/enter-codeadmin" element={<EnterCodeadmin />} />
                {/* Admin Routes */}
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-passwordadmin" element={<ResetPasswordadmin />} />
                {/* Protected Route Example */}
                <Route path="/dashboard" element={<Dashboard />} />
                
            </Routes>
        </Router>
    );
};

export default App;
