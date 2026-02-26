import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Stack,
  alpha,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout,
  Settings,
  Person,
  CheckCircle,
  Warning,
  Info,
  Error as ErrorIcon,
  MarkEmailRead,
  Circle,
  AdminPanelSettings,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/layout/ThemeToggle';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleSidebar, setSidebarOpen } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';

const DRAWER_WIDTH = 280;

interface AdminNotification {
  readonly id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockAdminNotifications: AdminNotification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Nouvelle inscription validée',
    message: 'Kofi Mensah a été inscrit en Licence Informatique',
    time: 'Il y a 5 min',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Paiement en attente',
    message: '3 paiements nécessitent une validation',
    time: 'Il y a 30 min',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'Nouvel établissement',
    message: "Demande d'ajout: Institut Polytechnique de Kara",
    time: 'Il y a 2h',
    read: false,
  },
  {
    id: 4,
    type: 'error',
    title: 'Échec de synchronisation',
    message: 'Erreur lors de la mise à jour des données',
    time: 'Il y a 3h',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle sx={{ color: '#4caf50' }} />;
    case 'warning':
      return <Warning sx={{ color: '#ff9800' }} />;
    case 'error':
      return <ErrorIcon sx={{ color: '#f44336' }} />;
    default:
      return <Info sx={{ color: '#2196f3' }} />;
  }
};

const getNotificationBgColor = (type: string) => {
  switch (type) {
    case 'success':
      return alpha('#4caf50', 0.1);
    case 'warning':
      return alpha('#ff9800', 0.1);
    case 'error':
      return alpha('#f44336', 0.1);
    default:
      return alpha('#2196f3', 0.1);
  }
};

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState(mockAdminNotifications);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      dispatch(setSidebarOpen(!sidebarOpen));
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
          // Glassy header: semi-transparent + blur, no border radius
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderRadius: 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 2, md: 3 } }}>
          {/* Menu burger */}
          <IconButton
            aria-label="ouvrir menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Titre et date */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              fontWeight={700}
              sx={{
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              ScholarWay
              <Typography
                component="span"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  ml: 0.5,
                }}
              >
                Admin
              </Typography>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
                mt: -0.3,
              }}
            >
              {currentTime.toLocaleDateString('fr-TG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <ThemeToggle />

            <IconButton
              onClick={(e) => setNotifAnchor(e.currentTarget)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Stack>

          {/* Séparateur */}
          <Divider orientation="vertical" flexItem sx={{ mx: 1.5, my: 1.5 }} />

          {/* Profil */}
          <IconButton
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              p: 0.5,
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 38,
                height: 38,
                fontSize: '0.95rem',
                fontWeight: 600,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              {(user && user.firstName) ? user.firstName.charAt(0) : 'A'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Popover Notifications - Design amélioré */}
      <Popover
        open={Boolean(notifAnchor)}
        anchorEl={notifAnchor}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Notifications Admin
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleMarkAllRead}
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <MarkEmailRead />
            </IconButton>
          </Stack>
        </Box>

        {/* Liste des notifications */}
        <List sx={{ p: 0, maxHeight: 340, overflow: 'auto' }}>
          {notifications.map((notif) => (
            <ListItem
              key={notif.id}
              sx={{
                py: 1.5,
                px: 2,
                cursor: 'pointer',
                bgcolor: !notif.read ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: getNotificationBgColor(notif.type) }}>
                  {getNotificationIcon(notif.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" fontWeight={!notif.read ? 600 : 400}>
                      {notif.title}
                    </Typography>
                    {!notif.read && <Circle sx={{ fontSize: 8, color: 'primary.main' }} />}
                  </Stack>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {notif.time}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
          <Button
            fullWidth
            variant="text"
            onClick={() => {
              setNotifAnchor(null);
              // Redirige vers la page de notifications adaptée au rôle
              if (user && user.role === 'ROLE_ETABLISSEMENT') {
                navigate('/etablissement/notifications');
              } else {
                navigate('/notifications');
              }
            }}
          >
            Voir toutes les notifications
          </Button>
        </Box>
      </Popover>

      {/* Popover Profil - Design amélioré */}
      <Popover
        open={Boolean(profileAnchor)}
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              mt: 1,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Header Profil */}
        <Box
          sx={{
            p: 2.5,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 1.5,
              bgcolor: 'white',
              color: 'primary.main',
              fontSize: '1.4rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            {(user && user.firstName) ? user.firstName.charAt(0) : 'A'}
          </Avatar>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            {user ? user.firstName : 'Administrateur'} {user ? user.lastName : 'ScholarWay'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            {user ? user.email : 'admin@scholarway.tg'}
          </Typography>
          <Chip
            icon={<AdminPanelSettings sx={{ fontSize: 16 }} />}
            label={(user && user.role === 'ROLE_ETABLISSEMENT') ? 'Admin Établissement' : 'Super Admin'}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        </Box>

        {/* Menu */}
        <Box sx={{ py: 1 }}>
          <ListItem
            onClick={() => {
              setProfileAnchor(null);
              navigate('/parametres');
            }}
            sx={{
              cursor: 'pointer',
              py: 1.5,
              px: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 40, height: 40 }}>
                <Person sx={{ color: 'primary.main' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Mon profil"
              secondary="Voir et modifier mon profil"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>

          {/* Journal d'activité - Uniquement pour SUPER_ADMIN */}
          {user && user.role === 'ROLE_ADMINISTRATEUR' && (
            <ListItem
              onClick={() => {
                setProfileAnchor(null);
                navigate('/logs');
              }}
              sx={{
                cursor: 'pointer',
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), width: 40, height: 40 }}>
                  <Settings sx={{ color: 'info.main' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Journal d'activité"
                secondary="Historique des actions"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          )}

          {/* Paramètres - Uniquement pour ADMIN_ETABLISSEMENT */}
          {user && user.role === 'ROLE_ETABLISSEMENT' && (
            <ListItem
              onClick={() => {
                setProfileAnchor(null);
                navigate('/etablissement/mon-etablissement');
              }}
              sx={{
                cursor: 'pointer',
                py: 1.5,
                px: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), width: 40, height: 40 }}>
                  <Settings sx={{ color: 'success.main' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Mon établissement"
                secondary="Gérer mon établissement"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          )}
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Déconnexion */}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={() => {
              setProfileAnchor(null);
              dispatch(logout());
              navigate('/login');
            }}
            sx={{
              borderRadius: 2,
              py: 1.2,
              fontWeight: 500,
              borderWidth: 1.5,
              '&:hover': {
                borderWidth: 1.5,
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            Déconnexion
          </Button>
        </Box>
      </Popover>

      {/* Sidebar - Mobile */}
      <Drawer
        variant="temporary"
        open={sidebarOpen && isMobile}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Sidebar onClose={handleDrawerToggle} />
      </Drawer>

      {/* Sidebar - Desktop */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: sidebarOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* Contenu Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          mt: '64px',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
