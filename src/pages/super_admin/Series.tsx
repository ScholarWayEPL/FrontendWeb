import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    alpha,
    useTheme,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { seriesApi, type SerieBac } from '../../api/series';
import { useAppDispatch } from '../../store/hooks';
import { showSnackbar } from '../../store/slices/uiSlice';
import { PageHeader } from '../../components/ui';

const SeriesManagement: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    
    const [series, setSeries] = useState<SerieBac[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPays, setSelectedPays] = useState('TG');
    
    const [formData, setFormData] = useState<SerieBac>({
        nomSerie: '',
        pays: 'TG',
        description: ''
    });

    const loadSeries = async () => {
        setLoading(true);
        try {
            const data = await seriesApi.getByPays(selectedPays);
            setSeries(data);
        } catch (error) {
            dispatch(showSnackbar({ message: 'Erreur lors du chargement des séries', severity: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSeries();
    }, [selectedPays]);

    const handleCreate = async () => {
        if (!formData.nomSerie) return;
        try {
            await seriesApi.create(formData);
            dispatch(showSnackbar({ message: 'Série créée avec succès', severity: 'success' }));
            setOpenDialog(false);
            setFormData({ nomSerie: '', pays: selectedPays, description: '' });
            loadSeries();
        } catch (error) {
            dispatch(showSnackbar({ message: 'Erreur lors de la création', severity: 'error' }));
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Supprimer cette série ?')) return;
        try {
            await seriesApi.delete(id);
            dispatch(showSnackbar({ message: 'Série supprimée', severity: 'success' }));
            loadSeries();
        } catch (error) {
            dispatch(showSnackbar({ message: 'Erreur lors de la suppression', severity: 'error' }));
        }
    };

    return (
        <Box>
            <PageHeader 
                title="Gestion des Séries du BAC" 
                subtitle="Configurez les séries disponibles par pays"
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Nouvelle Série
                    </Button>
                }
            />

            <Card sx={{ mt: 3, borderRadius: 2 }}>
                <CardContent>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Pays</InputLabel>
                            <Select
                                value={selectedPays}
                                label="Pays"
                                onChange={(e) => setSelectedPays(e.target.value)}
                            >
                                <MenuItem value="BJ">Bénin</MenuItem>
                                <MenuItem value="TG">Togo</MenuItem>
                                <MenuItem value="CI">Côte d'Ivoire</MenuItem>
                                <MenuItem value="SN">Sénégal</MenuItem>
                            </Select>
                        </FormControl>
                        <IconButton onClick={loadSeries} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Nom de la Série</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Pays</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={24} sx={{ my: 2 }} /></TableCell></TableRow>
                                ) : series.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} align="center">Aucune série trouvée pour ce pays</TableCell></TableRow>
                                ) : (
                                    series.map((serie) => (
                                        <TableRow key={serie.id}>
                                            <TableCell sx={{ fontWeight: 600 }}>{serie.nomSerie}</TableCell>
                                            <TableCell>{serie.pays}</TableCell>
                                            <TableCell>{serie.description}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Supprimer">
                                                    <IconButton color="error" onClick={() => serie.id && handleDelete(serie.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Ajouter une série du BAC</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Nom de la série"
                            fullWidth
                            value={formData.nomSerie}
                            onChange={(e) => setFormData({ ...formData, nomSerie: e.target.value })}
                            placeholder="Ex: C, D, A1, F4..."
                        />
                        <FormControl fullWidth>
                            <InputLabel>Pays</InputLabel>
                            <Select
                                value={formData.pays}
                                label="Pays"
                                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                            >
                                <MenuItem value="BJ">Bénin</MenuItem>
                                <MenuItem value="TG">Togo</MenuItem>
                                <MenuItem value="CI">Côte d'Ivoire</MenuItem>
                                <MenuItem value="SN">Sénégal</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                    <Button variant="contained" onClick={handleCreate}>Créer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SeriesManagement;
