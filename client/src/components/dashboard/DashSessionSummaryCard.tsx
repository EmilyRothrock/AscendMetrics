import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  CardHeader,
  Box,
  Collapse,
  Grid,
} from "@mui/material";
import LoadBarChart from "../charts/LoadBarChart";
import ActivityTimePieChart from "../charts/ActivityTimePieChart";
import { generateDisplayName } from "../../types/session"; // adjust the path to where your types are defined
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { TrainingSession } from "@shared/types";

const DashSessionSummaryCard: React.FC<{ session: TrainingSession }> = ({
  session,
}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const formattedDateTime = DateTime.fromISO(
    session.completedOn
  ).toLocaleString(DateTime.DATETIME_MED);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEditClick = () => {
    navigate(`/sessions/${session.id}`);
  };

  return (
    <Card elevation={2} sx={{ margin: 1, padding: 1 }}>
      <CardHeader
        title={
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {session.name || generateDisplayName(session, 15)}
          </Typography>
        }
        subheader={
          <>
            <Typography variant="subtitle2" color="textSecondary">
              {formattedDateTime}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Total Duration: {session.duration?.toFixed(2) ?? "N/A"} hours
            </Typography>
          </>
        }
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
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} sx={{ aspectRatio: "1" }}>
              <ActivityTimePieChart
                sessionActivities={session.sessionActivities}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ aspectRatio: "1" }}>
              <LoadBarChart data={session.loads} />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default DashSessionSummaryCard;
