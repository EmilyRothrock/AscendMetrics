import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Grid } from '@mui/material';
import ActivityList from './ActivityList';
import { Session, defaultNewSession } from '../../types';
import SessionGantt from '../charts/SessionGantt';
import { useData } from '../DataProvider';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

const SessionPage = () => {
  const { id } = useParams(); // Get the session ID from URL
  const { userDataBundle } = useData(); 

  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<Session>(defaultNewSession());

  useEffect(() => {
    if (id === 'new') {
      setSessionData(defaultNewSession());
    } else {
      const numericId = Number(id);
      console.log(userDataBundle.sessions);
      const session = userDataBundle.sessions.find(s => s.id === numericId);
      setSessionData(session);
    }
  }, [id, userDataBundle.sessions]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSessionData({ ...sessionData, [name]: value });
  };

  const saveSession = () => {
    // Save session logic
  };

  const deleteSession = () => {
    // Delete session logic
    navigate(-1);
  };

  if (!sessionData) {
    return <div>Loading session data...</div>;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <Box component="form" noValidate autoComplete="off">
          <Typography variant="h4">{id === 'new' ? 'New Session' : 'Edit Session'}</Typography>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={DateTime.fromISO(sessionData.date).toFormat('yyyy-MM-dd')}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            sx={{ mt: '8px', mb: '4px' }}
          />
          <TextField
            label="Name"
            name="name"
            value={sessionData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            sx={{ mt: '8px', mb: '4px' }}
          />
          <TextField
            label="Session Notes"
            name="notes"
            value={sessionData.notes}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            sx={{ mt: '8px', mb: '4px' }}
          />
          <ActivityList activities={sessionData.activities} setActivities={(activities) => setSessionData({ ...sessionData, activities })} />
          <Button onClick={saveSession} variant="contained" color="primary">Save</Button>
          {id === "new" ? 
          <Button onClick={() => navigate(-1)} variant="contained" color="secondary">Cancel</Button> 
          : 
          <Button onClick={deleteSession} variant="contained" color="secondary">Delete</Button>
          }
        </Box>
      </Grid>
      <Grid item md={8} sx={{ display: { xs: 'none', md: 'block' } }}>
        {/* <SessionGantt data={sessionData.activities} /> */}
      </Grid>
    </Grid>
  );
};

export default SessionPage;
