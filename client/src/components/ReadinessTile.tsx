import React from 'react';
import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Gauge } from '@mui/x-charts';

interface ReadinessTileProps {
    children: string; // Specifying that children must be a string
}

const ReadinessTile: React.FC<ReadinessTileProps> = ({ children }) => {
    return (
        <Paper elevation={2} sx={{ margin: 1, padding: 2, minHeight:50 }}>
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <Typography variant="body1">{children}</Typography>
                    <Typography variant="body1">
                        The overall readiness today is great. There are no contributing factors of concern! Go try hard!	
                    </Typography>
                </Grid>
                <Grid xs={4}>
                    <Gauge width={100} height={100} value={60} />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ReadinessTile;
