import { IconButton, Drawer, AppBar, Toolbar, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { NavButtons } from './NavButtons';

const MyAppBar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <AppBar position="static" sx={{ marginBottom:1, borderRadius: 1, boxShadow: "none", background: "linear-gradient(45deg, #7e57c2 30%, #3f51b5 90%)" }}>
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
                    <NavButtons sx={{ my:1 }}/>
                </Drawer>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'right' }}>
                    <NavButtons sx={{ mx:1 }}/>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;