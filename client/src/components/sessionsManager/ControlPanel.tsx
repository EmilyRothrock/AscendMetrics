import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import SortRoundedIcon from "@mui/icons-material/SortRounded"; // import FilterListIcon from '@mui/icons-material/FilterList';
import { FilterField } from "./DynamicFilterField";
import { useControlPanel } from "./ControlPanelContext";
import { fieldOptions } from "../../types/fieldOptions";
import NewSessionButton from "../dashboard/NewSessionButton";

const ControlPanel = () => {
  const {
    sortAscending,
    selectedField,
    toggleSort,
    handleSelectedFieldChange,
    resetControlPanel,
  } = useControlPanel();

  return (
    <Grid container spacing={1}>
      <FilterField selection={selectedField} />
      <Grid item xs={1}>
        <IconButton onClick={toggleSort}>
          <SortRoundedIcon
            fontSize="large"
            style={{ transform: sortAscending ? "scaleY(-1)" : "none" }}
          />
        </IconButton>
      </Grid>
      <Grid item sm={5}>
        <FormControl>
          <RadioGroup
            row
            name="fields"
            value={selectedField}
            onChange={(
              _e: React.ChangeEvent<HTMLInputElement>,
              value: string
            ) => handleSelectedFieldChange(value)}
          >
            {fieldOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={6} sm={1}>
        <Button
          variant="outlined"
          sx={{ height: "90%", fontSize: "16px" }}
          onClick={resetControlPanel}
          fullWidth
        >
          Reset
        </Button>
      </Grid>
      <Grid item xs={6} sm={2}>
        <NewSessionButton text="New Log" sx={{ height: "90%" }} />
      </Grid>
    </Grid>
  );
};

export default ControlPanel;
