import React, { useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    TextField,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Link,
    Button,
    CircularProgress,
    Alert,
    Fade,
    alpha,
    useTheme
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

interface LoginFormProps {
    credentials: { email: string; password: string };
    error: string | null;
    loading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onLogin: () => void;
    onToggleInscription: () => void;
    onFillDemo: () => void;
}

const glassInputStyle = (theme: any) => {
    const isDark = theme.palette.mode === 'dark';
    return {
        '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            color: isDark ? 'white' : 'text.primary',
            transition: 'all 0.2s ease',
            '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '1.5px',
                boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.15)}`,
            },
        },
        '& .MuiInputLabel-root': {
            color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary',
            '&.Mui-focused': {
                color: theme.palette.primary.main,
            },
        },
        '& .MuiOutlinedInput-input::placeholder': {
            color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.35)',
            opacity: 1,
        },
        '& .MuiSelect-icon': { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' },
    };
};

const LoginForm: React.FC<LoginFormProps> = ({
    credentials,
    error,
    loading,
    onInputChange,
    onKeyPress,
    onLogin,
    onToggleInscription,
    onFillDemo
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <Box>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{
                    color: isDark ? 'white' : 'text.primary',
                    letterSpacing: '-0.03em'
                }}>
                    Connexion.
                </Typography>
                <Typography variant="body1" sx={{
                    color: isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                    fontWeight: 500
                }}>
                    Accédez au <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>Portail établissement</span> et gagnez en productivité.
                </Typography>
            </Box>

            {/* Error Message */}
            <Fade in={!!error}>
                <Box sx={{ mb: 3 }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: '12px',
                                bgcolor: isDark ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
                                color: isDark ? '#ff5252' : '#d32f2f',
                                border: '1px solid',
                                borderColor: isDark ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.1)',
                                '& .MuiAlert-icon': { color: isDark ? '#ff5252' : '#d32f2f' }
                            }}
                        >
                            {error}
                        </Alert>
                    )}
                </Box>
            </Fade>

            <Stack spacing={3}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={onInputChange}
                    onKeyPress={onKeyPress}
                    disabled={loading}
                    placeholder="exemple@scholarway.com"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', fontSize: 20 }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={glassInputStyle(theme)}
                />

                <TextField
                    fullWidth
                    label="Mot de passe"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={onInputChange}
                    onKeyPress={onKeyPress}
                    disabled={loading}
                    placeholder="••••••••••••"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}>
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={glassInputStyle(theme)}
                />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" sx={{
                            color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                            '&.Mui-checked': { color: 'primary.main' }
                        }} />}
                        label={<Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'text.secondary', fontWeight: 500 }}>Se souvenir</Typography>}
                    />
                    <Link href="#" underline="hover" sx={{ color: 'primary.main', fontSize: '0.85rem', fontWeight: 600 }}>Mot de passe oublié ?</Link>
                </Stack>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={onLogin}
                    disabled={loading}
                    sx={{
                        height: 56,
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        boxShadow: isDark
                            ? '0 12px 24px rgba(79, 70, 229, 0.3)'
                            : '0 8px 16px rgba(79, 70, 229, 0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            boxShadow: isDark
                                ? '0 16px 32px rgba(79, 70, 229, 0.4)'
                                : '0 12px 24px rgba(79, 70, 229, 0.3)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Se connecter'}
                </Button>

                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: '12px',
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    }}
                >
                    <Typography variant="caption" sx={{
                        color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 700,
                        display: 'block',
                        mb: 1.5
                    }}>
                        Compte de test
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ color: isDark ? 'white' : 'text.primary', fontWeight: 600 }}>admin@scholarway.com</Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={onFillDemo}
                            sx={{
                                textTransform: 'none',
                                color: 'primary.main',
                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                borderRadius: '8px',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                                }
                            }}
                        >
                            Remplir
                        </Button>
                    </Stack>
                </Box>

                <Button
                    fullWidth
                    variant="text"
                    onClick={onToggleInscription}
                    sx={{
                        mt: 1,
                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { color: isDark ? 'white' : 'primary.main', bgcolor: 'transparent' }
                    }}
                >
                    Inscrire mon établissement
                </Button>
            </Stack>
        </Box>
    );
};

export default LoginForm;
