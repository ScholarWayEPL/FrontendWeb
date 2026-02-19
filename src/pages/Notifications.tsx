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
import { BORDER_RADIUS, SHADOWS } from '../constants';
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
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showSnackbar } from '../store/slices/uiSlice';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatRelativeTime } from '../utils/helpers';

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

const getTypeConfig = (type: AdminNotifType) => {
  const configs = {
    info: { icon: InfoIcon, color: '#2196f3', bgColor: '#e3f2fd', label: 'Info' },
    success: { icon: SuccessIcon, color: '#4caf50', bgColor: '#e8f5e9', label: 'Succès' },
    warning: { icon: WarningIcon, color: '#ff9800', bgColor: '#fff3e0', label: 'Attention' },
    error: { icon: ErrorIcon, color: '#f44336', bgColor: '#ffebee', label: 'Erreur' },
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

const Notifications: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  useAppSelector((state) => state.notifications);

  const [notifications, setNotifications] = useState<AdminNotification[]>(mockAdminNotifications);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<AdminNotification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const pageSize = 5;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.read).length;

  // Filtrer selon l'onglet
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 1) return !n.read;
    if (activeTab === 2) return n.actionRequired;
    return true;
  });

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredNotifications.length / pageSize);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    dispatch(showSnackbar({ message: 'Toutes les notifications marquées comme lues', severity: 'success' }));
  };

  const handleDeleteClick = (notification: AdminNotification) => {
    setNotificationToDelete(notification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (notificationToDelete) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationToDelete.id));
      dispatch(showSnackbar({ message: 'Notification supprimée', severity: 'success' }));
    }
    setDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  // Stats par type
  const stats = {
    info: notifications.filter((n) => n.type === 'info').length,
    success: notifications.filter((n) => n.type === 'success').length,
    warning: notifications.filter((n) => n.type === 'warning').length,
    error: notifications.filter((n) => n.type === 'error').length,
  };

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <NotificationsActive sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Notifications
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Alertes système et événements importants
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={handleMarkAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
          <Tooltip title="Actualiser">
            <IconButton color="primary" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(stats).map(([type, count]) => {
          const config = getTypeConfig(type as AdminNotifType);
          const Icon = config.icon;
          return (
            <Grid item xs={6} sm={3} key={type}>
              <Card
                sx={{
                  border: `1px solid ${alpha(config.color, 0.2)}`,
                  bgcolor: alpha(config.color, 0.02),
                }}
              >
                <CardContent sx={{ py: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ bgcolor: config.bgColor, color: config.color, width: 44, height: 44 }}>
                      <Icon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {config.label}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Onglets */}
      <Paper sx={{ mb: 3, borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => {
            setActiveTab(val);
            setCurrentPage(1);
          }}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Toutes</span>
                <Chip label={notifications.length} size="small" />
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Non lues</span>
                <Badge badgeContent={unreadCount} color="primary">
                  <Box sx={{ width: 8 }} />
                </Badge>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Action requise</span>
                <Badge badgeContent={actionRequiredCount} color="error">
                  <Box sx={{ width: 8 }} />
                </Badge>
              </Stack>
            }
          />
        </Tabs>
      </Paper>

      {/* Liste des notifications */}
      <Stack spacing={2}>
        {paginatedNotifications.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucune notification
            </Typography>
          </Paper>
        ) : (
          paginatedNotifications.map((notification) => {
            const typeConfig = getTypeConfig(notification.type);
            const categoryConfig = getCategoryConfig(notification.category);
            const TypeIcon = typeConfig.icon;
            const CategoryIcon = categoryConfig.icon;

            return (
              <Card
                key={notification.id}
                sx={{
                  position: 'relative',
                  overflow: 'visible',
                  border: `1px solid ${alpha(typeConfig.color, notification.read ? 0.1 : 0.3)}`,
                  bgcolor: notification.read ? 'transparent' : alpha(typeConfig.color, 0.02),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 2,
                  },
                }}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                {/* Indicateur non lu */}
                {!notification.read && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: typeConfig.color,
                      borderRadius: '4px 0 0 4px',
                    }}
                  />
                )}

                <CardContent sx={{ py: 2.5 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    {/* Icône type */}
                    <Avatar
                      sx={{
                        bgcolor: typeConfig.bgColor,
                        color: typeConfig.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <TypeIcon />
                    </Avatar>

                    {/* Contenu */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={notification.read ? 500 : 700}>
                          {notification.title}
                        </Typography>
                        {notification.actionRequired && (
                          <Chip
                            label="Action requise"
                            size="small"
                            color="error"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                      </Stack>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {notification.message}
                      </Typography>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          icon={<CategoryIcon sx={{ fontSize: '14px !important' }} />}
                          label={categoryConfig.label}
                          size="small"
                          variant="outlined"
                          sx={{ height: 24 }}
                        />
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <TimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.disabled">
                            {formatRelativeTime(notification.date)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Actions */}
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(notification);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Dialog de confirmation suppression */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer la notification"
        message="Êtes-vous sûr de vouloir supprimer cette notification ?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Notifications;
