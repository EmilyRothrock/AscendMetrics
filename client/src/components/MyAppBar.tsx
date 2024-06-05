import { IconButton, Drawer, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SessionIcon from '@mui/icons-material/EventNote'; // Example icon for "Sessions"
import { useNavigate } from 'react-router-dom';
import SignoutButton from './SignoutButton';

const MyAppBar: React.FC = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <AppBar position="static" sx={{ borderRadius: 1, boxShadow: "none", background: "linear-gradient(45deg, #7e57c2 30%, #3f51b5 90%)" }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Ascend Metrics
                </Typography>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <Button onClick={() => navigate('/dashboard')} sx={{ my: 1 }}>
                        Dashboard
                    </Button>
                    <Button onClick={() => navigate('/sessions')} sx={{ my: 1 }}>
                        Sessions
                    </Button>
                    <SignoutButton />
                </Drawer>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'right' }}>
                    <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => navigate('/dashboard')} sx={{ mx: 1 }}>
                        Dashboard
                    </Button>
                    <Button color="inherit" startIcon={<SessionIcon />} onClick={() => navigate('/sessions')} sx={{ mx: 1 }}>
                        Sessions
                    </Button>
                    <SignoutButton />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;