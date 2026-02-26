import React, { useMemo } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
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

// Page 404
import NotFound from './pages/NotFound';

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
        <Switch>
          <Route path="/login">
            <Login />
          </Route>

          <Route
            path="/"
            render={() => (
              <ProtectedRoute>
                <DashboardLayout>
                  <Switch>
                    {/* Routes Super Admin */}
                    <Route exact path="/" component={Dashboard} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route exact path="/validations" component={ValidationInscriptions} />
                    <Route exact path="/utilisateurs" component={Utilisateurs} />
                    <Route exact path="/etablissements" component={Etablissements} />
                    <Route exact path="/programmes" component={Programmes} />
                    <Route exact path="/notifications" component={Notifications} />
                    <Route exact path="/parametres" component={Parametres} />
                    <Route exact path="/logs" component={Logs} />

                    {/* Routes Admin Établissement */}
                    <Route exact path="/etablissement" component={EtablissementDashboard} />
                    <Route exact path="/etablissement/dashboard" component={EtablissementDashboard} />
                    <Route exact path="/etablissement/infos" component={MonEtablissement} />
                    <Route exact path="/etablissement/offre" component={OffreFormation} />
                    <Route exact path="/etablissement/candidatures" component={Candidatures} />
                    <Route exact path="/etablissement/resultats" component={Resultats} />
                    <Route exact path="/etablissement/notifications" component={EtablissementNotifications} />

                    <Route component={NotFound} />
                  </Switch>
                </DashboardLayout>
              </ProtectedRoute>
            )}
          />
        </Switch>
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
