import React from 'react';
import { Stack, Typography, Button, Paper } from '@mui/material';
import ReadinessTile from './ReadinessTile';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import AddBoxIcon from '@mui/icons-material/AddBox';
import TrainingSessionTile from './TrainingSessionTile';
import { BarChart, LineChart } from '@mui/x-charts';
import MyAppBar from './MyAppBar';

const Dashboard: React.FC = () => {
    return (
        <div>
            <MyAppBar/>
            <Grid container spacing={2} sx={{ marginTop: 1, minHeight: '90vh' }}>
                <Grid xs={12} md={4}>
                    <DashboardColumn>
                        <Stack direction='column' width={'100%'}>
                            <Button variant='contained' startIcon={<AddBoxIcon />} sx={{ margin: 1 }}>Log New Training Session</Button>
                            <ReadinessTile>Fingers and Forearms</ReadinessTile>
                            <ReadinessTile>Upper Body</ReadinessTile>
                            <ReadinessTile>Lower Body</ReadinessTile>
                        </Stack>
                    </DashboardColumn>
                </Grid>
                <Grid xs={12} md={4}>
                    <DashboardColumn>
                        <Typography variant='body1' >PAST TRAINING SESSIONS</Typography>
                        <Stack width={'100%'}>
                            <TrainingSessionTile/>
                            <TrainingSessionTile/>
                        </Stack>
                    </DashboardColumn>
                </Grid>
                <Grid xs={12} md={4}>
                    <DashboardColumn>
                        <Typography>VISUALIZATIONS</Typography>
                        <Stack width={'100%'}>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                                series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                                height={300}
                            />
                            <LineChart
                                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                series={[
                                    {
                                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                                    },
                                ]}
                                height={300}
                            />
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
        <Paper elevation={2} sx={{
            height: '100%',
            width: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {children}
        </Paper>
    );
};