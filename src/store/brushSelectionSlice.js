import { createSlice } from '@reduxjs/toolkit';

export const brushSelectionSlice = createSlice({
  name: 'brushSelection',
  initialState: {
    states: [],
  },
  reducers: {
    setStates: (state, action) => {
      state.states = action.payload;
    },
  },
});

export const { setStates } = brushSelectionSlice.actions;

export default brushSelectionSlice.reducer;
