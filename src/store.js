import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from './features/alerts/alertsSlice';

export const store = configureStore({
  reducer: {
    alerts: alertsReducer,
  },
});
