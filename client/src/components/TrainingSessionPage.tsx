import React from 'react';
import MyAppBar from './MyAppBar';
import Box from '@mui/material/Box';
import NewSessionButton from './NewSessionButton';
import { Part, Session } from '../types';
import TileTrainingSession from './TileTrainingSession';

const TrainingSessionPage: React.FC = () => {
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
          id: 1,
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
        <>
            <MyAppBar />
            <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <NewSessionButton />
                {sessions.map(session => (
                  <TileTrainingSession key={session.id} session={session} />
                ))}
            </Box>
        </>
    );
}

export default TrainingSessionPage;