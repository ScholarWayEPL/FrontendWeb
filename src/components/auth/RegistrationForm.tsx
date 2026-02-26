import React from 'react';
import {
    Box,
    Typography,
    Stack,
    TextField,
    Button,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    MenuItem,
    CircularProgress,
    alpha,
    useTheme
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

interface RegistrationFormProps {
    inscriptionForm: any;
    inscriptionStep: number;
    inscriptionSuccess: boolean;
    inscriptionLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
    onBackToLogin: () => void;
    onSubmit: () => void;
}

const inscriptionSteps = ['Informations générales', 'Coordonnées', 'Documents'];

const glassInputStyle = (theme: any) => {
    const isDark = theme.palette.mode === 'dark';
    return {
        '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            color: isDark ? 'white' : 'text.primary',
            transition: 'all 0.2s ease',
            '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '1.5px',
                boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.15)}`,
            },
        },
        '& .MuiInputLabel-root': {
            color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary',
            '&.Mui-focused': {
                color: theme.palette.primary.main,
            },
        },
        '& .MuiOutlinedInput-input::placeholder': {
            color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.35)',
            opacity: 1,
        },
        '& .MuiSelect-icon': { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' },
    };
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({
    inscriptionForm,
    inscriptionStep,
    inscriptionSuccess,
    inscriptionLoading,
    onInputChange,
    onFileChange,
    onNextStep,
    onPrevStep,
    onBackToLogin,
    onSubmit
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <IconButton
                    onClick={onBackToLogin}
                    sx={{
                        color: isDark ? 'white' : 'text.primary',
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight={800} sx={{
                    color: isDark ? 'white' : 'text.primary',
                    letterSpacing: '-0.02em'
                }}>
                    Inscription.
                </Typography>
            </Stack>

            {inscriptionSuccess ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
                    <Typography variant="h4" fontWeight={800} color={isDark ? "white" : "text.primary"} gutterBottom>Demande reçue.</Typography>
                    <Typography variant="body1" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'text.secondary', mb: 4 }}>Nous analysons votre dossier pour validation.</Typography>
                    <Button
                        variant="contained"
                        onClick={onBackToLogin}
                        sx={{
                            borderRadius: '12px',
                            py: 1.5,
                            px: 6,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        }}
                    >
                        Retour
                    </Button>
                </Box>
            ) : (
                <>
                    <Stepper
                        activeStep={inscriptionStep}
                        sx={{
                            mb: 6,
                            '& .MuiStepIcon-root': {
                                color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                '&.Mui-active': { color: 'primary.main' },
                                '&.Mui-completed': { color: 'primary.main' }
                            },
                            '& .MuiStepLabel-label': {
                                color: isDark ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                                '&.Mui-active': { color: isDark ? 'white' : 'text.primary', fontWeight: 600 }
                            }
                        }}
                    >
                        {inscriptionSteps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                    </Stepper>

                    <Stack spacing={3}>
                        {inscriptionStep === 0 && (
                            <Stack spacing={3}>
                                <TextField fullWidth label="Nom Etablissement" name="nomEtablissement" placeholder="Ex: Université de Lomé" value={inscriptionForm.nomEtablissement} onChange={onInputChange} sx={glassInputStyle(theme)} />
                                <TextField fullWidth select label="Type" name="typeEtablissement" value={inscriptionForm.typeEtablissement} onChange={onInputChange} sx={glassInputStyle(theme)}>
                                    <MenuItem value=""><em>Sélectionner le type</em></MenuItem>
                                    <MenuItem value="UNIVERSITE_PUBLIQUE">Université Publique</MenuItem>
                                    <MenuItem value="UNIVERSITE_PRIVEE">Université Privée</MenuItem>
                                    <MenuItem value="ECOLE_PUBLIQUE">École Publique</MenuItem>
                                    <MenuItem value="ECOLE_PRIVEE">École Privée</MenuItem>
                                </TextField>
                                <TextField fullWidth multiline rows={3} label="Description" name="description" placeholder="Présentez brièvement votre établissement..." value={inscriptionForm.description} onChange={onInputChange} sx={glassInputStyle(theme)} />
                            </Stack>
                        )}
                        {inscriptionStep === 1 && (
                            <Stack spacing={3}>
                                <TextField fullWidth label="Email Pro" name="emailPro" placeholder="contact@etablissement.tg" value={inscriptionForm.emailPro} onChange={onInputChange} sx={glassInputStyle(theme)} />
                                <TextField fullWidth label="Mot de passe" type="password" name="motDePasse" placeholder="Minimum 8 caractères" value={inscriptionForm.motDePasse} onChange={onInputChange} sx={glassInputStyle(theme)} />
                                <TextField fullWidth label="Téléphone" name="telephonePro" placeholder="+228 90 00 00 00" value={inscriptionForm.telephonePro} onChange={onInputChange} sx={glassInputStyle(theme)} />
                                <TextField fullWidth label="Localisation" name="localisation" placeholder="Lomé, Quartier Administratif" value={inscriptionForm.localisation} onChange={onInputChange} sx={glassInputStyle(theme)} />
                            </Stack>
                        )}
                        {inscriptionStep === 2 && (
                            <Stack spacing={2}>
                                <Box
                                    sx={{
                                        p: 4,
                                        borderRadius: '16px',
                                        border: '2px dashed',
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                        textAlign: 'center',
                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                    component="label"
                                >
                                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={onFileChange} />
                                    <CloudUploadIcon sx={{ fontSize: 48, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)', mb: 2 }} />
                                    <Typography variant="subtitle1" color={isDark ? "white" : "text.primary"} fontWeight={700}>
                                        {inscriptionForm.documentAccreditation ? 'Document prêt !' : 'Document d\'accréditation'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'text.secondary' }}>
                                        {(inscriptionForm.documentAccreditation && inscriptionForm.documentAccreditation.name) || 'Joindre une preuve d\'existence légale (PDF, DOC)'}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '8px',
                                    bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    border: '1px solid',
                                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="caption" sx={{
                                        color: isDark ? 'rgba(255,255,255,0.4)' : 'text.secondary',
                                        fontStyle: 'italic',
                                        display: 'block'
                                    }}>
                                        * Ce document est nécessaire pour l'audit de votre établissement par nos services de conformité.
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            {inscriptionStep > 0 && (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={onPrevStep}
                                    disabled={inscriptionLoading}
                                    sx={{
                                        borderRadius: '12px',
                                        color: isDark ? 'white' : 'text.primary',
                                        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                        fontWeight: 600
                                    }}
                                >
                                    Retour
                                </Button>
                            )}
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={inscriptionStep < 2 ? onNextStep : onSubmit}
                                disabled={inscriptionLoading}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: isDark
                                        ? '0 12px 24px rgba(79, 70, 229, 0.3)'
                                        : '0 8px 16px rgba(79, 70, 229, 0.2)',
                                }}
                            >
                                {inscriptionLoading ? <CircularProgress size={24} color="inherit" /> : (inscriptionStep < 2 ? 'Continuer' : 'Soumettre')}
                            </Button>
                        </Stack>
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default RegistrationForm;
