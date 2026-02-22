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
    Slide,
    Divider,
    Stepper,
    Step,
    StepLabel,
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
    Business as BusinessIcon,
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    Language as LanguageIcon,
    CloudUpload as CloudUploadIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import { authApi } from '../api';
import loginBg from '../assets/login_bg.jpg';
import type { User } from '../types';

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

// Interface pour le formulaire d'inscription
interface InscriptionForm {
    nomEtablissement: string;
    emailPro: string;
    telephonePro: string;
    localisation: string;
    siteWeb: string;
    description: string;
    documentAccreditation: File | null;
}

const inscriptionSteps = ['Informations générales', 'Coordonnées', 'Documents'];

const Login: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    // État pour basculer entre login et inscription
    const [showInscription, setShowInscription] = useState(false);
    const [inscriptionStep, setInscriptionStep] = useState(0);
    const [inscriptionSuccess, setInscriptionSuccess] = useState(false);
    const [inscriptionLoading, setInscriptionLoading] = useState(false);

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // État du formulaire d'inscription
    const [inscriptionForm, setInscriptionForm] = useState<InscriptionForm>({
        nomEtablissement: '',
        emailPro: '',
        telephonePro: '',
        localisation: '',
        siteWeb: '',
        description: '',
        documentAccreditation: null,
    });
    const [inscriptionError, setInscriptionError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (error) dispatch(setError(null));
    };

    const handleInscriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInscriptionForm((prev) => ({ ...prev, [name]: value }));
        if (inscriptionError) setInscriptionError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setInscriptionForm((prev) => ({ ...prev, documentAccreditation: e.target.files![0] }));
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleNextStep = () => {
        // Validation par étape
        if (inscriptionStep === 0) {
            if (!inscriptionForm.nomEtablissement || !inscriptionForm.description) {
                setInscriptionError('Veuillez remplir le nom et la description de l\'établissement');
                return;
            }
        } else if (inscriptionStep === 1) {
            if (!inscriptionForm.emailPro || !inscriptionForm.telephonePro || !inscriptionForm.localisation) {
                setInscriptionError('Veuillez remplir tous les champs obligatoires');
                return;
            }
        }
        setInscriptionStep((prev) => prev + 1);
    };

    const handlePrevStep = () => {
        setInscriptionStep((prev) => prev - 1);
    };

    const handleSubmitInscription = () => {
        if (!inscriptionForm.documentAccreditation) {
            setInscriptionError('Veuillez téléverser le document d\'accréditation');
            return;
        }

        setInscriptionLoading(true);
        // Simulation d'envoi
        setTimeout(() => {
            setInscriptionLoading(false);
            setInscriptionSuccess(true);
        }, 2000);
    };

    const handleBackToLogin = () => {
        setShowInscription(false);
        setInscriptionStep(0);
        setInscriptionSuccess(false);
        setInscriptionForm({
            nomEtablissement: '',
            emailPro: '',
            telephonePro: '',
            localisation: '',
            siteWeb: '',
            description: '',
            documentAccreditation: null,
        });
        setInscriptionError(null);
    };

    // On conserve les comptes de démo en commentaire pour référence si besoin
    /*
    const demoAccounts = [ ... ];
    */

    const handleLogin = async () => {
        // Validation
        if (!credentials.email || !credentials.password) {
            dispatch(setError('Veuillez remplir tous les champs'));
            return;
        }

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await authApi.login(credentials.email, credentials.password);

            if (response.success && response.data) {
                const { token, email, role, userId } = response.data;

                // Stockage du token
                localStorage.setItem('authToken', token);

                // Construct user object for Redux from response
                const userObj: User = {
                    id: String(userId),
                    email: email,
                    role: role,
                    firstName: email.split('@')[0], // Fallback as backend returns limited info on login
                    lastName: '',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                // Update Redux state
                dispatch(setUser(userObj));

                // Redirection selon le rôle
                if (userObj.role === 'ROLE_ADMINISTRATEUR') {
                    navigate('/');
                } else if (userObj.role === 'ROLE_ADMIN_ETABLISSEMENT') {
                    navigate('/etablissement/dashboard');
                } else if (userObj.role === 'ROLE_BACHELIER') {
                    navigate('/bachelier/dashboard');
                }
            } else {
                dispatch(setError(response.message || 'Identifiants invalides'));
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors de la connexion';
            dispatch(setError(errorMessage));
        } finally {
            dispatch(setLoading(false));
        }
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
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 480, position: 'relative' }}>
                    {/* Header mobile */}
                    <Box sx={{ display: { lg: 'none' }, mb: 4, textAlign: 'center' }}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 1 }}>
                            <SchoolIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                ScholarWay
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            {showInscription ? 'Inscription Établissement' : 'Panneau d\'administration'}
                        </Typography>
                    </Box>

                    {/* ===== FORMULAIRE DE CONNEXION ===== */}
                    <Slide direction="right" in={!showInscription} mountOnEnter unmountOnExit>
                        <Box>
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
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={credentials.email}
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
                                    🔐 Identifiants de test (Backend)
                                </Typography>

                                {/* Admin ScholarWay */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="primary.main" fontWeight={600}>
                                        Administrateur ScholarWay
                                    </Typography>
                                    <Stack direction="row" spacing={4}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Utilisateur
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                                admin@scholarway.com
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Mot de passe
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                                Admin@2026
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                            </Box>

                            {/* Séparateur */}
                            <Divider sx={{ my: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    ou
                                </Typography>
                            </Divider>

                            {/* Bouton inscription établissement */}
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                onClick={() => setShowInscription(true)}
                                startIcon={<BusinessIcon />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                    },
                                }}
                            >
                                Inscrire mon établissement
                            </Button>

                            {/* Footer */}
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                                Besoin d'aide ?{' '}
                                <Link href="#" underline="hover" fontWeight={600}>
                                    Contactez le support
                                </Link>
                            </Typography>
                        </Box>
                    </Slide>

                    {/* ===== FORMULAIRE D'INSCRIPTION ===== */}
                    <Slide direction="left" in={showInscription} mountOnEnter unmountOnExit>
                        <Box>
                            {inscriptionSuccess ? (
                                /* Message de succès */
                                <Fade in={inscriptionSuccess}>
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                            }}
                                        >
                                            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                        </Box>
                                        <Typography variant="h5" fontWeight={700} gutterBottom>
                                            Demande envoyée !
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                            Votre demande d'inscription a été soumise avec succès.
                                            Vous recevrez un email de confirmation une fois votre dossier validé par notre équipe.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={handleBackToLogin}
                                            startIcon={<ArrowBackIcon />}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                            }}
                                        >
                                            Retour à la connexion
                                        </Button>
                                    </Box>
                                </Fade>
                            ) : (
                                <>
                                    {/* Header inscription */}
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                        <IconButton onClick={handleBackToLogin} sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}>
                                            <ArrowBackIcon />
                                        </IconButton>
                                        <Box>
                                            <Typography variant="h5" fontWeight={700}>
                                                Inscription Établissement
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Remplissez le formulaire pour demander l'accès
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Stepper */}
                                    <Stepper activeStep={inscriptionStep} sx={{ mb: 4 }}>
                                        {inscriptionSteps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    {/* Message d'erreur */}
                                    <Fade in={!!inscriptionError}>
                                        <Box sx={{ mb: 2 }}>
                                            {inscriptionError && (
                                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                                    {inscriptionError}
                                                </Alert>
                                            )}
                                        </Box>
                                    </Fade>

                                    {/* Étape 1: Informations générales */}
                                    {inscriptionStep === 0 && (
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                label="Nom de l'établissement *"
                                                name="nomEtablissement"
                                                value={inscriptionForm.nomEtablissement}
                                                onChange={handleInscriptionInputChange}
                                                placeholder="Ex: Université de Lomé"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <BusinessIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        bgcolor: theme.palette.grey[50],
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Description de l'établissement *"
                                                name="description"
                                                value={inscriptionForm.description}
                                                onChange={handleInscriptionInputChange}
                                                placeholder="Décrivez votre établissement, ses formations, ses atouts..."
                                                multiline
                                                rows={4}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        bgcolor: theme.palette.grey[50],
                                                    },
                                                }}
                                            />
                                        </Stack>
                                    )}

                                    {/* Étape 2: Coordonnées */}
                                    {inscriptionStep === 1 && (
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                label="Email professionnel *"
                                                name="emailPro"
                                                type="email"
                                                value={inscriptionForm.emailPro}
                                                onChange={handleInscriptionInputChange}
                                                placeholder="contact@etablissement.tg"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        bgcolor: theme.palette.grey[50],
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Téléphone *"
                                                name="telephonePro"
                                                value={inscriptionForm.telephonePro}
                                                onChange={handleInscriptionInputChange}
                                                placeholder="+228 90 00 00 00"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        bgcolor: theme.palette.grey[50],
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Localisation *"
                                                name="localisation"
                                                value={inscriptionForm.localisation}
                                                onChange={handleInscriptionInputChange}
                                                placeholder="Lomé, Boulevard du 13 Janvier"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        bgcolor: theme.palette.grey[50],
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Site web (optionnel)"
                                                name="siteWeb"
                                                value={inscriptionForm.siteWeb}
                                                onChange={handleInscriptionInputChange}
                                                placeholder="https://www.etablissement.tg"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LanguageIcon sx={{ color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        bgcolor: theme.palette.grey[50],
                                                    },
                                                }}
                                            />
                                        </Stack>
                                    )}

                                    {/* Étape 3: Documents */}
                                    {inscriptionStep === 2 && (
                                        <Stack spacing={3}>
                                            <Box
                                                sx={{
                                                    p: 4,
                                                    borderRadius: 2,
                                                    border: `2px dashed ${inscriptionForm.documentAccreditation ? theme.palette.success.main : theme.palette.grey[300]}`,
                                                    bgcolor: inscriptionForm.documentAccreditation ? alpha(theme.palette.success.main, 0.05) : theme.palette.grey[50],
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    },
                                                }}
                                                component="label"
                                            >
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                />
                                                {inscriptionForm.documentAccreditation ? (
                                                    <>
                                                        <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                                                        <Typography variant="subtitle1" fontWeight={600} color="success.main">
                                                            Document sélectionné
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {inscriptionForm.documentAccreditation.name}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            Document d'accréditation *
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Cliquez ou glissez votre fichier ici (PDF, DOC)
                                                        </Typography>
                                                    </>
                                                )}
                                            </Box>

                                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                                <Typography variant="body2">
                                                    Le document d'accréditation sera examiné par notre équipe.
                                                    Assurez-vous qu'il soit lisible et à jour.
                                                </Typography>
                                            </Alert>
                                        </Stack>
                                    )}

                                    {/* Boutons de navigation */}
                                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                        {inscriptionStep > 0 && (
                                            <Button
                                                variant="outlined"
                                                onClick={handlePrevStep}
                                                sx={{
                                                    flex: 1,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Précédent
                                            </Button>
                                        )}
                                        {inscriptionStep < 2 ? (
                                            <Button
                                                variant="contained"
                                                onClick={handleNextStep}
                                                sx={{
                                                    flex: 1,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                }}
                                            >
                                                Suivant
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleSubmitInscription}
                                                disabled={inscriptionLoading}
                                                sx={{
                                                    flex: 1,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    boxShadow: `0 4px 14px ${alpha(theme.palette.success.main, 0.4)}`,
                                                }}
                                            >
                                                {inscriptionLoading ? (
                                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                                ) : (
                                                    'Soumettre la demande'
                                                )}
                                            </Button>
                                        )}
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </Slide>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
