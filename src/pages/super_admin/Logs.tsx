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
    Fade,
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
    Computer,
    Person,
} from '@mui/icons-material';
import { logsApi, type Log } from '../../api/logs';
import { formatRelativeTime } from '../../utils/helpers';

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

    const getLogTypeConfig = (type: string) => {
        const matching = LOG_TYPES.find((t) => t.value === type);
        if (matching) {
            return {
                ...matching,
                color: theme.palette.mode === 'dark' ? alpha(matching.color, 0.9) : matching.color,
                bgColor: theme.palette.mode === 'dark' ? alpha(matching.color, 0.15) : alpha(matching.color, 0.08)
            };
        }
        return {
            value: type,
            label: type,
            color: theme.palette.text.secondary,
            bgColor: alpha(theme.palette.text.secondary, 0.1),
            icon: Info,
        };
    };

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
            setTotal((response.pagination && response.pagination.total) || 0);

            const statsResponse = await logsApi.getStats();
            setStats(statsResponse.data.parType);
        } catch (error) {
            console.error('Erreur logs:', error);
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
            const a = document.createElement('a'); a.href = url;
            a.download = `scholarway-logs-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) { console.error(err); }
    };

    const handleClearLogs = async () => {
        try {
            await logsApi.clear(30);
            setClearDialog(false);
            fetchLogs();
        } catch (err) { console.error(err); }
    };

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            {/* Header section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>Audit & Logs</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Traçabilité complète des actions administratives</Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small">
                        <Tooltip title="Timeline"><IconButton onClick={() => setViewMode('timeline')} sx={{ color: viewMode === 'timeline' ? 'primary.main' : 'text.disabled', bgcolor: viewMode === 'timeline' ? alpha(theme.palette.primary.main, 0.1) : 'transparent' }}><Timeline fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Tableau"><IconButton onClick={() => setViewMode('table')} sx={{ color: viewMode === 'table' ? 'primary.main' : 'text.disabled', bgcolor: viewMode === 'table' ? alpha(theme.palette.primary.main, 0.1) : 'transparent' }}><ViewList fontSize="small" /></IconButton></Tooltip>
                    </ToggleButtonGroup>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                    <Tooltip title="Actualiser"><IconButton onClick={fetchLogs} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}><Refresh fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Exporter"><IconButton onClick={handleExport} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}><Download fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Nettoyer"><IconButton onClick={() => setClearDialog(true)} sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }}><Delete fontSize="small" /></IconButton></Tooltip>
                </Stack>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {LOG_TYPES.slice(0, 5).map((logType) => {
                    const count = stats[logType.value] || 0;
                    const config = getLogTypeConfig(logType.value);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <Grid item xs={12} sm={6} md={2.4} key={logType.value}>
                            <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: typeFilter === logType.value ? logType.color : 'divider', bgcolor: typeFilter === logType.value ? alpha(logType.color, 0.03) : 'background.paper', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.palette.mode === 'dark' ? '0 10px 20px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.05)' } }} onClick={() => setTypeFilter(typeFilter === logType.value ? '' : logType.value)}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                                        <Avatar sx={{ width: 40, height: 40, bgcolor: config.bgColor, color: config.color, border: `1px solid ${alpha(config.color, 0.2)}` }}><logType.icon sx={{ fontSize: 20 }} /></Avatar>
                                        <Box><Typography variant="h5" fontWeight={800}>{count}</Typography><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>{logType.label}</Typography></Box>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={percentage} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(logType.color, 0.1), '& .MuiLinearProgress-bar': { bgcolor: logType.color } }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Filter Card */}
            <Card sx={{ mb: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <TextField placeholder="Rechercher par action, utilisateur, IP..." value={search} onChange={e => setSearch(e.target.value)} size="small" fullWidth sx={{ maxWidth: { md: 400 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" color="primary" /></InputAdornment> }} />
                        <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel>Type d'action</InputLabel>
                            <Select value={typeFilter} label="Type d'action" onChange={e => setTypeFilter(e.target.value)} sx={{ borderRadius: '12px' }}>
                                <MenuItem value="">Toutes les actions</MenuItem>
                                {LOG_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Button variant={showFilters ? 'contained' : 'outlined'} startIcon={<FilterList />} onClick={() => setShowFilters(!showFilters)} sx={{ borderRadius: '10px' }}>Dates</Button>
                        <Box sx={{ flexGrow: 1 }} />
                        {(search || typeFilter || dateDebut || dateFin) && <Button variant="text" color="error" onClick={() => { setSearch(''); setTypeFilter(''); setDateDebut(''); setDateFin(''); }} sx={{ fontWeight: 700 }}>Réinitialiser</Button>}
                    </Stack>
                    <Fade in={showFilters} mountOnEnter unmountOnExit>
                        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Date début" type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} size="small" InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Date fin" type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} size="small" InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
                            </Grid>
                        </Box>
                    </Fade>
                </CardContent>
            </Card>

            {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

            {/* View Content */}
            {viewMode === 'timeline' ? (
                <Stack spacing={3}>
                    {logs.map((log, i) => {
                        const config = getLogTypeConfig(log.type);
                        return (
                            <Box key={log.id} sx={{ display: 'flex', gap: 3, position: 'relative' }}>
                                {i !== logs.length - 1 && <Box sx={{ position: 'absolute', left: 24, top: 48, bottom: -24, width: 2, bgcolor: 'divider', zIndex: 0 }} />}
                                <Avatar sx={{ width: 48, height: 48, bgcolor: config.bgColor, color: config.color, border: `1px solid ${alpha(config.color, 0.2)}`, zIndex: 1, boxShadow: 1 }}><config.icon /></Avatar>
                                <Card sx={{ flex: 1, borderRadius: '20px', border: '1px solid', borderColor: 'divider', transition: 'all 0.2s', cursor: 'pointer', '&:hover': { transform: 'translateX(6px)', borderColor: config.color, boxShadow: theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.04)' } }} onClick={() => setSelectedLog(log)}>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                            <Box>
                                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                                                    <Typography variant="subtitle1" fontWeight={800}>{log.action}</Typography>
                                                    <Chip label={config.label} size="small" sx={{ height: 20, bgcolor: alpha(config.color, 0.1), color: config.color, fontWeight: 800, fontSize: '0.65rem', borderRadius: '6px' }} />
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary">{log.description}</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>{formatRelativeTime(log.date)}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 2 }}>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.disabled' }}><Person sx={{ fontSize: 16 }} /><Typography variant="caption" fontWeight={700}>{log.utilisateur}</Typography></Stack>
                                            {log.ip && <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.disabled' }}><Computer sx={{ fontSize: 16 }} /><Typography variant="caption" fontWeight={600} fontFamily="monospace">{log.ip}</Typography></Stack>}
                                            <Typography variant="caption" sx={{ color: 'text.disabled', ml: 'auto' }}>{formatDate(log.date)}</Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Box>
                        );
                    })}
                </Stack>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>Horodatage</TableCell>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>Action / Type</TableCell>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }}>Intervenant</TableCell>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem' }} align="right">Détails</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map(log => {
                                const config = getLogTypeConfig(log.type);
                                return (
                                    <TableRow key={log.id} hover sx={{ cursor: 'pointer' }} onClick={() => setSelectedLog(log)}>
                                        <TableCell><Typography variant="body2" fontWeight={600}>{formatRelativeTime(log.date)}</Typography><Typography variant="caption" color="text.disabled">{formatDate(log.date)}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>{log.action}</Typography><Chip label={config.label} size="small" sx={{ height: 18, bgcolor: alpha(config.color, 0.1), color: config.color, fontWeight: 800, fontSize: '0.6rem' }} /></TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}><Typography variant="body2" color="text.secondary" noWrap>{log.description}</Typography></TableCell>
                                        <TableCell><Typography variant="body2" fontWeight={600}>{log.utilisateur}</Typography><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{log.ip}</Typography></TableCell>
                                        <TableCell align="right"><IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <TablePagination component="div" count={total} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2 }} />

            {/* Log Details Dialog */}
            <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundImage: 'none' } }}>
                {selectedLog && (
                    <><DialogTitle sx={{ p: 4, pb: 2 }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Avatar sx={{ width: 56, height: 56, bgcolor: getLogTypeConfig(selectedLog.type).bgColor, color: getLogTypeConfig(selectedLog.type).color, border: `2px solid ${alpha(getLogTypeConfig(selectedLog.type).color, 0.2)}` }}>{(() => { const Icon = getLogTypeConfig(selectedLog.type).icon; return <Icon sx={{ fontSize: 28 }} />; })()}</Avatar>
                            <Box><Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">{selectedLog.action}</Typography><Typography variant="body2" color="text.secondary" fontWeight={500}>{formatDate(selectedLog.date)}</Typography></Box>
                        </Stack>
                    </DialogTitle>
                        <DialogContent sx={{ p: 4 }}>
                            <Stack spacing={3}>
                                <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}><Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', mb: 1, display: 'block' }}>Journal de l'action</Typography><Typography variant="body1" fontWeight={500}>{selectedLog.description}</Typography></Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>UTILISATEUR</Typography><Typography variant="body2" fontWeight={700}>{selectedLog.utilisateur}</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>ADRESSE IP</Typography><Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>{selectedLog.ip || 'Interne'}</Typography></Grid>
                                </Grid>
                                {selectedLog.details && (
                                    <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: alpha(theme.palette.background.default, 0.5), border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}><Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', mb: 1, display: 'block' }}>MÉTADONNÉES TECHNIQUES</Typography><Box sx={{ maxHeight: 200, overflow: 'auto', p: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}><pre style={{ margin: 0 }}>{JSON.stringify(selectedLog.details, null, 2)}</pre></Box></Box>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 4, pt: 0 }}><Button onClick={() => setSelectedLog(null)} sx={{ fontWeight: 800, px: 4 }}>Fermer</Button></DialogActions></>
                )}
            </Dialog>

            {/* Clear Logs Dialog */}
            <Dialog open={clearDialog} onClose={() => setClearDialog(false)} PaperProps={{ sx: { borderRadius: '20px' } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Confirmer le nettoyage</DialogTitle>
                <DialogContent><Typography variant="body2">Vous êtes sur le point de supprimer les logs de plus de 30 jours. Cette action est irréversible et conforme à la politique de conservation des données.</Typography></DialogContent>
                <DialogActions sx={{ p: 2.5 }}><Button onClick={() => setClearDialog(false)} sx={{ fontWeight: 700 }}>Annuler</Button><Button variant="contained" color="error" onClick={handleClearLogs} sx={{ borderRadius: '10px', fontWeight: 800 }}>Confirmer la purge</Button></DialogActions>
            </Dialog>
        </Box>
    );
}

// Missing imports fix
import { ToggleButtonGroup } from '@mui/material';
