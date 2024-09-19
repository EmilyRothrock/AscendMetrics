// TrainingSessionEditor.tsx

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { TrainingSession, SessionActivity } from "@shared/types";
import { defaultNewTrainingSession } from "../../types/session";
import TrainingSessionForm from "./TrainingSessionForm";
import SessionGantt from "../charts/SessionGantt";
import { defaultNewSessionActivity } from "../../types/activity";
import { Grid } from "@mui/material";
import {
  deleteSession as deleteSessionInAPI,
  createSession as createSessionInAPI,
  updateSession as updateSessionInAPI,
} from "../../services/sessionService";
import {
  createSession as createSessionInStore,
  updateSession as updateSessionInStore,
  deleteSession as deleteSessionInStore,
  selectSessionById,
} from "../../store/sessionMetricsSlice";

const TrainingSessionEditor: React.FC = () => {
  // Initialize training session state
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [trainingSessionData, setTrainingSessionData] =
    useState<TrainingSession>(
      id
        ? useSelector((state: RootState) =>
            selectSessionById(state, Number(id))
          )
        : defaultNewTrainingSession()
    );
  console.log(trainingSessionData);

  const handleSessionChange = (newSessionData: Partial<TrainingSession>) => {
    setTrainingSessionData((prevState) => ({
      ...prevState,
      ...newSessionData,
    }));
  };

  const handleActivityChange = (
    id: number,
    newActivityData: Partial<SessionActivity>
  ) => {
    setTrainingSessionData((prevState) => ({
      ...prevState,
      sessionActivities: prevState.sessionActivities.map((activity) =>
        activity.id === id ? { ...activity, ...newActivityData } : activity
      ),
    }));
  };

  const addActivity = () => {
    const newActivity = defaultNewSessionActivity();
    setTrainingSessionData((prevState) => ({
      ...prevState,
      sessionActivities: [...prevState.sessionActivities, newActivity],
    }));
  };

  const removeActivity = (id: number) => {
    setTrainingSessionData((prevState) => ({
      ...prevState,
      sessionActivities: prevState.sessionActivities.filter(
        (activity) => activity.id !== id
      ),
    }));
  };

  const saveSession = async (): Promise<void> => {
    try {
      if (trainingSessionData.id < 0) {
        const createdSession = await createSessionInAPI(trainingSessionData);
        // Update the session data with the newly created session ID
        setTrainingSessionData(createdSession);
        // Dispatch the action to create the session in the store
        dispatch(createSessionInStore(createdSession));
      } else {
        console.log("updating existing session!");
        const updatedSession = await updateSessionInAPI(trainingSessionData);
        console.log(updatedSession);
        setTrainingSessionData(updatedSession);

        // Dispatch the action to update the session in the store
        dispatch(updateSessionInStore(updatedSession));
      }

      // If the session is saved successfully, resolve the Promise
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving session:", error);

      // If an error occurs during saving, reject the Promise with an error
      return Promise.reject(error);
    }
  };

  const deleteSession = () => {
    deleteSessionInAPI(Number(id));
    dispatch(deleteSessionInStore(Number(id)));
    navigate(-1);
  };

  // Render form and gantt chart
  return (
    <>
      <Grid container direction={"row"}>
        <Grid item xs={12} md={4}>
          <TrainingSessionForm
            trainingSessionData={trainingSessionData}
            onSessionChange={handleSessionChange}
            onActivityChange={handleActivityChange}
            addActivity={addActivity}
            removeActivity={removeActivity}
            saveSession={saveSession}
            deleteSession={deleteSession}
          />
        </Grid>
        <Grid item md={8} sx={{ display: { xs: "none", md: "block" } }}>
          <SessionGantt
            activities={trainingSessionData.sessionActivities}
            yAxisLabels={true}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TrainingSessionEditor;
