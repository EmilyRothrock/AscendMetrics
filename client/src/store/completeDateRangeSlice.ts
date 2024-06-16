import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CompleteDateRangeState {
  startDate: string;  // ISO date format
  endDate: string;    // ISO date format
}

const initialState: CompleteDateRangeState = {
  startDate: '2024-03-17',
  endDate: '2024-03-27',
};

const completeDateRangeSlice = createSlice({
  name: 'completeDateRange',
  initialState,
  reducers: {
    setCompleteDateRange(state, action: PayloadAction<CompleteDateRangeState>) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setCompleteDateRange } = completeDateRangeSlice.actions;
export default completeDateRangeSlice.reducer;
