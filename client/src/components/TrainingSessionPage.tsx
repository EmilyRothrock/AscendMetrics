import React from 'react';
import Box from '@mui/material/Box';
import NewSessionButton from './NewSessionButton';
import TileTrainingSession from './TileTrainingSession';
import demoData from '../assets/demoData';

const TrainingSessionPage: React.FC = () => {
    return (
        <>
            <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <NewSessionButton />
                {demoData.sessions.map(session => (
                  <TileTrainingSession key={session.id} session={session} />
                ))}
            </Box>
        </>
    );
}

export default TrainingSessionPage;