import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    useTheme,
    alpha,
    Checkbox,
    FormControlLabel,
    Link,
    Fade,
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Login as LoginIcon,
    School as SchoolIcon,
    AutoGraph,
    Groups,
    MenuBook,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import loginBg from '../assets/login_bg.jpg';

// Composant pour les features de la landing
interface FeatureItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
            sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white', mb: 0.5 }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {description}
            </Typography>
        </Box>
    </Stack>
);

const Login: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (error) dispatch(setError(null));
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async () => {
        // Validation
        if (!credentials.username || !credentials.password) {
            dispatch(setError('Veuillez remplir tous les champs'));
            return;
        }

        // Pour l'instant, accepter "admin" dans les deux champs
        if (credentials.username !== 'admin' || credentials.password !== 'admin') {
            dispatch(setError('Identifiants invalides'));
            return;
        }

        // Simulation de connexion
        dispatch(setLoading(true));
        dispatch(setError(null));

        setTimeout(() => {
            dispatch(
                setUser({
                    id: '1',
                    firstName: 'KOUMONDJI',
                    lastName: 'H. Timothée Klaus',
                    email: 'admin@scholarway.tg',
                    role: 'admin',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
            );
            dispatch(setLoading(false));
            navigate('/');
        }, 1200);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                bgcolor: theme.palette.grey[100],
            }}
        >
            {/* Panneau gauche - Branding */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', lg: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundImage: `linear-gradient(135deg, rgba(25, 118, 210, 0.87), rgba(69, 39, 160, 0.85)), url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    p: 6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Patterns décoratifs */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.05)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.03)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '10%',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                />

                {/* Logo et titre */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                            ScholarWay
                        </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                        Plateforme d'orientation académique du Togo
                    </Typography>
                </Box>

                {/* Features */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, display: 'block' }}>
                        Pourquoi ScholarWay ?
                    </Typography>
                    <Stack spacing={4}>
                        <FeatureItem
                            icon={<AutoGraph sx={{ color: 'white', fontSize: 24 }} />}
                            title="Tableau de bord analytique"
                            description="Suivez les inscriptions, programmes et établissements en temps réel"
                        />
                        <FeatureItem
                            icon={<Groups sx={{ color: 'white', fontSize: 24 }} />}
                            title="Gestion des bacheliers"
                            description="Accompagnez les étudiants dans leur parcours d'orientation"
                        />
                        <FeatureItem
                            icon={<MenuBook sx={{ color: 'white', fontSize: 24 }} />}
                            title="Base de programmes"
                            description="Accédez à plus de 180 programmes d'études au Togo"
                        />
                    </Stack>
                </Box>

                {/* Footer */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        © 2026 ScholarWay. Ensemble batissons un Togo meilleur
                    </Typography>
                </Box>
            </Box>

            {/* Panneau droit - Formulaire */}
            <Box
                sx={{
                    flex: { xs: 1, lg: 0.6 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: { xs: 3, sm: 6 },
                    bgcolor: 'white',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 440 }}>
                    {/* Header mobile */}
                    <Box sx={{ display: { lg: 'none' }, mb: 4, textAlign: 'center' }}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 1 }}>
                            <SchoolIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                ScholarWay
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Panneau d'administration
                        </Typography>
                    </Box>

                    {/* Titre du formulaire */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Connexion
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Entrez vos identifiants pour accéder au tableau de bord
                        </Typography>
                    </Box>

                    {/* Message d'erreur */}
                    <Fade in={!!error}>
                        <Box sx={{ mb: 3 }}>
                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': { alignItems: 'center' }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}
                        </Box>
                    </Fade>

                    {/* Formulaire */}
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Nom d'utilisateur"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            placeholder="Entrez votre identifiant"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: theme.palette.grey[50],
                                    '&:hover': { bgcolor: theme.palette.grey[100] },
                                    '&.Mui-focused': { bgcolor: 'white' },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Mot de passe"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={credentials.password}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            placeholder="Entrez votre mot de passe"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                            disabled={loading}
                                            size="small"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: theme.palette.grey[50],
                                    '&:hover': { bgcolor: theme.palette.grey[100] },
                                    '&.Mui-focused': { bgcolor: 'white' },
                                },
                            }}
                        />

                        {/* Remember me & Forgot password */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        size="small"
                                        disabled={loading}
                                    />
                                }
                                label={
                                    <Typography variant="body2" color="text.secondary">
                                        Se souvenir de moi
                                    </Typography>
                                }
                            />
                            <Link
                                href="#"
                                underline="hover"
                                sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                            >
                                Mot de passe oublié ?
                            </Link>
                        </Stack>

                        {/* Bouton de connexion */}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleLogin}
                            disabled={loading}
                            startIcon={!loading && <LoginIcon />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                '&:hover': {
                                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                'Se connecter'
                            )}
                        </Button>
                    </Stack>

                    {/* Info de démo */}
                    <Box
                        sx={{
                            mt: 4,
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                    >
                        <Typography variant="subtitle2" color="info.dark" fontWeight={600} gutterBottom>
                            🔐 Identifiants de démo
                        </Typography>
                        <Stack direction="row" spacing={4}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Utilisateur
                                </Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                    admin
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Mot de passe
                                </Typography>
                                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                    admin
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Footer */}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                        Besoin d'aide ?{' '}
                        <Link href="#" underline="hover" fontWeight={600}>
                            Contactez le support
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
