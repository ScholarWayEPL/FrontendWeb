import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
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
  Fade,
} from '@mui/material';
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
  PhotoCamera,
  Verified,
} from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks';
import { showSnackbar } from '../../store/slices/uiSlice';
import { INDICATIF_TOGO } from '../../constants';

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

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
    {value === index && (
      <Fade in={true} timeout={400}>
        <Box>{children}</Box>
      </Fade>
    )}
  </Box>
);

const Parametres: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const [profile, setProfile] = useState<AdminProfile>({
    nom: 'Mensah',
    prenom: 'Kodjo',
    email: 'admin@scholarway.tg',
    telephone: '90 00 00 00',
    role: 'Super Administrateur',
    dateCreation: '2024-01-01',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AdminProfile>(profile);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    securityAlerts: true,
    newUserAlerts: true,
    paymentAlerts: true,
  });

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
    dispatch(showSnackbar({ message: 'Profil mis à jour avec succès', severity: 'success' }));
  };

  const handleProfileCancel = () => {
    setEditingProfile(profile);
    setIsEditingProfile(false);
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      dispatch(showSnackbar({ message: 'Les mots de passe ne correspondent pas', severity: 'error' }));
      return;
    }
    setPasswords({ current: '', new: '', confirm: '' });
    dispatch(showSnackbar({ message: 'Mot de passe modifié avec succès', severity: 'success' }));
  };

  const handleNotifSettingChange = (key: keyof NotificationSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Banner Profil Premium */}
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.background.paper, 0.2)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.mode === 'dark' ? 'text.primary' : 'white',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Cercles décoratifs */}
        <Box sx={{ position: 'absolute', right: -60, top: -60, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', left: '20%', bottom: -40, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 140,
                height: 140,
                bgcolor: 'background.paper',
                color: 'primary.main',
                fontSize: '3rem',
                fontWeight: 800,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '4px solid',
                borderColor: alpha('#FFF', 0.2)
              }}
            >
              {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
            </Avatar>
            <IconButton sx={{ position: 'absolute', bottom: 5, right: 5, bgcolor: 'background.paper', boxShadow: 3, '&:hover': { bgcolor: 'action.hover' } }} size="small">
              <PhotoCamera sx={{ fontSize: 18, color: 'primary.main' }} />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 1 }}>
              <Typography variant="h3" fontWeight={800} letterSpacing="-0.03em">
                {profile.prenom} {profile.nom}
              </Typography>
              <Verified sx={{ color: '#4fc3f7', fontSize: 28 }} />
            </Stack>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500, mb: 2.5 }}>{profile.email}</Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <Chip icon={<AdminPanelSettings sx={{ color: 'inherit !important' }} />} label={profile.role} sx={{ bgcolor: alpha('#FFF', 0.1), color: 'inherit', fontWeight: 700, backdropFilter: 'blur(4px)' }} />
              <Chip icon={<Schedule sx={{ color: 'inherit !important' }} />} label={`Depuis ${new Date(profile.dateCreation).getFullYear()}`} sx={{ bgcolor: alpha('#FFF', 0.15), color: 'inherit', fontWeight: 600 }} />
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Navigation Tabs Premium */}
      <Paper sx={{ borderRadius: '16px', mb: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto" sx={{ '& .MuiTab-root': { fontWeight: 800, px: 4, py: 2.5, minHeight: 64, color: 'text.secondary' }, '& .Mui-selected': { color: 'primary.main' } }}>
          <Tab icon={<PersonIcon sx={{ mr: 1 }} />} label="Mon Profil" iconPosition="start" />
          <Tab icon={<LockIcon sx={{ mr: 1 }} />} label="Sécurité" iconPosition="start" />
          <Tab icon={<NotificationsIcon sx={{ mr: 1 }} />} label="Alertes" iconPosition="start" />
          <Tab icon={<Storage sx={{ mr: 1 }} />} label="Système" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={800}>Détails du compte</Typography>
                  <Stack direction="row" spacing={2}>
                    {isEditingProfile ? (
                      <>
                        <Button variant="outlined" color="inherit" onClick={handleProfileCancel} sx={{ borderRadius: '10px' }}>Annuler</Button>
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleProfileSave} sx={{ borderRadius: '10px', px: 3 }}>Enregistrer</Button>
                      </>
                    ) : (
                      <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditingProfile(true)} sx={{ borderRadius: '10px' }}>Modifier</Button>
                    )}
                  </Stack>
                </Stack>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" value={editingProfile.prenom} disabled={!isEditingProfile} onChange={e => setEditingProfile({ ...editingProfile, prenom: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Nom" value={editingProfile.nom} disabled={!isEditingProfile} onChange={e => setEditingProfile({ ...editingProfile, nom: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Adresse Email" value={editingProfile.email} disabled={!isEditingProfile} onChange={e => setEditingProfile({ ...editingProfile, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Téléphone" value={editingProfile.telephone} disabled={!isEditingProfile} InputProps={{ startAdornment: <InputAdornment position="start">{INDICATIF_TOGO}</InputAdornment> }} onChange={e => setEditingProfile({ ...editingProfile, telephone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider', height: '100%', bgcolor: alpha(theme.palette.success.main, 0.02) }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom>Permissions Actives</Typography>
                <Box sx={{ mt: 3, p: 3, borderRadius: '16px', bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.1)}` }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main', color: 'white' }}><AdminPanelSettings /></Avatar>
                    <Box><Typography variant="subtitle2" fontWeight={800}>{profile.role}</Typography><Typography variant="caption" color="text.secondary">Contrôle Total Hérité</Typography></Box>
                  </Stack>
                </Box>
                <List sx={{ mt: 2 }}>
                  {['Gestion des utilisateurs', 'Configuration système', 'Flux financiers', 'Validation établissements'].map(p => (
                    <ListItem key={p} sx={{ px: 0 }}><ListItemIcon sx={{ minWidth: 32 }}><CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} /></ListItemIcon><ListItemText primary={p} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} /></ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom>Sécurité du Compte</Typography>
                <Alert severity="warning" sx={{ mb: 4, borderRadius: '12px' }}>Changer régulièrement votre mot de passe renforce la protection de vos données administratives.</Alert>
                <Stack spacing={3}>
                  <TextField fullWidth label="Mot de passe actuel" type={showPasswords.current ? "text" : "password"} value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}>{showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }} />
                  <TextField fullWidth label="Nouveau mot de passe" type={showPasswords.new ? "text" : "password"} value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}>{showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }} />
                  {passwords.new && <Box><LinearProgress variant="determinate" value={Math.min(passwords.new.length * 10, 100)} color={passwords.new.length >= 8 ? "success" : "warning"} sx={{ height: 6, borderRadius: 3, mb: 1 }} /><Typography variant="caption" color="text.secondary">Force: {passwords.new.length >= 8 ? 'Forte' : 'Faible'}</Typography></Box>}
                  <TextField fullWidth label="Confirmation" type={showPasswords.confirm ? "text" : "password"} value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  <Button variant="contained" size="large" fullWidth sx={{ py: 1.5, borderRadius: '12px', fontWeight: 800 }} onClick={handlePasswordChange}>Appliquer le changement</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom>Journal d'accès</Typography>
                <List>
                  <ListItem sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: '12px', mb: 2 }}>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary="Session active" secondary="Lomé, Togo • 192.168.1.XX" primaryTypographyProps={{ fontWeight: 700 }} />
                    <Chip label="Current" size="small" color="success" sx={{ fontWeight: 800 }} />
                  </ListItem>
                  {['Hier à 14:20 • Paris, FR', '02 Fév • Kara, TG'].map((log, i) => (
                    <ListItem key={i} sx={{ px: 1 }}><ListItemIcon><History fontSize="small" /></ListItemIcon><ListItemText primary={log} secondary="Authentification réussie" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} /></ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Préférences d'Alertes</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Configurez les canaux et fréquences de réception des notifications critiques.</Typography>
            <Grid container spacing={3}>
              {[
                { k: 'emailNotifications', t: 'Emails direct', d: 'Réception immédiate des alertes par mail', i: EmailIcon },
                { k: 'pushNotifications', t: 'Push Browser', d: 'Notifications de bureau en temps réel', i: NotificationsIcon },
                { k: 'securityAlerts', t: 'Sécurité Critique', d: 'Tentatives d\'intrusion et échecs de connexion', i: SecurityIcon },
                { k: 'weeklyReport', t: 'Résumé Hebdo', d: 'Rapport d\'activité consolidé chaque lundi', i: Schedule },
              ].map(({ k, t, d, i: Icon }) => (
                <Grid item xs={12} sm={6} key={k}>
                  <Box sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: notifSettings[k as keyof NotificationSettings] ? 'primary.main' : 'divider', bgcolor: notifSettings[k as keyof NotificationSettings] ? alpha(theme.palette.primary.main, 0.03) : 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={2.5} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}><Icon /></Avatar>
                      <Box><Typography variant="subtitle2" fontWeight={800}>{t}</Typography><Typography variant="caption" color="text.secondary">{d}</Typography></Box>
                    </Stack>
                    <Switch checked={notifSettings[k as keyof NotificationSettings]} onChange={() => handleNotifSettingChange(k as keyof NotificationSettings)} color="primary" />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 4 }}>État de Santé du Système</Typography>
                <Grid container spacing={3}>
                  {[
                    { l: 'Version SDK', v: `v${systemInfo.version}`, i: CloudDone, c: 'primary' },
                    { l: 'Base de Données', v: systemInfo.dbSize, i: Storage, c: 'info' },
                    { l: 'Uptime Réseau', v: systemInfo.uptime, i: Speed, c: 'success' },
                    { l: 'Dernière MàJ', v: '04 Fév 2026', i: Backup, c: 'secondary' },
                  ].map(stat => (
                    <Grid item xs={12} sm={6} md={3} key={stat.l}>
                      <Box sx={{ p: 3, textAlign: 'center', borderRadius: '20px', bgcolor: alpha(theme.palette[stat.c as 'primary'].main, 0.05), border: `1px solid ${alpha(theme.palette[stat.c as 'primary'].main, 0.1)}` }}>
                        <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'background.paper', color: `${stat.c}.main`, boxShadow: 1 }}><stat.i /></Avatar>
                        <Typography variant="h6" fontWeight={900}>{stat.v}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{stat.l}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.error.main, 0.03) }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} color="error.main" gutterBottom>Zone de Danger</Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>Actions irréversibles impactant la disponibilité de la plateforme.</Typography>
                <Stack spacing={2}>
                  <Button variant="outlined" color="error" fullWidth sx={{ borderRadius: '10px', py: 1.2, fontWeight: 700 }}>Vider les fichiers temporaires</Button>
                  <Button variant="contained" color="error" fullWidth sx={{ borderRadius: '10px', py: 1.2, fontWeight: 800 }}>Maintenance Immédiate</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom>Configuration de l'Environnement</Typography>
                <Stack spacing={2.5} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">Serveur principal</Typography><Chip label="Europe West" size="small" variant="outlined" sx={{ fontWeight: 700 }} /></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">Base de données</Typography><Chip label="Replica Sync" color="success" size="small" sx={{ fontWeight: 700 }} /></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">SSL / TLS</Typography><Typography variant="body2" fontWeight={800} color="success.main">Activé (v1.3)</Typography></Box>
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
