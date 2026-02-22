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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BORDER_RADIUS, SHADOWS } from '../../constants';
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

  const handleViewDetails = (utilisateur: Bachelier) => {
    setViewingUtilisateur(utilisateur);
    setDetailsOpen(true);
  };

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
        await dispatch(deleteBachelier(utilisateurToDelete.idBachelier)).unwrap();
        dispatch(
          showSnackbar({
            message: 'Utilisateur supprimé avec succès',
            severity: 'success',
          })
        );
      } catch {
        dispatch(
          showSnackbar({
            message: 'Erreur lors de la suppression',
            severity: 'error',
          })
        );
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
        await dispatch(updateBachelier({ id: selectedUtilisateur.idBachelier, data })).unwrap();
        dispatch(showSnackbar({ message: 'Utilisateur modifié avec succès', severity: 'success' }));
      } else {
        await dispatch(createBachelier(data as Omit<Bachelier, 'idBachelier' | 'dateInscription'>)).unwrap();
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

  const hasActiveFilters = filters.search || filters.serieBac;

  const serieOptions = [
    { value: '', label: 'Toutes les séries' },
    ...series.map((s) => ({ value: s, label: s })),
  ];

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Utilisateurs
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Gérez les bacheliers inscrits sur ScholarWay
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
          sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Rechercher par nom, prénom ou email..."
              value={filters.search}
              onChange={handleSearchChange}
              size="small"
              sx={{ flexGrow: 1, minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtres {hasActiveFilters && `(${filters.serieBac ? 1 : 0})`}
            </Button>
            <Tooltip title="Rafraîchir">
              <IconButton onClick={loadData} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Filtres avancés */}
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Série du Bac</InputLabel>
                    <Select
                      value={filters.serieBac}
                      label="Série du Bac"
                      onChange={(e) => handleFilterChange('serieBac', e.target.value)}
                    >
                      {serieOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<CloseIcon />}
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                  >
                    Réinitialiser
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Stats rapides */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<PeopleIcon />}
          label={`${pagination.total} utilisateur${pagination.total > 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
        {filters.serieBac && (
          <Chip
            label={`Série: ${filters.serieBac}`}
            onDelete={() => handleFilterChange('serieBac', '')}
            color="secondary"
          />
        )}
      </Box>

      {/* Tableau */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bac</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Moyenne
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Budget max
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Inscription</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Chargement des utilisateurs...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : bacheliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <PeopleIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      Aucun utilisateur trouvé
                    </Typography>
                    {hasActiveFilters && (
                      <Button
                        variant="text"
                        onClick={handleResetFilters}
                        sx={{ mt: 1 }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                bacheliers.map((bachelier) => (
                  <TableRow
                    key={bachelier.idBachelier}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getInitials(bachelier.nom, bachelier.prenom)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {bachelier.prenom} {bachelier.nom}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {bachelier.objectifsProfessionnels.substring(0, 40)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{bachelier.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary">
                            {bachelier.telephone}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<SchoolIcon />}
                        label={bachelier.serieBac}
                        size="small"
                        color={getSerieColor(bachelier.serieBac)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${bachelier.moyenneBac}/20`}
                        size="small"
                        sx={{
                          bgcolor:
                            bachelier.moyenneBac >= 16
                              ? 'success.light'
                              : bachelier.moyenneBac >= 14
                              ? 'info.light'
                              : bachelier.moyenneBac >= 12
                              ? 'warning.light'
                              : 'grey.200',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatCFA(bachelier.budgetMax)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(bachelier.dateInscription)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Voir détails">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewDetails(bachelier)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(bachelier)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(bachelier)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Card>

      {/* Modal Ajouter/Modifier */}
      <UtilisateurModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        utilisateur={selectedUtilisateur}
      />

      {/* Modal Détails */}
      <UtilisateurDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        utilisateur={viewingUtilisateur}
        onEdit={(user) => {
          setDetailsOpen(false);
          handleEdit(user);
        }}
      />

      {/* Dialog de confirmation suppression */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer "${utilisateurToDelete?.prenom} ${utilisateurToDelete?.nom}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Utilisateurs;
