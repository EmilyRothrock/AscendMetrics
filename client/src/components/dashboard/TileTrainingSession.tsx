import React, { useState } from 'react';
import { Card, CardContent, IconButton, Typography,  CardHeader, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import LoadBarChart from '../charts/LoadBarChart';
import ActivityTimePieChart from '../charts/ActivityTimePieChart';
import { Session, generateDisplayName } from '../../types'; // adjust the path to where your types are defined
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';

const TileTrainingSession: React.FC<{ session: Session; }> = ({ session }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const formattedDateTime = DateTime.fromISO(session.completedOn).toLocaleString(DateTime.DATETIME_MED);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleEditClick = () => {
        navigate(`/sessions/${session.id}`);
    };

    return (
        <Card elevation={2} sx={{ margin: 1, padding: 2, alignContent: 'center' }}>
            <CardHeader
                action={
                    <Box display="flex" flexDirection="column">
                        <IconButton onClick={handleEditClick}>
                            <EditIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                        <IconButton onClick={handleExpandClick}>
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                }
                title={
                    <Typography 
                        sx={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            width: '100%',
                        }}
                    >
                        {session.name || generateDisplayName(session)}
                    </Typography>
                }
                subheader={<>
                    <Typography variant="subtitle2" color="textSecondary">
                        {formattedDateTime}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        Total Duration: {session.duration.toFixed(2)} hours
                    </Typography>
                </>}
                sx={{ 
                    '.MuiCardHeader-content': { 
                        maxWidth: 'calc(100% - 30px)' // Adjust this based on icon widths
                    } 
                }}
            />
            {expanded && (
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                            <ActivityTimePieChart activities={session.activities} />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <LoadBarChart data={session.loads} />
                        </Grid>
                    </Grid>
                </CardContent>
            )}
        </Card>
    );
};

export default TileTrainingSession;
