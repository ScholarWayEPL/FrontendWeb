import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Divider,
    Alert,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Description as DescriptionIcon,
    LocationOn as LocationOnIcon,
    Download as DownloadIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { StatusChip } from '../../../../components/ui';
import type { EtablissementEnAttente } from '../../../../types';

interface ValidationDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    selectedDemande: EtablissementEnAttente | null;
    getStatutLabel: (statut: string) => string;
    formatDate: (dateString: string) => string;
    onApprove: (demande: EtablissementEnAttente) => void;
    onReject: (demande: EtablissementEnAttente) => void;
}

const ValidationDetailsDialog: React.FC<ValidationDetailsDialogProps> = ({
    open,
    onClose,
    selectedDemande,
    getStatutLabel,
    formatDate,
    onApprove,
    onReject,
}) => {
    const theme = useTheme();

    if (!selectedDemande) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', backgroundImage: 'none' } }}>
            <DialogTitle sx={{ p: 4, pb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        src={selectedDemande.logoUrl ? `https://scholarway.pepit.cloud/api/files/${selectedDemande.logoUrl}` : undefined}
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 64, height: 64, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}
                    >
                        <BusinessIcon color="primary" sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
                            {selectedDemande.nomEtablissement}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                            <StatusChip
                                status={(() => {
                                    if (typeof selectedDemande.valide === 'boolean') return selectedDemande.valide ? 'actif' : 'en_attente';
                                    return String(selectedDemande.valide || 'en_attente').toLowerCase();
                                })()}
                                label={getStatutLabel(
                                    typeof selectedDemande.valide === 'boolean'
                                        ? (selectedDemande.valide ? 'ACTIF' : 'EN_ATTENTE')
                                        : String(selectedDemande.valide || 'EN_ATTENTE')
                                )}
                            />
                            <Typography variant="caption" sx={{ color: 'text.disabled', alignSelf: 'center' }}>
                                Demande #INS-{selectedDemande.idUtilisateur}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Alert severity="info" variant="outlined" icon={<DescriptionIcon />} sx={{ borderRadius: '12px', bgcolor: alpha(theme.palette.info.main, 0.02) }}>
                            Dossier soumis le <strong>{formatDate(selectedDemande.dateCreation)}</strong>. Veuillez vérifier l'accréditation avant toute validation.
                        </Alert>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 800 }}>Informations de contact</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main', width: 32, height: 32 }}><EmailIcon sx={{ fontSize: 18 }} /></Avatar>
                                <Typography variant="body2" fontWeight={600}>{selectedDemande.email}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), color: 'success.main', width: 32, height: 32 }}><PhoneIcon sx={{ fontSize: 18 }} /></Avatar>
                                <Typography variant="body2" fontWeight={600}>{selectedDemande.telephonePro}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), color: 'warning.main', width: 32, height: 32 }}><LocationOnIcon sx={{ fontSize: 18 }} /></Avatar>
                                <Typography variant="body2" fontWeight={600}>{selectedDemande.localisation}</Typography>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 800 }}>Preuve d'accréditation</Typography>
                        <Box sx={{ mt: 2, p: 3, borderRadius: '16px', border: '1px dashed', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), textAlign: 'center' }}>
                            <DescriptionIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1, opacity: 0.5 }} />
                            <Typography variant="body2" fontWeight={700} display="block">Certificat d'Homologation</Typography>
                            <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 2 }}>Fichier joint</Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<DownloadIcon />}
                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                                disabled={!selectedDemande.documentAccreditationUrl}
                                href={selectedDemande.documentAccreditationUrl ? `https://scholarway.pepit.cloud/api/files/${selectedDemande.documentAccreditationUrl}` : '#'}
                                target="_blank"
                            >
                                Visualiser le document
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 800 }}>Description de l'établissement</Typography>
                        <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.8, bgcolor: alpha(theme.palette.background.default, 0.3), p: 2, borderRadius: '12px' }}>
                            {selectedDemande.description || "Aucune description fournie."}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 0 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700, px: 3 }}>Fermer</Button>
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="error" startIcon={<CancelIcon />} sx={{ borderRadius: '10px', fontWeight: 700 }}
                        onClick={() => { onReject(selectedDemande); }}>
                        Rejeter le dossier
                    </Button>
                    <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} sx={{ borderRadius: '10px', fontWeight: 700, boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.25)}` }}
                        onClick={() => { onApprove(selectedDemande); }}>
                        Valider l'établissement
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default ValidationDetailsDialog;
