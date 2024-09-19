import React from "react";
import { Card, IconButton, Typography, Grid } from "@mui/material";
import { generateDisplayName } from "../../types/session"; // adjust the path to where your types are defined
import { TrainingSession } from "@shared/types";
import EditIcon from "@mui/icons-material/Edit";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import LoadBarChart from "../charts/LoadBarChart";
import SessionGantt from "../charts/SessionGantt";

const SessionSummaryCard: React.FC<{ session: TrainingSession }> = ({
  session,
}) => {
  const navigate = useNavigate();
  const formattedDateTime = DateTime.fromISO(
    session.completedOn
  ).toLocaleString(DateTime.DATETIME_MED);

  const handleEditClick = () => {
    navigate(`/sessions/${session.id}`);
  };

  return (
    <Card elevation={2} sx={{ margin: 1, alignContent: "center" }}>
      <IconButton
        onClick={handleEditClick}
        sx={{ position: "absolute", margin: "5px" }}
      >
        <EditIcon sx={{ fontSize: 30 }} />
      </IconButton>
      <Grid container direction={"row"} sx={{ alignItems: "center" }}>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{ paddingLeft: { xs: "60px", sm: "30px" }, alignItems: "right" }}
        >
          <Typography
            variant="body1"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {session.name || generateDisplayName(session, 15)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {formattedDateTime}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Total Duration: {session.duration.toFixed(2)} hours
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: { xs: "none", md: "block" } }}>
          <LoadBarChart data={session.loads} />
        </Grid>
        <Grid item xs={12} sm={8} sx={{ display: { xs: "none", md: "block" } }}>
          <SessionGantt sessionActivities={session.sessionActivities} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default SessionSummaryCard;
