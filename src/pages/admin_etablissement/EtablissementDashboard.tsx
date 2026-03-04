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
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    School as SchoolIcon,
    Description as DescriptionIcon,
    Assessment as AssessmentIcon,
    Groups as GroupsIcon,
    MenuBook as MenuBookIcon,
    Download as DownloadIcon,
    Publish as PublishIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { PageHeader, StatusChip } from '../../components/ui';
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
        acceptees: 62,
        dateOuverture: '2026-01-15',
        dateCloture: '2026-03-15',
    },
    {
        id: 2,
        parcours: 'Master Data Science',
        statut: 'OUVERTE',
        candidatures: 78,
        acceptees: 34,
        dateOuverture: '2026-01-20',
        dateCloture: '2026-03-20',
    },
    {
        id: 3,
        parcours: 'Licence Gestion',
        statut: 'A_VENIR',
        candidatures: 0,
        acceptees: 0,
        dateOuverture: '2026-04-01',
        dateCloture: '2026-06-01',
    },
    {
        id: 4,
        parcours: 'Master Finance',
        statut: 'CLOTUREE',
        candidatures: 112,
        acceptees: 45,
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
    const history = useHistory();
    const { user } = useAppSelector((state) => state.auth);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Données pour la répartition par statut
    const statusData = [
        { name: 'En attente', value: mockStats.candidaturesEnAttente, color: theme.palette.warning.main },
        { name: 'En cours', value: 33, color: theme.palette.info.main },
        { name: 'Acceptés', value: mockStats.candidaturesAcceptees, color: theme.palette.success.main },
        { name: 'Refusés', value: 100, color: theme.palette.error.main },
    ];

    // Données pour le Top 5 des parcours (Popularité)
    const popularityData = [...mockCampagnes]
        .sort((a, b) => b.candidatures - a.candidatures)
        .slice(0, 5)
        .map(c => ({
            name: c.parcours.length > 20 ? c.parcours.substring(0, 18) + '...' : c.parcours,
            fullName: c.parcours,
            volume: c.candidatures,
        }));

    return (
        <Box>
            {/* Header */}
            <PageHeader
                title={`Bienvenue, ${(user && user.etablissementNom) || 'Établissement'}`}
                subtitle="Gérez vos campagnes d'admission et suivez vos candidatures"
                icon={<SchoolIcon />}
                iconColor={theme.palette.primary.main}
            />

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Parcours actifs" value={mockStats.totalParcours} icon={<MenuBookIcon />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Total candidatures" value={mockStats.totalCandidatures} icon={<GroupsIcon />} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="En attente" value={mockStats.candidaturesEnAttente} icon={<DescriptionIcon />} color="warning" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Taux d'acceptation" value={`${mockStats.tauxAcceptation}%`} icon={<AssessmentIcon />} color="success" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Graphique 1: État global des candidatures */}
                <Grid item xs={12} md={6} lg={4}>
                    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                Statut des candidatures
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Répartition globale de l'avancement
                            </Typography>
                        </Box>
                        <CardContent sx={{ height: 320, p: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Graphique 2: Top Parcours */}
                <Grid item xs={12} md={6} lg={8}>
                    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                Top 5 Parcours les plus demandés
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Nombre de candidatures déposées
                            </Typography>
                        </Box>
                        <CardContent sx={{ height: 320, pt: 3 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={popularityData}
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="barPop" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor={theme.palette.secondary.main} stopOpacity={0.4} />
                                            <stop offset="100%" stopColor={theme.palette.secondary.main} stopOpacity={1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={120}
                                        tick={{ fill: theme.palette.text.secondary, fontSize: 11, fontWeight: 500 }}
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        labelFormatter={(label, payload) => (payload[0] && payload[0].payload && payload[0].payload.fullName) || label}
                                    />
                                    <Bar
                                        dataKey="volume"
                                        fill="url(#barPop)"
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Campagnes d'admission */}
                <Grid item xs={12} lg={8}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6" fontWeight={700} color="text.primary">
                                        Campagnes d'admission
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Gérez vos périodes de candidatures
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => history.push('/etablissement/offre')}
                                    sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
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
                                                                onClick={() => history.push('/etablissement/candidatures')}
                                                                sx={{ borderRadius: 1.5 }}
                                                            >
                                                                Voir
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => history.push('/etablissement/resultats')}
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
                                                            onClick={() => history.push('/etablissement/offre')}
                                                            sx={{ borderRadius: 1.5 }}
                                                        >
                                                            Configurer
                                                        </Button>
                                                    )}
                                                    {campagne.statut === 'CLOTUREE' && (
                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            onClick={() => history.push('/etablissement/resultats')}
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
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Typography variant="h6" fontWeight={700} color="text.primary">
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
                        <Box sx={{ p: 2.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Typography variant="h6" fontWeight={700} color="text.primary">
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
                                    onClick={() => history.push('/etablissement/offre')}
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
                                    onClick={() => history.push('/etablissement/candidatures')}
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
                                    onClick={() => history.push('/etablissement/resultats')}
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
