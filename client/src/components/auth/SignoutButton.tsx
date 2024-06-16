import React from 'react';
import Button from '@mui/material/Button';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SignoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await api.post('/auth/signout');
            navigate('/signin');
        } catch (error) {
            console.error('Signout failed', error);
        }
    };

    return (
        <Button color="inherit" onClick={handleSignout} sx={{ mx:1 }}>
            Signout
        </Button>
    );
};

export default SignoutButton;
