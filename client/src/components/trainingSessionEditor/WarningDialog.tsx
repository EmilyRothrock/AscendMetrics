import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface WarningDialogProps {
  isOpen: boolean;
  warnings: string[];
  onClose: (confirm: boolean) => void;
}

const WarningDialog: React.FC<WarningDialogProps> = ({
  isOpen,
  warnings,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onClose={() => onClose(false)}>
      <DialogTitle>Warnings Detected</DialogTitle>
      <DialogContent>
        {warnings.map((warning, index) => (
          <div key={index}>{warning}</div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onClose(true)} color="primary">
          Proceed Anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningDialog;
