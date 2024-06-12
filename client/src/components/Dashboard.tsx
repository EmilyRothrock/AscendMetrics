import React from 'react';
import { Stack, Typography, Paper } from '@mui/material';
import ReadinessTile from './ReadinessTile';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import TileTrainingSession from './TileTrainingSession';
import { BarChart, LineChart } from '@mui/x-charts';
import MyAppBar from './MyAppBar';
import NewSessionButton from './NewSessionButton';
import { Part, Session } from '../types';

const Dashboard: React.FC = () => {
    const sessions: Session[] = [
        {
            id: 1,
            dateTime: '2024-03-17T19:00:00',
            name: 'Bouldering',
            duration: 2,
            notes: 'slab, cave',
            activities: [
              { 
                name: 'Bouldering', 
                startTime:'7:00PM',
                endTime:'8:00PM',
                notes:'slab',
                intensities: [
                  { part: Part.Fingers, intensity: 6 },
                  { part: Part.UpperBody, intensity: 6 },
                  { part: Part.LowerBody, intensity: 3 }
                ]
              },
              { 
                name: 'Bouldering', 
                startTime:'8:00PM',
                endTime:'9:00PM',
                notes:'cave',
                intensities: [
                  { part: Part.Fingers, intensity: 8 },
                  { part: Part.UpperBody, intensity: 9 },
                  { part: Part.LowerBody, intensity: 2 }
                ]
              }
            ],
            loads: [
              { part: Part.Fingers, load: 14 },
              { part: Part.UpperBody, load: 15 },
              { part: Part.LowerBody, load: 5 }
            ],
            strains: [
                { part: Part.Fingers, strain: 15 },
                { part: Part.UpperBody, strain: 16 },
                { part: Part.LowerBody, strain: 6 }
            ]
        },
        {
          id: 2,
          dateTime: '2024-03-27T20:00:00',
          name: 'Cardio, Bouldering, Power/Strength Endurance',
          duration: 2,
          notes: 'At Slaughter Recreation Center',
          activities: [
            { 
              name: 'Cardio', 
              startTime:'8:00PM',
              endTime:'8:30PM',
              notes:'biking to Slaughter',
              intensities: [
                { part: Part.Fingers, intensity: 0 },
                { part: Part.UpperBody, intensity: 0 },
                { part: Part.LowerBody, intensity: 8 }
              ]
            },
            { 
              name: 'Bouldering', 
              startTime:'8:30PM',
              endTime:'9:30PM',
              notes:'cave',
              intensities: [
                { part: Part.Fingers, intensity: 6 },
                { part: Part.UpperBody, intensity: 6 },
                { part: Part.LowerBody, intensity: 2 }
              ]
            },
            { 
              name: 'Power/Strength Endurance', 
              startTime:'9:30PM',
              endTime:'10:00PM',
              notes:'felt great on the wall!',
              intensities: [
                { part: Part.Fingers, intensity: 9 },
                { part: Part.UpperBody, intensity: 7 },
                { part: Part.LowerBody, intensity: 2 }
              ]
            }
          ],
          loads: [
            { part: Part.Fingers, load: 10.5 },
            { part: Part.UpperBody, load: 9.5 },
            { part: Part.LowerBody, load: 7 }
          ],
          strains: [
              { part: Part.Fingers, strain: 11.5 },
              { part: Part.UpperBody, strain: 10.5 },
              { part: Part.LowerBody, strain: 8 }
          ]
      },
    ];
    
    return (
        <div>
            <MyAppBar/>
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
                        <Typography variant='h6' >PAST TRAINING SESSIONS</Typography>
                        <Stack width={'100%'}>
                        {sessions.map(session => (
                            <TileTrainingSession key={session.id} session={session} />
                        ))}
                        </Stack>
                    </DashboardColumn>
                </Grid>
                <Grid xs={12} md={4}>
                    <DashboardColumn>
                        <Typography variant='h6'>VISUALIZATIONS</Typography>
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