import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Grid,
  Card,
  CardContent,
  Avatar,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  MarkEmailRead,
  Info as InfoIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { showSnackbar } from '../../store/slices/uiSlice';
import { PageHeader } from '../../components/ui';
import { ConfirmDialog, NotificationList } from '../../components';
import { notificationsApi } from '../../api/notifications';
import type { Notification, TypeNotificationBackend } from '../../types';

const Notifications: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.etablissement?.idUtilisateur ?? user?.idUtilisateur ?? 0;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const pageSize = 10;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, pagination } = await notificationsApi.getByUser(userId, {
        page: currentPage - 1,
        size: pageSize,
      });
      setNotifications(data);
      setTotalPages(pagination.totalPages);
      setTotalElements(pagination.total);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      dispatch(showSnackbar({ message: 'Erreur lors du chargement des notifications', severity: 'error' }));
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 1) return !n.estLue;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.estLue).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.idNotification === id ? { ...n, estLue: true } : n)));
    } catch {
      dispatch(showSnackbar({ message: 'Erreur lors de la mise à jour', severity: 'error' }));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, estLue: true })));
      dispatch(showSnackbar({ message: 'Toutes les notifications marquées comme lues', severity: 'success' }));
    } catch {
      dispatch(showSnackbar({ message: 'Erreur lors de la mise à jour', severity: 'error' }));
    }
  };

  const handleDeleteClick = (id: number) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (notificationToDelete) {
      try {
        await notificationsApi.delete(notificationToDelete);
        setNotifications((prev) => prev.filter((n) => n.idNotification !== notificationToDelete));
        dispatch(showSnackbar({ message: 'Notification supprimée', severity: 'success' }));
      } catch {
        dispatch(showSnackbar({ message: 'Erreur lors de la suppression', severity: 'error' }));
      }
    }
    setDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  const getTypeConfig = (type: TypeNotificationBackend) => {
    const configs: Record<TypeNotificationBackend, { icon: typeof InfoIcon; color: string; label: string }> = {
      SYSTEME: { icon: InfoIcon, color: theme.palette.info.main, label: 'Système' },
      UTILISATEUR: { icon: PersonIcon, color: theme.palette.primary.main, label: 'Utilisateur' },
      ETABLISSEMENT: { icon: BusinessIcon, color: theme.palette.secondary.main, label: 'Établissement' },
      CANDIDATURE: { icon: WarningIcon, color: theme.palette.warning.main, label: 'Candidature' },
    };
    return configs[type] || configs.SYSTEME;
  };

  // Stats par type
  const stats: Record<TypeNotificationBackend, number> = {
    SYSTEME: notifications.filter((n) => n.type === 'SYSTEME').length,
    UTILISATEUR: notifications.filter((n) => n.type === 'UTILISATEUR').length,
    ETABLISSEMENT: notifications.filter((n) => n.type === 'ETABLISSEMENT').length,
    CANDIDATURE: notifications.filter((n) => n.type === 'CANDIDATURE').length,
  };

  return (
    <Box sx={{ pb: 6 }}>
      <PageHeader
        title="Notifications"
        subtitle="Gérez l'ensemble des communications et alertes de votre établissement"
        icon={<NotificationsIcon />}
        iconColor={theme.palette.primary.main}
        action={
          <Stack direction="row" spacing={1}>
            {unreadCount > 0 && (
              <Button variant="outlined" startIcon={<MarkEmailRead />} onClick={handleMarkAllAsRead} sx={{ borderRadius: '10px' }}>
                Tout lire
              </Button>
            )}
            <Tooltip title="Actualiser">
              <IconButton onClick={fetchNotifications} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {(Object.entries(stats) as [TypeNotificationBackend, number][]).map(([type, count]) => {
          const config = getTypeConfig(type);
          const Icon = config.icon;
          return (
            <Grid item xs={6} sm={3} key={type}>
              <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: alpha(config.color, 0.2), bgcolor: alpha(config.color, 0.02), boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: alpha(config.color, 0.1), color: config.color, width: 42, height: 42, border: `1px solid ${alpha(config.color, 0.1)}` }}>
                      <Icon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={800} sx={{ color: config.color }}>{count}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>{config.label}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Liste des notifications */}
      <NotificationList
        notifications={filteredNotifications}
        loading={loading}
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setCurrentPage}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteClick}
        unreadCount={unreadCount}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer la notification"
        message="Voulez-vous vraiment effacer cette notification ?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Notifications;
