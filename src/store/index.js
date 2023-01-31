import { configureStore } from '@reduxjs/toolkit';
import electoralMapReducer from './electoralMapSlice';
import studio6Reducer from './studio6Slice';

export default configureStore({
  reducer: {
    electoralMap: electoralMapReducer,
    studio6: studio6Reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }),
});
