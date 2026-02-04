import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import scholarwayTheme from './theme';

// Pages - Import centralisé
import {
  Login,
  Dashboard,
  Utilisateurs,
  Etablissements,
  Programmes,
  Notifications,
  Parametres,
  Logs,
} from './pages';

// Components
import { GlobalSnackbar, ProtectedRoute } from './components';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={scholarwayTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="utilisateurs" element={<Utilisateurs />} />
              <Route path="etablissements" element={<Etablissements />} />
              <Route path="programmes" element={<Programmes />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="parametres" element={<Parametres />} />
              <Route path="logs" element={<Logs />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <GlobalSnackbar />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
