// ProtectedLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import MyAppBar from './MyAppBar';
import { Box } from '@mui/material';

const Layout: React.FC = () => {
  return (
    <Box>
      <MyAppBar />
      <Box sx={{ pt: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
