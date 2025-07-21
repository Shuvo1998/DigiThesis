// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Removed useNavigate from here, as it's used inside components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';
import StudentDashboard from './components/dashboard/StudentDashboard';
import SupervisorDashboard from './components/dashboard/SupervisorDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ProposeThesis from './components/thesis/ProposeThesis'; // New component for thesis submission
import NotFound from './components/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import { AuthContext } from './context/AuthContext'; // AuthContext
import MyProposals from './components/thesis/MyProposals';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token on app load
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(window.atob(base64));

        // Check token expiry
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(decodedToken.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token'); // Token expired
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to decode or verify token:', error);
        localStorage.removeItem('token'); // Invalid token
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Logout function to be used by Header or other components
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    // Note: Redirection after logout happens within the component that calls logout (e.g., Header)
  };

  const authContextValue = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes using PrivateRoute component */}
              <Route path="/student-dashboard" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
              <Route path="/propose-thesis" element={<PrivateRoute roles={['student']}><ProposeThesis /></PrivateRoute>} />
              <Route path="/supervisor-dashboard" element={<PrivateRoute roles={['supervisor']}><SupervisorDashboard /></PrivateRoute>} />
              <Route path="/admin-dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/my-proposals" element={<PrivateRoute roles={['student']}><MyProposals /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;