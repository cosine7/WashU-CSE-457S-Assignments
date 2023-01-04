import { configureStore } from '@reduxjs/toolkit';
import yearReducer from './yearSlice';

export default configureStore({
  reducer: {
    yearSelector: yearReducer,
  },
});
