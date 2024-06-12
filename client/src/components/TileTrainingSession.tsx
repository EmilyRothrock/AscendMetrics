import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import LoadBarChart from './charts/LoadBarChart';
import ActivityTimePieChart from './charts/ActivityTimePieChart';
import { Session } from '../types'; // adjust the path to where your types are defined
import EditIcon from '@mui/icons-material/Edit';
import { DateTime } from 'luxon';

interface TileTrainingSessionProps {
    session: Session;
}

const TileTrainingSession: React.FC<TileTrainingSessionProps> = ({ session }) => {
    const formattedDateTime = DateTime.fromISO(session.dateTime).toLocaleString(DateTime.DATETIME_MED);

    return (
        <Paper elevation={2} sx={{ margin: 1, padding: 2, alignContent: 'center' }}>
            <Box sx={{ borderBottom: '2px solid grey', mb:1 }}>
                <Grid container>
                    <Grid xs={2}>
                        <EditIcon sx={{ fontSize:30}}/>
                    </Grid>
                    <Grid xs={8} container justifyContent="center">
                        <Typography variant="body1" fontSize={'18px'} sx={{ textAlign: 'center' }}>{session.name}</Typography>
                    </Grid>
                    <Grid xs={2}>
                    </Grid>
                    <Grid xs={12} container justifyContent="center">
                        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>{formattedDateTime}</Typography>
                    </Grid>
                    <Grid xs={12} container justifyContent="center">
                        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>Total Duration: {session.duration} hours</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2} >
                <Grid xs={6}>
                    <ActivityTimePieChart activities={session.activities}/>
                </Grid>
                <Grid xs={6}>
                    <LoadBarChart data={session.loads}/>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TileTrainingSession;
