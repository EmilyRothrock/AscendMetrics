// SessionActivityForm.tsx

import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  FormHelperText,
  Autocomplete,
  Slider,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ForwardIcon from "@mui/icons-material/Forward";
import { SessionActivity, BodyPartMetrics } from "@shared/types";

interface SessionActivityFormProps {
  sessionActivity: SessionActivity;
  onSessionActivityChange: (newData: Partial<SessionActivity>) => void;
  removeSessionActivity: () => void;
  errors: { [key: string]: string };
}

const activityOptions = [
  "Performance",
  "Power",
  "Finger Health",
  "Power/Strength Endurance",
  "PumpCap/AnCap",
  "Strength",
  "AeroCap",
  "Warm-Up",
  "Routesetting",
  "Cross Training",
  "Board Climbing",
  "Bouldering",
  "Routes",
  "Cardio",
  "Mobility/Stability",
  "Stretching",
  "Movement Practice",
  "Work Capacity",
  "Outdoor Bouldering",
  "Outdoor Routes",
  "Other",
];

const intensityMarks = {
  fingers: [
    { value: 0, label: "Tip for Fingers 0" },
    { value: 1, label: "Tip for Fingers 1" },
    { value: 2, label: "Tip for Fingers 2" },
    { value: 3, label: "Tip for Fingers 3" },
    { value: 4, label: "Tip for Fingers 4" },
    { value: 5, label: "Tip for Fingers 5" },
    { value: 6, label: "Tip for Fingers 6" },
    { value: 7, label: "Tip for Fingers 7" },
    { value: 8, label: "Tip for Fingers 8" },
    { value: 9, label: "Tip for Fingers 9" },
    { value: 10, label: "Tip for Fingers 10" },
  ],
  upperBody: [
    { value: 0, label: "Tip for Upper 0" },
    { value: 1, label: "Tip for Upper 1" },
    { value: 2, label: "Tip for Upper 2" },
    { value: 3, label: "Tip for Upper 3" },
    { value: 4, label: "Tip for Upper 4" },
    { value: 5, label: "Tip for Upper 5" },
    { value: 6, label: "Tip for Upper 6" },
    { value: 7, label: "Tip for Upper 7" },
    { value: 8, label: "Tip for Upper 8" },
    { value: 9, label: "Tip for Upper 9" },
    { value: 10, label: "Tip for Upper 10" },
  ],
  lowerBody: [
    { value: 0, label: "Tip for Lower 0" },
    { value: 1, label: "Tip for Lower 1" },
    { value: 2, label: "Tip for Lower 2" },
    { value: 3, label: "Tip for Lower 3" },
    { value: 4, label: "Tip for Lower 4" },
    { value: 5, label: "Tip for Lower 5" },
    { value: 6, label: "Tip for Lower 6" },
    { value: 7, label: "Tip for Lower 7" },
    { value: 8, label: "Tip for Lower 8" },
    { value: 9, label: "Tip for Lower 9" },
    { value: 10, label: "Tip for Lower 10" },
  ],
};

const IntensityInput: React.FC<{
  bodyPart: keyof BodyPartMetrics;
  value: number;
  onChange: (value: number) => void;
}> = ({ bodyPart, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  return (
    <>
      <TextField
        label={bodyPart}
        type="number"
        fullWidth
        variant="standard"
        value={value}
        InputProps={{ readOnly: true }}
        sx={{
          "& .MuiInputBase-input": {
            textAlign: "center",
          },
          cursor: "pointer",
        }}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        PaperProps={{
          style: {
            width: isMobile ? "80%" : "20%",
            height: "80%",
            margin: isMobile ? "0" : "auto",
            padding: "16px",
          },
        }}
      >
        <DialogContent>
          <Slider
            orientation="vertical"
            value={value}
            min={0}
            max={10}
            step={1}
            onChange={handleSliderChange}
            marks={intensityMarks[bodyPart]}
            sx={{ width: "10px" }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const SessionActivityForm: React.FC<SessionActivityFormProps> = ({
  sessionActivity,
  onSessionActivityChange,
  removeSessionActivity,
  errors,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true); // default open
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handle expansion state of form
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    handleMenuClose();
  };

  const handleDeleteActivity = () => {
    removeSessionActivity();
    handleMenuClose();
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onSessionActivityChange({ [name]: value });
  };

  const handleIntensityChange = (
    bodyPart: keyof BodyPartMetrics,
    value: number
  ) => {
    onSessionActivityChange({
      intensities: {
        ...sessionActivity.intensities,
        [bodyPart]: value,
      },
    });
  };

  // Render menu and input fields and errors
  return (
    <Box
      sx={{
        border: "1px solid lightgrey",
        borderRadius: "5px",
        padding: 2,
        mt: 2,
        position: "relative",
      }}
    >
      <IconButton
        aria-label="more"
        aria-controls="activity-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        sx={{ position: "absolute", right: 5, top: 5 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="activity-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={toggleExpand}>
          {isExpanded ? "Collapse" : "Expand"}
        </MenuItem>
        <MenuItem onClick={handleDeleteActivity}>Delete</MenuItem>
      </Menu>
      {isExpanded ? (
        <>
          {/* Activity Name Autocomplete */}
          <Autocomplete
            options={activityOptions}
            value={sessionActivity.name}
            onChange={(event, value) => {
              onSessionActivityChange({ name: value || "" });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Activity Name"
                variant="standard"
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
                sx={{ pr: 4 }}
              />
            )}
            sx={{ mt: 2 }}
          />

          {/* Start and End Time Inputs */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingTop="12px"
          >
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={sessionActivity.startTime}
              onChange={handleInputChange}
              error={!!errors.startTime}
              helperText={errors.startTime}
              InputLabelProps={{ shrink: true }}
            />
            <ForwardIcon fontSize="large" sx={{ mx: 2 }} />
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              value={sessionActivity.endTime}
              onChange={handleInputChange}
              error={!!errors.endTime}
              helperText={errors.endTime}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {errors.time && (
            <FormHelperText error sx={{ textAlign: "center" }}>
              {errors.time}
            </FormHelperText>
          )}

          {/* Note Field */}
          <TextField
            label="Note"
            name="note"
            value={sessionActivity.note}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
            multiline
            sx={{ mt: 2 }}
          />

          {/* Intensities Inputs */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <IntensityInput
              bodyPart="fingers"
              value={sessionActivity.intensities.fingers}
              onChange={(value) => handleIntensityChange("fingers", value)}
            />
            <IntensityInput
              bodyPart="upperBody"
              value={sessionActivity.intensities.upperBody}
              onChange={(value) => handleIntensityChange("upperBody", value)}
            />
            <IntensityInput
              bodyPart="lowerBody"
              value={sessionActivity.intensities.lowerBody}
              onChange={(value) => handleIntensityChange("lowerBody", value)}
            />
          </Box>
          {errors.intensities && (
            <FormHelperText error sx={{ textAlign: "center" }}>
              {errors.intensities}
            </FormHelperText>
          )}
          {errors.allIntensities && (
            <FormHelperText error sx={{ textAlign: "center" }}>
              {errors.allIntensities}
            </FormHelperText>
          )}
        </>
      ) : (
        // Collapsed view
        <Typography variant="body2" sx={{ mt: 1 }}>
          {sessionActivity.name || "No name provided"}
        </Typography>
      )}
    </Box>
  );
};

export default SessionActivityForm;
