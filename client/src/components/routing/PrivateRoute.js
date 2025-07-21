// client/src/components/routing/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Correct path from components/routing

const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext); // Added loading state if it were there

    const location = useLocation();

    // If still checking auth status (e.g., initial load from token), might show loading spinner
    // For now, we assume isAuthenticated is immediately available from useEffect in App.js
    // if (loading) {
    //    return <div>Loading...</div>;
    // }

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page, storing current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated but user role is not authorized for this route
    if (roles && roles.length > 0 && user && !roles.includes(user.role)) {
        // Redirect to home or an unauthorized page
        return <Navigate to="/" replace />; // Or create a /unauthorized route
    }

    // If authenticated and authorized, render the children components
    return children;
};

export default PrivateRoute;