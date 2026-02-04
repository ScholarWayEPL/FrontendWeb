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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { title: 'Tableau de bord', path: '/', icon: <DashboardIcon /> },
  { title: 'Utilisateurs', path: '/utilisateurs', icon: <PeopleIcon /> },
  { title: 'Établissements', path: '/etablissements', icon: <SchoolIcon /> },
  { title: 'Programmes', path: '/programmes', icon: <MenuBookIcon /> },
  { title: 'Notifications', path: '/notifications', icon: <NotificationsIcon /> },
  { title: 'Logs', path: '/logs', icon: <HistoryIcon /> },
];

const secondaryNavItems: NavItem[] = [
  { title: 'Paramètres', path: '/parametres', icon: <SettingsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
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
          borderColor: 'grey.200',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            ScholarWay
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Administration
          </Typography>
        </Box>
      </Box>

      {/* Navigation principale */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Typography
          variant="overline"
          sx={{ px: 3, color: 'text.secondary', fontWeight: 600 }}
        >
          Menu principal
        </Typography>
        <List sx={{ px: 2 }}>
          {mainNavItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                  color: isActive(item.path) ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive(item.path) ? 'primary.dark' : 'grey.100',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Navigation secondaire */}
        <Typography
          variant="overline"
          sx={{ px: 3, color: 'text.secondary', fontWeight: 600 }}
        >
          Configuration
        </Typography>
        <List sx={{ px: 2 }}>
          {secondaryNavItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                  color: isActive(item.path) ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive(item.path) ? 'primary.dark' : 'grey.100',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer Sidebar */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'grey.50',
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          ScholarWay Admin v1.0
        </Typography>
        <Typography variant="caption" color="text.secondary">
          © 2024 Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
