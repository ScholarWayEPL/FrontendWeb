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
import { BORDER_RADIUS, SHADOWS } from '../../constants';
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
        dispatch(
          showSnackbar({
            message: 'Programme supprimé avec succès',
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
      Licence: { color: '#2196f3', bg: '#e3f2fd', label: 'Licence (Bac+3)' },
      Master: { color: '#9c27b0', bg: '#f3e5f5', label: 'Master (Bac+5)' },
      Doctorat: { color: '#f44336', bg: '#ffebee', label: 'Doctorat (Bac+8)' },
    };
    return config[niveau];
  };

  // formatCFA importé depuis constants

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
          transition: 'all 0.3s ease-in-out',
          borderRadius: BORDER_RADIUS.md,
          borderTop: `4px solid ${niveauConfig.color}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* En-tête avec niveau */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Chip
              label={niveauConfig.label}
              size="small"
              sx={{
                bgcolor: niveauConfig.bg,
                color: niveauConfig.color,
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
            <Chip
              label={programme.domaine}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>

          {/* Titre du programme */}
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3.6em',
              lineHeight: 1.3,
            }}
          >
            {programme.nomProgramme}
          </Typography>

          {/* Établissement */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {programme.etablissementNom || 'Établissement non spécifié'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Infos clés - Design amélioré */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 1.5,
            mb: 1.5,
          }}>
            {/* Durée */}
            <Box sx={{ 
              p: 1.5, 
              borderRadius: BORDER_RADIUS.md, 
              bgcolor: 'rgba(2, 136, 209, 0.08)',
              border: '1px solid',
              borderColor: 'rgba(2, 136, 209, 0.2)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <DurationIcon sx={{ fontSize: 16, color: 'info.main' }} />
                <Typography variant="caption" color="info.main" fontWeight={500}>
                  Durée
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={700}>
                {programme.duree} an{programme.duree > 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {/* Frais */}
            <Box sx={{ 
              p: 1.5, 
              borderRadius: BORDER_RADIUS.md, 
              bgcolor: programme.fraisScolarite === 0 ? 'rgba(46, 125, 50, 0.08)' : 'rgba(237, 108, 2, 0.08)',
              border: '1px solid',
              borderColor: programme.fraisScolarite === 0 ? 'rgba(46, 125, 50, 0.2)' : 'rgba(237, 108, 2, 0.2)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <MoneyIcon sx={{ fontSize: 16, color: programme.fraisScolarite === 0 ? 'success.main' : 'warning.main' }} />
                <Typography variant="caption" color={programme.fraisScolarite === 0 ? 'success.main' : 'warning.main'} fontWeight={500}>
                  Frais/an
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={700} color={programme.fraisScolarite === 0 ? 'success.main' : 'text.primary'}>
                {formatCFA(programme.fraisScolarite)}
              </Typography>
            </Box>
          </Box>

          {/* Débouchés */}
          <Box sx={{ 
            p: 1.5, 
            borderRadius: BORDER_RADIUS.md, 
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
            mb: 1.5,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <WorkIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
              <Typography variant="caption" color="secondary.main" fontWeight={500}>
                Débouchés
              </Typography>
            </Box>
            <Tooltip title={programme.debouchesProfessionnels}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {programme.debouchesProfessionnels}
              </Typography>
            </Tooltip>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', gap: 1, px: 2, pb: 2, pt: 0 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(programme)}
            sx={{ borderRadius: BORDER_RADIUS.md, textTransform: 'none' }}
          >
            Modifier
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(programme)}
            sx={{ borderRadius: BORDER_RADIUS.md, textTransform: 'none' }}
          >
            Supprimer
          </Button>
        </CardActions>
      </Card>
    );
  };

  const SkeletonCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="rounded" width={100} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%' }} />
        <Skeleton variant="text" sx={{ mt: 2 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Programmes
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Gérez les programmes de formation disponibles sur ScholarWay
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
          sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}
        >
          Ajouter un programme
        </Button>
      </Box>

      {/* Barre de recherche et filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Rechercher un programme, un domaine..."
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
              Filtres {hasActiveFilters && `(${[filters.domaine, filters.niveau].filter(Boolean).length})`}
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
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Domaine</InputLabel>
                    <Select
                      value={filters.domaine}
                      label="Domaine"
                      onChange={(e) => handleFilterChange('domaine', e.target.value)}
                    >
                      {domaineOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Niveau</InputLabel>
                    <Select
                      value={filters.niveau}
                      label="Niveau"
                      onChange={(e) => handleFilterChange('niveau', e.target.value)}
                    >
                      {niveauOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
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
          icon={<SchoolIcon />}
          label={`${pagination.total} programme${pagination.total > 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
        />
        {filters.domaine && (
          <Chip
            label={`Domaine: ${filters.domaine}`}
            onDelete={() => handleFilterChange('domaine', '')}
            color="secondary"
          />
        )}
        {filters.niveau && (
          <Chip
            label={`Niveau: ${filters.niveau}`}
            onDelete={() => handleFilterChange('niveau', '')}
            color="info"
          />
        )}
      </Box>

      {/* Grille de programmes */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SkeletonCard />
              </Grid>
            ))
          : programmes.map((programme) => (
              <Grid item xs={12} sm={6} md={4} key={programme.idProgramme}>
                <ProgrammeCard programme={programme} />
              </Grid>
            ))}
      </Grid>

      {/* Message si aucun résultat */}
      {!loading && programmes.length === 0 && (
        <Card sx={{ py: 8, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun programme trouvé
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {hasActiveFilters
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Commencez par ajouter votre premier programme'}
          </Typography>
          {hasActiveFilters ? (
            <Button variant="outlined" onClick={handleResetFilters}>
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              Ajouter un programme
            </Button>
          )}
        </Card>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Modal Ajouter/Modifier */}
      <ProgrammeModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        programme={selectedProgramme}
      />

      {/* Dialog de confirmation suppression */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer le programme"
        message={`Êtes-vous sûr de vouloir supprimer "${programmeToDelete?.nomProgramme}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default Programmes;
