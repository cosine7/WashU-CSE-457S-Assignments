import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { csv } from 'd3';
import winner from '../../public/data/yearwise-winner.csv';

const { year: initialYear } = winner[winner.length - 1];

const converter = d => {
  const state = {
    abbreviation: d.Abbreviation,
    D_Nominee: d.D_Nominee,
    D_Percentage: Number(d.D_Percentage),
    D_Votes: Number(d.D_Votes),
    I_Nominee: d.I_Nominee,
    I_Percentage: Number(d.I_Percentage),
    I_Votes: Number(d.I_Votes),
    R_Nominee: d.R_Nominee,
    R_Percentage: Number(d.R_Percentage),
    R_Votes: Number(d.R_Votes),
    state: d.State,
    Total_EV: Number(d.Total_EV),
    year: Number(d.Year),
  };
  const votes = [
    [0, state.I_Percentage, 'I'],
    [1, state.D_Percentage, 'D'],
    [2, state.R_Percentage, 'R'],
  ];
  votes.sort((a, b) => b[1] - a[1]);
  state.group = votes[0][0];
  state.party = votes[0][2];
  state.victory = state.party === 'I' ? state.I_Percentage : state.R_Percentage - state.D_Percentage;
  return state;
};

const cache = {};

const fetchDataByYear = async year => {
  if (cache[year]) {
    return cache[year];
  }
  const data = await csv(`/data/election-results-${year}.csv`, converter);
  data.sort((a, b) => a.group === b.group ? a.victory - b.victory : a.group - b.group);
  cache[year] = data;
  return data;
};

export const setYearAndData = createAsyncThunk(
  'yearSelector/setYearAndData',
  async year => {
    const data = await fetchDataByYear(year);
    return { data, year };
  },
);

export const yearSlice = createSlice({
  name: 'yearSelector',
  initialState: {
    year: initialYear,
    data: await fetchDataByYear(initialYear),
  },
  extraReducers: builder => {
    builder.addCase(setYearAndData.fulfilled, (state, action) => ({ ...action.payload }));
  },
});

export default yearSlice.reducer;
