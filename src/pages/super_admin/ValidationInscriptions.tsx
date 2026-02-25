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
    Fade,
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
import { PageHeader, SearchField, StatusChip } from '../../components/ui';
import StatCard from '../../components/StatCard';

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
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            {/* En-tête */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUserIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    Validation des Inscriptions
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Examinez et validez les demandes d'accès des nouveaux établissements ScholarWay.
                </Typography>
            </Box>

            {/* Stats rapides */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Total Demandes" value={stats.total} icon={<BusinessIcon />} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="En attente" value={stats.enAttente} icon={<DescriptionIcon />} color="warning" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Approuvées" value={stats.approuvees} icon={<CheckCircleIcon />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Rejetées" value={stats.rejetees} icon={<CancelIcon />} color="error" />
                </Grid>
            </Grid>

            {/* Filtres */}
            <Card sx={{ mb: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                    <SearchField
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Rechercher un établissement, une ville ou un email..."
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </CardContent>
            </Card>

            {/* Liste des demandes */}
            <TableContainer component={Card} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Etablissement</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Localisation</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Statut</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDemandes
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((demande) => (
                                <TableRow key={demande.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                                                {demande.nomEtablissement.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={700}>
                                                    {demande.nomEtablissement}
                                                </Typography>
                                                {demande.siteWeb && (
                                                    <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                                        {demande.siteWeb.replace('https://', '')}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>{demande.emailPro}</Typography>
                                        <Typography variant="caption" color="text.secondary">{demande.telephonePro}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{demande.localisation}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{formatDate(demande.dateDemande)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <StatusChip status={demande.statut} label={getStatutLabel(demande.statut)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Examiner le dossier">
                                                <IconButton size="small" sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }} onClick={() => handleViewDetails(demande)}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            {demande.statut === 'en_attente' && (
                                                <>
                                                    <Tooltip title="Approuver">
                                                        <IconButton size="small" sx={{ color: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.05) }} onClick={() => handleOpenConfirmDialog(demande, 'approve')}>
                                                            <CheckCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Rejeter">
                                                        <IconButton size="small" sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }} onClick={() => handleOpenConfirmDialog(demande, 'reject')}>
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
                <TablePagination
                    component="div"
                    count={filteredDemandes.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                />
            </TableContainer>

            {/* Dialog de détails Premium */}
            <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', backgroundImage: 'none' } }}>
                {selectedDemande && (
                    <>
                        <DialogTitle sx={{ p: 4, pb: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 64, height: 64, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
                                    <BusinessIcon color="primary" sx={{ fontSize: 36 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
                                        {selectedDemande.nomEtablissement}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                        <StatusChip status={selectedDemande.statut} label={getStatutLabel(selectedDemande.statut)} />
                                        <Typography variant="caption" sx={{ color: 'text.disabled', alignSelf: 'center' }}>
                                            Demande #INS-{selectedDemande.id}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                        </DialogTitle>
                        <DialogContent sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Alert severity="info" variant="outlined" icon={<DescriptionIcon />} sx={{ borderRadius: '12px', bgcolor: alpha(theme.palette.info.main, 0.02) }}>
                                        Dossier soumis le <strong>{formatDate(selectedDemande.dateDemande)}</strong>. Veuillez vérifier l'accréditation avant toute validation.
                                    </Alert>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 800 }}>Informations de contact</Typography>
                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main', width: 32, height: 32 }}><EmailIcon sx={{ fontSize: 18 }} /></Avatar>
                                            <Typography variant="body2" fontWeight={600}>{selectedDemande.emailPro}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar size="small" sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), color: 'success.main', width: 32, height: 32 }}><PhoneIcon sx={{ fontSize: 18 }} /></Avatar>
                                            <Typography variant="body2" fontWeight={600}>{selectedDemande.telephonePro}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar size="small" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), color: 'warning.main', width: 32, height: 32 }}><LocationOnIcon sx={{ fontSize: 18 }} /></Avatar>
                                            <Typography variant="body2" fontWeight={600}>{selectedDemande.localisation}</Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 800 }}>Preuve d'accréditation</Typography>
                                    <Box sx={{ mt: 2, p: 3, borderRadius: '16px', border: '1px dashed', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), textAlign: 'center' }}>
                                        <DescriptionIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1, opacity: 0.5 }} />
                                        <Typography variant="body2" fontWeight={700} display="block">Certificat d'Homologation</Typography>
                                        <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 2 }}>PDF - 2.4 MB</Typography>
                                        <Button variant="contained" size="small" startIcon={<DownloadIcon />} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                                            Visualiser le PDF
                                        </Button>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ mb: 3 }} />
                                    <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 800 }}>Description de l'établissement</Typography>
                                    <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.8, bgcolor: alpha(theme.palette.background.default, 0.3), p: 2, borderRadius: '12px' }}>
                                        {selectedDemande.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 4, pt: 0 }}>
                            <Button onClick={() => setDetailDialogOpen(false)} sx={{ fontWeight: 700, px: 3 }}>Fermer</Button>
                            <Box sx={{ flexGrow: 1 }} />
                            {selectedDemande.statut === 'en_attente' && (
                                <Stack direction="row" spacing={2}>
                                    <Button variant="outlined" color="error" startIcon={<CancelIcon />} sx={{ borderRadius: '10px', fontWeight: 700 }}
                                        onClick={() => { setDetailDialogOpen(false); handleOpenConfirmDialog(selectedDemande, 'reject'); }}>
                                        Rejeter le dossier
                                    </Button>
                                    <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} sx={{ borderRadius: '10px', fontWeight: 700, boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.25)}` }}
                                        onClick={() => { setDetailDialogOpen(false); handleOpenConfirmDialog(selectedDemande, 'approve'); }}>
                                        Valider l'établissement
                                    </Button>
                                </Stack>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                title={confirmAction === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le rejet'}
                message={confirmAction === 'approve'
                    ? `Souhaitez-vous valider l'entrée de "${selectedDemande?.nomEtablissement}" sur ScholarWay ? Un email d'activation sera envoyé.`
                    : `Confirmez-vous le rejet de cette demande ? L'établissement sera informé par email.`
                }
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmDialogOpen(false)}
            />
        </Box>
    );
};

export default ValidationInscriptions;
