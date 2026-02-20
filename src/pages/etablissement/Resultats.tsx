import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Chip,
    TextField,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Grid,
    Alert,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Publish as PublishIcon,
    CloudUpload as CloudUploadIcon,
    CheckCircle as CheckCircleIcon,
    CalendarMonth as CalendarIcon,
    Description as DescriptionIcon,
    Download as DownloadIcon,
    School as SchoolIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { PageHeader, StatusChip } from '../../components/ui';
import { BORDER_RADIUS } from '../../constants';
import { readExcel, generateResultatsTemplate } from '../../utils/excelUtils';
 

interface Campagne {
    id: number;
    parcours: string;
    statut: 'OUVERTE' | 'A_VENIR' | 'CLOTUREE';
    candidatures: number;
    phase1Publiee: boolean;
    dateConcoursEcrit?: string;
    phase2Publiee: boolean;
}

const mockCampagnes: Campagne[] = [
    {
        id: 1,
        parcours: 'Licence Informatique',
        statut: 'OUVERTE',
        candidatures: 145,
        phase1Publiee: false,
        dateConcoursEcrit: undefined,
        phase2Publiee: false,
    },
    {
        id: 2,
        parcours: 'Master Data Science',
        statut: 'OUVERTE',
        candidatures: 78,
        phase1Publiee: true,
        dateConcoursEcrit: '2026-04-15',
        phase2Publiee: false,
    },
    {
        id: 3,
        parcours: 'Master Finance',
        statut: 'CLOTUREE',
        candidatures: 112,
        phase1Publiee: true,
        dateConcoursEcrit: '2025-12-10',
        phase2Publiee: true,
    },
];

const Resultats: React.FC = () => {
    const theme = useTheme();
    const [selectedCampagne, setSelectedCampagne] = useState<Campagne | null>(mockCampagnes[0]);
    const [phase1File, setPhase1File] = useState<File | null>(null);
    const [phase2File, setPhase2File] = useState<File | null>(null);
    const [dateConcoursEcrit, setDateConcoursEcrit] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    const handlePhase1Upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                // Valider que c'est un fichier Excel
                if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                    alert('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
                    return;
                }

                // Lire le fichier Excel pour validation
                const data = await readExcel(file);
                console.log('Données Excel Phase 1:', data);

                setPhase1File(file);
            } catch (error) {
                console.error('Erreur lors de la lecture du fichier:', error);
                alert('Erreur lors de la lecture du fichier Excel');
            }
        }
    };

    const handlePhase2Upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                // Valider que c'est un fichier Excel
                if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                    alert('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
                    return;
                }

                // Lire le fichier Excel pour validation
                const data = await readExcel(file);
                console.log('Données Excel Phase 2:', data);

                setPhase2File(file);
            } catch (error) {
                console.error('Erreur lors de la lecture du fichier:', error);
                alert('Erreur lors de la lecture du fichier Excel');
            }
        }
    };

    const handleDownloadTemplate = () => {
        generateResultatsTemplate();
    };

    const handlePublishPhase1 = () => {
        if (phase1File && selectedCampagne) {
            // TODO: Appeler l'API
            alert(`Résultats Phase 1 publiés pour ${selectedCampagne.parcours}`);
            setActiveStep(1);
        }
    };

    const handlePublishDateConcours = () => {
        if (dateConcoursEcrit && selectedCampagne) {
            // TODO: Appeler l'API
            alert(`Date du concours écrit publiée: ${dateConcoursEcrit}`);
            setActiveStep(2);
        }
    };

    const handlePublishPhase2 = () => {
        if (phase2File && selectedCampagne) {
            // TODO: Appeler l'API
            alert(`Résultats définitifs publiés pour ${selectedCampagne.parcours}`);
            setActiveStep(3);
        }
    };

    const getStepStatus = (step: number) => {
        if (!selectedCampagne) return false;
        switch (step) {
            case 0: return selectedCampagne.phase1Publiee;
            case 1: return !!selectedCampagne.dateConcoursEcrit;
            case 2: return selectedCampagne.phase2Publiee;
            default: return false;
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Box>
            {/* Header */}
            <PageHeader
                title="Publication des Résultats"
                subtitle="Gérez la publication des résultats par phase"
                icon={<PublishIcon />}
                iconColor={theme.palette.success.main}
            />

            <Grid container spacing={3}>
                {/* Sélection de la campagne */}
                <Grid item xs={12} md={4}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.success.main, 0.05), borderBottom: `2px solid ${theme.palette.success.main}` }}>
                            <Typography variant="h6" fontWeight={700}>
                                Sélectionner une campagne
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Choisissez le parcours à traiter
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                            <Stack spacing={1.5}>
                                {mockCampagnes.map((campagne) => (
                                    <Card
                                        key={campagne.id}
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedCampagne(campagne);
                                            // Reset les étapes selon l'état de la campagne
                                            if (campagne.phase2Publiee) setActiveStep(3);
                                            else if (campagne.dateConcoursEcrit) setActiveStep(2);
                                            else if (campagne.phase1Publiee) setActiveStep(1);
                                            else setActiveStep(0);
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            borderRadius: 1.5,
                                            borderWidth: 2,
                                            borderColor: selectedCampagne?.id === campagne.id ? 'success.main' : 'grey.300',
                                            bgcolor: selectedCampagne?.id === campagne.id ? alpha(theme.palette.success.main, 0.08) : 'white',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: 'success.main',
                                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                                transform: 'translateY(-2px)',
                                                boxShadow: 1,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700}>
                                                        {campagne.parcours}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                        {campagne.candidatures} candidatures
                                                    </Typography>
                                                </Box>
                                                <StatusChip status={campagne.statut} />
                                            </Stack>
                                            <Stack direction="row" spacing={0.75} flexWrap="wrap">
                                                <Chip
                                                    size="small"
                                                    label="Phase 1"
                                                    color={campagne.phase1Publiee ? 'success' : 'default'}
                                                    variant={campagne.phase1Publiee ? 'filled' : 'outlined'}
                                                    icon={campagne.phase1Publiee ? <CheckCircleIcon /> : undefined}
                                                    sx={{ borderRadius: 1, fontSize: '0.7rem', fontWeight: 600 }}
                                                />
                                                <Chip
                                                    size="small"
                                                    label="Concours"
                                                    color={campagne.dateConcoursEcrit ? 'success' : 'default'}
                                                    variant={campagne.dateConcoursEcrit ? 'filled' : 'outlined'}
                                                    icon={campagne.dateConcoursEcrit ? <CheckCircleIcon /> : undefined}
                                                    sx={{ borderRadius: 1, fontSize: '0.7rem', fontWeight: 600 }}
                                                />
                                                <Chip
                                                    size="small"
                                                    label="Phase 2"
                                                    color={campagne.phase2Publiee ? 'success' : 'default'}
                                                    variant={campagne.phase2Publiee ? 'filled' : 'outlined'}
                                                    icon={campagne.phase2Publiee ? <CheckCircleIcon /> : undefined}
                                                    sx={{ borderRadius: 1, fontSize: '0.7rem', fontWeight: 600 }}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Info box */}
                    <Alert
                        severity="info"
                        icon={<InfoIcon />}
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                        }}
                    >
                        <Stack spacing={1}>
                            <Typography variant="body2" fontWeight={500}>
                                Le fichier Excel doit contenir la colonne <strong>N° Candidature</strong> pour identifier les étudiants retenus.
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownloadTemplate}
                                sx={{ alignSelf: 'flex-start', borderRadius: 1.5 }}
                            >
                                Télécharger le modèle Excel
                            </Button>
                        </Stack>
                    </Alert>
                </Grid>

                {/* Processus de publication */}
                <Grid item xs={12} md={8}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            {selectedCampagne ? (
                                <>
                                    <Box
                                        sx={{
                                            p: 2.5,
                                            mb: 3,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                }}
                                            >
                                                <SchoolIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {selectedCampagne.parcours}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                    Processus de publication des résultats
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Stepper activeStep={activeStep} orientation="vertical">
                                        {/* Étape 1: Phase 1 - Sélection sur dossier */}
                                        <Step completed={getStepStatus(0)}>
                                            <StepLabel
                                                StepIconProps={{
                                                    sx: {
                                                        fontSize: 32,
                                                        '&.Mui-completed': {
                                                            color: 'success.main',
                                                        },
                                                        '&.Mui-active': {
                                                            color: 'primary.main',
                                                        },
                                                    }
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    Phase 1 - Résultats de sélection sur dossier
                                                </Typography>
                                            </StepLabel>
                                            <StepContent>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Uploadez le fichier Excel contenant les numéros de candidature des étudiants retenus après étude de dossier.
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        p: 3,
                                                        border: '2px dashed',
                                                        borderColor: phase1File ? 'success.main' : 'grey.300',
                                                        borderRadius: BORDER_RADIUS.sm,
                                                        bgcolor: phase1File ? alpha(theme.palette.success.main, 0.05) : 'grey.50',
                                                        textAlign: 'center',
                                                        mb: 2,
                                                    }}
                                                >
                                                    {phase1File ? (
                                                        <Stack alignItems="center" spacing={1}>
                                                            <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {phase1File.name}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                onClick={() => setPhase1File(null)}
                                                            >
                                                                Changer de fichier
                                                            </Button>
                                                        </Stack>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file"
                                                                accept=".xlsx,.xls"
                                                                onChange={handlePhase1Upload}
                                                                style={{ display: 'none' }}
                                                                id="phase1-upload"
                                                            />
                                                            <label htmlFor="phase1-upload">
                                                                <Button
                                                                    component="span"
                                                                    variant="outlined"
                                                                    startIcon={<CloudUploadIcon />}
                                                                    sx={{ borderRadius: BORDER_RADIUS.sm }}
                                                                >
                                                                    Sélectionner fichier Excel
                                                                </Button>
                                                            </label>
                                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                                                Format accepté: .xlsx, .xls
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>

                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<PublishIcon />}
                                                        onClick={handlePublishPhase1}
                                                        disabled={!phase1File}
                                                        sx={{ borderRadius: BORDER_RADIUS.sm }}
                                                    >
                                                        Publier Phase 1
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<DownloadIcon />}
                                                        onClick={() => alert('Téléchargement du modèle...')}
                                                        sx={{ borderRadius: BORDER_RADIUS.sm }}
                                                    >
                                                        Modèle Excel
                                                    </Button>
                                                </Stack>
                                            </StepContent>
                                        </Step>

                                        {/* Étape 2: Date du concours écrit */}
                                        <Step completed={getStepStatus(1)}>
                                            <StepLabel
                                                StepIconProps={{
                                                    sx: {
                                                        fontSize: 32,
                                                        '&.Mui-completed': {
                                                            color: 'success.main',
                                                        },
                                                        '&.Mui-active': {
                                                            color: 'primary.main',
                                                        },
                                                    }
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    Date du concours écrit
                                                </Typography>
                                            </StepLabel>
                                            <StepContent>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Renseignez la date du concours écrit pour les candidats retenus en Phase 1.
                                                </Typography>

                                                <TextField
                                                    type="date"
                                                    label="Date du concours"
                                                    value={dateConcoursEcrit || selectedCampagne.dateConcoursEcrit || ''}
                                                    onChange={(e) => setDateConcoursEcrit(e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    sx={{ mb: 2, maxWidth: 300 }}
                                                />

                                                {selectedCampagne.dateConcoursEcrit && (
                                                    <Alert severity="success" sx={{ mb: 2, borderRadius: BORDER_RADIUS.sm }}>
                                                        <Typography variant="body2">
                                                            Concours prévu le: <strong>{formatDate(selectedCampagne.dateConcoursEcrit)}</strong>
                                                        </Typography>
                                                    </Alert>
                                                )}

                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<CalendarIcon />}
                                                        onClick={handlePublishDateConcours}
                                                        disabled={!dateConcoursEcrit && !selectedCampagne.dateConcoursEcrit}
                                                        sx={{ borderRadius: BORDER_RADIUS.sm }}
                                                    >
                                                        Publier la date
                                                    </Button>
                                                    <Button
                                                        variant="text"
                                                        onClick={() => setActiveStep(2)}
                                                        sx={{ borderRadius: BORDER_RADIUS.sm }}
                                                    >
                                                        Passer (sans concours)
                                                    </Button>
                                                </Stack>
                                            </StepContent>
                                        </Step>

                                        {/* Étape 3: Phase 2 - Résultats définitifs */}
                                        <Step completed={getStepStatus(2)}>
                                            <StepLabel
                                                StepIconProps={{
                                                    sx: {
                                                        fontSize: 32,
                                                        '&.Mui-completed': {
                                                            color: 'success.main',
                                                        },
                                                        '&.Mui-active': {
                                                            color: 'primary.main',
                                                        },
                                                    }
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    Phase 2 - Résultats définitifs
                                                </Typography>
                                            </StepLabel>
                                            <StepContent>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Uploadez le fichier Excel final des étudiants admis après le concours écrit (ou directement si pas de concours).
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        p: 3,
                                                        border: '2px dashed',
                                                        borderColor: phase2File ? 'success.main' : 'grey.300',
                                                        borderRadius: BORDER_RADIUS.sm,
                                                        bgcolor: phase2File ? alpha(theme.palette.success.main, 0.05) : 'grey.50',
                                                        textAlign: 'center',
                                                        mb: 2,
                                                    }}
                                                >
                                                    {phase2File ? (
                                                        <Stack alignItems="center" spacing={1}>
                                                            <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {phase2File.name}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                onClick={() => setPhase2File(null)}
                                                            >
                                                                Changer de fichier
                                                            </Button>
                                                        </Stack>
                                                    ) : (
                                                        <>
                                                            <input
                                                                type="file"
                                                                accept=".xlsx,.xls"
                                                                onChange={handlePhase2Upload}
                                                                style={{ display: 'none' }}
                                                                id="phase2-upload"
                                                            />
                                                            <label htmlFor="phase2-upload">
                                                                <Button
                                                                    component="span"
                                                                    variant="outlined"
                                                                    startIcon={<CloudUploadIcon />}
                                                                    sx={{ borderRadius: BORDER_RADIUS.sm }}
                                                                >
                                                                    Sélectionner fichier Excel
                                                                </Button>
                                                            </label>
                                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                                                Format accepté: .xlsx, .xls
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>

                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<PublishIcon />}
                                                    onClick={handlePublishPhase2}
                                                    disabled={!phase2File}
                                                    sx={{ borderRadius: BORDER_RADIUS.sm }}
                                                >
                                                    Publier résultats définitifs
                                                </Button>
                                            </StepContent>
                                        </Step>
                                    </Stepper>

                                    {/* Message de fin */}
                                    {selectedCampagne.phase2Publiee && (
                                        <Alert
                                            severity="success"
                                            icon={<CheckCircleIcon />}
                                            sx={{ mt: 3, borderRadius: BORDER_RADIUS.sm }}
                                        >
                                            <Typography variant="body2" fontWeight={500}>
                                                Tous les résultats ont été publiés pour ce parcours !
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Les candidats ont été notifiés automatiquement.
                                            </Typography>
                                        </Alert>
                                    )}
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        Sélectionnez une campagne pour commencer
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Resultats;
