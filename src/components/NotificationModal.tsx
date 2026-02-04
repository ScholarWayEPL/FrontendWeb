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
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import type { Notification, TypeNotification } from '../types';

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: Omit<Notification, 'idNotification'>) => Promise<void>;
}

interface FormData {
  contenu: string;
  type: TypeNotification;
  idChecklist: number;
}

const initialFormData: FormData = {
  contenu: '',
  type: 'Information',
  idChecklist: 1,
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.contenu.trim()) {
      newErrors.contenu = 'Le contenu est requis';
    } else if (formData.contenu.length < 10) {
      newErrors.contenu = 'Le contenu doit faire au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSuccess({
        ...formData,
        dateEnvoi: new Date().toISOString(),
      });
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon color="warning" />
            <Typography variant="h6" fontWeight={600}>
              Nouvelle notification
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type de notification</InputLabel>
              <Select
                value={formData.type}
                label="Type de notification"
                onChange={(e) => handleChange('type', e.target.value as TypeNotification)}
              >
                <MenuItem value="Information">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'info.main',
                      }}
                    />
                    Information
                  </Box>
                </MenuItem>
                <MenuItem value="Rappel">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'warning.main',
                      }}
                    />
                    Rappel
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contenu de la notification"
              value={formData.contenu}
              onChange={(e) => handleChange('contenu', e.target.value)}
              error={!!errors.contenu}
              helperText={errors.contenu || `${formData.contenu.length}/500 caractères`}
              required
              multiline
              rows={4}
              placeholder="Saisissez le contenu de la notification..."
              inputProps={{ maxLength: 500 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ID Checklist associée"
              type="number"
              value={formData.idChecklist}
              onChange={(e) => handleChange('idChecklist', parseInt(e.target.value) || 1)}
              helperText="Identifiant de la checklist liée à cette notification"
              inputProps={{ min: 1 }}
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
          Envoyer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationModal;
