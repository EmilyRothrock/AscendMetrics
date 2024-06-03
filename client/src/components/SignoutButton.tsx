import React from 'react';
import Button from '@mui/material/Button';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const SignoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await api.post('/signout');
            // Clear any client-side authentication tokens or state here
            navigate('/signin');
        } catch (error) {
            console.error('Signout failed', error);
            // Handle the error as needed
        }
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleSignout}>
            Signout
        </Button>
    );
};

export default SignoutButton;
