import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  PublishedWithChanges as PublishedWithChangesIcon,
  Category as CategoryIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

// Menu pour Super Admin
const superAdminMainNavItems: NavItem[] = [
  { title: 'Tableau de bord', path: '/', icon: <DashboardIcon /> },
  { title: 'Validation Inscriptions', path: '/validations', icon: <VerifiedUserIcon /> },
  { title: 'Utilisateurs', path: '/utilisateurs', icon: <PeopleIcon /> },
  { title: 'Établissements', path: '/etablissements', icon: <SchoolIcon /> },
  { title: 'Programmes', path: '/programmes', icon: <MenuBookIcon /> },
  { title: 'Notifications', path: '/notifications', icon: <NotificationsIcon /> },
  { title: 'Logs', path: '/logs', icon: <HistoryIcon /> },
];

// Menu pour Admin Établissement
const adminEtablissementMainNavItems: NavItem[] = [
  { title: 'Tableau de bord', path: '/etablissement/dashboard', icon: <DashboardIcon /> },
  { title: 'Mon Établissement', path: '/etablissement/infos', icon: <BusinessIcon /> },
  { title: 'Offre de Formation', path: '/etablissement/offre', icon: <CategoryIcon /> },
  { title: 'Candidatures', path: '/etablissement/candidatures', icon: <AssignmentIcon /> },
  { title: 'Résultats', path: '/etablissement/resultats', icon: <PublishedWithChangesIcon /> },
  { title: 'Notifications', path: '/etablissement/notifications', icon: <NotificationsIcon /> },
];

const secondaryNavItems: NavItem[] = [
  { title: 'Paramètres', path: '/parametres', icon: <SettingsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // Sélection du menu selon le rôle
  const mainNavItems = (user && user.role === 'ROLE_ETABLISSEMENT')
    ? adminEtablissementMainNavItems
    : superAdminMainNavItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    if (path === '/etablissement/dashboard') {
      return location.pathname === '/etablissement/dashboard' || location.pathname === '/etablissement';
    }
    if (path === '/etablissements') {
      return location.pathname === '/etablissements';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Logo / Titre */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1.2 }}>
            ScholarWay
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {(user && user.role === 'ROLE_ETABLISSEMENT') ? 'Espace Établissement' : 'Administration'}
          </Typography>
        </Box>
      </Box>

      {/* Navigation principale */}
      <Box sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
        <Typography
          variant="overline"
          sx={{ px: 3, color: 'text.disabled', fontWeight: 700, fontSize: '0.7rem' }}
        >
          Menu principal
        </Typography>
        <List sx={{ px: 2, mt: 1 }}>
          {mainNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: active ? 'primary.main' : 'text.primary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: active ? alpha(theme.palette.primary.main, 0.15) : 'action.hover',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? 'primary.main' : 'text.secondary',
                      minWidth: 40,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.875rem',
                    }}
                  />
                  {active && (
                    <Box
                      sx={{
                        width: 4,
                        height: 18,
                        bgcolor: 'primary.main',
                        borderRadius: 2,
                        ml: 1
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2, mx: 3, opacity: 0.5 }} />

        {/* Navigation secondaire */}
        <Typography
          variant="overline"
          sx={{ px: 3, color: 'text.disabled', fontWeight: 700, fontSize: '0.7rem' }}
        >
          Configuration
        </Typography>
        <List sx={{ px: 2, mt: 1 }}>
          {secondaryNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: active ? 'primary.main' : 'text.primary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: active ? alpha(theme.palette.primary.main, 0.15) : 'action.hover',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? 'primary.main' : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.875rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Sidebar */}
      <Box
        sx={{
          p: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, display: 'block' }}>
          ScholarWay Admin v1.0
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 400 }}>
          © 2024 Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
