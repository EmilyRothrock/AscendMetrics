import { Autocomplete, Grid, TextField } from "@mui/material";
import { useControlPanel } from "./ControlPanelContext";
import { FieldName } from "../../types/fieldOptions";

interface AutocompleteOption {
  label: string;
}

const options: AutocompleteOption[] = [];

interface FilterFieldProps {
  selection: FieldName | null;
}

export const FilterField: React.FC<FilterFieldProps> = ({ selection }) => {
  const { updateFilterValue } = useControlPanel();

  switch (selection) {
    case "name":
      return (
        <Grid item xs={9} sm={3}>
          <TextField
            label={"Filter By Name"}
            onChange={(e) => updateFilterValue("text", e.target.value)}
            fullWidth
          />
        </Grid>
      );
    case "notes":
      return (
        <Grid item xs={9} sm={3}>
          <TextField
            label={"Filter By Notes"}
            onChange={(e) => updateFilterValue("text", e.target.value)}
            fullWidth
          />
        </Grid>
      );
    case "activities":
      return (
        <Grid item xs={9} sm={3}>
          <Autocomplete
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by Activity"
                onChange={(e) => updateFilterValue("text", e.target.value)}
              />
            )}
            fullWidth
          />
        </Grid>
      );
    case "completedOn":
      // TODO: default values should be set to range of complete data (stored in metrics slice)
      // TODO: handle change --> check for complete range, fetch if needed
      return (
        <Grid item xs={9} md={4} lg={3}>
          <TextField
            label="From"
            name="fromDate"
            type="date"
            onChange={(e) => {
              updateFilterValue("min", e.target.value);
            }}
            sx={{ padding: "5px" }}
          />
          <TextField
            label="To"
            name="toDate"
            type="date"
            onChange={(e) => {
              updateFilterValue("max", e.target.value);
            }}
            sx={{ padding: "5px" }}
          />
        </Grid>
      );
    case "loads":
      return (
        <>
          <Grid item xs={4} sm={1}>
            <TextField
              label="Min"
              name="min"
              type="number"
              onChange={(e) => {
                updateFilterValue("min", e.target.value);
              }}
              sx={{ padding: "5px" }}
            />
          </Grid>
          <Grid item xs={4} sm={1}>
            <TextField
              label="Max"
              name="max"
              type="number"
              onChange={(e) => {
                updateFilterValue("max", e.target.value);
              }}
              sx={{ padding: "5px" }}
            />
          </Grid>
        </>
      );
    case "duration":
      return (
        <>
          <Grid item xs={4} sm={1}>
            <TextField
              label="Min"
              name="min"
              type="number"
              onChange={(e) => {
                updateFilterValue("min", e.target.value);
              }}
              sx={{ padding: "5px" }}
            />
          </Grid>
          <Grid item xs={4} sm={1}>
            <TextField
              label="Max"
              name="max"
              type="number"
              onChange={(e) => {
                updateFilterValue("max", e.target.value);
              }}
              sx={{ padding: "5px" }}
            />
          </Grid>
        </>
      );
    default:
      return (
        <Grid item xs={9} sm={3}>
          <TextField
            disabled
            value=""
            label="Select a Field to Filter or Sort By"
            fullWidth
          />
        </Grid>
      );
  }
};
