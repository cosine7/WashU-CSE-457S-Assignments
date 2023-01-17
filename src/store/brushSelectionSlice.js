import { createSlice } from '@reduxjs/toolkit';

export const brushSelectionSlice = createSlice({
  name: 'brushSelection',
  initialState: {
    states: [],
  },
});

export default brushSelectionSlice.reducer;
