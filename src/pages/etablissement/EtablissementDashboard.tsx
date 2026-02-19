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
import StatCard from '../../components/StatCard';

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
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Parcours actifs"
                        value={mockStats.totalParcours}
                        icon={<MenuBookIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total candidatures"
                        value={mockStats.totalCandidatures}
                        icon={<GroupsIcon />}
                        color="info"
                        growth={12}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="En attente"
                        value={mockStats.candidaturesEnAttente}
                        icon={<DescriptionIcon />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Taux d'acceptation"
                        value={`${mockStats.tauxAcceptation}%`}
                        icon={<AssessmentIcon />}
                        color="success"
                        growth={5}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Campagnes d'admission */}
                <Grid item xs={12} lg={8}>
                    <DataCard
                        title="Campagnes d'admission"
                        subtitle="Gérez vos périodes de candidatures"
                        action={
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate('/etablissement/offre')}
                            >
                                Gérer les campagnes
                            </Button>
                        }
                    >
                        <Stack spacing={1.5}>
                            {mockCampagnes.map((campagne) => (
                                <Box
                                    key={campagne.id}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'grey.200',
                                        borderRadius: 1,
                                        bgcolor: 'white',
                                        '&:hover': {
                                            borderColor: 'grey.300',
                                            bgcolor: 'grey.50',
                                        },
                                    }}
                                >
                                        <Box sx={{ px: 2, py: 1.5 }}>
                                        <Stack
                                            direction={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                                            spacing={1.5}
                                        >
                                            <Box sx={{ flex: 1 }}>
                                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {campagne.parcours}
                                                    </Typography>
                                                    <StatusChip status={campagne.statut} />
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(campagne.dateOuverture)} → {formatDate(campagne.dateCloture)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.disabled">•</Typography>
                                                    <Typography variant="caption" color="text.secondary">
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
                                                        >
                                                            Voir
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() => navigate('/etablissement/resultats')}
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
                                                    >
                                                        Configurer
                                                    </Button>
                                                )}
                                                {campagne.statut === 'CLOTUREE' && (
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        onClick={() => navigate('/etablissement/resultats')}
                                                    >
                                                        Résultats
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </DataCard>
                </Grid>

                {/* Activité récente */}
                <Grid item xs={12} lg={4}>
                    <DataCard
                        title="Activité récente"
                        subtitle="Dernières actions sur vos campagnes"
                    >
                        <Stack spacing={0} divider={<Divider />}>
                            {mockActivites.map((activite) => (
                                <Box key={activite.id} sx={{ py: 1.5 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {activite.action}
                                    </Typography>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {activite.parcours}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {activite.date}
                                        </Typography>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </DataCard>

                    {/* Actions rapides */}
                    <Card variant="outlined" sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Actions rapides
                            </Typography>
                            <Stack spacing={1}>
                                <Button
                                    fullWidth
                                    variant="text"
                                    startIcon={<MenuBookIcon />}
                                    onClick={() => navigate('/etablissement/offre')}
                                    sx={{ justifyContent: 'flex-start', py: 1 }}
                                >
                                    Ajouter un parcours
                                </Button>
                                <Button
                                    fullWidth
                                    variant="text"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => navigate('/etablissement/candidatures')}
                                    sx={{ justifyContent: 'flex-start', py: 1 }}
                                >
                                    Télécharger candidatures
                                </Button>
                                <Button
                                    fullWidth
                                    variant="text"
                                    startIcon={<PublishIcon />}
                                    onClick={() => navigate('/etablissement/resultats')}
                                    sx={{ justifyContent: 'flex-start', py: 1 }}
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
