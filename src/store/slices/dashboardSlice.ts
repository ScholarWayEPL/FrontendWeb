// Dashboard Slice - Gestion de l'état du tableau de bord
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DashboardStats } from '../../types';
import { dashboardApi } from '../../api/dashboard';

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Thunk pour charger les statistiques
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const stats = await dashboardApi.getStats();
    return stats;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement des statistiques';
      });
  },
});

export const { clearDashboardError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
