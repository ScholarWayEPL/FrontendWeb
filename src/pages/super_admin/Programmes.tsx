import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
  Skeleton,
  Pagination,
  Divider,
  Avatar,
  useTheme,
  alpha,
  Stack,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  AccessTime as DurationIcon,
  AccountBalanceWallet as MoneyIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { formatCFA } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchProgrammes,
  fetchDomaines,
  setFilters,
  resetFilters,
  deleteProgramme,
} from '../../store/slices/programmesSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import type { Programme, NiveauProgramme, ProgrammeFilters } from '../../types';
import ProgrammeModal from '../../components/ProgrammeModal';
import ConfirmDialog from '../../components/ConfirmDialog';

const niveauOptions: { value: string; label: string }[] = [
  { value: '', label: 'Tous les niveaux' },
  { value: 'Licence', label: 'Licence' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorat', label: 'Doctorat' },
];

const Programmes: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { programmes, loading, pagination, filters, domaines } = useAppSelector(
    (state) => state.programmes
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programmeToDelete, setProgrammeToDelete] = useState<Programme | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const loadData = useCallback(() => {
    dispatch(
      fetchProgrammes({
        page: currentPage,
        limit: pageSize,
        filters,
      })
    );
  }, [dispatch, currentPage, filters]);

  useEffect(() => {
    loadData();
    dispatch(fetchDomaines());
  }, [loadData, dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: event.target.value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof ProgrammeFilters, value: string) => {
    dispatch(setFilters({ [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setSelectedProgramme(null);
    setModalOpen(true);
  };

  const handleEdit = (programme: Programme) => {
    setSelectedProgramme(programme);
    setModalOpen(true);
  };

  const handleDeleteClick = (programme: Programme) => {
    setProgrammeToDelete(programme);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (programmeToDelete) {
      try {
        await dispatch(deleteProgramme(programmeToDelete.idProgramme)).unwrap();
        dispatch(showSnackbar({ message: 'Programme supprimé avec succès', severity: 'success' }));
        loadData();
      } catch {
        dispatch(showSnackbar({ message: 'Erreur lors de la suppression', severity: 'error' }));
      }
    }
    setDeleteDialogOpen(false);
    setProgrammeToDelete(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProgramme(null);
  };

  const handleModalSuccess = () => {
    loadData();
    handleModalClose();
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const getNiveauConfig = (niveau: NiveauProgramme) => {
    const config = {
      Licence: { color: theme.palette.primary.main, label: 'Licence (Bac+3)' },
      Master: { color: theme.palette.secondary.main, label: 'Master (Bac+5)' },
      Doctorat: { color: theme.palette.error.main, label: 'Doctorat (Bac+8)' },
    };
    return config[niveau] || { color: theme.palette.text.secondary, label: niveau };
  };

  const domaineOptions = [
    { value: '', label: 'Tous les domaines' },
    ...domaines.map((d: string) => ({ value: d, label: d })),
  ];

  const hasActiveFilters = filters.search || filters.domaine || filters.niveau;

  const ProgrammeCard: React.FC<{ programme: Programme }> = ({ programme }) => {
    const niveauConfig = getNiveauConfig(programme.niveau);

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '24px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: theme.palette.mode === 'dark' ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.06)',
            borderColor: alpha(niveauConfig.color, 0.3),
          },
        }}
      >
        <Box sx={{ height: 6, width: '100%', bgcolor: alpha(niveauConfig.color, 0.5) }} />

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
            <Chip
              label={niveauConfig.label}
              size="small"
              sx={{
                bgcolor: alpha(niveauConfig.color, 0.1),
                color: niveauConfig.color,
                fontWeight: 800,
                fontSize: '0.65rem',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>{programme.domaine}</Typography>
          </Stack>

          <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5, letterSpacing: '-0.01em', lineHeight: 1.3, minHeight: '2.6em' }}>
            {programme.nomProgramme}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
            <Avatar sx={{ width: 20, height: 20, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
              <BusinessIcon sx={{ fontSize: 12 }} />
            </Avatar>
            <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
              {programme.etablissementNom || 'Établissement Admin'}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2.5, opacity: 0.5 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <DurationIcon sx={{ fontSize: 14, color: 'info.main' }} />
                  <Typography variant="caption" color="info.main" fontWeight={800} textTransform="uppercase">Durée</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={800}>{programme.duree} an{programme.duree > 1 ? 's' : ''}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.1)}` }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <MoneyIcon sx={{ fontSize: 14, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main" fontWeight={800} textTransform="uppercase">Scolarité</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={800}>{formatCFA(programme.fraisScolarite)}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2.5, p: 2, borderRadius: '16px', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <WorkIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
              <Typography variant="caption" color="secondary.main" fontWeight={800} textTransform="uppercase">Débouchés</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3em' }}>
              {programme.debouchesProfessionnels}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
          <Button size="small" variant="text" startIcon={<EditIcon />} onClick={() => handleEdit(programme)} sx={{ borderRadius: '10px', fontWeight: 700 }}>Modifier</Button>
          <Button size="small" variant="text" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(programme)} sx={{ borderRadius: '10px', fontWeight: 700 }}>Supprimer</Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>Programmes</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Gérez le catalogue des formations ScholarWay</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ px: 3, py: 1.2, borderRadius: '12px', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}` }}
        >
          Nouveau Programme
        </Button>
      </Box>

      {/* Barre de recherche & Filtres */}
      <Card sx={{ mb: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Rechercher un programme, domaine..."
              value={filters.search}
              onChange={handleSearchChange}
              size="small"
              fullWidth
              sx={{ maxWidth: { sm: 400 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="primary" fontSize="small" /></InputAdornment>) }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button variant={showFilters ? 'contained' : 'outlined'} startIcon={<FilterIcon />} onClick={() => setShowFilters(!showFilters)} sx={{ borderRadius: '10px' }}>Filtres</Button>
            <Tooltip title="Actualiser"><IconButton onClick={loadData} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}><RefreshIcon fontSize="small" /></IconButton></Tooltip>
          </Stack>

          <Fade in={showFilters} mountOnEnter unmountOnExit>
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small"><InputLabel>Domaine d'études</InputLabel>
                    <Select value={filters.domaine} label="Domaine d'études" onChange={(e) => handleFilterChange('domaine', e.target.value)} sx={{ borderRadius: '10px' }}>
                      {domaineOptions.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small"><InputLabel>Niveau académique</InputLabel>
                    <Select value={filters.niveau} label="Niveau académique" onChange={(e) => handleFilterChange('niveau', e.target.value)} sx={{ borderRadius: '10px' }}>
                      {niveauOptions.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}><Button fullWidth variant="text" startIcon={<CloseIcon />} onClick={handleResetFilters} disabled={!hasActiveFilters} sx={{ borderRadius: '10px', height: 40 }}>Reset</Button></Grid>
              </Grid>
            </Box>
          </Fade>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {loading ? Array.from({ length: 6 }).map((_, i) => (<Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={340} sx={{ borderRadius: '24px' }} /></Grid>))
          : programmes.map((p) => (<Grid item xs={12} sm={6} md={4} key={p.idProgramme}><ProgrammeCard programme={p} /></Grid>))}
      </Grid>

      {!loading && programmes.length === 0 && (
        <Box sx={{ py: 10, textAlign: 'center', bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: '24px', border: '1px dashed', borderColor: 'divider' }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'text.disabled', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Aucun programme ne correspond</Typography>
          <Button variant="text" sx={{ mt: 1 }} onClick={handleResetFilters}>Réinitialiser les filtres</Button>
        </Box>
      )}

      {!loading && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination count={pagination.totalPages} page={currentPage} onChange={handlePageChange} color="primary" sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: '8px' } }} />
        </Box>
      )}

      <ProgrammeModal open={modalOpen} onClose={handleModalClose} onSuccess={handleModalSuccess} programme={selectedProgramme} />
      <ConfirmDialog open={deleteDialogOpen} title="Supprimer le programme" message={`Voulez-vous vraiment retirer "${programmeToDelete ? programmeToDelete.nomProgramme : ''}" du catalogue ?`} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteDialogOpen(false)} />
    </Box>
  );
};

export default Programmes;
