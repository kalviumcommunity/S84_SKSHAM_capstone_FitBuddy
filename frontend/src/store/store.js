import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import planReducer from './slices/planSlice';
import trackerReducer from './slices/trackerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    plan: planReducer,
    tracker: trackerReducer,
  },
});
