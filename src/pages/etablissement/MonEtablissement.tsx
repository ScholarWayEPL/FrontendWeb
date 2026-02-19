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
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { PageHeader, DataCard } from '../../components/ui';
import { BORDER_RADIUS, SHADOWS, AVATAR_SIZES } from '../../constants';

const MonEtablissement: React.FC = () => {
    const theme = useTheme();
    const { user } = useAppSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);

    // Données mockées de l'établissement
    const [etablissement, setEtablissement] = useState({
        nom: user?.etablissementNom || 'Mon Établissement',
        description: 'Établissement d\'enseignement supérieur reconnu par l\'État, offrant des formations de qualité dans divers domaines. Notre mission est de former les leaders de demain en leur fournissant les compétences nécessaires pour exceller dans un monde en constante évolution.',
        localisation: 'Lomé, Togo',
        telephone: '+228 22 XX XX XX',
        siteWeb: 'https://www.etablissement.tg',
        logoUrl: '',
        scolariteGlobale: '500 000 - 2 000 000 FCFA/an',
        conditionsAdmission: 'Baccalauréat requis. Étude de dossier et/ou concours d\'entrée selon les filières.',
        infrastructures: 'Bibliothèque moderne, Laboratoires informatiques, Salles climatisées, WiFi campus, Cafétéria',
        documentAccreditation: 'Accréditation CAMES',
        valide: true,
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
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: BORDER_RADIUS.md, boxShadow: SHADOWS.card }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Header de la carte */}
                            <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
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
                                            <CloudUploadIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                                            {isEditing && (
                                                <Typography variant="caption" color="primary.main">
                                                    Logo
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
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label={etablissement.documentAccreditation}
                                            color="success"
                                            size="small"
                                            sx={{ borderRadius: BORDER_RADIUS.xs }}
                                        />
                                        <Chip
                                            icon={<LocationIcon />}
                                            label={etablissement.localisation}
                                            size="small"
                                            sx={{ borderRadius: BORDER_RADIUS.xs }}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 3 }} />

                            {/* Description */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Description
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={etablissement.description}
                                        onChange={(e) => setEtablissement({ ...etablissement, description: e.target.value })}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>
                                        {etablissement.description}
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Coordonnées */}
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                Coordonnées
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Téléphone"
                                            value={etablissement.telephone}
                                            onChange={(e) => setEtablissement({ ...etablissement, telephone: e.target.value })}
                                        />
                                    ) : (
                                        <InfoItem
                                            icon={<PhoneIcon />}
                                            label="Téléphone"
                                            value={etablissement.telephone}
                                            color={theme.palette.info.main}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Site web"
                                            value={etablissement.siteWeb}
                                            onChange={(e) => setEtablissement({ ...etablissement, siteWeb: e.target.value })}
                                        />
                                    ) : (
                                        <InfoItem
                                            icon={<LanguageIcon />}
                                            label="Site web"
                                            value={etablissement.siteWeb}
                                            color={theme.palette.success.main}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Localisation"
                                            value={etablissement.localisation}
                                            onChange={(e) => setEtablissement({ ...etablissement, localisation: e.target.value })}
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
                                <Grid item xs={12} md={6}>
                                    <InfoItem
                                        icon={<DescriptionIcon />}
                                        label="Accréditation"
                                        value={etablissement.documentAccreditation}
                                        color={theme.palette.primary.main}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        {/* Scolarité */}
                        <DataCard title="Scolarité globale" subtitle="Frais de scolarité annuels">
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    value={etablissement.scolariteGlobale}
                                    onChange={(e) => setEtablissement({ ...etablissement, scolariteGlobale: e.target.value })}
                                    placeholder="Ex: 500 000 - 2 000 000 FCFA/an"
                                />
                            ) : (
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), width: AVATAR_SIZES.md, height: AVATAR_SIZES.md }}>
                                        <AccountBalanceIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight={600} color="success.main">
                                        {etablissement.scolariteGlobale}
                                    </Typography>
                                </Stack>
                            )}
                        </DataCard>

                        {/* Conditions d'admission */}
                        <DataCard title="Conditions d'admission" subtitle="Prérequis généraux">
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={etablissement.conditionsAdmission}
                                    onChange={(e) => setEtablissement({ ...etablissement, conditionsAdmission: e.target.value })}
                                />
                            ) : (
                                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), width: AVATAR_SIZES.md, height: AVATAR_SIZES.md }}>
                                        <AssignmentIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                                    </Avatar>
                                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                                        {etablissement.conditionsAdmission}
                                    </Typography>
                                </Stack>
                            )}
                        </DataCard>

                        {/* Infrastructures */}
                        <DataCard title="Infrastructures" subtitle="Équipements disponibles">
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={etablissement.infrastructures}
                                    onChange={(e) => setEtablissement({ ...etablissement, infrastructures: e.target.value })}
                                    placeholder="Séparez par des virgules"
                                />
                            ) : (
                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {etablissement.infrastructures.split(',').map((infra, index) => (
                                        <Chip
                                            key={index}
                                            label={infra.trim()}
                                            size="small"
                                            sx={{ borderRadius: BORDER_RADIUS.xs }}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </DataCard>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MonEtablissement;
