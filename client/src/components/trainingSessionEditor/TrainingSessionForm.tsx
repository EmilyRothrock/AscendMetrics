// TrainingSessionForm.tsx

import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormHelperText,
  ButtonGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import { TrainingSession, SessionActivity } from "@shared/types";
import SessionActivityForm from "./SessionActivityForm";
import WarningDialog from "./WarningDialog";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";

interface TrainingSessionFormProps {
  trainingSessionData: TrainingSession;
  onTrainingSessionChange: (newSessionData: Partial<TrainingSession>) => void;
  onSessionActivityChange: (
    id: number,
    newActivityData: Partial<SessionActivity>
  ) => void;
  addSessionActivity: () => void;
  removeSessionActivity: (id: number) => void;
  saveTrainingSession: () => Promise<void>;
  deleteTrainingSession: () => void;
}

const TrainingSessionForm: React.FC<TrainingSessionFormProps> = ({
  trainingSessionData,
  onTrainingSessionChange,
  onSessionActivityChange,
  addSessionActivity,
  removeSessionActivity,
  saveTrainingSession,
  deleteTrainingSession,
}) => {
  const navigate = useNavigate();
  // Form validation - set errors and warnings
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const validateForm = () => {
    const newErrors: { [key: string]: any } = {};
    const newWarnings: string[] = [];

    // Validate session date
    if (!trainingSessionData.completedOn) {
      newErrors.completedOn = "Session date is required";
    } else {
      const sessionDate = DateTime.fromISO(trainingSessionData.completedOn);
      if (sessionDate > DateTime.now()) {
        newErrors.completedOn = "Date cannot be in the future";
      } else if (DateTime.now().diff(sessionDate, "months").months > 6) {
        newWarnings.push("Date is over 6 months ago (often accidental year)");
      }
    }

    // Validate activities
    if (trainingSessionData.sessionActivities.length === 0) {
      newErrors.activities = "At least one activity is required";
    } else {
      const activityErrors: { [key: number]: any } = {};
      trainingSessionData.sessionActivities.forEach((activity) => {
        const errorsForActivity: { [key: string]: string } = {};

        if (!activity.name) {
          errorsForActivity.name = "Activity name is required";
        }
        if (!activity.startTime) {
          errorsForActivity.startTime = "Start time is required";
        }
        if (!activity.endTime) {
          errorsForActivity.endTime = "End time is required";
        }
        if (
          activity.startTime &&
          activity.endTime &&
          DateTime.fromISO(activity.startTime) >=
            DateTime.fromISO(activity.endTime)
        ) {
          errorsForActivity.time = "Start time must be earlier than end time";
        }
        if (
          activity.startTime &&
          activity.endTime &&
          DateTime.fromISO(activity.endTime).diff(
            DateTime.fromISO(activity.startTime),
            "hours"
          ).hours > 2
        ) {
          newWarnings.push(
            `Activity "${
              activity.name || "Unnamed"
            }" duration is longer than 2 hours (often an accidental am/pm)`
          );
        }
        if (
          activity.intensities.fingers < 0 ||
          activity.intensities.fingers > 10 ||
          activity.intensities.upperBody < 0 ||
          activity.intensities.upperBody > 10 ||
          activity.intensities.lowerBody < 0 ||
          activity.intensities.lowerBody > 10
        ) {
          errorsForActivity.intensities =
            "Intensities must be between 0 and 10";
        }
        if (
          activity.intensities.fingers === 0 &&
          activity.intensities.upperBody === 0 &&
          activity.intensities.lowerBody === 0
        ) {
          errorsForActivity.allIntensities = "All intensities cannot be zero";
        }

        if (Object.keys(errorsForActivity).length > 0) {
          activityErrors[activity.id] = errorsForActivity;
        }
      });
      if (Object.keys(activityErrors).length > 0) {
        newErrors.activities = activityErrors;
      }
    }

    setErrors(newErrors);
    setWarnings(newWarnings);

    return {
      valid: Object.keys(newErrors).length === 0,
      hasWarnings: newWarnings.length > 0,
    };
  };

  const handleSave = async () => {
    const { valid, hasWarnings } = validateForm();
    if (valid) {
      if (hasWarnings) {
        setShowWarningDialog(true);
      } else {
        try {
          await saveTrainingSession();
          setSnackbar({
            open: true,
            message: "Session saved successfully!",
            severity: "success",
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error saving session.",
            severity: "error",
          });
        }
      }
    }
  };

  const handleWarningDialogClose = async (confirm: boolean) => {
    setShowWarningDialog(false);
    if (confirm) {
      try {
        await saveTrainingSession();
        setSnackbar({
          open: true,
          message: "Session saved successfully!",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error saving session.",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render session fields, activity forms, and warning dialog
  return (
    <>
      <Box component="form" noValidate autoComplete="off">
        <Typography variant="h4">
          {trainingSessionData.id < 0
            ? "New Training Session"
            : "Edit Training Session"}
        </Typography>
        <TextField
          label="Date"
          name="completedOn"
          type="date"
          value={DateTime.fromISO(trainingSessionData.completedOn).toISODate()}
          onChange={(e) =>
            onTrainingSessionChange({ completedOn: e.target.value })
          }
          fullWidth
          margin="normal"
          error={!!errors.completedOn}
          helperText={errors.completedOn}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Name"
          name="name"
          value={trainingSessionData.name}
          onChange={(e) => onTrainingSessionChange({ name: e.target.value })}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Session Note"
          name="note"
          value={trainingSessionData.note}
          onChange={(e) => onTrainingSessionChange({ note: e.target.value })}
          fullWidth
          multiline
          margin="normal"
          error={!!errors.note}
          helperText={errors.note}
        />

        {trainingSessionData.sessionActivities.map((sa) => (
          <SessionActivityForm
            key={sa.id}
            sessionActivity={sa}
            onSessionActivityChange={(newData) =>
              onSessionActivityChange(sa.id, newData)
            }
            removeSessionActivity={() => removeSessionActivity(sa.id)}
            errors={
              errors.activities && errors.activities[sa.id]
                ? errors.activities[sa.id]
                : {}
            }
          />
        ))}

        <Button
          fullWidth
          variant="outlined"
          onClick={addSessionActivity}
          sx={{ mt: 2, mb: 2 }}
        >
          Add Activity
        </Button>
        {errors.activities && typeof errors.activities === "string" && (
          <FormHelperText error>{errors.activities}</FormHelperText>
        )}
        {warnings.map((warning, idx) => (
          <FormHelperText key={idx} error>
            {warning}
          </FormHelperText>
        ))}
        <ButtonGroup variant="contained" fullWidth>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          {trainingSessionData.id > 0 ? (
            <Button onClick={deleteTrainingSession} color="secondary">
              Delete
            </Button>
          ) : (
            <Button onClick={() => navigate(-1)} color="secondary">
              Cancel
            </Button>
          )}
        </ButtonGroup>
      </Box>

      <WarningDialog
        isOpen={showWarningDialog}
        warnings={warnings}
        onClose={handleWarningDialogClose}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TrainingSessionForm;
