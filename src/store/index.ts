import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import etablissementsReducer from './slices/etablissementsSlice';
import usersReducer from './slices/usersSlice';
import programmesReducer from './slices/programmesSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    etablissements: etablissementsReducer,
    users: usersReducer,
    programmes: programmesReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
