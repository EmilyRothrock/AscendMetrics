import React from 'react';
import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

interface ReadinessTileProps {
    children: string; // Specifying that children must be a string
}

const ReadinessTile: React.FC<ReadinessTileProps> = ({ children }) => {
    return (
        <Paper elevation={2} sx={{ margin: 1, padding: 2 }}>
            <Grid container spacing={2}>
                <Grid xs={10}>
                    <Typography variant="body1">{children}</Typography>
                </Grid>
                <Grid xs={2}>
                    <Typography variant="body1">100%</Typography>
                </Grid>
                <Grid xs={12} minHeight={20}>
                    <Typography variant="body1">
                        The overall readiness today is great. There are no contributing factors of concern! Go try hard!	
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ReadinessTile;
