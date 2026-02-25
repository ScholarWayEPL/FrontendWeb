import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { getScholarwayTheme } from './theme';
import { useAppSelector } from './store/hooks';

// Pages - Super Admin
import {
  Login,
  Dashboard,
  Utilisateurs,
  Etablissements,
  Programmes,
  Notifications,
  Parametres,
  Logs,
  ValidationInscriptions,
} from './pages/super_admin';

// Pages Admin Établissement
import {
  EtablissementDashboard,
  MonEtablissement,
  OffreFormation,
  Candidatures,
  Resultats,
  Notifications as EtablissementNotifications,
} from './pages/admin_etablissement';

// Components
import { GlobalSnackbar, ProtectedRoute } from './components';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

const AppContent: React.FC = () => {
  const darkMode = useAppSelector((state) => state.ui.darkMode);

  const theme = useMemo(
    () => getScholarwayTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
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
            {/* Routes Super Admin */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="validations" element={<ValidationInscriptions />} />
            <Route path="utilisateurs" element={<Utilisateurs />} />
            <Route path="etablissements" element={<Etablissements />} />
            <Route path="programmes" element={<Programmes />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="parametres" element={<Parametres />} />
            <Route path="logs" element={<Logs />} />

            {/* Routes Admin Établissement */}
            <Route path="etablissement">
              <Route index element={<EtablissementDashboard />} />
              <Route path="dashboard" element={<EtablissementDashboard />} />
              <Route path="infos" element={<MonEtablissement />} />
              <Route path="offre" element={<OffreFormation />} />
              <Route path="candidatures" element={<Candidatures />} />
              <Route path="resultats" element={<Resultats />} />
              <Route path="notifications" element={<EtablissementNotifications />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <GlobalSnackbar />
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
