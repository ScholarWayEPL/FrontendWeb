import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Avatar,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Divider,
    useTheme,
    alpha,
    Alert,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Download as DownloadIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Description as DescriptionIcon,
    LocationOn as LocationOnIcon,
    VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { PageHeader, SearchField, StatusChip } from '../components/ui';
import StatCard from '../components/StatCard';
import { BORDER_RADIUS, SHADOWS } from '../constants';

// Types
interface DemandeInscription {
    id: number;
    nomEtablissement: string;
    emailPro: string;
    telephonePro: string;
    localisation: string;
    siteWeb?: string;
    description: string;
    documentAccreditationUrl: string;
    dateDemande: string;
    statut: 'en_attente' | 'approuvee' | 'rejetee';
}

// Données de démonstration
const initialDemandes: DemandeInscription[] = [
    {
        id: 1,
        nomEtablissement: 'Institut Africain de Management (IAM)',
        emailPro: 'contact@iam-togo.tg',
        telephonePro: '+228 90 12 34 56',
        localisation: 'Lomé, Boulevard du 13 Janvier',
        siteWeb: 'https://www.iam-togo.tg',
        description: 'Institut supérieur de formation en management, commerce international et marketing digital.',
        documentAccreditationUrl: '/documents/accreditation_iam.pdf',
        dateDemande: '2024-02-15',
        statut: 'en_attente',
    },
    {
        id: 2,
        nomEtablissement: 'École Supérieure des Métiers du Numérique (ESMN)',
        emailPro: 'info@esmn.tg',
        telephonePro: '+228 91 23 45 67',
        localisation: 'Lomé, Quartier Tokoin',
        siteWeb: 'https://www.esmn.tg',
        description: 'Formation en développement web, cybersécurité et intelligence artificielle.',
        documentAccreditationUrl: '/documents/accreditation_esmn.pdf',
        dateDemande: '2024-02-14',
        statut: 'en_attente',
    },
    {
        id: 3,
        nomEtablissement: 'Centre de Formation Technique Avancée (CFTA)',
        emailPro: 'admission@cfta.tg',
        telephonePro: '+228 92 34 56 78',
        localisation: 'Kara, Zone Industrielle',
        description: 'Centre spécialisé en formation technique et professionnelle.',
        documentAccreditationUrl: '/documents/accreditation_cfta.pdf',
        dateDemande: '2024-02-13',
        statut: 'en_attente',
    },
    {
        id: 4,
        nomEtablissement: 'Université Privée de Sokodé (UPS)',
        emailPro: 'rectorat@ups.tg',
        telephonePro: '+228 93 45 67 89',
        localisation: 'Sokodé, Avenue de la République',
        siteWeb: 'https://www.ups.tg',
        description: 'Université pluridisciplinaire offrant des formations en sciences, lettres et économie.',
        documentAccreditationUrl: '/documents/accreditation_ups.pdf',
        dateDemande: '2024-02-10',
        statut: 'approuvee',
    },
    {
        id: 5,
        nomEtablissement: 'Institut de Formation Non Accrédité',
        emailPro: 'contact@ifna.tg',
        telephonePro: '+228 94 56 78 90',
        localisation: 'Lomé',
        description: 'Formation générale.',
        documentAccreditationUrl: '/documents/accreditation_ifna.pdf',
        dateDemande: '2024-02-08',
        statut: 'rejetee',
    },
];

const ValidationInscriptions: React.FC = () => {
    const theme = useTheme();
    const [demandes, setDemandes] = useState<DemandeInscription[]>(initialDemandes);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedDemande, setSelectedDemande] = useState<DemandeInscription | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

    // Filtrer les demandes
    const filteredDemandes = demandes.filter((demande) =>
        demande.nomEtablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.emailPro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.localisation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const stats = {
        total: demandes.length,
        enAttente: demandes.filter((d) => d.statut === 'en_attente').length,
        approuvees: demandes.filter((d) => d.statut === 'approuvee').length,
        rejetees: demandes.filter((d) => d.statut === 'rejetee').length,
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (demande: DemandeInscription) => {
        setSelectedDemande(demande);
        setDetailDialogOpen(true);
    };

    const handleOpenConfirmDialog = (demande: DemandeInscription, action: 'approve' | 'reject') => {
        setSelectedDemande(demande);
        setConfirmAction(action);
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = () => {
        if (selectedDemande && confirmAction) {
            setDemandes((prev) =>
                prev.map((d) =>
                    d.id === selectedDemande.id
                        ? { ...d, statut: confirmAction === 'approve' ? 'approuvee' : 'rejetee' }
                        : d
                )
            );
        }
        setConfirmDialogOpen(false);
        setSelectedDemande(null);
        setConfirmAction(null);
    };

    const getStatutLabel = (statut: DemandeInscription['statut']) => {
        switch (statut) {
            case 'en_attente': return 'En attente';
            case 'approuvee': return 'Approuvée';
            case 'rejetee': return 'Rejetée';
            default: return statut;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Box>
            {/* En-tête */}
            <PageHeader
                title="Validation des Inscriptions"
                subtitle="Examinez et validez les demandes d'inscription des établissements"
                icon={<VerifiedUserIcon />}
                iconColor={theme.palette.primary.main}
            />

            {/* Stats rapides */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Total demandes"
                        value={stats.total}
                        icon={<BusinessIcon />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="En attente"
                        value={stats.enAttente}
                        icon={<DescriptionIcon />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Approuvées"
                        value={stats.approuvees}
                        icon={<CheckCircleIcon />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard
                        title="Rejetées"
                        value={stats.rejetees}
                        icon={<CancelIcon />}
                        color="error"
                    />
                </Grid>
            </Grid>

            {/* Barre de recherche */}
            <Card sx={{ mb: 3, borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}>
                <CardContent>
                    <SearchField
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Rechercher par nom, email ou localisation..."
                        fullWidth
                    />
                </CardContent>
            </Card>

            {/* Tableau des demandes */}
            <Card sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Établissement</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Localisation</TableCell>
                                <TableCell>Date demande</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDemandes
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((demande) => (
                                    <TableRow key={demande.id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                                    <BusinessIcon color="primary" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {demande.nomEtablissement}
                                                    </Typography>
                                                    {demande.siteWeb && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {demande.siteWeb}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{demande.emailPro}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {demande.telephonePro}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{demande.localisation}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{formatDate(demande.dateDemande)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <StatusChip status={demande.statut} label={getStatutLabel(demande.statut)} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Voir détails">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewDetails(demande)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {demande.statut === 'en_attente' && (
                                                    <>
                                                        <Tooltip title="Approuver">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => handleOpenConfirmDialog(demande, 'approve')}
                                                            >
                                                                <CheckCircleIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Rejeter">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleOpenConfirmDialog(demande, 'reject')}
                                                            >
                                                                <CancelIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredDemandes.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                />
            </Card>

            {/* Dialog de détails */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedDemande && (
                    <>
                        <DialogTitle>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 56, height: 56 }}>
                                    <BusinessIcon color="primary" sx={{ fontSize: 32 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        {selectedDemande.nomEtablissement}
                                    </Typography>
                                    <StatusChip status={selectedDemande.statut} label={getStatutLabel(selectedDemande.statut)} />
                                </Box>
                            </Stack>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Demande soumise le {formatDate(selectedDemande.dateDemande)}
                                    </Alert>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                            <EmailIcon color="primary" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Email professionnel
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedDemande.emailPro}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                                            <PhoneIcon color="success" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Téléphone
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedDemande.telephonePro}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                                            <LocationOnIcon color="warning" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Localisation
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {selectedDemande.localisation}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                {selectedDemande.siteWeb && (
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                                                <LanguageIcon color="info" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Site web
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {selectedDemande.siteWeb}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Description de l'établissement
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                        {selectedDemande.description}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Card sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}>
                                        <CardContent>
                                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <DescriptionIcon color="action" />
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            Document d'accréditation
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {selectedDemande.documentAccreditationUrl}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<DownloadIcon />}
                                                    size="small"
                                                >
                                                    Télécharger
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button onClick={() => setDetailDialogOpen(false)}>
                                Fermer
                            </Button>
                            {selectedDemande.statut === 'en_attente' && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => {
                                            setDetailDialogOpen(false);
                                            handleOpenConfirmDialog(selectedDemande, 'reject');
                                        }}
                                    >
                                        Rejeter
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => {
                                            setDetailDialogOpen(false);
                                            handleOpenConfirmDialog(selectedDemande, 'approve');
                                        }}
                                    >
                                        Approuver
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Dialog de confirmation */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    {confirmAction === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le rejet'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {confirmAction === 'approve'
                            ? `Êtes-vous sûr de vouloir approuver la demande de "${selectedDemande?.nomEtablissement}" ? Un email sera envoyé à l'établissement avec ses identifiants de connexion.`
                            : `Êtes-vous sûr de vouloir rejeter la demande de "${selectedDemande?.nomEtablissement}" ? L'établissement sera notifié par email.`}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setConfirmDialogOpen(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        color={confirmAction === 'approve' ? 'success' : 'error'}
                        onClick={handleConfirmAction}
                    >
                        {confirmAction === 'approve' ? 'Approuver' : 'Rejeter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ValidationInscriptions;
