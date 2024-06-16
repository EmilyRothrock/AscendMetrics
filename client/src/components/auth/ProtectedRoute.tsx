import { Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { checkAuthentication } from '../../services/authService';

const ProtectedRoute: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null initially to indicate loading state

    useEffect(() => {
        async function checkAuth() {
            const authStatus = await checkAuthentication();
            setIsAuthenticated(authStatus);
        }

        checkAuth();
    }, []); // Empty dependency array ensures this runs only once after the component mounts

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

export default ProtectedRoute;