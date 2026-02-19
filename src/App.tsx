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
  ValidationInscriptions,
} from './pages';

// Pages Admin Établissement
import {
  EtablissementDashboard,
  MonEtablissement,
  OffreFormation,
  Candidatures,
  Resultats,
} from './pages/etablissement';

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
              </Route>
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
