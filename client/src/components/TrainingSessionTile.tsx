import React from 'react';
import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { PieChart } from '@mui/x-charts/PieChart';

const TrainingSessionTile: React.FC = () => {
    return (
        <Paper elevation={2} sx={{ margin: 1, padding: 2, alignContent:'center' }}>
            <Grid container spacing={1}>
                <Grid container direction={'column'} xs={3} >
                    <Grid>
                        <Typography variant="body1">DD/MM/YY HH:MM</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1">Name of Session</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1">Finger ??</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1">Upper ??</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1">Lower ??</Typography>
                    </Grid>
                </Grid>
                <Grid container direction={'column'} xs={9} alignItems="center">
                    <Grid>
                        <Typography variant="body1">Duration: h:mm</Typography>
                    </Grid>
                    <Grid>
                        <PieChart
                            series={[
                                {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                                },
                            ]}
                            height={100}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TrainingSessionTile;
