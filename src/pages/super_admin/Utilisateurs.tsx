import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
  CircularProgress,
  Avatar,
  Stack,
  alpha,
  useTheme,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchBacheliers,
  fetchSeries,
  setFilters,
  resetFilters,
  deleteBachelier,
  createBachelier,
  updateBachelier,
} from '../../store/slices/usersSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import type { Bachelier } from '../../types';
import UtilisateurModal from '../../components/UtilisateurModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCFA } from '../../constants';
import UtilisateurDetails from '../../components/UtilisateurDetails';

const Utilisateurs: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { bacheliers, loading, pagination, filters, series } = useAppSelector(
    (state) => state.users
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUtilisateur, setSelectedUtilisateur] = useState<Bachelier | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewingUtilisateur, setViewingUtilisateur] = useState<Bachelier | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [utilisateurToDelete, setUtilisateurToDelete] = useState<Bachelier | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadData = useCallback(() => {
    dispatch(
      fetchBacheliers({
        page: page + 1,
        limit: rowsPerPage,
        filters,
      })
    );
  }, [dispatch, page, rowsPerPage, filters]);

  useEffect(() => {
    loadData();
    dispatch(fetchSeries());
  }, [loadData, dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: event.target.value }));
    setPage(0);
  };

  const handleFilterChange = (key: 'serieBac', value: string) => {
    dispatch(setFilters({ [key]: value }));
    setPage(0);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAdd = () => {
    setSelectedUtilisateur(null);
    setModalOpen(true);
  };

  const handleEdit = (utilisateur: Bachelier) => {
    setSelectedUtilisateur(utilisateur);
    setModalOpen(true);
  };

  const handleDeleteClick = (utilisateur: Bachelier) => {
    setUtilisateurToDelete(utilisateur);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (utilisateurToDelete) {
      try {
        await dispatch(deleteBachelier(utilisateurToDelete.idUtilisateur)).unwrap();
        dispatch(showSnackbar({ message: 'Utilisateur supprimé avec succès', severity: 'success' }));
        loadData();
      } catch {
        dispatch(showSnackbar({ message: 'Erreur lors de la suppression', severity: 'error' }));
      }
    }
    setDeleteDialogOpen(false);
    setUtilisateurToDelete(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUtilisateur(null);
  };

  const handleModalSuccess = async (data: Partial<Bachelier>) => {
    try {
      if (selectedUtilisateur) {
        await dispatch(updateBachelier({ id: selectedUtilisateur.idUtilisateur, data })).unwrap();
        dispatch(showSnackbar({ message: 'Utilisateur modifié avec succès', severity: 'success' }));
      } else {
        await dispatch(createBachelier(data as Omit<Bachelier, 'idUtilisateur' | 'dateCreation'>)).unwrap();
        dispatch(showSnackbar({ message: 'Utilisateur créé avec succès', severity: 'success' }));
      }
      handleModalClose();
      loadData();
    } catch {
      dispatch(showSnackbar({ message: 'Une erreur est survenue', severity: 'error' }));
    }
  };

  const getSerieColor = (serie: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
      C: 'primary',
      D: 'success',
      A4: 'secondary',
      G2: 'warning',
      E: 'info',
      F1: 'error',
      F2: 'primary',
      F3: 'success',
    };
    return colors[serie] || 'default';
  };

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-TG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const hasActiveFilters = Boolean(filters.search || filters.serieBac);

  const serieOptions = [
    { value: '', label: 'Toutes les séries' },
    ...series.map((s) => ({ value: s, label: s })),
  ];

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* En-tête Dynamique */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
            Utilisateurs
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Gestion centralisée des bacheliers ScholarWay
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            px: 3,
            py: 1.2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
          }}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      {/* Barre de Filtres Premium */}
      <Card
        sx={{
          mb: 4,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Rechercher par nom, email..."
              value={filters.search}
              onChange={handleSearchChange}
              size="small"
              fullWidth
              sx={{
                maxWidth: { sm: 400 },
                '& .MuiOutlinedInput-root': { borderRadius: '12px' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderRadius: '10px',
                borderColor: showFilters ? 'primary.main' : 'divider',
                color: showFilters ? 'white' : 'text.primary',
                '&:hover': { borderColor: 'primary.main' }
              }}
            >
              Filtres {hasActiveFilters && `(Actifs)`}
            </Button>

            <Tooltip title="Rafraîchir les données">
              <IconButton
                onClick={loadData}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Filtres Avancés (Fade) */}
          <Fade in={showFilters} mountOnEnter unmountOnExit>
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="serie-label">Série du Bac</InputLabel>
                    <Select
                      labelId="serie-label"
                      value={filters.serieBac}
                      label="Série du Bac"
                      onChange={(e) => handleFilterChange('serieBac', e.target.value)}
                      sx={{ borderRadius: '10px' }}
                    >
                      {serieOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<CloseIcon />}
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                    sx={{ height: 40, borderRadius: '10px' }}
                  >
                    Réinitialiser
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </CardContent>
      </Card>

      {/* Statistiques Rapides */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
        <Chip
          icon={<PeopleIcon sx={{ color: 'white !important' }} />}
          label={`${pagination.total} utilisateur${pagination.total > 1 ? 's' : ''}`}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 700,
            borderRadius: '8px'
          }}
        />
        {filters.serieBac && (
          <Chip
            label={`Série: ${filters.serieBac}`}
            onDelete={() => handleFilterChange('serieBac', '')}
            variant="outlined"
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          />
        )}
      </Stack>

      {/* Table de Données Premium */}
      <TableContainer
        component={Card}
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Utilisateur</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Série</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Moyenne</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Budget max</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Inscription</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>
                    Chargement de l'espace utilisateurs...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : bacheliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" color="text.secondary">
                    Aucun résultat trouvé
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Ajustez vos filtres ou lancez une nouvelle recherche
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              bacheliers.map((bachelier) => (
                <TableRow
                  key={bachelier.idUtilisateur}
                  hover
                  sx={{
                    transition: 'background-color 0.2s ease',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        }}
                      >
                        {getInitials(bachelier.nom, bachelier.prenom)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>
                          {bachelier.prenom} {bachelier.nom}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {bachelier.serieBac} • ID: #{bachelier.idUtilisateur}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.3}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{bachelier.email}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{bachelier.telephone}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bachelier.serieBac}
                      size="small"
                      color={getSerieColor(bachelier.serieBac)}
                      sx={{ fontWeight: 700, borderRadius: '6px', fontSize: '0.65rem' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'inline-flex',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        bgcolor: bachelier.moyenneBac >= 14 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                        color: bachelier.moyenneBac >= 14 ? 'success.main' : 'warning.main'
                      }}
                    >
                      {bachelier.moyenneBac}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700} color="text.primary">
                      {formatCFA(bachelier.budgetMax)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {formatDate(bachelier.dateCreation)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Détails complets">
                        <IconButton size="small" onClick={() => { setViewingUtilisateur(bachelier); setDetailsOpen(true); }} sx={{ color: 'primary.main' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton size="small" onClick={() => handleEdit(bachelier)} sx={{ color: 'info.main' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" onClick={() => handleDeleteClick(bachelier)} sx={{ color: 'error.main' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination.total}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </TableContainer>

      {/* Modals & Dialogs */}
      <UtilisateurModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        utilisateur={selectedUtilisateur}
      />

      <UtilisateurDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        utilisateur={viewingUtilisateur}
        onEdit={(user) => { setDetailsOpen(false); handleEdit(user); }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmation de suppression"
        message={`Voulez-vous vraiment supprimer cet utilisateur ? Cette action effacera définitivement ses données.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Utilisateurs;
