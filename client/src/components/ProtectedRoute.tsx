import { redirect, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Ensure this has typings available or declared

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/authcheck');
                setIsAuthenticated(!!response.data);
            } catch (error) {
                console.error('Error checking authentication', error);
                redirect('/signin');
            }
        };
        checkAuth();
    });

    if (isAuthenticated) { return children; }
    else { return <Navigate to="/signin" replace /> }
};

export default ProtectedRoute;