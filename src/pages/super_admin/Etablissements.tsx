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
  OpenInNew as OpenInNewIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
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
  const theme = useTheme();
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
        dispatch(showSnackbar({ message: 'Établissement supprimé avec succès', severity: 'success' }));
        loadData();
      } catch {
        dispatch(showSnackbar({ message: 'Erreur lors de la suppression', severity: 'error' }));
      }
    }
    setDeleteDialogOpen(false);
    etablissementToDelete && setEtablissementToDelete(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEtablissement(null);
  };

  const handleModalSuccess = () => {
    loadData();
    handleModalClose();
  };

  const handleViewDetails = (etablissement: Etablissement) => {
    setViewingEtablissement(etablissement);
    setDetailsOpen(true);
  };

  const getTypeChip = (type: TypeEtablissement) => {
    const typeConfig = {
      'Université': { color: 'primary' as const },
      'École': { color: 'secondary' as const },
      'Institut': { color: 'info' as const },
    };
    const config = typeConfig[type];
    return <Chip label={type} color={config.color} size="small" sx={{ fontWeight: 700, borderRadius: '6px' }} />;
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
            Établissements
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Partenariats et structures de formation ScholarWay
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
          Nouvel établissement
        </Button>
      </Box>

      {/* Filtres */}
      <Card
        sx={{
          mb: 4,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Rechercher un établissement..."
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
              sx={{ borderRadius: '10px' }}
            >
              Filtres
            </Button>
            <Tooltip title="Rafraîchir">
              <IconButton onClick={loadData} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Fade in={showFilters} mountOnEnter unmountOnExit>
            <Grid container spacing={3} sx={{ mt: 2, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type d'établissement</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type d'établissement"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    sx={{ borderRadius: '10px' }}
                  >
                    {typeOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Région</InputLabel>
                  <Select
                    value={filters.localisation}
                    label="Région"
                    onChange={(e) => handleFilterChange('localisation', e.target.value)}
                    sx={{ borderRadius: '10px' }}
                  >
                    {localisationOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="text" onClick={handleResetFilters} size="small">
                  Réinitialiser tous les filtres
                </Button>
              </Grid>
            </Grid>
          </Fade>
        </CardContent>
      </Card>

      {/* Tableau */}
      <TableContainer
        component={Card}
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Etablissement</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Localisation</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Site Web</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : etablissements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.3, mb: 2 }} />
                  <Typography color="text.secondary" fontWeight={500}>
                    Aucun établissement ne correspond à votre recherche
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
                      <Typography variant="body2" fontWeight={700}>
                        {etablissement.nom}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: 300,
                        }}
                      >
                        {etablissement.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{getTypeChip(etablissement.type)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{etablissement.localisation}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {etablissement.contact}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {etablissement.siteWeb && (
                      <Link
                        href={etablissement.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: 'primary.main',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Visiter <OpenInNewIcon sx={{ fontSize: 14 }} />
                      </Link>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Détails">
                        <IconButton size="small" color="primary" onClick={() => handleViewDetails(etablissement)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton size="small" color="info" onClick={() => handleEdit(etablissement)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(etablissement)}>
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
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </TableContainer>

      {/* Modals */}
      <EtablissementModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        etablissement={selectedEtablissement}
      />

      <EtablissementDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        etablissement={viewingEtablissement}
        onEdit={(etab) => { setDetailsOpen(false); handleEdit(etab); }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer l'établissement"
        message={`Voulez-vous vraiment retirer "${etablissementToDelete?.nom}" de la plateforme ?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Etablissements;
