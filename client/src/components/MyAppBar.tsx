import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SessionIcon from '@mui/icons-material/EventNote'; // Example icon for "Sessions"
import SignoutButton from './SignoutButton';
import { useNavigate } from 'react-router-dom';

const MyAppBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ borderRadius: 1, boxShadow: "none", background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Ascend Metrics
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'right' }}>
                    <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => navigate('/dashboard')} sx={{ marginRight:3 }}>
                        Dashboard
                    </Button>
                    <Button color="inherit" startIcon={<SessionIcon />} onClick={() => navigate('/sessions')} sx={{ marginRight:3 }}>
                        Sessions
                    </Button>
                    <SignoutButton />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;