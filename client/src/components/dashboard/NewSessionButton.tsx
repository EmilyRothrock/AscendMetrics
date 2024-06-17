import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';

const NewSessionButton: React.FC = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/sessions/new');
    };

    return (
        <Button 
            variant='contained' 
            startIcon={<AddBoxIcon />} 
            fullWidth
            onClick={handleButtonClick}
        >
            Log New Training Session
        </Button>
    );
};

export default NewSessionButton;