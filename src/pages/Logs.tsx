import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Tooltip,
    Paper,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    alpha,
    Avatar,
    Divider,
    useTheme,
    LinearProgress,
} from '@mui/material';
import {
    Search,
    FilterList,
    Refresh,
    Download,
    Delete,
    Login,
    Logout,
    Add,
    Edit,
    Remove,
    Visibility,
    CheckCircle,
    Cancel,
    FileDownload,
    FileUpload,
    Info,
    Timeline,
    ViewList,
    CalendarToday,
    AccessTime,
    Computer,
    Person,
} from '@mui/icons-material';
import { logsApi, type Log } from '../api/logs';
import { formatRelativeTime } from '../utils/helpers';

const LOG_TYPES = [
    { value: 'connexion', label: 'Connexion', color: '#4caf50', icon: Login, bgColor: '#e8f5e9' },
    { value: 'deconnexion', label: 'Déconnexion', color: '#9e9e9e', icon: Logout, bgColor: '#fafafa' },
    { value: 'creation', label: 'Création', color: '#2196f3', icon: Add, bgColor: '#e3f2fd' },
    { value: 'modification', label: 'Modification', color: '#ff9800', icon: Edit, bgColor: '#fff3e0' },
    { value: 'suppression', label: 'Suppression', color: '#f44336', icon: Remove, bgColor: '#ffebee' },
    { value: 'consultation', label: 'Consultation', color: '#673ab7', icon: Visibility, bgColor: '#ede7f6' },
    { value: 'validation', label: 'Validation', color: '#4caf50', icon: CheckCircle, bgColor: '#e8f5e9' },
    { value: 'rejet', label: 'Rejet', color: '#f44336', icon: Cancel, bgColor: '#ffebee' },
    { value: 'export', label: 'Export', color: '#00bcd4', icon: FileDownload, bgColor: '#e0f7fa' },
    { value: 'import', label: 'Import', color: '#009688', icon: FileUpload, bgColor: '#e0f2f1' },
];

const getLogTypeConfig = (type: string) => {
    return LOG_TYPES.find((t) => t.value === type) || {
        value: type,
        label: type,
        color: '#9e9e9e',
        bgColor: '#fafafa',
        icon: Info,
    };
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-TG', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

export default function Logs() {
    const theme = useTheme();
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [clearDialog, setClearDialog] = useState(false);
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'timeline'>('timeline');
    const [stats, setStats] = useState<Record<string, number>>({});

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await logsApi.getAll({
                page: page + 1,
                limit: rowsPerPage,
                filters: {
                    search: search || undefined,
                    type: typeFilter || undefined,
                    dateDebut: dateDebut || undefined,
                    dateFin: dateFin || undefined,
                },
            });
            setLogs(response.data);
            setTotal(response.pagination?.total || 0);

            // Calculer les stats
            const statsResponse = await logsApi.getStats();
            setStats(statsResponse.data.parType);
        } catch (error) {
            console.error('Erreur lors du chargement des logs:', error);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search, typeFilter, dateDebut, dateFin]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleExport = async () => {
        try {
            const response = await logsApi.export('json');
            const blob = new Blob([response.data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    const handleClearLogs = async () => {
        try {
            await logsApi.clear(30);
            setClearDialog(false);
            fetchLogs();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    // Vue Timeline
    const TimelineView = () => (
        <Box sx={{ mt: 2 }}>
            {logs.map((log, index) => {
                const typeConfig = getLogTypeConfig(log.type);
                const Icon = typeConfig.icon;
                const isLast = index === logs.length - 1;

                return (
                    <Box
                        key={log.id}
                        sx={{
                            display: 'flex',
                            position: 'relative',
                            pb: isLast ? 0 : 3,
                            cursor: 'pointer',
                            '&:hover': {
                                '& .timeline-content': {
                                    bgcolor: alpha(typeConfig.color, 0.04),
                                    borderColor: typeConfig.color,
                                },
                            },
                        }}
                        onClick={() => setSelectedLog(log)}
                    >
                        {/* Timeline line */}
                        {!isLast && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 23,
                                    top: 48,
                                    bottom: 0,
                                    width: 2,
                                    bgcolor: 'grey.200',
                                }}
                            />
                        )}

                        {/* Timeline dot */}
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: typeConfig.bgColor,
                                color: typeConfig.color,
                                mr: 2,
                                zIndex: 1,
                                boxShadow: `0 0 0 4px ${theme.palette.background.paper}`,
                            }}
                        >
                            <Icon />
                        </Avatar>

                        {/* Content */}
                        <Card
                            className="timeline-content"
                            sx={{
                                flex: 1,
                                transition: 'all 0.2s',
                                border: '1px solid',
                                borderColor: 'grey.200',
                                '&:hover': {
                                    boxShadow: 2,
                                },
                            }}
                        >
                            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {log.action}
                                            </Typography>
                                            <Chip
                                                label={typeConfig.label}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(typeConfig.color, 0.1),
                                                    color: typeConfig.color,
                                                    fontWeight: 500,
                                                    height: 22,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {log.description}
                                        </Typography>
                                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Person sx={{ fontSize: 14, color: 'text.disabled' }} />
                                                <Typography variant="caption" color="text.disabled">
                                                    {log.utilisateur}
                                                </Typography>
                                            </Stack>
                                            {log.ip && (
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <Computer sx={{ fontSize: 14, color: 'text.disabled' }} />
                                                    <Typography variant="caption" color="text.disabled" fontFamily="monospace">
                                                        {log.ip}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" color="primary.main" fontWeight={500}>
                                            {formatRelativeTime(log.date)}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.disabled">
                                            {formatDate(log.date)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                );
            })}
        </Box>
    );

    return (
        <Box>
            {/* En-tête */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Timeline sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={700}>
                            Journal d'activité
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Suivi de toutes les actions effectuées sur la plateforme
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Vue tableau">
                        <IconButton
                            onClick={() => setViewMode('table')}
                            color={viewMode === 'table' ? 'primary' : 'default'}
                            sx={{
                                bgcolor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                            }}
                        >
                            <ViewList />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Vue timeline">
                        <IconButton
                            onClick={() => setViewMode('timeline')}
                            color={viewMode === 'timeline' ? 'primary' : 'default'}
                            sx={{
                                bgcolor: viewMode === 'timeline' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                            }}
                        >
                            <Timeline />
                        </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Tooltip title="Actualiser">
                        <IconButton onClick={fetchLogs} color="primary">
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Exporter">
                        <IconButton onClick={handleExport} color="primary">
                            <Download />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Nettoyer les anciens logs">
                        <IconButton onClick={() => setClearDialog(true)} color="error">
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Statistiques */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {LOG_TYPES.slice(0, 5).map((logType) => {
                    const count = stats[logType.value] || 0;
                    const Icon = logType.icon;
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    return (
                        <Grid item xs={6} sm={4} md={2.4} key={logType.value}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: typeFilter === logType.value ? `2px solid ${logType.color}` : '2px solid transparent',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                    },
                                }}
                                onClick={() => setTypeFilter(typeFilter === logType.value ? '' : logType.value)}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: logType.bgColor,
                                                color: logType.color,
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                                {count}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" noWrap>
                                                {logType.label}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={percentage}
                                        sx={{
                                            mt: 1.5,
                                            height: 4,
                                            borderRadius: 2,
                                            bgcolor: alpha(logType.color, 0.1),
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: logType.color,
                                                borderRadius: 2,
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Filtres */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ py: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            placeholder="Rechercher dans les logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            sx={{ minWidth: 280 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Type d'action</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Type d'action"
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <MenuItem value="">Tous les types</MenuItem>
                                {LOG_TYPES.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    backgroundColor: type.color,
                                                }}
                                            />
                                            {type.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant={showFilters ? 'contained' : 'outlined'}
                            startIcon={<FilterList />}
                            onClick={() => setShowFilters(!showFilters)}
                            size="small"
                            sx={{ minWidth: 140 }}
                        >
                            {showFilters ? 'Masquer' : 'Plus de filtres'}
                        </Button>

                        {(search || typeFilter || dateDebut || dateFin) && (
                            <Button
                                variant="text"
                                color="error"
                                size="small"
                                onClick={() => {
                                    setSearch('');
                                    setTypeFilter('');
                                    setDateDebut('');
                                    setDateFin('');
                                }}
                            >
                                Réinitialiser
                            </Button>
                        )}
                    </Stack>

                    {showFilters && (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                            <TextField
                                label="Date début"
                                type="date"
                                value={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarToday sx={{ fontSize: 18, color: 'action.active' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Date fin"
                                type="date"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarToday sx={{ fontSize: 18, color: 'action.active' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                    )}
                </CardContent>
            </Card>

            {/* Loading */}
            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* Contenu selon le mode de vue */}
            {viewMode === 'timeline' ? (
                <TimelineView />
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <AccessTime sx={{ fontSize: 16 }} />
                                            <span>Date/Heure</span>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Action</TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Person sx={{ fontSize: 16 }} />
                                            <span>Utilisateur</span>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', width: 50 }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Timeline sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                                                <Typography color="text.secondary">
                                                    Aucun log trouvé
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => {
                                        const typeConfig = getLogTypeConfig(log.type);
                                        const Icon = typeConfig.icon;
                                        return (
                                            <TableRow
                                                key={log.id}
                                                hover
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:hover': { backgroundColor: alpha(typeConfig.color, 0.04) },
                                                }}
                                                onClick={() => setSelectedLog(log)}
                                            >
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {formatRelativeTime(log.date)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">
                                                            {formatDate(log.date)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={<Icon sx={{ fontSize: '14px !important' }} />}
                                                        label={typeConfig.label}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: typeConfig.bgColor,
                                                            color: typeConfig.color,
                                                            fontWeight: 500,
                                                            '& .MuiChip-icon': { color: typeConfig.color },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {log.action}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            maxWidth: 350,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {log.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{log.utilisateur}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Voir détails">
                                                        <IconButton size="small" color="primary">
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        labelRowsPerPage="Lignes par page:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                    />
                </Paper>
            )}

            {/* Dialog de détails */}
            <Dialog
                open={!!selectedLog}
                onClose={() => setSelectedLog(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 },
                }}
            >
                {selectedLog && (
                    <>
                        <DialogTitle sx={{ pb: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: getLogTypeConfig(selectedLog.type).bgColor,
                                        color: getLogTypeConfig(selectedLog.type).color,
                                    }}
                                >
                                    {(() => {
                                        const Icon = getLogTypeConfig(selectedLog.type).icon;
                                        return <Icon />;
                                    })()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedLog.action}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(selectedLog.date)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                        DESCRIPTION
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {selectedLog.description}
                                    </Typography>
                                </Box>

                                <Divider />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            TYPE
                                        </Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={getLogTypeConfig(selectedLog.type).label}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getLogTypeConfig(selectedLog.type).bgColor,
                                                    color: getLogTypeConfig(selectedLog.type).color,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            UTILISATEUR
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {selectedLog.utilisateur}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {selectedLog.ip && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            ADRESSE IP
                                        </Typography>
                                        <Typography variant="body2" fontFamily="monospace" sx={{ mt: 0.5 }}>
                                            {selectedLog.ip}
                                        </Typography>
                                    </Box>
                                )}

                                {selectedLog.entite && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            ENTITÉ CONCERNÉE
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {selectedLog.entite}
                                            {selectedLog.entiteId && (
                                                <Chip
                                                    label={`ID: ${selectedLog.entiteId}`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                                />
                                            )}
                                        </Typography>
                                    </Box>
                                )}

                                {selectedLog.details && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            DÉTAILS SUPPLÉMENTAIRES
                                        </Typography>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 1.5,
                                                mt: 0.5,
                                                bgcolor: 'grey.50',
                                                borderRadius: 1,
                                                fontFamily: 'monospace',
                                                fontSize: '0.8rem',
                                                overflow: 'auto',
                                            }}
                                        >
                                            <pre style={{ margin: 0 }}>
                                                {JSON.stringify(selectedLog.details, null, 2)}
                                            </pre>
                                        </Paper>
                                    </Box>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={() => setSelectedLog(null)} variant="outlined">
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Dialog de confirmation de suppression */}
            <Dialog open={clearDialog} onClose={() => setClearDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Delete color="error" />
                        <span>Nettoyer les logs</span>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Voulez-vous supprimer tous les logs de plus de <strong>30 jours</strong> ?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Cette action est irréversible.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClearDialog(false)}>Annuler</Button>
                    <Button onClick={handleClearLogs} color="error" variant="contained">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
