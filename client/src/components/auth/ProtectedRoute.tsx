import { Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Ensure this API service is correctly set up to handle requests
import { DataProvider } from '../DataProvider';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null initially to indicate loading state

    useEffect(() => {
        async function checkAuthentication() {
            try {
                const response = await api.get('/authcheck');
                setIsAuthenticated(response.data); // Assume response.data directly gives a boolean for authentication status
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false); // Assume not authenticated if there's an error
            }
        }

        checkAuthentication();
    }, []); // Empty dependency array ensures this runs only once after the component mounts

    // Handling the initial loading state
    if (isAuthenticated === null) {
        return null; // Optionally, replace with a loading spinner or similar indicator
    }

    // Navigate to signin if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    // Render children if authenticated
    // return <>{children}</>;
    return <DataProvider>{children}</DataProvider>;
};

export default ProtectedRoute;