import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Notification, PaginationParams } from '../../types';
import { notificationsApi } from '../../api/notifications';

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  pagination: PaginationParams;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Thunks asynchrones
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getAll(params);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (data: Omit<Notification, 'idNotification'>, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.create(data);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: number, { rejectWithValue }) => {
    try {
      await notificationsApi.delete(id);
      return id;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (n) => n.idNotification !== action.payload
        );
        state.pagination.total -= 1;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
