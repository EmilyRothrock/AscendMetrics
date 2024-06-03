import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignoutButton from './SignoutButton';
import { Stack, Typography, Button, Box, Paper, AppBar, Toolbar } from '@mui/material';
import ReadinessTile from './ReadinessTile';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import AddBoxIcon from '@mui/icons-material/AddBox';

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

    if (isAuthenticated) {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography sx={{ flexGrow: 1 }}>Welcome to your Dashboard</Typography>
                        <SignoutButton/>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={2} sx={{ marginTop: 1, minHeight: '88vh'}}>
                    <Grid xs={12} md={4}>
                        <Paper elevation={2} sx={{
                            height: '100%',
                            width: '100%',
                        }}>
                            <Stack direction='column'>
                                {/* TODO: populate FEEDBACK from database */}
                                <Button variant='contained' startIcon={<AddBoxIcon/>} sx={{ margin: 1 }}>Log New Training Session</Button>
                                <ReadinessTile>Fingers and Forearms</ReadinessTile>
                                <ReadinessTile>Upper Body</ReadinessTile>
                                <ReadinessTile>Lower Body</ReadinessTile>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Paper elevation={2} sx={{
                        height: '100%',
                        width: '100%',
                        overflow: 'auto'
                        }}>
                            <Typography>TODO: populate PAST TRAINING SESSIONS from database</Typography>
                        </Paper>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Paper elevation={2} sx={{
                        height: '100%',
                        width: '100%',
                        }}>
                            <Typography>TODO: populate VISUALIZATIONS from database</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }

    return (
        <div>
            <h1>You are not authenticated</h1>
            {/* Optionally add a link or button to redirect to the sign-in page */}
        </div>
    );
}

export default Dashboard;