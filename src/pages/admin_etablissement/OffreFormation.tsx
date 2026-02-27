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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Collapse,
    Paper,
    Divider,
    useTheme,
    alpha,
    Tooltip,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Category as CategoryIcon,
    School as SchoolIcon,
    KeyboardArrowRight as ArrowIcon,
    PlayArrow as OpenIcon,
    Stop as CloseIcon,
    Replay as ReopenIcon,
    CalendarMonth as CalendarIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { PageHeader, SearchField } from '../../components/ui';
import { formatCFA } from '../../constants';
import type { StatutCampagne } from '../../types';
import { domainesApi } from '../../api/domaines';
import { useAppDispatch } from '../../store/hooks';
import { showSnackbar } from '../../store/slices/uiSlice';

// Types alignés sur les models backend
interface Filiere {
    id: number;
    nom: string;
    fraisScolarite: number;
    places: number;
}

interface Parcours {
    id: number;
    nom: string;
    niveau: 'Licence' | 'Master' | 'Doctorat';
    statut: StatutCampagne;
    anneeAcademique: string;
    dateOuverture?: string;
    dateCloture?: string;
    dateConcoursEcrit?: string;
    filieres: Filiere[];
}

interface Domaine {
    id: number;
    nom: string;
    description: string;
    parcours: Parcours[];
}

// Données mock
const initialDomaines: Domaine[] = [
    {
        id: 1,
        nom: 'Sciences et Technologies',
        description: 'Formations scientifiques et technologiques',
        parcours: [
            {
                id: 1,
                nom: 'Informatique',
                niveau: 'Licence',
                statut: 'OUVERTE',
                anneeAcademique: '2025-2026',
                dateOuverture: '2026-01-15',
                dateCloture: '2026-06-30',
                filieres: [
                    { id: 1, nom: 'Génie Logiciel', fraisScolarite: 850000, places: 50 },
                    { id: 2, nom: 'Réseaux & Systèmes', fraisScolarite: 850000, places: 40 },
                    { id: 3, nom: 'Intelligence Artificielle', fraisScolarite: 950000, places: 30 },
                ],
            },
            {
                id: 2,
                nom: 'Mathématiques Appliquées',
                niveau: 'Master',
                statut: 'A_VENIR',
                anneeAcademique: '2025-2026',
                dateOuverture: '2026-09-01',
                dateCloture: '2026-12-15',
                filieres: [
                    { id: 4, nom: 'Data Science', fraisScolarite: 1200000, places: 25 },
                    { id: 5, nom: 'Statistiques', fraisScolarite: 1100000, places: 30 },
                ],
            },
        ],
    },
    {
        id: 2,
        nom: 'Sciences Économiques et Gestion',
        description: 'Formations en économie et gestion',
        parcours: [
            {
                id: 3,
                nom: 'Gestion des Entreprises',
                niveau: 'Licence',
                statut: 'OUVERTE',
                anneeAcademique: '2025-2026',
                dateOuverture: '2026-01-15',
                dateCloture: '2026-06-30',
                filieres: [
                    { id: 6, nom: 'Comptabilité', fraisScolarite: 750000, places: 60 },
                    { id: 7, nom: 'Marketing', fraisScolarite: 750000, places: 50 },
                    { id: 8, nom: 'Finance', fraisScolarite: 800000, places: 45 },
                ],
            },
        ],
    },
];

const OffreFormation: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [domaines, setDomaines] = useState<Domaine[]>(initialDomaines);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedDomaines, setExpandedDomaines] = useState<number[]>([1]);
    const [expandedParcours, setExpandedParcours] = useState<number[]>([1]);

    // Dialog states
    const [openDialog, setOpenDialog] = useState<'domaine' | 'parcours' | 'filiere' | null>(null);
    const [selectedDomaineId, setSelectedDomaineId] = useState<number | null>(null);
    const [selectedParcoursId, setSelectedParcoursId] = useState<number | null>(null);
    const [isCreatingDomaine, setIsCreatingDomaine] = useState(false);

    // Form states
    const [newDomaine, setNewDomaine] = useState({ nom: '', description: '' });
    const [newParcours, setNewParcours] = useState<{ nom: string; niveau: 'Licence' | 'Master' | 'Doctorat' }>({ nom: '', niveau: 'Licence' });
    const [newFiliere, setNewFiliere] = useState({ nom: '', fraisScolarite: 0, places: 0 });

    // Campaign dialog states
    const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
    const [campaignAction, setCampaignAction] = useState<'open' | 'close' | 'reopen' | null>(null);
    const [campaignDomaineId, setCampaignDomaineId] = useState<number | null>(null);
    const [campaignParcoursId, setCampaignParcoursId] = useState<number | null>(null);
    const [campaignDates, setCampaignDates] = useState({
        dateOuverture: '',
        dateCloture: '',
        anneeAcademique: '2025-2026',
        dateConcoursEcrit: '',
    });

    // Toggle functions
    const toggleDomaine = (id: number) => {
        setExpandedDomaines(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const toggleParcours = (id: number) => {
        setExpandedParcours(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Get status chip
    const getStatusChip = (statut: string) => {
        const config = {
            'OUVERTE': { label: 'Ouverte', color: 'success' as const },
            'A_VENIR': { label: 'À venir', color: 'warning' as const },
            'CLOTUREE': { label: 'Clôturée', color: 'default' as const },
        };
        const { label, color } = config[statut as keyof typeof config] || { label: statut, color: 'default' as const };
        return <Chip label={label} color={color} size="small" />;
    };

    // Get niveau chip
    const getNiveauChip = (niveau: string) => {
        const colors = {
            'Licence': 'primary',
            'Master': 'secondary',
            'Doctorat': 'error',
        };
        return (
            <Chip
                label={niveau}
                size="small"
                variant="outlined"
                color={((colors[niveau as keyof typeof colors]) as 'primary' | 'secondary' | 'error') || 'default'}
            />
        );
    };

    // Filter domaines
    const filteredDomaines = domaines.filter(d =>
        d.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.parcours.some(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Stats
    const totalParcours = domaines.reduce((acc, d) => acc + d.parcours.length, 0);
    const totalFilieres = domaines.reduce((acc, d) =>
        acc + d.parcours.reduce((acc2, p) => acc2 + p.filieres.length, 0), 0
    );
    const campagnesOuvertes = domaines.reduce((acc, d) =>
        acc + d.parcours.filter(p => p.statut === 'OUVERTE').length, 0
    );

    // Format date for display
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Handle add domaine — appel API réel POST /api/domaines
    const handleAddDomaine = async () => {
        if (!newDomaine.nom.trim()) return;
        setIsCreatingDomaine(true);
        try {
            const created = await domainesApi.createDomaine({
                nomDomaine: newDomaine.nom.trim(),
                description: newDomaine.description.trim() || undefined,
            });
            setDomaines(prev => [...prev, {
                id: created.id,
                nom: created.nomDomaine,
                description: created.description || '',
                parcours: [],
            }]);
            setExpandedDomaines(prev => [...prev, created.id]);
            setNewDomaine({ nom: '', description: '' });
            setOpenDialog(null);
            dispatch(showSnackbar({ message: `Domaine « ${created.nomDomaine} » créé avec succès`, severity: 'success' }));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la création du domaine';
            dispatch(showSnackbar({ message, severity: 'error' }));
        } finally {
            setIsCreatingDomaine(false);
        }
    };

    // Handle add parcours
    const handleAddParcours = () => {
        if (newParcours.nom.trim() && selectedDomaineId) {
            setDomaines(domaines.map(d => {
                if (d.id === selectedDomaineId) {
                    const newId = Math.max(...d.parcours.map(p => p.id), 0) + 1;
                    return {
                        ...d,
                        parcours: [...d.parcours, {
                            id: newId,
                            nom: newParcours.nom,
                            niveau: newParcours.niveau,
                            statut: 'A_VENIR' as const,
                            anneeAcademique: '2025-2026',
                            filieres: [],
                        }]
                    };
                }
                return d;
            }));
            setNewParcours({ nom: '', niveau: 'Licence' });
            setOpenDialog(null);
            setSelectedDomaineId(null);
        }
    };

    // Handle add filiere
    const handleAddFiliere = () => {
        if (newFiliere.nom.trim() && selectedDomaineId && selectedParcoursId) {
            setDomaines(domaines.map(d => {
                if (d.id === selectedDomaineId) {
                    return {
                        ...d,
                        parcours: d.parcours.map(p => {
                            if (p.id === selectedParcoursId) {
                                const newId = Math.max(...p.filieres.map(f => f.id), 0) + 1;
                                return {
                                    ...p,
                                    filieres: [...p.filieres, {
                                        id: newId,
                                        nom: newFiliere.nom,
                                        fraisScolarite: newFiliere.fraisScolarite,
                                        places: newFiliere.places,
                                    }]
                                };
                            }
                            return p;
                        })
                    };
                }
                return d;
            }));
            setNewFiliere({ nom: '', fraisScolarite: 0, places: 0 });
            setOpenDialog(null);
            setSelectedDomaineId(null);
            setSelectedParcoursId(null);
        }
    };

    // Handle delete filiere
    const handleDeleteFiliere = (domaineId: number, parcoursId: number, filiereId: number) => {
        setDomaines(domaines.map(d => {
            if (d.id === domaineId) {
                return {
                    ...d,
                    parcours: d.parcours.map(p => {
                        if (p.id === parcoursId) {
                            return {
                                ...p,
                                filieres: p.filieres.filter(f => f.id !== filiereId)
                            };
                        }
                        return p;
                    })
                };
            }
            return d;
        }));
    };

    // Campaign management
    const handleOpenCampaignDialog = (domaineId: number, parcoursId: number, action: 'open' | 'close' | 'reopen') => {
        const domaine = domaines.find(d => d.id === domaineId);
        const parcours = (domaine && domaine.parcours) ? domaine.parcours.find(p => p.id === parcoursId) : undefined;
        setCampaignDomaineId(domaineId);
        setCampaignParcoursId(parcoursId);
        setCampaignAction(action);
        if (action === 'open' || action === 'reopen') {
            setCampaignDates({
                dateOuverture: (parcours && parcours.dateOuverture) || new Date().toISOString().split('T')[0],
                dateCloture: (parcours && parcours.dateCloture) || '',
                anneeAcademique: (parcours && parcours.anneeAcademique) || '2025-2026',
                dateConcoursEcrit: (parcours && parcours.dateConcoursEcrit) || '',
            });
        }
        setCampaignDialogOpen(true);
    };

    const handleCampaignConfirm = () => {
        if (campaignDomaineId === null || campaignParcoursId === null || !campaignAction) return;

        setDomaines(domaines.map(d => {
            if (d.id === campaignDomaineId) {
                return {
                    ...d,
                    parcours: d.parcours.map(p => {
                        if (p.id === campaignParcoursId) {
                            const newStatut: StatutCampagne =
                                campaignAction === 'close' ? 'CLOTUREE' : (campaignAction === 'reopen' ? 'OUVERTE' : 'OUVERTE');
                            return {
                                ...p,
                                statut: newStatut,
                                ...(campaignAction !== 'close' && {
                                    dateOuverture: campaignDates.dateOuverture,
                                    dateCloture: campaignDates.dateCloture,
                                    anneeAcademique: campaignDates.anneeAcademique,
                                    dateConcoursEcrit: campaignDates.dateConcoursEcrit || undefined,
                                }),
                            };
                        }
                        return p;
                    })
                };
            }
            return d;
        }));

        setCampaignDialogOpen(false);
        setCampaignDomaineId(null);
        setCampaignParcoursId(null);
        setCampaignAction(null);
    };

    const getCampaignDialogTitle = () => {
        switch (campaignAction) {
            case 'open': return 'Ouvrir la campagne';
            case 'close': return 'Clôturer la campagne';
            case 'reopen': return 'Réouvrir la campagne';
            default: return '';
        }
    };

    const getCampaignParcoursName = () => {
        const domaine = domaines.find(d => d.id === campaignDomaineId);
        const parcours = (domaine && domaine.parcours) ? domaine.parcours.find(p => p.id === campaignParcoursId) : undefined;
        return (parcours && parcours.nom) || '';
    };

    return (
        <Box>
            <PageHeader
                title="Offre de Formation"
                subtitle="Gérez vos domaines, parcours et filières"
                icon={<CategoryIcon />}
                iconColor={theme.palette.secondary.main}
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog('domaine')}
                    >
                        Nouveau domaine
                    </Button>
                }
            />

            {/* Stats rapides */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip
                    icon={<CategoryIcon />}
                    label={`${domaines.length} domaines`}
                    variant="outlined"
                />
                <Chip
                    icon={<SchoolIcon />}
                    label={`${totalParcours} parcours`}
                    variant="outlined"
                    color="primary"
                />
                <Chip
                    label={`${totalFilieres} filières`}
                    variant="outlined"
                    color="secondary"
                />
                <Chip
                    icon={<EventIcon />}
                    label={`${campagnesOuvertes} campagne${campagnesOuvertes > 1 ? 's' : ''} ouverte${campagnesOuvertes > 1 ? 's' : ''}`}
                    variant="outlined"
                    color="success"
                />
            </Stack>

            {/* Recherche */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <SearchField
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Rechercher un domaine ou parcours..."
                        fullWidth
                    />
                </CardContent>
            </Card>

            {/* Liste des domaines */}
            <Stack spacing={2}>
                {filteredDomaines.map((domaine) => (
                    <Card key={domaine.id} variant="outlined">
                        {/* Header Domaine */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                cursor: 'pointer',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                            }}
                            onClick={() => toggleDomaine(domaine.id)}
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <IconButton
                                    size="small"
                                    sx={{
                                        bgcolor: 'white',
                                        boxShadow: 1,
                                        '&:hover': { bgcolor: 'white', boxShadow: 2 },
                                    }}
                                >
                                    {expandedDomaines.includes(domaine.id) ?
                                        <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                                <Box>
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                        {domaine.nom}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {domaine.description} • {domaine.parcours.length} parcours
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDomaineId(domaine.id);
                                        setOpenDialog('parcours');
                                    }}
                                    sx={{ borderRadius: 1.5 }}
                                >
                                    Ajouter un parcours
                                </Button>
                                <Tooltip title="Modifier le domaine">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            bgcolor: 'white',
                                            '&:hover': { bgcolor: 'white', color: 'primary.main' },
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>

                        {/* Parcours du domaine */}
                        <Collapse in={expandedDomaines.includes(domaine.id)}>
                            <Divider />
                            {domaine.parcours.length === 0 ? (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography color="text.secondary">
                                        Aucun parcours dans ce domaine
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        {domaine.parcours.map((parcours) => (
                                            <Paper
                                                key={parcours.id}
                                                variant="outlined"
                                                sx={{ overflow: 'hidden' }}
                                            >
                                                {/* Header Parcours */}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        p: 2,
                                                        bgcolor: alpha(theme.palette.grey[50], 0.8),
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        '&:hover': { bgcolor: alpha(theme.palette.grey[100], 0.9) },
                                                    }}
                                                    onClick={() => toggleParcours(parcours.id)}
                                                >
                                                    <Box sx={{ flex: 1 }}>
                                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
                                                            <ArrowIcon
                                                                sx={{
                                                                    transform: expandedParcours.includes(parcours.id)
                                                                        ? 'rotate(90deg)' : 'none',
                                                                    transition: 'transform 0.2s',
                                                                    color: 'primary.main',
                                                                    fontSize: 20,
                                                                }}
                                                            />
                                                            <Typography variant="subtitle1" fontWeight={600}>
                                                                {parcours.nom}
                                                            </Typography>
                                                            {getNiveauChip(parcours.niveau)}
                                                            {getStatusChip(parcours.statut)}
                                                        </Stack>
                                                        {/* Dates de la campagne */}
                                                        {parcours.statut === 'OUVERTE' && parcours.dateOuverture && parcours.dateCloture && (
                                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 4.5 }}>
                                                                <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Du {formatDate(parcours.dateOuverture)} au {formatDate(parcours.dateCloture)}
                                                                </Typography>
                                                                {parcours.dateConcoursEcrit && (
                                                                    <>
                                                                        <Typography variant="caption" color="text.secondary">•</Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Concours : {formatDate(parcours.dateConcoursEcrit)}
                                                                        </Typography>
                                                                    </>
                                                                )}
                                                            </Stack>
                                                        )}
                                                        {parcours.statut === 'A_VENIR' && parcours.dateOuverture && (
                                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 4.5 }}>
                                                                <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Ouverture prévue le {formatDate(parcours.dateOuverture)}
                                                                </Typography>
                                                            </Stack>
                                                        )}
                                                    </Box>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip
                                                            label={`${parcours.filieres.length} filières`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'white',
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                        {/* Campaign action buttons */}
                                                        {parcours.statut === 'A_VENIR' && (
                                                            <Tooltip title="Ouvrir la campagne">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleOpenCampaignDialog(domaine.id, parcours.id, 'open');
                                                                    }}
                                                                    sx={{
                                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                        color: theme.palette.success.main,
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.success.main, 0.2),
                                                                        },
                                                                    }}
                                                                >
                                                                    <OpenIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {parcours.statut === 'OUVERTE' && (
                                                            <Tooltip title="Clôturer la campagne">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleOpenCampaignDialog(domaine.id, parcours.id, 'close');
                                                                    }}
                                                                    sx={{
                                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                        color: theme.palette.error.main,
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.error.main, 0.2),
                                                                        },
                                                                    }}
                                                                >
                                                                    <CloseIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {parcours.statut === 'CLOTUREE' && (
                                                            <Tooltip title="Réouvrir la campagne">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleOpenCampaignDialog(domaine.id, parcours.id, 'reopen');
                                                                    }}
                                                                    sx={{
                                                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                                        color: theme.palette.warning.main,
                                                                        '&:hover': {
                                                                            bgcolor: alpha(theme.palette.warning.main, 0.2),
                                                                        },
                                                                    }}
                                                                >
                                                                    <ReopenIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title="Ajouter une filière">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedDomaineId(domaine.id);
                                                                    setSelectedParcoursId(parcours.id);
                                                                    setOpenDialog('filiere');
                                                                }}
                                                                sx={{
                                                                    bgcolor: theme.palette.primary.main,
                                                                    color: 'white',
                                                                    '&:hover': {
                                                                        bgcolor: theme.palette.primary.dark,
                                                                    },
                                                                }}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Modifier le parcours">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => e.stopPropagation()}
                                                                sx={{
                                                                    bgcolor: 'white',
                                                                    '&:hover': {
                                                                        bgcolor: 'white',
                                                                        color: 'primary.main',
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </Box>

                                                {/* Cards des filières */}
                                                <Collapse in={expandedParcours.includes(parcours.id)}>
                                                    {parcours.filieres.length === 0 ? (
                                                        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                Aucune filière dans ce parcours
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<AddIcon />}
                                                                onClick={() => {
                                                                    setSelectedDomaineId(domaine.id);
                                                                    setSelectedParcoursId(parcours.id);
                                                                    setOpenDialog('filiere');
                                                                }}
                                                            >
                                                                Ajouter une filière
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.3) }}>
                                                            <Stack spacing={1.5}>
                                                                {parcours.filieres.map((filiere) => (
                                                                    <Card
                                                                        key={filiere.id}
                                                                        variant="outlined"
                                                                        sx={{
                                                                            transition: 'all 0.2s',
                                                                            '&:hover': {
                                                                                boxShadow: 1,
                                                                                borderColor: 'primary.main',
                                                                            }
                                                                        }}
                                                                    >
                                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                                <Box sx={{ flex: 1 }}>
                                                                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                                                                                        {filiere.nom}
                                                                                    </Typography>
                                                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                                                        <Box sx={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            px: 1.5,
                                                                                            py: 0.5,
                                                                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                                                            borderRadius: 1,
                                                                                        }}>
                                                                                            <Typography
                                                                                                variant="body2"
                                                                                                color="primary.main"
                                                                                                fontWeight={600}
                                                                                            >
                                                                                                {formatCFA(filiere.fraisScolarite)}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                        <Chip
                                                                                            label={`${filiere.places} places`}
                                                                                            size="small"
                                                                                            color="default"
                                                                                            sx={{
                                                                                                fontWeight: 500,
                                                                                                borderRadius: 1.5,
                                                                                            }}
                                                                                        />
                                                                                    </Stack>
                                                                                </Box>
                                                                                <Stack direction="row" spacing={0.5}>
                                                                                    <Tooltip title="Modifier">
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            sx={{
                                                                                                '&:hover': {
                                                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                                                    color: 'primary.main',
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <EditIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    <Tooltip title="Supprimer">
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            onClick={() => handleDeleteFiliere(domaine.id, parcours.id, filiere.id)}
                                                                                            sx={{
                                                                                                '&:hover': {
                                                                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                                                    color: 'error.main',
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <DeleteIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Stack>
                                                                            </Stack>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </Stack>
                                                        </Box>
                                                    )}
                                                </Collapse>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Collapse>
                    </Card>
                ))}
            </Stack>

            {filteredDomaines.length === 0 && (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Aucun domaine trouvé
                    </Typography>
                </Card>
            )}

            {/* Dialog: Gestion de campagne */}
            <Dialog
                open={campaignDialogOpen}
                onClose={() => setCampaignDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <EventIcon color={
                        campaignAction === 'open' ? 'success' :
                            campaignAction === 'close' ? 'error' : 'warning'
                    } />
                    {getCampaignDialogTitle()}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <Alert
                            severity={
                                campaignAction === 'close' ? 'warning' : 'info'
                            }
                            variant="outlined"
                        >
                            {campaignAction === 'open' && (
                                <>Vous allez ouvrir la campagne d'admission pour le parcours <strong>{getCampaignParcoursName()}</strong>. Les bacheliers pourront soumettre leurs candidatures.</>
                            )}
                            {campaignAction === 'close' && (
                                <>Vous allez clôturer la campagne pour le parcours <strong>{getCampaignParcoursName()}</strong>. Plus aucune candidature ne sera acceptée.</>
                            )}
                            {campaignAction === 'reopen' && (
                                <>Vous allez réouvrir la campagne pour le parcours <strong>{getCampaignParcoursName()}</strong>. Les candidatures seront à nouveau acceptées.</>
                            )}
                        </Alert>

                        {(campaignAction === 'open' || campaignAction === 'reopen') && (
                            <>
                                <TextField
                                    label="Année académique"
                                    fullWidth
                                    value={campaignDates.anneeAcademique}
                                    onChange={(e) => setCampaignDates({ ...campaignDates, anneeAcademique: e.target.value })}
                                    placeholder="Ex: 2025-2026"
                                />
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Date d'ouverture"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={campaignDates.dateOuverture}
                                        onChange={(e) => setCampaignDates({ ...campaignDates, dateOuverture: e.target.value })}
                                    />
                                    <TextField
                                        label="Date de clôture"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={campaignDates.dateCloture}
                                        onChange={(e) => setCampaignDates({ ...campaignDates, dateCloture: e.target.value })}
                                    />
                                </Stack>
                                <TextField
                                    label="Date du concours écrit (optionnel)"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={campaignDates.dateConcoursEcrit}
                                    onChange={(e) => setCampaignDates({ ...campaignDates, dateConcoursEcrit: e.target.value })}
                                    helperText="Laissez vide si pas de concours écrit"
                                />
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setCampaignDialogOpen(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCampaignConfirm}
                        color={
                            campaignAction === 'open' ? 'success' :
                                campaignAction === 'close' ? 'error' : 'warning'
                        }
                        startIcon={
                            campaignAction === 'open' ? <OpenIcon /> :
                                campaignAction === 'close' ? <CloseIcon /> : <ReopenIcon />
                        }
                    >
                        {campaignAction === 'open' ? 'Ouvrir' :
                            campaignAction === 'close' ? 'Clôturer' : 'Réouvrir'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Nouveau Domaine */}
            <Dialog
                open={openDialog === 'domaine'}
                onClose={() => setOpenDialog(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Nouveau Domaine</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nom du domaine"
                            fullWidth
                            value={newDomaine.nom}
                            onChange={(e) => setNewDomaine({ ...newDomaine, nom: e.target.value })}
                            placeholder="Ex: Sciences et Technologies"
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={newDomaine.description}
                            onChange={(e) => setNewDomaine({ ...newDomaine, description: e.target.value })}
                            placeholder="Description du domaine..."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDialog(null);
                            setNewDomaine({ nom: '', description: '' });
                        }}
                        disabled={isCreatingDomaine}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddDomaine}
                        disabled={!newDomaine.nom.trim() || isCreatingDomaine}
                    >
                        {isCreatingDomaine ? 'Création...' : 'Créer'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Nouveau Parcours */}
            <Dialog
                open={openDialog === 'parcours'}
                onClose={() => { setOpenDialog(null); setSelectedDomaineId(null); }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Nouveau Parcours</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nom du parcours"
                            fullWidth
                            value={newParcours.nom}
                            onChange={(e) => setNewParcours({ ...newParcours, nom: e.target.value })}
                            placeholder="Ex: Informatique"
                        />
                        <FormControl fullWidth>
                            <InputLabel>Niveau</InputLabel>
                            <Select
                                value={newParcours.niveau}
                                label="Niveau"
                                onChange={(e) => setNewParcours({
                                    ...newParcours,
                                    niveau: e.target.value as 'Licence' | 'Master' | 'Doctorat'
                                })}
                            >
                                <MenuItem value="Licence">Licence</MenuItem>
                                <MenuItem value="Master">Master</MenuItem>
                                <MenuItem value="Doctorat">Doctorat</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenDialog(null); setSelectedDomaineId(null); }}>
                        Annuler
                    </Button>
                    <Button variant="contained" onClick={handleAddParcours}>
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Nouvelle Filière */}
            <Dialog
                open={openDialog === 'filiere'}
                onClose={() => {
                    setOpenDialog(null);
                    setSelectedDomaineId(null);
                    setSelectedParcoursId(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Nouvelle Filière</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nom de la filière"
                            fullWidth
                            value={newFiliere.nom}
                            onChange={(e) => setNewFiliere({ ...newFiliere, nom: e.target.value })}
                            placeholder="Ex: Génie Logiciel"
                        />
                        <TextField
                            label="Frais de scolarité (FCFA)"
                            fullWidth
                            type="number"
                            value={newFiliere.fraisScolarite || ''}
                            onChange={(e) => setNewFiliere({
                                ...newFiliere,
                                fraisScolarite: parseInt(e.target.value) || 0
                            })}
                            placeholder="Ex: 850000"
                        />
                        <TextField
                            label="Nombre de places"
                            fullWidth
                            type="number"
                            value={newFiliere.places || ''}
                            onChange={(e) => setNewFiliere({
                                ...newFiliere,
                                places: parseInt(e.target.value) || 0
                            })}
                            placeholder="Ex: 50"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDialog(null);
                        setSelectedDomaineId(null);
                        setSelectedParcoursId(null);
                    }}>
                        Annuler
                    </Button>
                    <Button variant="contained" onClick={handleAddFiliere}>
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OffreFormation;
