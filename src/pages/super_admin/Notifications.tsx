import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Pagination,
  Stack,
  Avatar,
  alpha,
  useTheme,
  Paper,
  Grid,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  AccessTime as TimeIcon,
  PersonAdd,
  Payment,
  Security,
  Storage,
  Sync,
  MarkEmailRead,
  NotificationsActive,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { showSnackbar } from '../../store/slices/uiSlice';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatRelativeTime } from '../../utils/helpers';

// Types de notifications admin
type AdminNotifType = 'info' | 'success' | 'warning' | 'error';

interface AdminNotification {
  id: number;
  type: AdminNotifType;
  category: 'system' | 'user' | 'security' | 'payment' | 'sync';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionRequired?: boolean;
}

// Mock données notifications admin
const mockAdminNotifications: AdminNotification[] = [
  {
    id: 1,
    type: 'success',
    category: 'user',
    title: 'Nouvelle inscription validée',
    message: 'Kofi Mensah a été inscrit avec succès en Licence Informatique à l\'Université de Lomé',
    date: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: false,
  },
  {
    id: 2,
    type: 'warning',
    category: 'payment',
    title: '3 paiements en attente',
    message: 'Des paiements nécessitent votre validation. Montant total: 1 500 000 F CFA',
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: true,
  },
  {
    id: 3,
    type: 'info',
    category: 'user',
    title: 'Nouvel établissement proposé',
    message: 'Demande d\'ajout reçue: Institut Polytechnique de Kara. En attente de validation.',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: true,
  },
  {
    id: 4,
    type: 'error',
    category: 'sync',
    title: 'Échec de synchronisation',
    message: 'La synchronisation avec le serveur externe a échoué. Dernière tentative il y a 3h.',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: true,
  },
  {
    id: 5,
    type: 'success',
    category: 'payment',
    title: 'Paiement confirmé',
    message: 'Paiement de 350 000 F CFA reçu de Ama Amegah pour le programme Master IA',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: false,
  },
  {
    id: 6,
    type: 'warning',
    category: 'security',
    title: 'Tentative de connexion suspecte',
    message: 'Une connexion depuis une nouvelle adresse IP (41.207.xx.xx) a été détectée',
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: false,
  },
  {
    id: 7,
    type: 'info',
    category: 'system',
    title: 'Maintenance programmée',
    message: 'Une maintenance du système est prévue le 10/02/2026 de 02h à 04h (heure de Lomé)',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: false,
  },
  {
    id: 8,
    type: 'success',
    category: 'sync',
    title: 'Sauvegarde réussie',
    message: 'Sauvegarde automatique de la base de données effectuée avec succès',
    date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: false,
  },
];

const Notifications: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockAdminNotifications);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<AdminNotification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const pageSize = 5;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.read).length;

  const getTypeConfig = (type: AdminNotifType) => {
    const configs = {
      info: { icon: InfoIcon, color: theme.palette.info.main, label: 'Info' },
      success: { icon: SuccessIcon, color: theme.palette.success.main, label: 'Succès' },
      warning: { icon: WarningIcon, color: theme.palette.warning.main, label: 'Attention' },
      error: { icon: ErrorIcon, color: theme.palette.error.main, label: 'Erreur' },
    };
    return configs[type];
  };

  const getCategoryConfig = (category: AdminNotification['category']) => {
    const configs = {
      system: { icon: Storage, label: 'Système' },
      user: { icon: PersonAdd, label: 'Utilisateurs' },
      security: { icon: Security, label: 'Sécurité' },
      payment: { icon: Payment, label: 'Paiements' },
      sync: { icon: Sync, label: 'Synchronisation' },
    };
    return configs[category];
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 1) return !n.read;
    if (activeTab === 2) return n.actionRequired;
    return true;
  });

  const paginatedNotifications = filteredNotifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredNotifications.length / pageSize);

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    dispatch(showSnackbar({ message: 'Notifications marquées comme lues', severity: 'success' }));
  };

  const handleDeleteClick = (notification: AdminNotification) => {
    setNotificationToDelete(notification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (notificationToDelete) {
      setNotifications(prev => prev.filter(n => n.id !== notificationToDelete.id));
      dispatch(showSnackbar({ message: 'Notification supprimée', severity: 'success' }));
    }
    setDeleteDialogOpen(false);
  };

  const stats = {
    info: notifications.filter(n => n.type === 'info').length,
    success: notifications.filter(n => n.type === 'success').length,
    warning: notifications.filter(n => n.type === 'warning').length,
    error: notifications.filter(n => n.type === 'error').length,
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>Notifications</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Suivi des activités et alertes critiques de la plateforme</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {unreadCount > 0 && <Button variant="outlined" startIcon={<MarkEmailRead />} onClick={handleMarkAllAsRead} sx={{ borderRadius: '10px' }}>Tout lire</Button>}
          <Tooltip title="Actualiser"><IconButton sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}><RefreshIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(stats).map(([type, count]) => {
          const config = getTypeConfig(type as AdminNotifType);
          const Icon = config.icon;
          return (
            <Grid item xs={6} sm={3} key={type}>
              <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: alpha(config.color, 0.2), bgcolor: alpha(config.color, 0.02), boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: alpha(config.color, 0.1), color: config.color, width: 42, height: 42, border: `1px solid ${alpha(config.color, 0.1)}` }}><Icon sx={{ fontSize: 20 }} /></Avatar>
                    <Box><Typography variant="h5" fontWeight={800} sx={{ color: config.color }}>{count}</Typography><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>{config.label}</Typography></Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paper sx={{ mb: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper', boxShadow: 'none' }}>
        <Tabs value={activeTab} onChange={(_, v) => { setActiveTab(v); setCurrentPage(1); }} sx={{ '& .MuiTab-root': { fontWeight: 700, px: 3, pt: 2.5, pb: 2 } }}>
          <Tab label={<Stack direction="row" spacing={1} alignItems="center"><span>Toutes</span><Chip label={notifications.length} size="small" sx={{ height: 20, bgcolor: 'action.hover', fontWeight: 700 }} /></Stack>} />
          <Tab label={<Stack direction="row" spacing={1} alignItems="center"><span>Non lues</span><Badge badgeContent={unreadCount} color="primary" sx={{ '& .MuiBadge-badge': { top: -2, right: -4 } }}><Box sx={{ width: 4 }} /></Badge></Stack>} />
          <Tab label={<Stack direction="row" spacing={1} alignItems="center"><span>Critiques</span><Badge badgeContent={actionRequiredCount} color="error" sx={{ '& .MuiBadge-badge': { top: -2, right: -4 } }}><Box sx={{ width: 4 }} /></Badge></Stack>} />
        </Tabs>

        <Stack spacing={0} divider={<Divider />}>
          {paginatedNotifications.length === 0 ? (
            <Box sx={{ p: 10, textAlign: 'center' }}><NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', opacity: 0.2, mb: 2 }} /><Typography variant="h6" color="text.secondary">Aucune notification à afficher</Typography></Box>
          ) : (
            paginatedNotifications.map((n) => {
              const typeConfig = getTypeConfig(n.type);
              const categoryConfig = getCategoryConfig(n.category);
              const TypeIcon = typeConfig.icon;
              return (
                <Box key={n.id} onClick={() => handleMarkAsRead(n.id)} sx={{ p: 3, transition: 'all 0.2s', cursor: 'pointer', bgcolor: n.read ? 'transparent' : alpha(typeConfig.color, 0.03), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }, position: 'relative' }}>
                  {!n.read && <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: typeConfig.color }} />}
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: alpha(typeConfig.color, 0.1), color: typeConfig.color, width: 48, height: 48, border: `1px solid ${alpha(typeConfig.color, 0.1)}` }}><TypeIcon /></Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={n.read ? 600 : 800} sx={{ color: 'text.primary' }}>{n.title}</Typography>
                        {n.actionRequired && <Chip label="Action requise" size="small" color="error" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 800, borderRadius: '6px' }} />}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 800 }}>{n.message}</Typography>
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Chip icon={<categoryConfig.icon sx={{ fontSize: '14px !important' }} />} label={categoryConfig.label} size="small" variant="outlined" sx={{ height: 24, fontWeight: 700, borderRadius: '6px' }} />
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.disabled' }}>
                          <TimeIcon sx={{ fontSize: 14 }} /><Typography variant="caption" fontWeight={500}>{formatRelativeTime(n.date)}</Typography>
                        </Stack>
                      </Stack>
                    </Box>
                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(n); }}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                </Box>
              );
            })
          )}
        </Stack>
      </Paper>

      {totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><Pagination count={totalPages} page={currentPage} onChange={(_, p) => setCurrentPage(p)} color="primary" sx={{ '& .MuiPaginationItem-root': { fontWeight: 700 } }} /></Box>}
      <ConfirmDialog open={deleteDialogOpen} title="Supprimer la notification" message="Voulez-vous vraiment effacer cette alerte de l'historique ?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteDialogOpen(false)} />
    </Box>
  );
};

export default Notifications;
