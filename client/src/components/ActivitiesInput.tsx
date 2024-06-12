import { Autocomplete, TextField, Stack, Grid, Container, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import ForwardIcon from '@mui/icons-material/Forward';
import MenuIcon from '@mui/icons-material/Menu';

interface Activity {
    name: string;
    startTime: string;
    endTime: string;
    fingerIntensity: string;
    upperIntensity: string;
    lowerIntensity: string;
    notes: string;
    expanded?: boolean;
}

interface ActivitiesInputProps {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const ActivitiesInput: React.FC<ActivitiesInputProps> = ({ activities, setActivities }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentActivityIndex, setCurrentActivityIndex] = useState<number | null>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        setAnchorEl(event.currentTarget);
        setCurrentActivityIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentActivityIndex(null);
    };

    const handleDelete = () => {
        if (currentActivityIndex !== null) {
            setActivities(prev => prev.filter((_, i) => i !== currentActivityIndex));
            handleClose();
        }
    };

    const toggleExpand = () => {
        if (currentActivityIndex !== null) {
            setActivities(prev => prev.map((activity, i) => 
                i === currentActivityIndex ? { ...activity, expanded: !activity.expanded } : activity
            ));
            handleClose();
        }
    };

    const updateActivityField = (index: number, field: keyof Activity, value: string) => {
        setActivities(prev => prev.map((activity, i) =>
            i === index ? { ...activity, [field]: value } : activity
        ));
    };

    const activityOptions = [
        'Performance', 'Power', 'Finger Health', 'Power/Strength Endurance', 'PumpCap/AnCap', 'Strength', 'AeroCap', 'Warm-Up', 'Routesetting', 'Cross Training', 'Board Climbing', 'Bouldering', 'Routes', 'Cardio', 'Mobility/Stability', 'Stretching', 'Movement Practice', 'Work Capacity', 'Outdoor Bouldering', 'Outdoor Routes', 'Other'
    ];

    return (
        <Stack spacing={2}>
            {activities.map((activity, index) => (
                <Container key={index} sx={{ border: '1px solid lightgrey', borderRadius: '5px', padding: 2 }}>
                    {
                        activity.expanded ? 
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <Autocomplete
                                    options={activityOptions}
                                    value={activity.name}
                                    onChange={(event, newValue) => updateActivityField(index, 'name', newValue || '')}
                                    renderInput={(params) => <TextField {...params} label="Activity Name" variant="standard" fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton onClick={(e) => handleMenuClick(e, index)}><MenuIcon /></IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && currentActivityIndex === index}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                    <MenuItem onClick={toggleExpand}>{activity.expanded ? 'Show Less' : 'Show More'}</MenuItem>
                                </Menu>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="Start Time"
                                    type="time"
                                    value={activity.startTime}
                                    onChange={(e) => updateActivityField(index, 'startTime', e.target.value)}
                                    fullWidth
                                    variant="standard"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ForwardIcon fontSize="large" />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="End Time"
                                    type="time"
                                    value={activity.endTime}
                                    onChange={(e) => updateActivityField(index, 'endTime', e.target.value)}
                                    fullWidth
                                    variant="standard"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Finger"
                                    type="number"
                                    value={activity.fingerIntensity}
                                    onChange={(e) => updateActivityField(index, 'fingerIntensity', e.target.value)}
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Upper"
                                    type="number"
                                    value={activity.upperIntensity}
                                    onChange={(e) => updateActivityField(index, 'upperIntensity', e.target.value)}
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Lower"
                                    type="number"
                                    value={activity.lowerIntensity}
                                    onChange={(e) => updateActivityField(index, 'lowerIntensity', e.target.value)}
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Notes"
                                    value={activity.notes}
                                    onChange={(e) => updateActivityField(index, 'notes', e.target.value)}
                                    multiline
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={2}>
                            <Grid item xs={10} sx={{justifyContent:'left', alignItems: 'center', display:"flex"}}>
                                <Typography variant="subtitle1">{activity.name || 'Name Not Selected'}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={(e) => handleMenuClick(e, index)}><MenuIcon /></IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && currentActivityIndex === index}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                    <MenuItem onClick={toggleExpand}>{activity.expanded ? 'Show Less' : 'Show More'}</MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    }
                </Container>
            ))}
        </Stack>
    );
};

export default ActivitiesInput;