import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Avatar,
    Button,
    TextField,
    Grid,
    Chip,
    Divider,
    useTheme,
    alpha,
} from '@mui/material';
import {
    School as SchoolIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    CloudUpload as CloudUploadIcon,
    Language as LanguageIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { PageHeader } from '../../components/ui';
import { BORDER_RADIUS, SHADOWS, AVATAR_SIZES } from '../../constants';

const MonEtablissement: React.FC = () => {
    const theme = useTheme();
    const { user } = useAppSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);

    // Données de l'établissement initialisées depuis le store Redux (réponse API login)
    const [etablissement, setEtablissement] = useState({
        nom: user?.etablissement?.nomEtablissement || user?.etablissementNom || 'Mon Établissement',
        description: user?.etablissement?.description || '',
        localisation: user?.etablissement?.localisation || '',
        telephonePro: user?.etablissement?.telephonePro || '',
        siteWeb: user?.etablissement?.siteWeb || '',
        logoUrl: user?.etablissement?.logoUrl || '',
        scolariteGlobale: user?.etablissement?.scolariteGlobale || '',
        documentAccreditationUrl: user?.etablissement?.documentAccreditationUrl || '',
        valide: user?.etablissement?.valide ?? false,
    });

    const handleSave = () => {
        // TODO: Appeler l'API pour sauvegarder
        setIsEditing(false);
    };

    const handleCancel = () => {
        // TODO: Réinitialiser les données
        setIsEditing(false);
    };

    const InfoItem = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
        <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar sx={{
                bgcolor: alpha(color, 0.1),
                width: AVATAR_SIZES.md,
                height: AVATAR_SIZES.md,
                '& .MuiSvgIcon-root': { color, fontSize: 20 },
            }}>
                {icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                    {value}
                </Typography>
            </Box>
        </Stack>
    );

    return (
        <Box>
            {/* Header */}
            <PageHeader
                title="Mon Établissement"
                subtitle="Gérez les informations de votre établissement"
                icon={<SchoolIcon />}
                iconColor={theme.palette.primary.main}
                badge={etablissement.valide ? { label: 'Validé', color: 'success' } : { label: 'En attente', color: 'warning' }}
                action={
                    !isEditing ? (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditing(true)}
                            sx={{ borderRadius: BORDER_RADIUS.sm }}
                        >
                            Modifier
                        </Button>
                    ) : (
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                                sx={{ borderRadius: BORDER_RADIUS.sm }}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                sx={{ borderRadius: BORDER_RADIUS.sm }}
                            >
                                Enregistrer
                            </Button>
                        </Stack>
                    )
                }
            />

            <Grid container spacing={3}>
                {/* Informations principales */}
                <Grid item xs={12} lg={7}>
                    <Card sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Header de la carte */}
                            <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: BORDER_RADIUS.md,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px dashed',
                                        borderColor: 'grey.300',
                                        cursor: isEditing ? 'pointer' : 'default',
                                        transition: 'all 0.2s',
                                        '&:hover': isEditing ? {
                                            borderColor: 'primary.main',
                                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                                        } : {},
                                    }}
                                >
                                    {etablissement.logoUrl ? (
                                        <img src={etablissement.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: BORDER_RADIUS.md }} />
                                    ) : (
                                        <Stack alignItems="center" spacing={0.5}>
                                            <CloudUploadIcon sx={{ color: 'primary.main', fontSize: 40 }} />
                                            {isEditing && (
                                                <Typography variant="caption" color="primary.main" fontWeight={500}>
                                                    Ajouter logo
                                                </Typography>
                                            )}
                                        </Stack>
                                    )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Nom de l'établissement"
                                            value={etablissement.nom}
                                            onChange={(e) => setEtablissement({ ...etablissement, nom: e.target.value })}
                                            sx={{ mb: 2 }}
                                        />
                                    ) : (
                                        <Typography variant="h5" fontWeight={700} gutterBottom>
                                            {etablissement.nom}
                                        </Typography>
                                    )}
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label={etablissement.valide ? "Établissement validé" : "En attente de validation"}
                                            color={etablissement.valide ? "success" : "warning"}
                                            size="small"
                                            sx={{ borderRadius: BORDER_RADIUS.xs, fontWeight: 500 }}
                                        />
                                        <Chip
                                            icon={<LocationIcon />}
                                            label={etablissement.localisation}
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderRadius: BORDER_RADIUS.xs }}
                                        />
                                    </Stack>
                                    {etablissement.documentAccreditationUrl && !isEditing && (
                                        <Button
                                            size="small"
                                            variant="text"
                                            startIcon={<DescriptionIcon />}
                                            href={etablissement.documentAccreditationUrl}
                                            target="_blank"
                                            sx={{ mt: 1 }}
                                        >
                                            Voir document d'accréditation
                                        </Button>
                                    )}
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 3 }} />

                            {/* Description */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom>
                                    Description de l'établissement
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        value={etablissement.description}
                                        onChange={(e) => setEtablissement({ ...etablissement, description: e.target.value })}
                                        placeholder="Décrivez votre établissement, sa mission, ses valeurs..."
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.8 }}>
                                        {etablissement.description}
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Coordonnées */}
                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                Coordonnées de contact
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Téléphone professionnel"
                                            value={etablissement.telephonePro}
                                            onChange={(e) => setEtablissement({ ...etablissement, telephonePro: e.target.value })}
                                        />
                                    ) : (
                                        <InfoItem
                                            icon={<PhoneIcon />}
                                            label="Téléphone professionnel"
                                            value={etablissement.telephonePro}
                                            color={theme.palette.info.main}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Site web"
                                            value={etablissement.siteWeb || ''}
                                            onChange={(e) => setEtablissement({ ...etablissement, siteWeb: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    ) : (
                                        <InfoItem
                                            icon={<LanguageIcon />}
                                            label="Site web"
                                            value={etablissement.siteWeb || 'Non renseigné'}
                                            color={theme.palette.success.main}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Localisation"
                                            value={etablissement.localisation}
                                            onChange={(e) => setEtablissement({ ...etablissement, localisation: e.target.value })}
                                            placeholder="Ville, Pays"
                                        />
                                    ) : (
                                        <InfoItem
                                            icon={<LocationIcon />}
                                            label="Localisation"
                                            value={etablissement.localisation}
                                            color={theme.palette.warning.main}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} lg={5}>
                    <Stack spacing={3}>
                        {/* Scolarité globale */}
                        <Card sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), width: AVATAR_SIZES.md, height: AVATAR_SIZES.md }}>
                                        <AccountBalanceIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Scolarité globale
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Fourchette des frais annuels
                                        </Typography>
                                    </Box>
                                </Stack>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        value={etablissement.scolariteGlobale || ''}
                                        onChange={(e) => setEtablissement({ ...etablissement, scolariteGlobale: e.target.value })}
                                        placeholder="Ex: 500 000 - 2 000 000 FCFA/an"
                                        helperText="Indiquez la fourchette de prix des programmes"
                                    />
                                ) : (
                                    <Box sx={{
                                        bgcolor: alpha(theme.palette.success.main, 0.08),
                                        p: 2.5,
                                        borderRadius: BORDER_RADIUS.sm,
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.success.main, 0.2),
                                    }}>
                                        <Typography variant="h5" fontWeight={700} color="success.main" textAlign="center">
                                            {etablissement.scolariteGlobale || 'Non renseigné'}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Document d'accréditation */}
                        {isEditing && (
                            <Card sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: AVATAR_SIZES.md, height: AVATAR_SIZES.md }}>
                                            <DescriptionIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Document d'accréditation
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Attestation officielle
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <TextField
                                        fullWidth
                                        value={etablissement.documentAccreditationUrl || ''}
                                        onChange={(e) => setEtablissement({ ...etablissement, documentAccreditationUrl: e.target.value })}
                                        placeholder="URL du document PDF"
                                        helperText="Lien vers votre document d'accréditation (PDF)"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Informations complémentaires */}
                        <Card sx={{
                            borderRadius: BORDER_RADIUS.md,
                            boxShadow: SHADOWS.card,
                            bgcolor: alpha(theme.palette.info.main, 0.02),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.info.main, 0.1),
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 2 }}>
                                    <DescriptionIcon sx={{ color: 'info.main', fontSize: 20, mt: 0.3 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600} color="info.main" gutterBottom>
                                            Besoin d'aide ?
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            Les informations de votre établissement sont visibles par les bacheliers.
                                            Assurez-vous qu'elles sont complètes et à jour.
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Stack spacing={1}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        INFORMATIONS IMPORTANTES :
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary">
                                            • Le logo améliore la visibilité de votre établissement
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            • La description aide les étudiants à vous découvrir
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            • Les coordonnées doivent être exactes pour être contacté
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MonEtablissement;
