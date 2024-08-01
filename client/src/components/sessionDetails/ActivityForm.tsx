import React, { useState, useEffect } from 'react';
import { Box, TextField, Slider, Autocomplete, useMediaQuery, useTheme, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { DateTime } from 'luxon';
import { Activity, BodyPartMetrics } from '../../types';
import ForwardIcon from '@mui/icons-material/Forward';

const activityOptions = [
  'Performance', 'Power', 'Finger Health', 'Power/Strength Endurance', 'PumpCap/AnCap', 'Strength', 'AeroCap', 'Warm-Up', 'Routesetting', 'Cross Training', 'Board Climbing', 'Bouldering', 'Routes', 'Cardio', 'Mobility/Stability', 'Stretching', 'Movement Practice', 'Work Capacity', 'Outdoor Bouldering', 'Outdoor Routes', 'Other'
];

const intensityMarks = {
  fingers: [
    { value: 0, label: 'Tip for Fingers 0' },
    { value: 1, label: 'Tip for Fingers 1' },
    { value: 2, label: 'Tip for Fingers 2' },
    { value: 3, label: 'Tip for Fingers 3' },
    { value: 4, label: 'Tip for Fingers 4' },
    { value: 5, label: 'Tip for Fingers 5' },
    { value: 6, label: 'Tip for Fingers 6' },
    { value: 7, label: 'Tip for Fingers 7' },
    { value: 8, label: 'Tip for Fingers 8' },
    { value: 9, label: 'Tip for Fingers 9' },
    { value: 10, label: 'Tip for Fingers 10' },
  ],
  upperBody: [
    { value: 0, label: 'Tip for Upper 0' },
    { value: 1, label: 'Tip for Upper 1' },
    { value: 2, label: 'Tip for Upper 2' },
    { value: 3, label: 'Tip for Upper 3' },
    { value: 4, label: 'Tip for Upper 4' },
    { value: 5, label: 'Tip for Upper 5' },
    { value: 6, label: 'Tip for Upper 6' },
    { value: 7, label: 'Tip for Upper 7' },
    { value: 8, label: 'Tip for Upper 8' },
    { value: 9, label: 'Tip for Upper 9' },
    { value: 10, label: 'Tip for Upper 10' },
  ],
  lowerBody: [
    { value: 0, label: 'Tip for Lower 0' },
    { value: 1, label: 'Tip for Lower 1' },
    { value: 2, label: 'Tip for Lower 2' },
    { value: 3, label: 'Tip for Lower 3' },
    { value: 4, label: 'Tip for Lower 4' },
    { value: 5, label: 'Tip for Lower 5' },
    { value: 6, label: 'Tip for Lower 6' },
    { value: 7, label: 'Tip for Lower 7' },
    { value: 8, label: 'Tip for Lower 8' },
    { value: 9, label: 'Tip for Lower 9' },
    { value: 10, label: 'Tip for Lower 10' },
  ],
};

const IntensityInput: React.FC<{ bodyPart: keyof BodyPartMetrics; value: number; onChange: (value: number) => void; }> = ({ bodyPart, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  return (
    <>
      <TextField
        label={bodyPart}
        type="number"
        fullWidth
        variant="standard"
        value={value}
        InputProps={{ readOnly: true }}
        sx={{
          '& .MuiInputBase-input': {
            textAlign: 'center',
          },
        }}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        PaperProps={{
          style: {
            width: isMobile ? '80%' : '20%',
            height: '80%',
            margin: isMobile ? '0' : 'auto',
            padding: '16px',
          },
        }}
      >
        <DialogContent>
          <Slider
            orientation="vertical"
            value={value}
            min={0}
            max={10}
            step={1}
            onChange={handleSliderChange}
            marks={intensityMarks[bodyPart]}
            sx={{ width: "10px" }}
          />
        </DialogContent>
        <DialogActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Button onClick={handleClose} variant='contained'>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ActivityForm: React.FC<{ activity: Activity; onActivityChange: (activity: Activity) => void; }> = ({ activity, onActivityChange }) => {
  const [formData, setFormData] = useState<Activity>(activity);

  useEffect(() => {
    setFormData(activity);
  }, [activity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedActivity = { ...formData, [name]: value };
    setFormData(updatedActivity);
    onActivityChange(updatedActivity);
  };

  const handleIntensityChange = (bodyPart: keyof BodyPartMetrics, value: number) => {
    const updatedActivity = {
      ...formData,
      intensities: {
        ...formData.intensities,
        [bodyPart]: value,
      },
    };
    setFormData(updatedActivity);
    onActivityChange(updatedActivity);
  };

  return (
    <Box sx={{ border: '1px solid lightgrey', borderRadius: '5px', padding: 2 }}>
      <Autocomplete
        options={activityOptions}
        value={formData.name}
        onChange={(event, value) => {
          const updatedActivity = { ...formData, name: value || '' };
          setFormData(updatedActivity);
          onActivityChange(updatedActivity);
        }}
        renderInput={(params) => <TextField {...params} label="Activity Name" variant="standard" fullWidth />}
        sx={{ pr: 4 }}
      />
      <Box display="flex" alignItems="center" justifyContent="center" paddingTop="12px" >
        <TextField
          label="Start Time"
          name="startTime"
          type="time"
          value={DateTime.fromISO(formData.startTime).toFormat('HH:mm')}
          onChange={handleInputChange}
        />
        <ForwardIcon fontSize="large" />
        <TextField
          label="End Time"
          name="endTime"
          type="time"
          value={DateTime.fromISO(formData.endTime).toFormat('HH:mm')}
          onChange={handleInputChange}
        />
      </Box>
      <TextField
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleInputChange}
        fullWidth
        variant="standard"
        multiline
        sx={{ marginTop:"6px", marginBottom:"8px" }}
      />
      <Box display="flex" justifyContent="space-between">
        <IntensityInput
          bodyPart="fingers"
          value={formData.intensities.fingers}
          onChange={(value) => handleIntensityChange('fingers', value)}
        />
        <IntensityInput
          bodyPart="upperBody"
          value={formData.intensities.upperBody}
          onChange={(value) => handleIntensityChange('upperBody', value)}
        />
        <IntensityInput
          bodyPart="lowerBody"
          value={formData.intensities.lowerBody}
          onChange={(value) => handleIntensityChange('lowerBody', value)}
        />
      </Box>
    </Box>
  );
};

export default ActivityForm;
