import React from "react";
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ReadinessGauge from "../charts/ReadinessGauge";

interface ReadinessTileProps {
  data: {
    title: string;
    value: number;
    feedback: string;
    color: string;
  };
}

const ReadinessTile: React.FC<ReadinessTileProps> = ({ data }) => {
  const { title, value, feedback, color } = data;
  return (
    <Paper elevation={2} sx={{ margin: 1, padding: 2, minHeight: 50 }}>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2">{feedback}</Typography>
        </Grid>
        <Grid xs={6}>
          <ReadinessGauge value={value} color={color} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReadinessTile;
