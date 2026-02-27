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
  Link,
} from '@mui/material';
import {
  Close,
  Email,
  Phone,
  Language,
  LocationOn,
  School,
  Business,
  OpenInNew,
  Description,
} from '@mui/icons-material';
import type { EtablissementLoginData, TypeEtablissementBackend } from '../types';

interface EtablissementDetailsProps {
  open: boolean;
  onClose: () => void;
  etablissement: EtablissementLoginData | null;
  onEdit?: (etablissement: EtablissementLoginData) => void;
}

const EtablissementDetails: React.FC<EtablissementDetailsProps> = ({
  open,
  onClose,
  etablissement,
  onEdit,
}) => {
  if (!etablissement) return null;

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Université': '#1976d2',
      'École': '#9c27b0',
      'Institut': '#00897b',
    };
    return colors[type] || '#757575';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Université':
        return <School />;
      case 'École':
        return <Business />;
      default:
        return <School />;
    }
  };

  const getInitials = (nom: string) => {
    const words = nom.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return nom.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 10, overflow: 'hidden' },
      }}
    >
      {/* Header avec gradient */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${getTypeColor(etablissement.typeEtablissement)} 0%, ${alpha(getTypeColor(etablissement.typeEtablissement), 0.7)} 100%)`,
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
          <Avatar src={etablissement.logoUrl || ''}
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'white',
              color: getTypeColor(etablissement.typeEtablissement),
              fontSize: '1.5rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            {getInitials(etablissement.nom)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              {etablissement.nomEtablissement}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Chip
                icon={getTypeIcon(etablissement.type)}
                label={getTypeLabel(etablissement.typeEtablissement)}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
              <Chip
                icon={<LocationOn sx={{ color: 'white !important' }} />}
                label={etablissement.localisation}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* Colonne gauche - Coordonnées */}
          <Grid item xs={12} md={6} sx={{ p: 3, borderRight: { md: '1px solid #e0e0e0' } }}>
            <Typography variant="overline" color="text.secondary" fontWeight={600}>
              Coordonnées
            </Typography>

            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={etablissement.logoUrl || ''} sx={{ bgcolor: alpha('#1976d2', 0.1), width: 40, height: 40 }}>
                  <Email sx={{ color: 'primary.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    <Link href={`mailto:${etablissement.email}`} underline="hover">
                      {etablissement.email}
                    </Link>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={etablissement.logoUrl || ''} sx={{ bgcolor: alpha('#4caf50', 0.1), width: 40, height: 40 }}>
                  <Phone sx={{ color: '#4caf50' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Téléphone
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {etablissement.telephonePro}
                  </Typography>
                </Box>
              </Box>

              {etablissement.siteWeb && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={etablissement.logoUrl || ''} sx={{ bgcolor: alpha('#9c27b0', 0.1), width: 40, height: 40 }}>
                    <Language sx={{ color: '#9c27b0' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Site web
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      <Link
                        href={etablissement.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        {etablissement.siteWeb.replace(/^https?:\/\//, '')}
                        <OpenInNew sx={{ fontSize: 14 }} />
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={etablissement.logoUrl || ''} sx={{ bgcolor: alpha('#ff9800', 0.1), width: 40, height: 40 }}>
                  <LocationOn sx={{ color: '#ff9800' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Région
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    🇹🇬 {etablissement.localisation}, Togo
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Colonne droite - Infos supplémentaires */}
          <Grid item xs={12} md={6} sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary" fontWeight={600}>
              Informations
            </Typography>

            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={etablissement.logoUrl || ''} sx={{ bgcolor: alpha(getTypeColor(etablissement.typeEtablissement), 0.1), width: 40, height: 40 }}>
                  {React.cloneElement(getTypeIcon(etablissement.type), { sx: { color: getTypeColor(etablissement.typeEtablissement) } })}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Type d'établissement
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {etablissement.type}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={etablissement.logoUrl || ''} sx={{ bgcolor: alpha('#00897b', 0.1), width: 40, height: 40 }}>
                  <School sx={{ color: '#00897b' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip
                    label="Partenaire actif"
                    size="small"
                    color="success"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={etablissement.logoUrl || ''} sx={{ bgcolor: alpha('#1976d2', 0.1), width: 40, height: 40 }}>
                  <Business sx={{ color: '#1976d2' }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ID Établissement
                  </Typography>
                  <Typography variant="body1" fontWeight={500} fontFamily="monospace">
                    #{etablissement.idEtablissement.toString().padStart(4, '0')}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        {/* Description */}
        {etablissement.description && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Description color="primary" />
              <Typography variant="overline" color="text.secondary" fontWeight={600}>
                Description
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 8,
                lineHeight: 1.7,
              }}
            >
              {etablissement.description}
            </Typography>
          </Box>
        )}

        {/* Actions rapides */}
        <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="overline" color="text.secondary" fontWeight={600} sx={{ mb: 2, display: 'block' }}>
            Actions rapides
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {etablissement.siteWeb && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Language />}
                component="a"
                href={etablissement.siteWeb}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visiter le site
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<Email />}
              component="a"
              href={`mailto:${etablissement.email}`}
            >
              Envoyer un email
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Phone />}
              component="a"
              href={`tel:${etablissement.telephonePro}`}
            >
              Appeler
            </Button>
          </Stack>
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
              onEdit(etablissement);
            }}
          >
            Modifier
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EtablissementDetails;
