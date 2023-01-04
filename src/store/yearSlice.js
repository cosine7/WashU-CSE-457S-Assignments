import { createSlice } from '@reduxjs/toolkit';
import winner from '../assets/data/yearwise-winner.csv';

export const yearSlice = createSlice({
  name: 'year',
  initialState: {
    year: winner[winner.length - 1].year,
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
  },
});

export const { setYear } = yearSlice.actions;

export default yearSlice.reducer;
