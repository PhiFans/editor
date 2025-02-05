import { configureStore } from '@reduxjs/toolkit';
import chartSlice from './slices/chart';

export const store = configureStore({
  reducer: {
    chart: chartSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
