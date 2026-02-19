import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Avatar,
    IconButton,
    Tooltip,
    Grid,
    useTheme,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import {
    Download as DownloadIcon,
    Visibility as VisibilityIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    CalendarMonth as CalendarIcon,
    Description as DescriptionIcon,
    PictureAsPdf as PdfIcon,
    TableChart as ExcelIcon,
    HourglassEmpty as HourglassIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { PageHeader, SearchField, StatusChip } from '../../components/ui';
import { BORDER_RADIUS, AVATAR_SIZES } from '../../constants';
import { exportCandidaturesToExcel } from '../../utils/excelUtils';
import { generateCandidaturesPDF } from '../../utils/pdfUtils';
import { useAppSelector } from '../../store/hooks';

interface Candidature {
    id: number;
    numeroCandidature: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    dateNaissance: string;
    sexe: 'M' | 'F';
    serieBac: string;
    moyenneBac: number;
    parcours: string;
    dateSoumission: string;
    statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' | 'EN_LISTE_ATTENTE';
}

// Données mockées
const mockCandidatures: Candidature[] = [
    {
        id: 1,
        numeroCandidature: 'CAND-2026-001',
        nom: 'AGBEKO',
        prenom: 'Kofi',
        email: 'kofi.agbeko@email.com',
        telephone: '+228 90 12 34 56',
        dateNaissance: '2005-03-15',
        sexe: 'M',
        serieBac: 'C',
        moyenneBac: 14.5,
        parcours: 'Licence Informatique',
        dateSoumission: '2026-02-01',
        statut: 'EN_ATTENTE',
    },
    {
        id: 2,
        numeroCandidature: 'CAND-2026-002',
        nom: 'MENSAH',
        prenom: 'Ama',
        email: 'ama.mensah@email.com',
        telephone: '+228 91 23 45 67',
        dateNaissance: '2004-07-22',
        sexe: 'F',
        serieBac: 'D',
        moyenneBac: 15.2,
        parcours: 'Licence Informatique',
        dateSoumission: '2026-02-02',
        statut: 'EN_ATTENTE',
    },
    {
        id: 3,
        numeroCandidature: 'CAND-2026-003',
        nom: 'KODJO',
        prenom: 'Yao',
        email: 'yao.kodjo@email.com',
        telephone: '+228 92 34 56 78',
        dateNaissance: '2005-11-08',
        sexe: 'M',
        serieBac: 'C',
        moyenneBac: 16.8,
        parcours: 'Master Data Science',
        dateSoumission: '2026-02-03',
        statut: 'ACCEPTEE',
    },
    {
        id: 4,
        numeroCandidature: 'CAND-2026-004',
        nom: 'ADOM',
        prenom: 'Akossiwa',
        email: 'akossiwa.adom@email.com',
        telephone: '+228 93 45 67 89',
        dateNaissance: '2004-01-30',
        sexe: 'F',
        serieBac: 'D',
        moyenneBac: 13.9,
        parcours: 'Master Data Science',
        dateSoumission: '2026-02-04',
        statut: 'EN_LISTE_ATTENTE',
    },
    {
        id: 5,
        numeroCandidature: 'CAND-2026-005',
        nom: 'AMEGAH',
        prenom: 'Kossi',
        email: 'kossi.amegah@email.com',
        telephone: '+228 94 56 78 90',
        dateNaissance: '2005-06-12',
        sexe: 'M',
        serieBac: 'C',
        moyenneBac: 12.5,
        parcours: 'Licence Informatique',
        dateSoumission: '2026-02-05',
        statut: 'REFUSEE',
    },
];

const mockParcours = ['Tous les parcours', 'Licence Informatique', 'Master Data Science', 'Licence Gestion', 'Master Finance'];

const Candidatures: React.FC = () => {
    const theme = useTheme();
    const { user } = useAppSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParcours, setSelectedParcours] = useState('Tous les parcours');
    const [selectedStatut, setSelectedStatut] = useState('Tous');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCandidat, setSelectedCandidat] = useState<Candidature | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const filteredCandidatures = mockCandidatures.filter((c) => {
        const matchSearch =
            c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.numeroCandidature.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchParcours = selectedParcours === 'Tous les parcours' || c.parcours === selectedParcours;
        const matchStatut = selectedStatut === 'Tous' || c.statut === selectedStatut;
        return matchSearch && matchParcours && matchStatut;
    });

    const stats = {
        total: mockCandidatures.length,
        enAttente: mockCandidatures.filter(c => c.statut === 'EN_ATTENTE').length,
        acceptees: mockCandidatures.filter(c => c.statut === 'ACCEPTEE').length,
        refusees: mockCandidatures.filter(c => c.statut === 'REFUSEE').length,
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const calculateAge = (dateNaissance: string) => {
        const today = new Date();
        const birthDate = new Date(dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };



    const getStatutLabel = (statut: string) => {
        switch (statut) {
            case 'EN_ATTENTE': return 'En attente';
            case 'ACCEPTEE': return 'Acceptée';
            case 'REFUSEE': return 'Refusée';
            case 'EN_LISTE_ATTENTE': return 'Liste d\'attente';
            default: return statut;
        }
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        const dataToExport = filteredCandidatures.map(c => ({
            numeroCandidature: c.numeroCandidature,
            nomCandidat: c.nom,
            prenomCandidat: c.prenom,
            emailCandidat: c.email,
            parcours: c.parcours,
            serieBac: c.serieBac,
            moyenneBac: c.moyenneBac,
            dateSoumission: c.dateSoumission,
            statut: getStatutLabel(c.statut),
        }));

        const filename = `candidatures_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}`;

        if (format === 'excel') {
            exportCandidaturesToExcel(dataToExport, filename);
        } else {
            generateCandidaturesPDF(dataToExport, filename, user?.etablissementNom);
        }
    };

    return (
        <Box>
            {/* Header */}
            <PageHeader
                title="Candidatures"
                subtitle="Consultez et téléchargez les candidatures reçues"
                icon={<DescriptionIcon />}
                iconColor={theme.palette.info.main}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<ExcelIcon />}
                            onClick={() => handleExport('excel')}
                            sx={{ borderRadius: BORDER_RADIUS.sm }}
                        >
                            Excel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<PdfIcon />}
                            onClick={() => handleExport('pdf')}
                            sx={{ borderRadius: BORDER_RADIUS.sm }}
                        >
                            PDF
                        </Button>
                    </Stack>
                }
            />

            {/* Stats */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Card
                    variant="outlined"
                    sx={{
                        flex: 1,
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: 'primary.main',
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                            {stats.total}
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
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                        borderColor: 'warning.main',
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                        }}
                    >
                        <HourglassIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {stats.enAttente}
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
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        borderColor: 'success.main',
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 28, color: 'success.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {stats.acceptees}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Acceptées
                        </Typography>
                    </Box>
                </Card>
                <Card
                    variant="outlined"
                    sx={{
                        flex: 1,
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                        borderColor: 'error.main',
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                        }}
                    >
                        <CancelIcon sx={{ fontSize: 28, color: 'error.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="error.main">
                            {stats.refusees}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Refusées
                        </Typography>
                    </Box>
                </Card>
            </Stack>

            {/* Filtres */}
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    mb: 3,
                    bgcolor: alpha(theme.palette.grey[50], 0.5),
                }}
            >
                <CardContent sx={{ p: 2.5 }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                    >
                        <SearchField
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Rechercher par nom, N° candidature, email..."
                            fullWidth
                        />
                        <FormControl size="small" sx={{ minWidth: 220 }}>
                            <InputLabel>Parcours</InputLabel>
                            <Select
                                value={selectedParcours}
                                label="Parcours"
                                onChange={(e) => setSelectedParcours(e.target.value)}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: 'white',
                                }}
                            >
                                {mockParcours.map((p) => (
                                    <MenuItem key={p} value={p}>{p}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={selectedStatut}
                                label="Statut"
                                onChange={(e) => setSelectedStatut(e.target.value)}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: 'white',
                                }}
                            >
                                <MenuItem value="Tous">Tous les statuts</MenuItem>
                                <MenuItem value="EN_ATTENTE">En attente</MenuItem>
                                <MenuItem value="ACCEPTEE">Acceptées</MenuItem>
                                <MenuItem value="REFUSEE">Refusées</MenuItem>
                                <MenuItem value="EN_LISTE_ATTENTE">Liste d'attente</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </CardContent>
            </Card>

            {/* Tableau des candidatures */}
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>N° Candidature</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Candidat</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Parcours</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Série Bac</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Moyenne</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Statut</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCandidatures
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((candidature) => (
                                    <TableRow
                                        key={candidature.id}
                                        hover
                                        sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                {candidature.numeroCandidature}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        width: AVATAR_SIZES.sm,
                                                        height: AVATAR_SIZES.sm,
                                                    }}
                                                >
                                                    <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {candidature.prenom} {candidature.nom}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {candidature.email}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {candidature.parcours}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={candidature.serieBac}
                                                size="small"
                                                sx={{ borderRadius: BORDER_RADIUS.xs }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                color={candidature.moyenneBac >= 14 ? 'success.main' : candidature.moyenneBac >= 12 ? 'warning.main' : 'error.main'}
                                            >
                                                {candidature.moyenneBac.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(candidature.dateSoumission)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <StatusChip
                                                status={candidature.statut}
                                                label={getStatutLabel(candidature.statut)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Voir détails">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedCandidat(candidature);
                                                        setDetailsOpen(true);
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredCandidatures.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="Lignes par page"
                />
            </Card>

            {/* Dialog Détails */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: BORDER_RADIUS.md } }}
            >
                {selectedCandidat && (
                    <>
                        <DialogTitle>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: AVATAR_SIZES.lg, height: AVATAR_SIZES.lg }}>
                                    <PersonIcon sx={{ color: 'primary.main' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedCandidat.prenom} {selectedCandidat.nom}
                                    </Typography>
                                    <Typography variant="body2" color="primary.main">
                                        {selectedCandidat.numeroCandidature}
                                    </Typography>
                                </Box>
                            </Stack>
                        </DialogTitle>
                        <DialogContent>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    <Typography variant="body2">{selectedCandidat.email}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    <Typography variant="body2">{selectedCandidat.telephone}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    <Typography variant="body2">
                                        {formatDate(selectedCandidat.dateNaissance)} ({calculateAge(selectedCandidat.dateNaissance)} ans)
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <SchoolIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    <Typography variant="body2">{selectedCandidat.parcours}</Typography>
                                </Stack>

                                <Divider sx={{ my: 1 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Série Bac</Typography>
                                        <Typography variant="body1" fontWeight={600}>{selectedCandidat.serieBac}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Moyenne Bac</Typography>
                                        <Typography variant="body1" fontWeight={600} color="success.main">
                                            {selectedCandidat.moyenneBac.toFixed(2)}/20
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Sexe</Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {selectedCandidat.sexe === 'M' ? 'Masculin' : 'Féminin'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">Statut</Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <StatusChip
                                                status={selectedCandidat.statut}
                                                label={getStatutLabel(selectedCandidat.statut)}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="subtitle2" color="text.secondary">
                                    Documents du dossier
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {['Bulletin Seconde', 'Bulletin Première', 'Bulletin Terminale', 'Relevé Bac', 'CV'].map((doc) => (
                                        <Chip
                                            key={doc}
                                            icon={<DescriptionIcon />}
                                            label={doc}
                                            size="small"
                                            variant="outlined"
                                            onClick={() => alert(`Téléchargement de ${doc}...`)}
                                            sx={{ borderRadius: BORDER_RADIUS.xs, cursor: 'pointer' }}
                                        />
                                    ))}
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDetailsOpen(false)}>Fermer</Button>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={() => alert('Téléchargement du dossier complet...')}
                            >
                                Télécharger dossier
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Candidatures;
