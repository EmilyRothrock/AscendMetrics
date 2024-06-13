import React, { useState } from 'react';
import {
  TextField,
  Dialog,
  DialogContent,
  Slider,
  useMediaQuery,
  useTheme,
  Button,
  DialogActions,
} from '@mui/material';
import { Part } from '../types';

interface IntensityInputProps {
  type: Part;
}

const marks = {
    [Part.Fingers]: [
        {
            value: 0,
            label: 'Tip for Fingers 0',
        },
        {
            value: 1,
            label: 'Tip for Fingers 1',
        },
        {
            value: 2,
            label: 'Tip for Fingers 2',
        },
        {
            value: 3,
            label: 'Tip for Fingers 3',
        },
        {
            value: 4,
            label: 'Tip for Fingers 4',
        },
        {
            value: 5,
            label: 'Tip for Fingers 5',
        },
        {
            value: 6,
            label: 'Tip for Fingers 6',
        },
        {
            value: 7,
            label: 'Tip for Fingers 7',
        },
        {
            value: 8,
            label: 'Tip for Fingers 8',
        },
        {
            value: 9,
            label: 'Tip for Fingers 9',
        },
        {
            value: 10,
            label: 'Tip for Fingers 10',
        },
    ],
    [Part.UpperBody]: [
        {
            value: 0,
            label: 'Tip for Upper 0',
        },
        {
            value: 1,
            label: 'Tip for Upper 1',
        },
        {
            value: 2,
            label: 'Tip for Upper 2',
        },
        {
            value: 3,
            label: 'Tip for Upper 3',
        },
        {
            value: 4,
            label: 'Tip for Upper 4',
        },
        {
            value: 5,
            label: 'Tip for Upper 5',
        },
        {
            value: 6,
            label: 'Tip for Upper 6',
        },
        {
            value: 7,
            label: 'Tip for Upper 7',
        },
        {
            value: 8,
            label: 'Tip for Upper 8',
        },
        {
            value: 9,
            label: 'Tip for Upper 9',
        },
        {
            value: 10,
            label: 'Tip for Upper 10',
        },
    ],    
    [Part.LowerBody]: [
        {
            value: 0,
            label: 'Tip for Lower 0',
        },
        {
            value: 1,
            label: 'Tip for Lower 1',
        },
        {
            value: 2,
            label: 'Tip for Lower 2',
        },
        {
            value: 3,
            label: 'Tip for Lower 3',
        },
        {
            value: 4,
            label: 'Tip for Lower 4',
        },
        {
            value: 5,
            label: 'Tip for Lower 5',
        },
        {
            value: 6,
            label: 'Tip for Lower 6',
        },
        {
            value: 7,
            label: 'Tip for Lower 7',
        },
        {
            value: 8,
            label: 'Tip for Lower 8',
        },
        {
            value: 9,
            label: 'Tip for Lower 9',
        },
        {
            value: 10,
            label: 'Tip for Lower 10',
        },
    ],
};

const IntensityInput: React.FC<IntensityInputProps> = ({ type }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <>
        <TextField
            label={type}
            type="number"
            fullWidth
            variant="standard"
            value={value}
            InputProps={{ readOnly: true }}
            sx={{
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                },
            }}
            onClick={handleClickOpen}
        />
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        PaperProps={{
            style: {
                width: isMobile ? '80%' : '20%',
                height: '80%',
                margin: isMobile ? '0' : 'auto',
                padding: '16px',
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
                marks={marks[type]}
                sx={{ width:"10px" }}
            />
        </DialogContent>
        <DialogActions sx={{ alignItems:'center', justifyContent:'center'}}>
            <Button onClick={handleClose} variant='contained'>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IntensityInput;
