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
    Menu,
    ListItemIcon,
    ListItemText,
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
    KeyboardArrowDown as ArrowDownIcon,
    Folder as FolderIcon,
    ViewList as ViewListIcon,
} from '@mui/icons-material';
import { PageHeader, SearchField, StatusChip } from '../../components/ui';
import StatCard from '../../components/StatCard';
import { BORDER_RADIUS, AVATAR_SIZES } from '../../constants';
import useCandidatures from '../../hooks/useCandidatures';



const Candidatures: React.FC = () => {
    const theme = useTheme();
    const {
        searchTerm,
        setSearchTerm,
        selectedParcours,
        setSelectedParcours,
        selectedStatut,
        setSelectedStatut,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        selectedCandidat,
        setSelectedCandidat,
        selectedFiliere,
        setSelectedFiliere,
        detailsOpen,
        setDetailsOpen,
        filteredCandidatures,
        stats,
        formatDate,
        calculateAge,
        handleExport,
        getStatutLabel,
        mockParcours,
        mockFilieres,
    } = useCandidatures();

    // Export menu state (UI only)
    const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
    const exportMenuOpen = Boolean(exportMenuAnchor);


    

    return (
        <Box>
            {/* Header */}
            <PageHeader
                title="Candidatures"
                subtitle="Consultez et téléchargez les candidatures reçues"
                icon={<DescriptionIcon />}
                iconColor={theme.palette.info.main}
                action={
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            endIcon={<ArrowDownIcon />}
                            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                            sx={{ borderRadius: BORDER_RADIUS.sm }}
                        >
                            Exporter
                        </Button>
                        <Menu
                            anchorEl={exportMenuAnchor}
                            open={exportMenuOpen}
                            onClose={() => setExportMenuAnchor(null)}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    minWidth: 260,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* Section Excel */}
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={600}>
                                    Excel
                                </Typography>
                            </Box>
                            <MenuItem onClick={() => handleExport('excel', false)}>
                                <ListItemIcon>
                                    <ExcelIcon fontSize="small" sx={{ color: 'success.main' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Liste complète"
                                    secondary="Toutes les candidatures filtrées"
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </MenuItem>
                            <MenuItem onClick={() => handleExport('excel', true)}>
                                <ListItemIcon>
                                    <FolderIcon fontSize="small" sx={{ color: 'success.main' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Groupé par filière"
                                    secondary="Un onglet par filière + récapitulatif"
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </MenuItem>
                            <Divider sx={{ my: 0.5 }} />
                            {/* Section PDF */}
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={600}>
                                    PDF
                                </Typography>
                            </Box>
                            <MenuItem onClick={() => handleExport('pdf', false)}>
                                <ListItemIcon>
                                    <PdfIcon fontSize="small" sx={{ color: 'error.main' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Liste complète"
                                    secondary="Toutes les candidatures filtrées"
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </MenuItem>
                            <MenuItem onClick={() => handleExport('pdf', true)}>
                                <ListItemIcon>
                                    <ViewListIcon fontSize="small" sx={{ color: 'error.main' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Groupé par filière"
                                    secondary="Une page par filière avec en-tête"
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </MenuItem>
                        </Menu>
                    </Box>
                }
            />

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Total candidatures" value={stats.total} icon={<PersonIcon />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="En attente" value={stats.enAttente} icon={<HourglassIcon />} color="warning" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Acceptées" value={stats.acceptees} icon={<CheckCircleIcon />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard title="Refusées" value={stats.refusees} icon={<CancelIcon />} color="error" />
                </Grid>
            </Grid>

            {/* Filtres */}
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    mb: 3,
                    bgcolor: alpha(theme.palette.action.hover, 0.5),
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
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Parcours</InputLabel>
                            <Select
                                value={selectedParcours}
                                label="Parcours"
                                onChange={(e) => setSelectedParcours(e.target.value)}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: 'background.paper',
                                }}
                            >
                                {mockParcours.map((p) => (
                                    <MenuItem key={p} value={p}>{p}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Filière</InputLabel>
                            <Select
                                value={selectedFiliere}
                                label="Filière"
                                onChange={(e) => setSelectedFiliere(e.target.value)}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: 'background.paper',
                                }}
                            >
                                {mockFilieres.map((f) => (
                                    <MenuItem key={f} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 170 }}>
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={selectedStatut}
                                label="Statut"
                                onChange={(e) => setSelectedStatut(e.target.value)}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <MenuItem value="Tous">Tous les statuts</MenuItem>
                                <MenuItem value="SOUMISE">Soumise</MenuItem>
                                <MenuItem value="EN_COURS">En cours</MenuItem>
                                <MenuItem value="ACCEPTEE">Acceptées</MenuItem>
                                <MenuItem value="REFUSEE">Refusées</MenuItem>
                                <MenuItem value="EN_ATTENTE_CONCOURS">Attente concours</MenuItem>
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
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Parcours / Filière</TableCell>
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
                                            <Typography variant="body2" fontWeight={500}>
                                                {candidature.parcours}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {candidature.filiere}
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
                                    <Box>
                                        <Typography variant="body2">{selectedCandidat.parcours} — {selectedCandidat.filiere}</Typography>
                                        <Typography variant="caption" color="text.secondary">{selectedCandidat.domaine}</Typography>
                                    </Box>
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
