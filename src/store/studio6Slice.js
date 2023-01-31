import { createSlice } from '@reduxjs/toolkit';

const studio6Slice = createSlice({
  name: 'studio6',
  initialState: {
    domain: null,
  },
  reducers: {
    setBrushedDomain: (state, action) => {
      state.domain = action.payload;
    },
  },
});

export const { setBrushedDomain } = studio6Slice.actions;

export default studio6Slice.reducer;
