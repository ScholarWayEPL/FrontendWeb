import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Divider,
    useTheme,
    alpha,
} from '@mui/material';
import {
    School as SchoolIcon,
    Description as DescriptionIcon,
    Assessment as AssessmentIcon,
    Groups as GroupsIcon,
    MenuBook as MenuBookIcon,
    Download as DownloadIcon,
    Publish as PublishIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { PageHeader, DataCard, StatusChip } from '../../components/ui';

// Données mockées pour le dashboard établissement
const mockStats = {
    totalParcours: 12,
    totalCandidatures: 456,
    candidaturesEnAttente: 89,
    candidaturesAcceptees: 234,
    tauxAcceptation: 51.3,
};

const mockCampagnes = [
    {
        id: 1,
        parcours: 'Licence Informatique',
        statut: 'OUVERTE',
        candidatures: 145,
        dateOuverture: '2026-01-15',
        dateCloture: '2026-03-15',
    },
    {
        id: 2,
        parcours: 'Master Data Science',
        statut: 'OUVERTE',
        candidatures: 78,
        dateOuverture: '2026-01-20',
        dateCloture: '2026-03-20',
    },
    {
        id: 3,
        parcours: 'Licence Gestion',
        statut: 'A_VENIR',
        candidatures: 0,
        dateOuverture: '2026-04-01',
        dateCloture: '2026-06-01',
    },
    {
        id: 4,
        parcours: 'Master Finance',
        statut: 'CLOTUREE',
        candidatures: 112,
        dateOuverture: '2025-09-01',
        dateCloture: '2025-11-30',
    },
];

const mockActivites = [
    { id: 1, action: 'Nouvelle candidature reçue', parcours: 'Licence Informatique', date: 'Il y a 5 min' },
    { id: 2, action: 'Résultats Phase 1 publiés', parcours: 'Master Finance', date: 'Il y a 2h' },
    { id: 3, action: 'Campagne ouverte', parcours: 'Master Data Science', date: 'Hier' },
    { id: 4, action: '15 nouvelles candidatures', parcours: 'Licence Informatique', date: 'Hier' },
];

const EtablissementDashboard: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <Box>
            {/* Header */}
            <PageHeader
                title={`Bienvenue, ${user?.etablissementNom || 'Établissement'}`}
                subtitle="Gérez vos campagnes d'admission et suivez vos candidatures"
                icon={<SchoolIcon />}
                iconColor={theme.palette.primary.main}
            />

            {/* Stats Cards */}
            <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap' }}>
                <Card 
                    variant="outlined"
                    sx={{ 
                        flex: 1,
                        minWidth: 240,
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: `${theme.palette.primary.main}08`,
                        borderColor: 'primary.main',
                    }}
                >
                    <Box 
                        sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: `${theme.palette.primary.main}15`,
                        }}
                    >
                        <MenuBookIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                            {mockStats.totalParcours}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Parcours actifs
                        </Typography>
                    </Box>
                </Card>
                <Card 
                    variant="outlined"
                    sx={{ 
                        flex: 1,
                        minWidth: 240,
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: `${theme.palette.info.main}08`,
                        borderColor: 'info.main',
                    }}
                >
                    <Box 
                        sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: `${theme.palette.info.main}15`,
                        }}
                    >
                        <GroupsIcon sx={{ fontSize: 28, color: 'info.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="info.main">
                            {mockStats.totalCandidatures}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Total candidatures
                        </Typography>
                    </Box>
                </Card>
                <Card 
                    variant="outlined"
                    sx={{ 
                        flex: 1,
                        minWidth: 240,
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: `${theme.palette.warning.main}08`,
                        borderColor: 'warning.main',
                    }}
                >
                    <Box 
                        sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: `${theme.palette.warning.main}15`,
                        }}
                    >
                        <DescriptionIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {mockStats.candidaturesEnAttente}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            En attente
                        </Typography>
                    </Box>
                </Card>
                <Card 
                    variant="outlined"
                    sx={{ 
                        flex: 1,
                        minWidth: 240,
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: `${theme.palette.success.main}08`,
                        borderColor: 'success.main',
                    }}
                >
                    <Box 
                        sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: `${theme.palette.success.main}15`,
                        }}
                    >
                        <AssessmentIcon sx={{ fontSize: 28, color: 'success.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {mockStats.tauxAcceptation}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Taux d'acceptation
                        </Typography>
                    </Box>
                </Card>
            </Stack>

            <Grid container spacing={3}>
                {/* Campagnes d'admission */}
                <Grid item xs={12} lg={8}>
                    <Card 
                        variant="outlined"
                        sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderBottom: `2px solid ${theme.palette.primary.main}` }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        Campagnes d'admission
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Gérez vos périodes de candidatures
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => navigate('/etablissement/offre')}
                                    sx={{ borderRadius: 1.5 }}
                                >
                                    Gérer les campagnes
                                </Button>
                            </Stack>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                            <Stack spacing={1.5}>
                                {mockCampagnes.map((campagne) => (
                                    <Card
                                        key={campagne.id}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 1.5,
                                            borderWidth: 1.5,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                transform: 'translateY(-2px)',
                                                boxShadow: 1,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                justifyContent="space-between"
                                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                                spacing={2}
                                            >
                                                <Box sx={{ flex: 1 }}>
                                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight={700}>
                                                            {campagne.parcours}
                                                        </Typography>
                                                        <StatusChip status={campagne.statut} />
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                            {formatDate(campagne.dateOuverture)} → {formatDate(campagne.dateCloture)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">•</Typography>
                                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                            {campagne.candidatures} candidatures
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                                <Stack direction="row" spacing={1}>
                                                    {campagne.statut === 'OUVERTE' && (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => navigate('/etablissement/candidatures')}
                                                                sx={{ borderRadius: 1.5 }}
                                                            >
                                                                Voir
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => navigate('/etablissement/resultats')}
                                                                sx={{ borderRadius: 1.5 }}
                                                            >
                                                                Publier
                                                            </Button>
                                                        </>
                                                    )}
                                                    {campagne.statut === 'A_VENIR' && (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => navigate('/etablissement/offre')}
                                                            sx={{ borderRadius: 1.5 }}
                                                        >
                                                            Configurer
                                                        </Button>
                                                    )}
                                                    {campagne.statut === 'CLOTUREE' && (
                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            onClick={() => navigate('/etablissement/resultats')}
                                                            sx={{ borderRadius: 1.5 }}
                                                        >
                                                            Résultats
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Activité récente */}
                <Grid item xs={12} lg={4}>
                    <Card 
                        variant="outlined"
                        sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.info.main, 0.05), borderBottom: `2px solid ${theme.palette.info.main}` }}>
                            <Typography variant="h6" fontWeight={700}>
                                Activité récente
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dernières actions sur vos campagnes
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                            <Stack spacing={0} divider={<Divider />}>
                                {mockActivites.map((activite) => (
                                    <Box key={activite.id} sx={{ py: 2 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {activite.action}
                                        </Typography>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                {activite.parcours}
                                            </Typography>
                                            <Typography variant="caption" color="primary.main" fontWeight={600}>
                                                {activite.date}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Actions rapides */}
                    <Card 
                        variant="outlined" 
                        sx={{ 
                            mt: 3,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.success.main, 0.05), borderBottom: `2px solid ${theme.palette.success.main}` }}>
                            <Typography variant="h6" fontWeight={700}>
                                Actions rapides
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Raccourcis vers vos actions fréquentes
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                            <Stack spacing={1}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<MenuBookIcon />}
                                    onClick={() => navigate('/etablissement/offre')}
                                    sx={{ 
                                        justifyContent: 'flex-start', 
                                        py: 1.5,
                                        borderRadius: 1.5,
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        },
                                    }}
                                >
                                    Ajouter un parcours
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => navigate('/etablissement/candidatures')}
                                    sx={{ 
                                        justifyContent: 'flex-start', 
                                        py: 1.5,
                                        borderRadius: 1.5,
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        },
                                    }}
                                >
                                    Télécharger candidatures
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<PublishIcon />}
                                    onClick={() => navigate('/etablissement/resultats')}
                                    sx={{ 
                                        justifyContent: 'flex-start', 
                                        py: 1.5,
                                        borderRadius: 1.5,
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        },
                                    }}
                                >
                                    Publier des résultats
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EtablissementDashboard;
