import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ActivityForm from './ActivityForm';
import { Activity } from '../../types';
import { DateTime } from 'luxon';

// List of activities within session form - manages visual appearance
const ActivityList: React.FC<{ activities: Activity[]; setActivities: (activities: Activity[]) => void; }> = ({ activities, setActivities }) => {
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
      {activities.map(activity => (
        <Box key={activity.id} my={2} position="relative">
          <IconButton
            aria-label="more"
            aria-controls={`menu-${activity.id}`}
            aria-haspopup="true"
            onClick={(e) => handleMenuOpen(e, activity.id)}
            style={{ position: 'absolute', top: 0, right: 0 }}
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
            <ActivityForm activity={activity} />
          ) : (
            <Box sx={{ border: '1px solid lightgrey', borderRadius: '5px', padding: 2 }}>
              <Typography>{activity.name || 'No name selected'}</Typography>
            </Box>
          )}
        </Box>
      ))}
      <Button onClick={() => setActivities([
        ...activities,
        {
          id: Date.now(), // unique identifier based on the current timestamp
          name: '', // empty name to be filled out
          startTime: DateTime.now().toISO(), // current date and time in ISO format
          endTime: DateTime.now().toISO(), // current date and time in ISO format, can be adjusted later
          notes: '', // empty notes
          duration: 0, // default duration set to 0, to be updated
          intensities: {
            fingers: 0,
            upperBody: 0,
            lowerBody: 0
          },
          loads: {
            fingers: 0, // default load for fingers
            upperBody: 0, // default load for upper body
            lowerBody: 0 // default load for lower body
          }
        }
      ])}>
        Add Activity
      </Button>
    </Box>
  );
};

export default ActivityList;
