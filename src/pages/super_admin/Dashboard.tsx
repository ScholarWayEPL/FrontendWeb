import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  PersonAdd,
  Add,
  Edit,
  Send,
  Refresh,
  EmojiEvents,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatCard from '../../components/StatCard';
import { type ActivityItem } from '../../types';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { stats, loading, lastUpdated } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (!stats) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, stats]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_created': return <PersonAdd fontSize="small" />;
      case 'etablissement_added': return <Add fontSize="small" />;
      case 'programme_updated': return <Edit fontSize="small" />;
      case 'notification_sent': return <Send fontSize="small" />;
      default: return <NotificationsIcon fontSize="small" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_created': return 'primary';
      case 'etablissement_added': return 'secondary';
      case 'programme_updated': return 'info';
      case 'notification_sent': return 'warning';
      default: return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Récent';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* En-tête Supérieur */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 0.5, letterSpacing: '-0.02em' }}>
            Tableau de Bord
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Visualisez les performances et l'activité de ScholarWay au Togo
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {lastUpdated && (
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
              MàJ: {new Date(lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          )}
          <Tooltip title="Actualiser les données">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Refresh sx={{ animation: loading ? 'spin 1.5s linear infinite' : 'none', color: 'primary.main' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Cartes de Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Bacheliers" value={(stats && stats.totalUsers) || 0} growth={stats ? stats.usersGrowth : undefined} icon={<PeopleIcon />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Établissements" value={(stats && stats.totalEtablissements) || 0} growth={stats ? stats.etablissementsGrowth : undefined} icon={<SchoolIcon />} color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Formations" value={(stats && stats.totalProgrammes) || 0} growth={stats ? stats.programmesGrowth : undefined} icon={<MenuBookIcon />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Notifications" value={(stats && stats.totalNotifications) || 0} icon={<NotificationsIcon />} color="warning" />
        </Grid>
      </Grid>

      {/* Zone Graphique Principale */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>Croissance des Inscriptions</Typography>
                  <Typography variant="caption" color="text.secondary">Inscriptions mensuelles vs Dossiers validés</Typography>
                </Box>
                <Chip label="6 derniers mois" size="small" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 600 }} />
              </Box>
              <Box sx={{ height: 320, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={(stats && stats.inscriptionsParMois) || []}>
                    <defs>
                      <linearGradient id="colorInscr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        backgroundColor: theme.palette.background.paper
                      }}
                    />
                    <Area type="monotone" dataKey="value" name="Inscriptions" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorInscr)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: '24px', height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>Niveaux d'Études</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 4 }}>Répartition des nouveaux dossiers</Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={(stats && stats.repartitionParNiveau) || []}
                      cx="50%" cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {stats && stats.repartitionParNiveau && stats.repartitionParNiveau.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Zone Inférieure */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Activité Récente</Typography>
              <List disablePadding>
                {stats && stats.recentActivity && stats.recentActivity.slice(0, 6).map((activity, idx) => (
                  <ListItem key={activity.id} sx={{ px: 0, py: 1.5, borderBottom: idx < 5 ? '1px solid' : 'none', borderColor: alpha(theme.palette.divider, 0.5) }}>
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette[getActivityColor(activity.type)].main, 0.1), color: `${getActivityColor(activity.type)}.main`, border: `1px solid ${alpha(theme.palette[getActivityColor(activity.type)].main, 0.2)}` }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={formatDate(activity.timestamp)}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600, sx: { color: 'text.primary' } }}
                      secondaryTypographyProps={{ variant: 'caption', sx: { color: 'text.disabled' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <EmojiEvents color="warning" />
                <Typography variant="h6" fontWeight={800}>Établissements Phares</Typography>
              </Stack>
              <Stack spacing={2.5}>
                {stats && stats.topProgrammes && stats.topProgrammes.slice(0, 5).map((prog, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography variant="caption" fontWeight={900} sx={{ color: 'text.disabled', width: 14 }}>{index + 1}</Typography>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{prog.nom}</Typography>
                          <Typography variant="caption" color="text.secondary">{prog.etablissement}</Typography>
                        </Box>
                      </Stack>
                      <Typography variant="caption" fontWeight={800} color="primary.main">{prog.candidatures}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={prog.taux} sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'divider', height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Résumé de Performance</Typography>
              <Grid container spacing={2}>
                {stats && stats.statsRapides && stats.statsRapides.map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ p: 2, borderRadius: '16px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={900} color="text.primary">{stat.value}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{stat.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 4, p: 3, borderRadius: '20px', bgcolor: 'primary.main', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <Typography variant="h6" fontWeight={800}>Besoin d'aide ?</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, fontSize: '0.8rem' }}>Accédez à la documentation complète de l'administration ScholarWay.</Typography>
                <Button size="small" variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700, '&:hover': { bgcolor: alpha('#FFF', 0.9) } }}>Voir Guide</Button>
                <DashboardIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 100, opacity: 0.1, transform: 'rotate(-15deg)' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Dashboard;
