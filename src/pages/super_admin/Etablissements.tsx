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
  Link,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BORDER_RADIUS, SHADOWS } from '../../constants';
import {
  fetchEtablissements,
  setFilters,
  resetFilters,
  deleteEtablissement,
} from '../../store/slices/etablissementsSlice';
import { showSnackbar } from '../../store/slices/uiSlice';
import type { Etablissement, EtablissementFilters, TypeEtablissement } from '../../types';
import EtablissementModal from '../../components/EtablissementModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { REGION_OPTIONS } from '../../constants';
import EtablissementDetails from '../../components/EtablissementDetails';

const typeOptions: { value: string; label: string }[] = [
  { value: '', label: 'Tous les types' },
  { value: 'Université', label: 'Université' },
  { value: 'École', label: 'École' },
  { value: 'Institut', label: 'Institut' },
];

const localisationOptions = [
  { value: '', label: 'Toutes les régions' },
  ...REGION_OPTIONS,
];

const Etablissements: React.FC = () => {
  const dispatch = useAppDispatch();
  const { etablissements, loading, pagination, filters } = useAppSelector(
    (state) => state.etablissements
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEtablissement, setSelectedEtablissement] = useState<Etablissement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [viewingEtablissement, setViewingEtablissement] = useState<Etablissement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [etablissementToDelete, setEtablissementToDelete] = useState<Etablissement | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const loadData = useCallback(() => {
    dispatch(
      fetchEtablissements({
        page: pagination.page,
        limit: pagination.limit,
        filters,
      })
    );
  }, [dispatch, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewDetails = (etablissement: Etablissement) => {
    setViewingEtablissement(etablissement);
    setDetailsOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: event.target.value }));
  };

  const handleFilterChange = (key: keyof EtablissementFilters, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(
      fetchEtablissements({
        page: newPage + 1,
        limit: pagination.limit,
        filters,
      })
    );
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      fetchEtablissements({
        page: 1,
        limit: parseInt(event.target.value, 10),
        filters,
      })
    );
  };

  const handleAdd = () => {
    setSelectedEtablissement(null);
    setModalOpen(true);
  };

  const handleEdit = (etablissement: Etablissement) => {
    setSelectedEtablissement(etablissement);
    setModalOpen(true);
  };

  const handleDeleteClick = (etablissement: Etablissement) => {
    setEtablissementToDelete(etablissement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (etablissementToDelete) {
      try {
        await dispatch(deleteEtablissement(etablissementToDelete.idEtablissement)).unwrap();
        dispatch(
          showSnackbar({
            message: 'Établissement supprimé avec succès',
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
    setEtablissementToDelete(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEtablissement(null);
  };

  const handleModalSuccess = () => {
    loadData();
    handleModalClose();
  };

  const getTypeChip = (type: TypeEtablissement) => {
    const typeConfig = {
      'Université': { color: 'primary' as const },
      'École': { color: 'secondary' as const },
      'Institut': { color: 'info' as const },
    };
    const config = typeConfig[type];
    return <Chip label={type} color={config.color} size="small" />;
  };

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Établissements
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Gérez les établissements partenaires de ScholarWay
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
          sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}
        >
          Ajouter un établissement
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Rechercher un établissement..."
              value={filters.search}
              onChange={handleSearchChange}
              size="small"
              sx={{ minWidth: 300 }}
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
              Filtres
            </Button>
            <Tooltip title="Rafraîchir">
              <IconButton onClick={loadData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Filtres avancés */}
          {showFilters && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    {typeOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Région</InputLabel>
                  <Select
                    value={filters.localisation}
                    label="Région"
                    onChange={(e) => handleFilterChange('localisation', e.target.value)}
                  >
                    {localisationOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="text" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Localisation</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Site Web</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : etablissements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Aucun établissement trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                etablissements.map((etablissement: Etablissement) => (
                  <TableRow
                    key={etablissement.idEtablissement}
                    hover
                    sx={{ '&:last-child td': { border: 0 } }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {etablissement.nom}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxWidth: 250,
                          }}
                        >
                          {etablissement.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getTypeChip(etablissement.type)}</TableCell>
                    <TableCell>{etablissement.localisation}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {etablissement.contact}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {etablissement.siteWeb && (
                        <Link
                          href={etablissement.siteWeb}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          Visiter <OpenInNewIcon fontSize="small" />
                        </Link>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Voir détails">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewDetails(etablissement)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(etablissement)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(etablissement)}
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
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Card>

      {/* Modal Ajouter/Modifier */}
      <EtablissementModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        etablissement={selectedEtablissement}
      />

      {/* Modal Détails */}
      <EtablissementDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        etablissement={viewingEtablissement}
        onEdit={(etab) => {
          setDetailsOpen(false);
          handleEdit(etab);
        }}
      />

      {/* Dialog de confirmation suppression */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer l'établissement"
        message={`Êtes-vous sûr de vouloir supprimer "${etablissementToDelete?.nom}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Etablissements;
