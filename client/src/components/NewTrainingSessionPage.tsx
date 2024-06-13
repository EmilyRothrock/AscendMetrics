import React, { useState } from 'react';
import MyAppBar from './MyAppBar';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Button, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import ActivitiesInput from './ActivitiesInput';
import SaveIcon from '@mui/icons-material/Save';
import { BarChart, LineChart } from '@mui/x-charts';
import { Activity } from '../types';

const NewTrainingSessionPage: React.FC = () => {
  const [sessionDate, setSessionDate] = useState<DateTime | null>(DateTime.now());
  const [sessionName, setSessionName] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([
    { name: '', startTime: '', endTime: '', notes: '', intensities: [] }
  ]);

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      { name: '', startTime: '', endTime: '', notes: '', intensities: [] }
    ]);
  };

  return (
    <>
      <MyAppBar />
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Grid container spacing={2}>
          <Grid xs={12} md={4} container spacing={2}>
            <Grid xs={12} sm={6}>
              <DatePicker
                label="Training Date"
                value={sessionDate}
                onChange={(date) => setSessionDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                label="Session Name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                label="Session Notes"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                multiline
                fullWidth
              />
            </Grid>
            <Grid xs={12}>
              <ActivitiesInput activities={activities} setActivities={setActivities} />
            </Grid>
            <Grid xs={12}>
              <Button onClick={handleAddActivity} variant="contained" fullWidth>Add Activity</Button>
            </Grid>
            <Grid xs={12}>
              <SaveButton />
            </Grid>
          </Grid>
          <Grid md={8} sx={{ display: { xs: 'none', md: 'block' } }} direction={'column'}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              height={300}
            />
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
              height={300}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
};

export default NewTrainingSessionPage;

const SaveButton: React.FC = () => {
  const handleSave = () => {
    console.log('trying to save!');
  };

  return (
    <Button variant="contained" startIcon={<SaveIcon />} fullWidth onClick={handleSave} sx={{ height: '100%' }}>
      Save
    </Button>
  );
};
