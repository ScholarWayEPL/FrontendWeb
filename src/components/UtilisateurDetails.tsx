import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Stack,
  alpha,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Email,
  Phone,
  School,
  AttachMoney,
  CalendarToday,
  Work,
  Person,
  Flag,
} from '@mui/icons-material';
import type { Bachelier } from '../types';
import { formatCFA } from '../constants';
import { getFileUrl } from '../utils/helpers';

interface UtilisateurDetailsProps {
  open: boolean;
  onClose: () => void;
  utilisateur: Bachelier | null;
  loading?: boolean;
  onEdit?: (utilisateur: Bachelier) => void;
}

const UtilisateurDetails: React.FC<UtilisateurDetailsProps> = ({
  open,
  onClose,
  utilisateur,
  loading = false,
  onEdit,
}) => {
  if (!utilisateur) return null;

  const { serieBac, moyenneBac, budgetMax, objectifsProfessionnels: objectives } = utilisateur;

  const getSerieColor = (serie: string | null) => {
    if (!serie) return '#757575';
    const colors: Record<string, string> = {
      C: '#1976d2',
      D: '#2e7d32',
      A4: '#9c27b0',
      G2: '#ed6c02',
      E: '#0288d1',
      F1: '#d32f2f',
      F2: '#7b1fa2',
      F3: '#388e3c',
    };
    return colors[serie] || '#757575';
  };

  const getMoyenneColor = (moyenne: number | null) => {
    if (moyenne === null) return '#9e9e9e';
    if (moyenne >= 16) return '#4caf50';
    if (moyenne >= 14) return '#2196f3';
    if (moyenne >= 12) return '#ff9800';
    return '#9e9e9e';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non renseigné';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      return new Intl.DateTimeFormat('fr-TG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch {
      return 'Date invalide';
    }
  };

  const getInitials = (nom: string | undefined, prenom: string | undefined) => {
    const p = prenom?.charAt(0) || '';
    const n = nom?.charAt(0) || '';
    return (p + n).toUpperCase() || '?';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, overflow: 'hidden' },
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha('#fff', 0.6),
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Header avec gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={getFileUrl(utilisateur.avatar)}
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'white',
              color: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            {getInitials(utilisateur.nom, utilisateur.prenom)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {utilisateur.prenom} {utilisateur.nom}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              Bachelier inscrit sur ScholarWay
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Chip
                icon={<School sx={{ color: 'white !important' }} />}
                label={serieBac ? `Série ${serieBac}` : 'Série N/A'}
                size="small"
                sx={{
                  bgcolor: alpha(getSerieColor(serieBac), 0.3),
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
              <Chip
                label={moyenneBac !== null ? `${moyenneBac}/20` : 'Moyenne N/A'}
                size="small"
                sx={{
                  bgcolor: alpha(getMoyenneColor(moyenneBac), 0.3),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* Colonne gauche - Infos personnelles */}
          <Grid item xs={12} md={6} sx={{ p: 3, borderRight: { md: '1px solid #e0e0e0' } }}>
            <Typography variant="overline" color="text.secondary" fontWeight={600}>
              Informations personnelles
            </Typography>

            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), width: 40, height: 40 }}>
                  <Email sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {utilisateur.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#4caf50', 0.1), width: 40, height: 40 }}>
                  <Phone sx={{ color: '#4caf50' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Téléphone
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {utilisateur.telephone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#ff9800', 0.1), width: 40, height: 40 }}>
                  <CalendarToday sx={{ color: '#ff9800' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Date d'inscription
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(utilisateur.dateCreation)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#9c27b0', 0.1), width: 40, height: 40 }}>
                  <Flag sx={{ color: '#9c27b0' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pays
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    🇹🇬 Togo
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Colonne droite - Infos académiques */}
          <Grid item xs={12} md={6} sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary" fontWeight={600}>
              Informations académiques
            </Typography>

            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1), width: 40, height: 40 }}>
                  <School sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Série du Baccalauréat
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {serieBac || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#4caf50', 0.1), width: 40, height: 40 }}>
                  <Person sx={{ color: '#4caf50' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Moyenne au Bac
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" fontWeight={700} color={getMoyenneColor(moyenneBac)}>
                      {moyenneBac !== null ? moyenneBac : 'N/A'}
                    </Typography>
                    {moyenneBac !== null && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          / 20
                        </Typography>
                        <Chip
                          label={
                            moyenneBac >= 16
                              ? 'Très Bien'
                              : moyenneBac >= 14
                                ? 'Bien'
                                : moyenneBac >= 12
                                  ? 'Assez Bien'
                                  : 'Passable'
                          }
                          size="small"
                          sx={{
                            bgcolor: alpha(getMoyenneColor(moyenneBac), 0.1),
                            color: getMoyenneColor(moyenneBac),
                            fontWeight: 600,
                            ml: 1,
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#ff9800', 0.1), width: 40, height: 40 }}>
                  <AttachMoney sx={{ color: '#ff9800' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Budget maximum
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    {budgetMax !== null ? formatCFA(budgetMax) : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        {/* Objectifs professionnels */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Work color="primary" />
            <Typography variant="overline" color="text.secondary" fontWeight={600}>
              Objectifs professionnels
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              p: 2.5,
              bgcolor: 'grey.50',
              borderRadius: '12px',
              lineHeight: 1.8,
              fontStyle: objectives ? 'italic' : 'normal',
              color: objectives ? 'text.primary' : 'text.disabled',
              textAlign: objectives ? 'left' : 'center',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            {objectives ? `"${objectives}"` : "Aucun objectif professionnel défini pour le moment."}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
        {onEdit && (
          <Button
            variant="contained"
            onClick={() => {
              onClose();
              onEdit(utilisateur);
            }}
          >
            Modifier
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UtilisateurDetails;
