
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import SignoutButton from './SignoutButton';

const MyAppBar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography sx={{ flexGrow: 1 }}>Welcome to your Dashboard</Typography>
                <SignoutButton />
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;

