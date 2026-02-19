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
  Divider,
  useTheme,
  alpha,
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
  TrendingUp,
  TrendingDown,
  Refresh,
  MoreVert,
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
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { BORDER_RADIUS } from '../constants';
import StatCard from '../components/StatCard';
import { type ActivityItem } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';

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
      case 'user_created':
        return <PersonAdd color="primary" />;
      case 'etablissement_added':
        return <Add color="secondary" />;
      case 'programme_updated':
        return <Edit color="info" />;
      case 'notification_sent':
        return <Send color="warning" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_created':
        return 'primary';
      case 'etablissement_added':
        return 'secondary';
      case 'programme_updated':
        return 'info';
      case 'notification_sent':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Il y a quelques minutes';
    if (hours < 24) return `Il y a ${hours}h`;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !stats) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Tableau de bord
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Bienvenue sur le panneau d'administration ScholarWay
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Dernière mise à jour: {formatDate(lastUpdated)}
            </Typography>
          )}
        </Box>
        <Tooltip title="Actualiser les données">
          <IconButton onClick={handleRefresh} disabled={loading} color="primary" size="large">
            <Refresh sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Utilisateurs"
            value={stats?.totalUsers || 0}
            growth={stats?.usersGrowth}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Établissements"
            value={stats?.totalEtablissements || 0}
            growth={stats?.etablissementsGrowth}
            icon={<SchoolIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Programmes"
            value={stats?.totalProgrammes || 0}
            growth={stats?.programmesGrowth}
            icon={<MenuBookIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Notifications"
            value={stats?.totalNotifications || 0}
            icon={<NotificationsIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Graphiques principaux */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Graphique des inscriptions */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Évolution des inscriptions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inscriptions vs Dossiers complets (6 derniers mois)
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={stats?.inscriptionsParMois || []}>
                  <defs>
                    <linearGradient id="colorInscriptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDossiers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: BORDER_RADIUS.md,
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Inscriptions"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorInscriptions)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="value2"
                    name="Dossiers complets"
                    stroke={theme.palette.success.main}
                    fillOpacity={1}
                    fill="url(#colorDossiers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Répartition par niveau */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Répartition par niveau
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Distribution des candidatures
              </Typography>
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
                  <Pie
                    data={stats?.repartitionParNiveau || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats?.repartitionParNiveau?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Deuxième rangée de graphiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Répartition par région */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Répartition par région
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Candidats par région du Togo
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={stats?.repartitionParRegion || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stats?.repartitionParRegion?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Activité hebdomadaire */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Activité hebdomadaire
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nouvelles inscriptions par jour
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={stats?.performanceHebdo || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section basse : Activité + Top Programmes + Stats rapides */}
      <Grid container spacing={3}>
        {/* Activité récente */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Activité récente
              </Typography>
              <List sx={{ py: 0 }}>
                {stats?.recentActivity.slice(0, 5).map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      borderRadius: BORDER_RADIUS.md,
                      mb: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                      px: 2,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(theme.palette[getActivityColor(activity.type) as 'primary'].main, 0.15),
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={formatDate(activity.timestamp)}
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: 11 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Programmes */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmojiEvents color="warning" />
                <Typography variant="h6" fontWeight={600}>
                  Top Programmes
                </Typography>
              </Box>
              {stats?.topProgrammes?.map((programme, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: 12,
                          bgcolor: index === 0 ? 'warning.main' : index === 1 ? 'grey.400' : index === 2 ? '#CD7F32' : 'grey.300',
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                          {programme.nom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {programme.etablissement}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${programme.candidatures}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
                    <LinearProgress
                      variant="determinate"
                      value={programme.taux}
                      sx={{ flexGrow: 1, height: 6, borderRadius: 8 }}
                      color={programme.taux >= 70 ? 'success' : programme.taux >= 50 ? 'warning' : 'error'}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
                      {programme.taux}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Stats rapides */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 450 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Résumé rapide
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {stats?.statsRapides?.map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: BORDER_RADIUS.md,
                        bgcolor: alpha(theme.palette[stat.color].main, 0.08),
                        border: `1px solid ${alpha(theme.palette[stat.color].main, 0.2)}`,
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color={`${stat.color}.main`}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
                      >
                        {stat.value}
                        {stat.trend && (
                          stat.trend > 0 ? (
                            <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                          ) : (
                            <TrendingDown sx={{ fontSize: 18, color: 'error.main' }} />
                          )
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CSS pour l'animation de spin */}
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
