import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  Divider,
  Grid,
  Avatar,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
  Paper,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import { BORDER_RADIUS } from '../constants';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  AdminPanelSettings,
  Schedule,
  Backup,
  History,
  CloudDone,
  Storage,
  Speed,
  TrendingUp,
  PhotoCamera,
  Verified,
} from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { showSnackbar } from '../store/slices/uiSlice';
import { INDICATIF_TOGO } from '../constants';

interface AdminProfile {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  dateCreation: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  securityAlerts: boolean;
  newUserAlerts: boolean;
  paymentAlerts: boolean;
}

interface SystemInfo {
  version: string;
  lastUpdate: string;
  environment: string;
  dbSize: string;
  usersCount: number;
  uptime: string;
}

// Composant TabPanel défini hors du composant principal pour éviter les re-renders
const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
    {value === index && children}
  </Box>
);

const Parametres: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState(0);

  // État du profil admin
  const [profile, setProfile] = useState<AdminProfile>({
    nom: 'Mensah',
    prenom: 'Kodjo',
    email: 'admin@scholarway.tg',
    telephone: '90 00 00 00',
    role: 'Super Administrateur',
    dateCreation: '2024-01-01',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // État temporaire pour l'édition (avant clic sur Enregistrer)
  const [editingProfile, setEditingProfile] = useState<AdminProfile>(profile);

  // État du mot de passe
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Paramètres notifications
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    securityAlerts: true,
    newUserAlerts: true,
    paymentAlerts: true,
  });

  // Infos système
  const systemInfo: SystemInfo = {
    version: '1.2.0',
    lastUpdate: '4 février 2026',
    environment: 'Production',
    dbSize: '256 MB',
    usersCount: 1250,
    uptime: '99.9%',
  };

  const handleProfileSave = () => {
    setProfile(editingProfile);
    setIsEditingProfile(false);
    dispatch(
      showSnackbar({
        message: 'Profil mis à jour avec succès',
        severity: 'success',
      })
    );
  };

  const handleProfileCancel = () => {
    setEditingProfile(profile);
    setIsEditingProfile(false);
  };

  const handleEditProfileStart = () => {
    setEditingProfile(profile);
    setIsEditingProfile(true);
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      dispatch(showSnackbar({ message: 'Les mots de passe ne correspondent pas', severity: 'error' }));
      return;
    }
    if (passwords.new.length < 8) {
      dispatch(showSnackbar({ message: 'Le mot de passe doit contenir au moins 8 caractères', severity: 'error' }));
      return;
    }
    setPasswords({ current: '', new: '', confirm: '' });
    dispatch(showSnackbar({ message: 'Mot de passe modifié avec succès', severity: 'success' }));
  };

  const handleNotifSettingChange = (key: keyof NotificationSettings) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box>
      {/* En-tête avec profil */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: BORDER_RADIUS.md,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pattern décoratif */}
        <Box
          sx={{
            position: 'absolute',
            right: -50,
            top: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 50,
            bottom: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
          }}
        />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ md: 'center' }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '2.5rem',
                fontWeight: 700,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': { bgcolor: 'grey.100' },
              }}
              size="small"
            >
              <PhotoCamera sx={{ fontSize: 18, color: 'primary.main' }} />
            </IconButton>
          </Box>

          {/* Infos */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                {profile.prenom} {profile.nom}
              </Typography>
              <Verified sx={{ color: '#4fc3f7' }} />
            </Stack>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              {profile.email}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                icon={<AdminPanelSettings sx={{ color: 'white !important' }} />}
                label={profile.role}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<Schedule sx={{ color: 'white !important' }} />}
                label={`Membre depuis ${new Date(profile.dateCreation).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              />
            </Stack>
          </Box>

          {/* Stats rapides */}
          <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>
                {systemInfo.usersCount}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Utilisateurs
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>
                {systemInfo.uptime}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Uptime
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* Onglets */}
      <Paper sx={{ borderRadius: BORDER_RADIUS.md, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Profil" iconPosition="start" />
          <Tab icon={<LockIcon />} label="Sécurité" iconPosition="start" />
          <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
          <Tab icon={<Storage />} label="Système" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Profil */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Informations personnelles
                  </Typography>
                  <Stack direction="row" gap={2}>
                    {isEditingProfile && (
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleProfileCancel}
                      >
                        Annuler
                      </Button>
                    )}
                    <Button
                      variant={isEditingProfile ? 'contained' : 'outlined'}
                      startIcon={isEditingProfile ? <SaveIcon /> : <EditIcon />}
                      onClick={isEditingProfile ? handleProfileSave : handleEditProfileStart}
                    >
                      {isEditingProfile ? 'Enregistrer' : 'Modifier'}
                    </Button>
                  </Stack>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Prénom"
                      value={editingProfile.prenom}
                      onChange={(e) => setEditingProfile((p) => ({ ...p, prenom: e.target.value }))}
                      disabled={!isEditingProfile}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom"
                      value={editingProfile.nom}
                      onChange={(e) => setEditingProfile((p) => ({ ...p, nom: e.target.value }))}
                      disabled={!isEditingProfile}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editingProfile.email}
                      onChange={(e) => setEditingProfile((p) => ({ ...p, email: e.target.value }))}
                      disabled={!isEditingProfile}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      value={editingProfile.telephone}
                      onChange={(e) => setEditingProfile((p) => ({ ...p, telephone: e.target.value }))}
                      disabled={!isEditingProfile}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography color="text.secondary" sx={{ mr: 0.5 }}>
                              {INDICATIF_TOGO}
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Rôle & Permissions
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: BORDER_RADIUS.md,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    mb: 2,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                      <AdminPanelSettings />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {profile.role}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Accès complet au système
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  En tant que Super Administrateur, vous avez accès à toutes les fonctionnalités de la plateforme.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Sécurité */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Changer le mot de passe
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Utilisez un mot de passe fort avec au moins 8 caractères, incluant majuscules, minuscules et chiffres.
                </Alert>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Mot de passe actuel"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPasswords((s) => ({ ...s, current: !s.current }))}>
                            {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Nouveau mot de passe"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}>
                            {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {passwords.new && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Force du mot de passe
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(passwords.new.length * 10, 100)}
                        color={passwords.new.length >= 8 ? 'success' : passwords.new.length >= 5 ? 'warning' : 'error'}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    label="Confirmer le nouveau mot de passe"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    error={passwords.confirm !== '' && passwords.new !== passwords.confirm}
                    helperText={passwords.confirm !== '' && passwords.new !== passwords.confirm ? 'Les mots de passe ne correspondent pas' : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))}>
                            {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SecurityIcon />}
                    onClick={handlePasswordChange}
                    disabled={!passwords.current || !passwords.new || !passwords.confirm}
                    fullWidth
                    size="large"
                  >
                    Mettre à jour le mot de passe
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Sessions actives
                </Typography>
                <List>
                  <ListItem sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: BORDER_RADIUS.md, mb: 1 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'success.main', width: 36, height: 36 }}>
                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Session actuelle"
                      secondary="Lomé, Togo • Chrome sur Linux"
                    />
                    <Chip label="Actif" color="success" size="small" />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Dernières connexions
                </Typography>
                <List dense>
                  {[
                    { date: 'Aujourd\'hui, 09:15', ip: '192.168.1.100', location: 'Lomé' },
                    { date: 'Hier, 18:30', ip: '192.168.1.100', location: 'Lomé' },
                    { date: '2 fév, 14:00', ip: '41.207.xx.xx', location: 'Kara' },
                  ].map((session, i) => (
                    <ListItem key={i} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <History color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={session.date}
                        secondary={`${session.ip} • ${session.location}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Notifications */}
      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Préférences de notification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choisissez comment et quand vous souhaitez être notifié des événements importants.
            </Typography>

            <Grid container spacing={2}>
              {[
                { key: 'emailNotifications', icon: EmailIcon, title: 'Notifications par email', desc: 'Recevoir les alertes par email' },
                { key: 'pushNotifications', icon: NotificationsIcon, title: 'Notifications push', desc: 'Notifications dans le navigateur' },
                { key: 'newUserAlerts', icon: PersonIcon, title: 'Nouveaux utilisateurs', desc: 'Alertes lors de nouvelles inscriptions' },
                { key: 'paymentAlerts', icon: TrendingUp, title: 'Paiements', desc: 'Notifications de paiements reçus' },
                { key: 'securityAlerts', icon: SecurityIcon, title: 'Alertes de sécurité', desc: 'Connexions suspectes et menaces' },
                { key: 'weeklyReport', icon: Schedule, title: 'Rapport hebdomadaire', desc: 'Résumé chaque lundi matin' },
              ].map(({ key, icon: Icon, title, desc }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Paper
                    sx={{
                      p: 2,
                      border: `1px solid ${notifSettings[key as keyof NotificationSettings] ? theme.palette.primary.main : theme.palette.divider}`,
                      borderRadius: BORDER_RADIUS.md,
                      bgcolor: notifSettings[key as keyof NotificationSettings] ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: theme.palette.primary.main },
                    }}
                    onClick={() => handleNotifSettingChange(key as keyof NotificationSettings)}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: notifSettings[key as keyof NotificationSettings]
                              ? alpha(theme.palette.primary.main, 0.1)
                              : 'grey.100',
                            color: notifSettings[key as keyof NotificationSettings] ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          <Icon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {desc}
                          </Typography>
                        </Box>
                      </Stack>
                      <Switch
                        checked={notifSettings[key as keyof NotificationSettings]}
                        onChange={() => handleNotifSettingChange(key as keyof NotificationSettings)}
                        color="primary"
                      />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab Système */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Informations système
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {[
                    { icon: CloudDone, label: 'Version', value: `ScholarWay Admin v${systemInfo.version}`, color: 'primary' },
                    { icon: Schedule, label: 'Dernière mise à jour', value: systemInfo.lastUpdate, color: 'info' },
                    { icon: Storage, label: 'Base de données', value: systemInfo.dbSize, color: 'secondary' },
                    { icon: Speed, label: 'Disponibilité', value: systemInfo.uptime, color: 'success' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <Grid item xs={12} sm={6} md={3} key={label}>
                      <Paper
                        sx={{
                          p: 2.5,
                          textAlign: 'center',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: BORDER_RADIUS.md,
                        }}
                      >
                        <Avatar
                          sx={{
                            mx: 'auto',
                            mb: 1.5,
                            bgcolor: alpha(theme.palette[color as 'primary'].main, 0.1),
                            color: `${color}.main`,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Icon />
                        </Avatar>
                        <Typography variant="h6" fontWeight={700}>
                          {value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Sauvegarde
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Automatique"
                    color="success"
                    size="small"
                  />
                </Stack>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Dernière sauvegarde: Aujourd'hui à 03:00
                </Alert>
                <Button variant="outlined" startIcon={<Backup />} fullWidth>
                  Lancer une sauvegarde manuelle
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Environnement
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Mode</Typography>
                    <Chip
                      label={systemInfo.environment}
                      color={systemInfo.environment === 'Production' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Région</Typography>
                    <Typography fontWeight={500}>Afrique de l'Ouest (Lomé)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Fuseau horaire</Typography>
                    <Typography fontWeight={500}>GMT+0 (Togo)</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Parametres;
