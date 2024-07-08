import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, Menu, MenuItem, FormHelperText, Alert, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ActivityForm from './ActivityForm';
import { Activity, defaultNewActivity } from '../../types';

const ActivityList: React.FC<{
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  onActivityChange: (activity: Activity) => void;
  errors: { [key: string]: string }; }> = ({ activities, setActivities, onActivityChange, errors }) => {
  const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, activityId: number) => {
    setCurrentActivityId(activityId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentActivityId(null);
  };

  const handleDeleteActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
    handleMenuClose();
  };

  const toggleExpandActivity = (id: number) => {
    const newExpandedActivities = new Set(expandedActivities);
    if (newExpandedActivities.has(id)) {
      newExpandedActivities.delete(id);
    } else {
      newExpandedActivities.add(id);
    }
    setExpandedActivities(newExpandedActivities);
    handleMenuClose();
  };

  return (
    <Box>
      <Typography variant="h6">Activities</Typography>
      {activities.map((activity, index) => (
        <Box key={activity.id} position="relative">
          <IconButton
            aria-label="more"
            aria-controls={`menu-${activity.id}`}
            aria-haspopup="true"
            onClick={(e) => handleMenuOpen(e, activity.id)}
            style={{ position: 'absolute', right: 5, top: 10}}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`menu-${activity.id}`}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl) && currentActivityId === activity.id}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => toggleExpandActivity(activity.id)}>
              {expandedActivities.has(activity.id) ? 'See Less' : 'See More'}
            </MenuItem>
            <MenuItem onClick={() => handleDeleteActivity(activity.id)}>Delete</MenuItem>
          </Menu>
          {expandedActivities.has(activity.id) ? (
            <ActivityForm activity={activity} onActivityChange={onActivityChange} />
          ) : (
            <Box sx={{ border: '1px solid lightgrey', borderRadius: '5px', padding: 2 }}>
              <Typography>{activity.name || 'No name selected'}</Typography>
            </Box>
          )}
          <Stack spacing={1} pt={1}>
          {errors[`activity-name-${index}`] && (
            <Alert severity="error">{errors[`activity-name-${index}`]}</Alert>
          )}
          {errors[`activity-startTime-${index}`] && (
            <Alert severity="error">{errors[`activity-startTime-${index}`]}</Alert>
          )}
          {errors[`activity-endTime-${index}`] && (
            <Alert severity="error">{errors[`activity-endTime-${index}`]}</Alert>
          )}
          {errors[`activity-time-${index}`] && (
            <Alert severity="error">{errors[`activity-time-${index}`]}</Alert>
          )}
          {errors[`activity-intensities-${index}`] && (
            <Alert severity="error">{errors[`activity-intensities-${index}`]}</Alert>
          )}
          </Stack>
        </Box>
      ))}
      <Button fullWidth variant="outlined" onClick={() => setActivities([
        ...activities,
        defaultNewActivity()
      ])}>
        Add Activity
      </Button>
      {errors.activities && (
        <FormHelperText error>{errors.activities}</FormHelperText>
      )}
    </Box>
  );
};

export default ActivityList;
