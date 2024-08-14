import React from "react";
import { Stack, Typography } from "@mui/material";
import ReadinessTile from "./ReadinessTile";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import DashSessionSummaryCard from "./DashSessionSummaryCard";
import NewSessionButton from "./NewSessionButton";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import BalanceLineChart from "../charts/BalanceLineChart";
import SteppedAreaChart from "../charts/SteppedAreaChart";
import { bodyPartLabels } from "../../styles/bodyPartLabels";
import { bodyPartColors } from "../../styles/bodyPartColors";
import { selectMetricsByDate } from "../../store/metricsSlice";
import { DateTime } from "luxon";

// Landing page after logging in - surface level information about your Readiness, Past Sessions, and Visualizations for trends in past month
const Dashboard: React.FC = () => {
  const sessions = useSelector((state: RootState) => state.sessions.sessions);
  const sessionIds = useSelector(
    (state: RootState) => state.sessions.sessionIds
  );
  const { metrics } = useSelector((state: RootState) =>
    selectMetricsByDate(state, DateTime.now().toISODate())
  );

  const readinessValues = metrics.readiness
    ? metrics.readiness
    : { fingers: 0, upperBody: 0, lowerBody: 0 };

  const readinessData = ["fingers", "upperBody", "lowerBody"].map(
    (bodyPart) => {
      return {
        title: bodyPartLabels[bodyPart],
        value: Math.round(readinessValues[bodyPart] * 100),
        feedback: "Textual feedback on training patterns coming soon!",
        color: bodyPartColors[bodyPart],
      };
    }
  );

  return (
    <div>
      <Grid container spacing={2} sx={{ minHeight: "90vh" }}>
        <Grid xs={12} md={4}>
          <Typography variant="h5">Readiness</Typography>
          <Stack direction="column" width={"100%"}>
            {readinessData.map((data) => {
              return <ReadinessTile data={data} />;
            })}
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h5">Past Sessions</Typography>
          <Stack width={"100%"}>
            <NewSessionButton />
            {sessionIds.slice(0, 3).map((id: number) => {
              const session = sessions[id];
              return <DashSessionSummaryCard key={id} session={session} />;
            })}
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h5">Visualizations</Typography>
          <Stack>
            <SteppedAreaChart />
            <BalanceLineChart />
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
