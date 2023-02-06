import { configureStore } from '@reduxjs/toolkit';
import electoralMapReducer from './electoralMapSlice';
import studio6Reducer from './studio6Slice';
import onceUpOnATimeReducer from './onceUpOnATimeSlice';

export default configureStore({
  reducer: {
    electoralMap: electoralMapReducer,
    studio6: studio6Reducer,
    onceUpOnATime: onceUpOnATimeReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }),
});
