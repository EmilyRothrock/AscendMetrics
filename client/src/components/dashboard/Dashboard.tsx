import React from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import ReadinessTile from './ReadinessTile';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import TileTrainingSession from './TileTrainingSession';
import NewSessionButton from './NewSessionButton';
import { RootState } from '../../store/store'; 
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SessionIcon from '@mui/icons-material/EventNote'; // Example icon for "Sessions"
import BalanceLineChart from '../charts/BalanceLineChart';
import SteppedAreaChart from '../charts/SteppedAreaChart';

// Landing page after logging in - surface level information about your Readiness, Past Sessions, and Visualizations for trends in past month
const Dashboard: React.FC = () => {
    const sessions = useSelector((state: RootState) => state.sessions.sessions);
    const sessionIds = useSelector((state: RootState) => state.sessions.sessionIds);
    const navigate = useNavigate();

    return (
        <div>
            <Grid container spacing={2} sx={{ minHeight: '90vh' }}>
                <Grid xs={12} md={4}>
                    <DashboardColumn>
                        <Stack direction='column' width={'100%'}>
                            <NewSessionButton/>
                            <ReadinessTile>Fingers and Forearms</ReadinessTile>
                            <ReadinessTile>Upper Body</ReadinessTile>
                            <ReadinessTile>Lower Body</ReadinessTile>
                        </Stack>
                    </DashboardColumn>
                </Grid>
                <Grid xs={12} md={4}>
                    <DashboardColumn>
                        <Stack width={'100%'}>
                        <Button variant='contained' startIcon={<SessionIcon />} onClick={() => navigate('/sessions')}>
                            Past Sessions
                        </Button>
                        {sessionIds.slice(0, 3).map((id: number) => {
                            const session = sessions[id];
                            return <TileTrainingSession key={id} session={session} />;
                        })}
                        </Stack>
                    </DashboardColumn>
                </Grid>
                <Grid xs={12} md={4}>
                    <DashboardColumn>
                        <Typography variant='h5'>Visualizations</Typography>
                        <Stack width={'100%'}>
                            <SteppedAreaChart />
                            <BalanceLineChart />
                        </Stack>
                    </DashboardColumn>
                </Grid>
            </Grid>
        </div>
    );
}

export default Dashboard;


interface DashboardColumnProps {
    children: React.ReactNode; // Specifying that children must be a string
}

const DashboardColumn: React.FC<DashboardColumnProps> = ({children}) => {
    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {children}
        </Box>
    );
};