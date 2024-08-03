import { Button, SxProps } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import QuizIcon from '@mui/icons-material/Quiz';
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SessionIcon from '@mui/icons-material/EventNote';
import { useNavigate } from 'react-router-dom';
import SignoutButton from '../auth/SignoutButton';
import UnderConstructionBadge from './UnderConstructionBadge';

export const NavButtons: React.FC<SxProps> = (SxProps: SxProps) => {
    const navigate = useNavigate();

    return (
        <>
            <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => navigate('/dashboard')} sx={SxProps}>
                Dashboard
            </Button>
            <UnderConstructionBadge>
                <Button color="inherit" startIcon={<SessionIcon />} onClick={() => navigate('/sessions/manage')} sx={SxProps}>
                    Sessions
                </Button>
            </UnderConstructionBadge>
            <UnderConstructionBadge>
                <Button color="inherit" startIcon={<FitnessCenterIcon />} onClick={() => navigate('/sessions')} sx={SxProps}>
                    Activities
                </Button>
            </UnderConstructionBadge>
            <UnderConstructionBadge>
                <Button color="inherit" startIcon={<QuizIcon />} onClick={() => navigate('/sessions')} sx={SxProps}>
                    Calibration
                </Button>
            </UnderConstructionBadge>
            <UnderConstructionBadge>
                <Button color="inherit" startIcon={<BarChartIcon />} onClick={() => navigate('/sessions')} sx={SxProps}>
                    Visualizations
                </Button>
            </UnderConstructionBadge>
            <UnderConstructionBadge>
                <Button color="inherit" startIcon={<CalendarMonthIcon />} onClick={() => navigate('/sessions')} sx={SxProps}>
                    Planning
                </Button>
            </UnderConstructionBadge>
            <UnderConstructionBadge>
                <Button color="inherit" startIcon={<SettingsIcon />} onClick={() => navigate('/sessions')} sx={SxProps}>
                    Settings
                </Button>
            </UnderConstructionBadge>
            <SignoutButton />
        </>
    );
};
