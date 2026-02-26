import React, { useState } from 'react';
import {
    Box,
    Slide,
    useTheme,
    alpha,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAuth, setError, setLoading } from '../store/slices/authSlice';
import { authApi } from '../api';
import type { RegisterEtablissementRequest, TypeEtablissementBackend } from '../types';
import BrandingPanel from '../components/auth/BrandingPanel';
import LoginForm from '../components/auth/LoginForm';
import RegistrationForm from '../components/auth/RegistrationForm';
import ThemeToggle from '../components/layout/ThemeToggle';

// Interface pour le formulaire d'inscription
interface InscriptionForm {
    nomEtablissement: string;
    emailPro: string;
    motDePasse: string;
    typeEtablissement: string;
    telephonePro: string;
    localisation: string;
    siteWeb: string;
    description: string;
    documentAccreditation: File | null;
}

const Login: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const history = useHistory();
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

    // État du formulaire d'inscription
    const [inscriptionForm, setInscriptionForm] = useState<InscriptionForm>({
        nomEtablissement: '',
        emailPro: '',
        motDePasse: '',
        typeEtablissement: '',
        telephonePro: '',
        localisation: '',
        siteWeb: '',
        description: '',
        documentAccreditation: null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (error) dispatch(setError(null));
    };

    const handleInscriptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInscriptionForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setInscriptionForm((prev) => ({ ...prev, documentAccreditation: e.target.files![0] }));
        }
    };

    const handleLogin = async () => {
        if (!credentials.email || !credentials.password) {
            dispatch(setError('Veuillez remplir tous les champs'));
            return;
        }

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await authApi.login(credentials.email, credentials.password);

            if (response.success && response.data) {
                const { token, role } = response.data;
                localStorage.setItem('authToken', token);

                dispatch(setAuth({
                    user: {
                        id: String(response.data.userId || ''),
                        email: response.data.email || '',
                        role: role as any,
                        firstName: (response.data.email && response.data.email.split('@')[0]) || 'Utilisateur',
                        lastName: '',
                        status: 'active',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    token: token
                }));

                // Redirection selon le rôle
                if (role === 'ROLE_ADMINISTRATEUR') {
                    history.push('/dashboard');
                } else if (role === 'ROLE_ETABLISSEMENT') {
                    history.push('/etablissement/dashboard');
                } else {
                    history.push('/');
                }
            } else {
                dispatch(setError(response.message || 'Identifiants invalides'));
            }
        } catch (err: any) {
            const errorMessage = (err.response && err.response.data && err.response.data.message) || 'Une erreur est survenue lors de la connexion';
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

    const handleNextStep = () => {
        if (inscriptionStep < 2) setInscriptionStep((prev) => prev + 1);
    };

    const handlePrevStep = () => {
        setInscriptionStep((prev) => prev - 1);
    };

    const handleSubmitInscription = async () => {
        if (!inscriptionForm.documentAccreditation) {
            dispatch(setError('Veuillez uploader le document d\'accréditation'));
            return;
        }

        setInscriptionLoading(true);
        dispatch(setError(null));

        try {
            const data: RegisterEtablissementRequest = {
                nomEtablissement: inscriptionForm.nomEtablissement,
                email: inscriptionForm.emailPro,
                motDePasse: inscriptionForm.motDePasse,
                typeEtablissement: inscriptionForm.typeEtablissement as TypeEtablissementBackend,
                telephonePro: inscriptionForm.telephonePro,
                localisation: inscriptionForm.localisation,
                siteWeb: inscriptionForm.siteWeb || undefined,
                description: inscriptionForm.description || undefined,
            };
            const response = await authApi.registerEtablissement(
                data,
                inscriptionForm.documentAccreditation !== null ? inscriptionForm.documentAccreditation : undefined,
            );

            if (response.success) {
                setInscriptionSuccess(true);
            } else {
                dispatch(setError(response.message || 'Une erreur est survenue lors de l\'inscription'));
            }
        } catch (err: any) {
            const errorMessage = (err.response && err.response.data && err.response.data.message) || 'Une erreur est survenue lors de l\'inscription';
            dispatch(setError(errorMessage));
        } finally {
            setInscriptionLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setShowInscription(false);
        setInscriptionStep(0);
        setInscriptionSuccess(false);
        setInscriptionForm({
            nomEtablissement: '',
            emailPro: '',
            motDePasse: '',
            typeEtablissement: '',
            telephonePro: '',
            localisation: '',
            siteWeb: '',
            description: '',
            documentAccreditation: null,
        });
        dispatch(setError(null));
    };

    const handleToggleInscription = () => {
        setShowInscription(true);
        dispatch(setError(null));
    };

    const handleFillDemo = () => {
        setCredentials({ email: 'admin@scholarway.com', password: 'Admin@2026' });
        dispatch(setError(null));
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                position: 'relative',
                bgcolor: isDark ? '#020617' : '#fcfdfe',
                transition: 'background-color 0.5s ease',
                '--blob-bg': isDark ? '#020617' : '#fcfdfe',
                '--blob-1-color': isDark ? '#6366f1' : alpha('#6366f1', 0.1),
                '--blob-2-color': isDark ? '#4338ca' : alpha('#4f46e5', 0.06),
                '--blob-3-color': isDark ? '#1e1b4b' : alpha('#cbd5e1', 0.04),
                '--blob-opacity': isDark ? 0.25 : 0.7,
                '--glass-bg': isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                '--glass-border': isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.8)',
            }}
        >
            {/* Theme Toggle Button */}
            <Box sx={{ position: 'absolute', top: { xs: 16, md: 32 }, right: { xs: 16, md: 32 }, zIndex: 100 }}>
                <ThemeToggle />
            </Box>
            {/* Background Animated Blobs */}
            <Box className="blob-container">
                <Box className="blob blob-1" />
                <Box className="blob blob-2" />
                <Box className="blob blob-3" />
            </Box>

            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, md: 4 },
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Box
                    className="glass-effect"
                    sx={{
                        width: '100%',
                        maxWidth: showInscription ? 1100 : 980,
                        minHeight: 640,
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isDark
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            : '0 32px 64px -12px rgba(99, 102, 241, 0.22)',
                    }}
                >
                    <BrandingPanel />

                    <Box
                        sx={{
                            flex: 1,
                            p: { xs: 4, md: 8 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
                            position: 'relative',
                        }}
                    >
                        <Slide direction="up" in={!showInscription} mountOnEnter unmountOnExit>
                            <Box>
                                <LoginForm
                                    credentials={credentials}
                                    error={error}
                                    loading={loading}
                                    onInputChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    onLogin={handleLogin}
                                    onToggleInscription={handleToggleInscription}
                                    onFillDemo={handleFillDemo}
                                />
                            </Box>
                        </Slide>

                        <Slide direction="up" in={showInscription} mountOnEnter unmountOnExit>
                            <Box>
                                <RegistrationForm
                                    inscriptionForm={inscriptionForm}
                                    inscriptionStep={inscriptionStep}
                                    inscriptionSuccess={inscriptionSuccess}
                                    inscriptionLoading={inscriptionLoading}
                                    onInputChange={handleInscriptionInputChange}
                                    onFileChange={handleFileChange}
                                    onNextStep={handleNextStep}
                                    onPrevStep={handlePrevStep}
                                    onBackToLogin={handleBackToLogin}
                                    onSubmit={handleSubmitInscription}
                                />
                            </Box>
                        </Slide>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
