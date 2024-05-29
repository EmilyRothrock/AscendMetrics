import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
        try {
            const response = await api.get('/authcheck');
            console.log(response.data);
            if (response.data) { setIsAuthenticated(true); } 
            else {  navigate('/signin'); }
        } catch (error) {
            console.error('Error checking authentication', error);
            navigate('/signin');
        }
        };
        checkAuth();
    });

    if (isAuthenticated === null) {
        return (
            <>
            <h1>This is the dashboard... but you aren't authenticated</h1>
            </>
        );
    }
}

export default Dashboard;