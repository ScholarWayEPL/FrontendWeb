import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  AccountBalanceWallet as MoneyIcon,
} from '@mui/icons-material';
import type { Bachelier } from '../types';

interface UtilisateurModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: Partial<Bachelier>) => Promise<void>;
  utilisateur: Bachelier | null;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  serieBac: string;
  moyenneBac: number;
  matieresPrincipales: string;
  budgetMax: number;
  objectifsProfessionnels: string;
}

const initialFormData: FormData = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  serieBac: '',
  moyenneBac: 10,
  matieresPrincipales: '',
  budgetMax: 10000,
  objectifsProfessionnels: '',
};

const UtilisateurModal: React.FC<UtilisateurModalProps> = ({
  open,
  onClose,
  onSuccess,
  utilisateur,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!utilisateur;

  useEffect(() => {
    if (utilisateur) {
      setFormData({
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        serieBac: utilisateur.serieBac,
        moyenneBac: utilisateur.moyenneBac,
        matieresPrincipales: utilisateur.matieresPrincipales,
        budgetMax: utilisateur.budgetMax,
        objectifsProfessionnels: utilisateur.objectifsProfessionnels,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [utilisateur, open]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.serieBac.trim()) newErrors.serieBac = 'La série du bac est requise';
    if (formData.moyenneBac < 0 || formData.moyenneBac > 20) {
      newErrors.moyenneBac = 'La moyenne doit être entre 0 et 20';
    }
    if (formData.budgetMax < 0) newErrors.budgetMax = 'Le budget doit être positif';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSuccess(formData);
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informations personnelles */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Informations personnelles
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              error={!!errors.nom}
              helperText={errors.nom}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              error={!!errors.prenom}
              helperText={errors.prenom}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              error={!!errors.telephone}
              helperText={errors.telephone}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Informations académiques */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Informations académiques
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Série du Bac"
              value={formData.serieBac}
              onChange={(e) => handleChange('serieBac', e.target.value)}
              error={!!errors.serieBac}
              helperText={errors.serieBac}
              required
              placeholder="Ex: S, ES, L, STI2D..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Moyenne au Bac"
              type="number"
              value={formData.moyenneBac}
              onChange={(e) => handleChange('moyenneBac', parseFloat(e.target.value) || 0)}
              error={!!errors.moyenneBac}
              helperText={errors.moyenneBac}
              inputProps={{ min: 0, max: 20, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Budget maximum (F CFA)"
              type="number"
              value={formData.budgetMax}
              onChange={(e) => handleChange('budgetMax', parseInt(e.target.value) || 0)}
              error={!!errors.budgetMax}
              helperText={errors.budgetMax}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">F CFA/an</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Matières principales"
              value={formData.matieresPrincipales}
              onChange={(e) => handleChange('matieresPrincipales', e.target.value)}
              placeholder="Ex: Mathématiques, Physique, Informatique..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objectifs professionnels"
              value={formData.objectifsProfessionnels}
              onChange={(e) => handleChange('objectifsProfessionnels', e.target.value)}
              multiline
              rows={3}
              placeholder="Décrivez vos objectifs de carrière..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {isEditMode ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UtilisateurModal;
