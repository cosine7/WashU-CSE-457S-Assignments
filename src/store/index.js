import { configureStore } from '@reduxjs/toolkit';
import yearReducer from './yearSlice';
import brushReducer from './brushSelectionSlice';

export default configureStore({
  reducer: {
    yearSelector: yearReducer,
    brushSelection: brushReducer,
  },
});
