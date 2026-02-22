import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Button,
  Stack,
  Card,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DeleteOutline as DeleteIcon,
  MarkEmailReadOutlined as ReadIcon,
  MarkEmailUnreadOutlined as UnreadIcon,
  SchoolOutlined as SchoolIcon,
  SettingsOutlined as SettingsIcon,
  ReportProblemOutlined as WarningIcon,
  CampaignOutlined as CampaignIcon,
  DoneAll as DoneAllIcon,
  DeleteSweepOutlined as ClearAllIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  InboxOutlined as EmptyIcon
} from '@mui/icons-material';
import { PageHeader } from '../../components/ui';
import { TransitionGroup } from 'react-transition-group';

type NotifType = 'admission' | 'system' | 'warning' | 'campaign';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotifType;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Nouvelle Candidature',
    message: 'M. Ali Ben Mohamed a postulé pour le Master Data Science.',
    time: 'Il y a 10 min',
    read: false,
    type: 'admission',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Mise à jour Système',
    message: 'Le module d\'export PDF a été mis à jour avec de nouveaux modèles.',
    time: 'Il y a 2 h',
    read: true,
    type: 'system',
    priority: 'low'
  },
  {
    id: 3,
    title: 'Action requise',
    message: 'Votre certification établissement expire dans 30 jours. Veuillez renouveler vos documents.',
    time: 'Hier, 15:30',
    read: false,
    type: 'warning',
    priority: 'high'
  },
  {
    id: 4,
    title: 'Nouvelle Campagne',
    message: 'La campagne d\'été pour la Licence Gestion est maintenant configurée et prête à être ouverte.',
    time: 'Hier, 09:12',
    read: true,
    type: 'campaign',
    priority: 'medium'
  },
  {
    id: 5,
    title: 'Dossier Complet',
    message: '15 nouveaux dossiers ont été complétés pour la Licence Informatique.',
    time: '20 Fév 2026',
    read: true,
    type: 'admission',
    priority: 'medium'
  },
];

const Notifications: React.FC = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<NotifType | 'all'>('all');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const remove = (id: number) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'admission': return theme.palette.primary.main;
      case 'system': return theme.palette.info.main;
      case 'warning': return theme.palette.error.main;
      case 'campaign': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'admission': return <SchoolIcon fontSize="inherit" />;
      case 'system': return <SettingsIcon fontSize="inherit" />;
      case 'warning': return <WarningIcon fontSize="inherit" />;
      case 'campaign': return <CampaignIcon fontSize="inherit" />;
      default: return <NotificationsIcon fontSize="inherit" />;
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Tab filter
      if (tabValue === 1 && n.read) return false;
      if (tabValue === 2 && n.priority !== 'high' && n.type !== 'warning') return false;

      // Category filter
      if (activeFilter !== 'all' && n.type !== activeFilter) return false;

      // Search query
      const search = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(search) || n.message.toLowerCase().includes(search);
    });
  }, [notifications, tabValue, searchQuery, activeFilter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filters: { label: string, value: NotifType | 'all' }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Admissions', value: 'admission' },
    { label: 'Système', value: 'system' },
    { label: 'Alertes', value: 'warning' },
    { label: 'Campagnes', value: 'campaign' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      <PageHeader
        title="Notifications"
        subtitle="Gérez l'ensemble des communications et des alertes de votre établissement"
        icon={<NotificationsIcon />}
        iconColor={theme.palette.primary.main}
      />

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header Actions & Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
              '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minWidth: 100, fontSize: '0.95rem', px: 3 }
            }}
          >
            <Tab label="Toutes" />
            <Tab
              label={
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { right: -14, top: 0, fontSize: '0.7rem' } }}>
                  Non lues
                </Badge>
              }
            />
            <Tab label="Importantes" />
          </Tabs>

          <Stack direction="row" spacing={1.5} sx={{ mb: 0.5 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={markAllRead}
              disabled={unreadCount === 0}
              sx={{ borderRadius: 2, px: 2, fontWeight: 700, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
            >
              Tout marquer lu
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<ClearAllIcon />}
              onClick={clearAll}
              disabled={notifications.length === 0}
              sx={{ borderRadius: 2, px: 2, fontWeight: 700, borderContext: 1.5 }}
            >
              Tout effacer
            </Button>
          </Stack>
        </Box>

        {/* Search & Filters Toolbar */}
        <Card
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <TextField
            placeholder="Rechercher une notification..."
            variant="standard"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              minWidth: 300,
              bgcolor: alpha(theme.palette.text.disabled, 0.05),
              px: 2,
              py: 0.75,
              borderRadius: 2
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <FilterIcon sx={{ color: 'text.disabled', fontSize: 18, mr: 1 }} />
            {filters.map((f) => (
              <Chip
                key={f.value}
                label={f.label}
                onClick={() => setActiveFilter(f.value)}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderRadius: 1.5,
                  bgcolor: activeFilter === f.value ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  color: activeFilter === f.value ? 'primary.main' : 'text.secondary',
                  border: `1px solid ${activeFilter === f.value ? theme.palette.primary.main : alpha(theme.palette.divider, 0.8)}`,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                }}
              />
            ))}
          </Stack>
        </Card>

        {/* Notifications List Card */}
        <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 14 }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.text.disabled, 0.05), color: 'text.disabled' }}>
                <EmptyIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" fontWeight={700}>
                Boîte vide
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Vous êtes à jour ! Aucune notification à afficher."}
              </Typography>
              {searchQuery && (
                <Button size="small" variant="text" sx={{ mt: 1 }} onClick={() => setSearchQuery('')}>Effacer la recherche</Button>
              )}
            </Box>
          ) : (
            <List disablePadding>
              <TransitionGroup component={null}>
                {filteredNotifications.map((n, index) => (
                  <Collapse key={n.id}>
                    <ListItem
                      disablePadding
                      sx={{
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        bgcolor: !n.read ? alpha(theme.palette.primary.main, 0.03) : 'transparent',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.06),
                        },
                        // Unread indicator bar
                        '&::before': !n.read ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 5,
                          bgcolor: 'primary.main',
                          boxShadow: `2px 0 8px ${alpha(theme.palette.primary.main, 0.4)}`,
                          zIndex: 1
                        } : {}
                      }}
                    >
                      <Box sx={{ p: 2.5, display: 'flex', gap: 3, width: '100%', alignItems: 'center' }}>
                        <ListItemAvatar sx={{ minWidth: 'auto' }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(getIconColor(n.type), 0.1),
                              color: getIconColor(n.type),
                              width: 46,
                              height: 46,
                              fontSize: '1.3rem',
                              border: `1px solid ${alpha(getIconColor(n.type), 0.2)}`
                            }}
                          >
                            {getIcon(n.type)}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight={!n.read ? 800 : 700}
                                color={!n.read ? 'text.primary' : 'text.secondary'}
                                sx={{ fontSize: '1rem' }}
                              >
                                {n.title}
                              </Typography>
                              <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 600, color: 'text.disabled', textAlign: 'right', minWidth: 80 }}>
                                {n.time}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                lineHeight: 1.6,
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                maxWidth: '90%'
                              }}
                            >
                              {n.message}
                            </Typography>
                          }
                        />

                        <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                          <Tooltip title={n.read ? "Marquer comme non lu" : "Marquer comme lu"}>
                            <IconButton
                              size="small"
                              onClick={() => toggleRead(n.id)}
                              sx={{
                                color: 'text.disabled',
                                '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                              }}
                            >
                              {n.read ? <UnreadIcon sx={{ fontSize: 20 }} /> : <ReadIcon sx={{ fontSize: 20 }} />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer définitivement">
                            <IconButton
                              size="small"
                              onClick={() => remove(n.id)}
                              sx={{
                                color: 'text.disabled',
                                '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) }
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
                  </Collapse>
                ))}
              </TransitionGroup>
            </List>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default Notifications;
