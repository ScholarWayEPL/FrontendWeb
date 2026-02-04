import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
}

const initialState: UiState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  darkMode: false,
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'warning' | 'info' }>
    ) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  toggleDarkMode,
  showSnackbar,
  hideSnackbar,
} = uiSlice.actions;
export default uiSlice.reducer;
