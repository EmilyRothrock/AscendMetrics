import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Ensure this has typings available or declared
import SignoutButton from './SignoutButton';
import { Stack, Typography, Button, Box, Paper, AppBar, Toolbar } from '@mui/material';
import ReadinessTile from './ReadinessTile';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import AddBoxIcon from '@mui/icons-material/AddBox';

const Dashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/authcheck');
                setIsAuthenticated(!!response.data);
            } catch (error) {
                console.error('Error checking authentication', error);
                navigate('/signin');
            }
        };
        checkAuth();
    }, [navigate]);

    if (isAuthenticated) {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography sx={{ flexGrow: 1 }}>Welcome to your Dashboard</Typography>
                        <SignoutButton />
                    </Toolbar>
                </AppBar>
                <Grid container spacing={2} sx={{ marginTop: 1, minHeight: '90vh' }}>
                    <Grid xs={12} md={4}>
                        <DashboardColumn>
                            <Stack direction='column'>
                                <Button variant='contained' startIcon={<AddBoxIcon />} sx={{ margin: 1 }}>Log New Training Session</Button>
                                <ReadinessTile>Fingers and Forearms</ReadinessTile>
                                <ReadinessTile>Upper Body</ReadinessTile>
                                <ReadinessTile>Lower Body</ReadinessTile>
                            </Stack>
                        </DashboardColumn>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <DashboardColumn>
                            <Typography>TODO: populate PAST TRAINING SESSIONS from database</Typography>
                        </DashboardColumn>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <DashboardColumn>
                            <Typography>TODO: populate VISUALIZATIONS from database</Typography>
                        </DashboardColumn>
                    </Grid>
                </Grid>
            </div>
        );
    }

    return (
        <div>
            <h1>You are not authenticated</h1>
        </div>
    );
}

export default Dashboard;


interface DashboardColumnProps {
    children: React.ReactNode; // Specifying that children must be a string
}

const DashboardColumn: React.FC<DashboardColumnProps> = ({children}) => {
    return (
        <Paper elevation={2} sx={{
            height: '100%',
            width: '100%',
            overflow: 'auto'
        }}>
            {children}
        </Paper>
    );
};