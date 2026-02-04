import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { createEtablissement, updateEtablissement } from '../store/slices/etablissementsSlice';
import { showSnackbar } from '../store/slices/uiSlice';
import type { Etablissement, TypeEtablissement } from '../types';
import { REGION_OPTIONS, INDICATIF_TOGO } from '../constants';

interface EtablissementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  etablissement: Etablissement | null;
}

interface FormData {
  nom: string;
  type: TypeEtablissement;
  localisation: string;
  description: string;
  contact: string;
  siteWeb: string;
  email: string;
  telephone: string;
}

const initialFormData: FormData = {
  nom: '',
  type: 'Université',
  localisation: '',
  description: '',
  contact: '',
  siteWeb: '',
  email: '',
  telephone: '',
};

const typeOptions: TypeEtablissement[] = ['Université', 'École', 'Institut'];

const EtablissementModal: React.FC<EtablissementModalProps> = ({
  open,
  onClose,
  onSuccess,
  etablissement,
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!etablissement;

  useEffect(() => {
    if (etablissement) {
      setFormData({
        nom: etablissement.nom,
        type: etablissement.type,
        localisation: etablissement.localisation,
        description: etablissement.description,
        contact: etablissement.contact,
        siteWeb: etablissement.siteWeb || '',
        email: etablissement.email || '',
        telephone: etablissement.telephone || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [etablissement, open]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.localisation) {
      newErrors.localisation = 'La localisation est requise';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'Le contact est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditMode && etablissement) {
        await dispatch(
          updateEtablissement({
            id: etablissement.idEtablissement,
            data: formData,
          })
        ).unwrap();
        dispatch(
          showSnackbar({
            message: 'Établissement mis à jour avec succès',
            severity: 'success',
          })
        );
      } else {
        await dispatch(createEtablissement(formData)).unwrap();
        dispatch(
          showSnackbar({
            message: 'Établissement créé avec succès',
            severity: 'success',
          })
        );
      }
      onSuccess();
    } catch {
      dispatch(
        showSnackbar({
          message: `Erreur lors de ${isEditMode ? 'la mise à jour' : 'la création'}`,
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {isEditMode ? 'Modifier l\'établissement' : 'Ajouter un établissement'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Informations générales */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
              Informations générales
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Nom de l'établissement"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              error={!!errors.nom}
              helperText={errors.nom}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => handleChange('type', e.target.value as TypeEtablissement)}
              >
                {typeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
              required
            />
          </Grid>

          {/* Localisation */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
              Localisation
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.localisation}>
              <InputLabel>Région *</InputLabel>
              <Select
                value={formData.localisation}
                label="Région *"
                onChange={(e) => handleChange('localisation', e.target.value)}
              >
                {REGION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.localisation && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.localisation}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Contact */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
              Contact
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              placeholder="contact@etablissement.tg"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              error={!!errors.telephone}
              helperText={errors.telephone}
              required
              placeholder="90 XX XX XX"
              InputProps={{
                startAdornment: <InputAdornment position="start">{INDICATIF_TOGO}</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact (personne référente)"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              error={!!errors.contact}
              helperText={errors.contact || 'Nom du contact principal'}
              required
              placeholder="Ex: M. Kofi, Responsable des admissions"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Site web"
              value={formData.siteWeb}
              onChange={(e) => handleChange('siteWeb', e.target.value)}
              placeholder="https://"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EtablissementModal;
