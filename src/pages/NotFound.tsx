import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    useTheme,
    alpha,
    Paper
} from '@mui/material';
import {
    Home as HomeIcon,
    SentimentDissatisfied as SadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isDark ? '#020617' : '#fcfdfe',
                position: 'relative',
                overflow: 'hidden',
                p: 3
            }}
        >
            {/* Background Decorative Blobs */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '30vw',
                    height: '30vw',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '5%',
                    width: '25vw',
                    height: '25vw',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
                    filter: 'blur(50px)',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 8 },
                        textAlign: 'center',
                        borderRadius: '40px',
                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                        boxShadow: isDark
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 2.5,
                            borderRadius: '24px',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            mb: 4
                        }}
                    >
                        <SadIcon sx={{ fontSize: 48 }} />
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '80px', md: '120px' },
                            fontWeight: 900,
                            lineHeight: 1,
                            mb: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.05em'
                        }}
                    >
                        404
                    </Typography>

                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            color: 'text.primary',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Page introuvable
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            mb: 6,
                            fontSize: '1.1rem',
                            maxWidth: '320px',
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        La route existe peut-être, mais le serveur ne l’a pas retrouvée.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            borderRadius: '18px',
                            px: 6,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            textTransform: 'none',
                            boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: `0 15px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }
                        }}
                    >
                        Retour à l’accueil
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default NotFound;
