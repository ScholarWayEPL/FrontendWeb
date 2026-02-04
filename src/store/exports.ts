// Store index - Export centralisé du store Redux
export { store } from './index';
export { useAppDispatch, useAppSelector } from './hooks';

// Slices
export { default as authReducer, setUser, setLoading, setError, logout } from './slices/authSlice';
export { default as dashboardReducer, fetchDashboardStats, clearDashboardError, resetDashboard } from './slices/dashboardSlice';
export { default as uiReducer, toggleSidebar, setSidebarOpen, showSnackbar, hideSnackbar } from './slices/uiSlice';
