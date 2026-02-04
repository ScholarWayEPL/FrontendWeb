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
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createProgramme, updateProgramme } from '../store/slices/programmesSlice';
import { showSnackbar } from '../store/slices/uiSlice';
import type { Programme, NiveauProgramme } from '../types';

interface ProgrammeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  programme: Programme | null;
}

interface FormData {
  nomProgramme: string;
  domaine: string;
  niveau: NiveauProgramme;
  fraisScolarite: number;
  conditionsAdmission: string;
  duree: number;
  debouchesProfessionnels: string;
  etablissementNom: string;
}

const initialFormData: FormData = {
  nomProgramme: '',
  domaine: '',
  niveau: 'Licence',
  fraisScolarite: 0,
  conditionsAdmission: '',
  duree: 3,
  debouchesProfessionnels: '',
  etablissementNom: '',
};

const niveauOptions: NiveauProgramme[] = ['Licence', 'Master', 'Doctorat'];

const domaineOptions = [
  'Informatique',
  'Commerce & Management',
  'Ingénierie',
  'Droit',
  'Sciences Humaines',
  'Sciences',
  'Santé',
  'Arts & Design',
  'Communication',
  'Langues',
];

const ProgrammeModal: React.FC<ProgrammeModalProps> = ({
  open,
  onClose,
  onSuccess,
  programme,
}) => {
  const dispatch = useAppDispatch();
  const { domaines } = useAppSelector((state) => state.programmes);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const isEditMode = !!programme;

  // Combiner les domaines de l'API avec les options par défaut
  const allDomaines = [...new Set([...domaineOptions, ...domaines])];

  useEffect(() => {
    if (programme) {
      setFormData({
        nomProgramme: programme.nomProgramme,
        domaine: programme.domaine,
        niveau: programme.niveau,
        fraisScolarite: programme.fraisScolarite,
        conditionsAdmission: programme.conditionsAdmission,
        duree: programme.duree,
        debouchesProfessionnels: programme.debouchesProfessionnels,
        etablissementNom: programme.etablissementNom || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [programme, open]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nomProgramme.trim()) {
      newErrors.nomProgramme = 'Le nom du programme est requis';
    }
    if (!formData.domaine) {
      newErrors.domaine = 'Le domaine est requis';
    }
    if (!formData.conditionsAdmission.trim()) {
      newErrors.conditionsAdmission = 'Les conditions d\'admission sont requises';
    }
    if (formData.duree <= 0) {
      newErrors.duree = 'La durée doit être supérieure à 0';
    }
    if (!formData.debouchesProfessionnels.trim()) {
      newErrors.debouchesProfessionnels = 'Les débouchés professionnels sont requis';
    }
    if (formData.fraisScolarite < 0) {
      newErrors.fraisScolarite = 'Les frais ne peuvent pas être négatifs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditMode && programme) {
        await dispatch(
          updateProgramme({
            id: programme.idProgramme,
            data: formData,
          })
        ).unwrap();
        dispatch(
          showSnackbar({
            message: 'Programme mis à jour avec succès',
            severity: 'success',
          })
        );
      } else {
        await dispatch(createProgramme(formData)).unwrap();
        dispatch(
          showSnackbar({
            message: 'Programme créé avec succès',
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
            {isEditMode ? 'Modifier le programme' : 'Ajouter un programme'}
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom du programme"
              value={formData.nomProgramme}
              onChange={(e) => handleChange('nomProgramme', e.target.value)}
              error={!!errors.nomProgramme}
              helperText={errors.nomProgramme}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.domaine}>
              <InputLabel>Domaine *</InputLabel>
              <Select
                value={formData.domaine}
                label="Domaine *"
                onChange={(e) => handleChange('domaine', e.target.value)}
              >
                {allDomaines.map((dom) => (
                  <MenuItem key={dom} value={dom}>
                    {dom}
                  </MenuItem>
                ))}
              </Select>
              {errors.domaine && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.domaine}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Niveau</InputLabel>
              <Select
                value={formData.niveau}
                label="Niveau"
                onChange={(e) => handleChange('niveau', e.target.value as NiveauProgramme)}
              >
                {niveauOptions.map((niv) => (
                  <MenuItem key={niv} value={niv}>
                    {niv}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Établissement"
              value={formData.etablissementNom}
              onChange={(e) => handleChange('etablissementNom', e.target.value)}
              placeholder="Nom de l'établissement"
            />
          </Grid>

          {/* Détails du programme */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
              Détails du programme
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Durée"
              type="number"
              value={formData.duree}
              onChange={(e) => handleChange('duree', parseInt(e.target.value) || 0)}
              error={!!errors.duree}
              helperText={errors.duree}
              InputProps={{
                endAdornment: <InputAdornment position="end">année(s)</InputAdornment>,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Frais de scolarité"
              type="number"
              value={formData.fraisScolarite}
              onChange={(e) => handleChange('fraisScolarite', parseFloat(e.target.value) || 0)}
              error={!!errors.fraisScolarite}
              helperText={errors.fraisScolarite}
              InputProps={{
                endAdornment: <InputAdornment position="end">F CFA/an</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Conditions d'admission"
              value={formData.conditionsAdmission}
              onChange={(e) => handleChange('conditionsAdmission', e.target.value)}
              error={!!errors.conditionsAdmission}
              helperText={errors.conditionsAdmission}
              multiline
              rows={3}
              required
              placeholder="Ex: Bac scientifique ou technique, dossier et entretien"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Débouchés professionnels"
              value={formData.debouchesProfessionnels}
              onChange={(e) => handleChange('debouchesProfessionnels', e.target.value)}
              error={!!errors.debouchesProfessionnels}
              helperText={errors.debouchesProfessionnels}
              multiline
              rows={3}
              required
              placeholder="Ex: Développeur, Analyste programmeur, Administrateur systèmes"
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

export default ProgrammeModal;
