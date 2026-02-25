import React from 'react';
import {
  Dialog,
  Button,
  Typography,
  Box,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Zoom,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmColor = 'error',
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getIcon = () => {
    switch (confirmColor) {
      case 'error': return <ErrorIcon sx={{ fontSize: 32, color: 'error.main' }} />;
      case 'warning': return <WarningIcon sx={{ fontSize: 32, color: 'warning.main' }} />;
      case 'success': return <SuccessIcon sx={{ fontSize: 32, color: 'success.main' }} />;
      case 'info':
      case 'primary':
      default: return <InfoIcon sx={{ fontSize: 32, color: 'primary.main' }} />;
    }
  };

  const getBgColor = () => {
    const colorKey = confirmColor === 'primary' ? 'primary' : confirmColor;
    const baseColor = theme.palette[colorKey as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main;
    return alpha(baseColor, isDark ? 0.1 : 0.05);
  };

  const getPrimaryColor = () => {
    const colorKey = confirmColor === 'primary' ? 'primary' : confirmColor;
    return theme.palette[colorKey as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main;
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          borderRadius: '28px',
          backgroundImage: 'none',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }
      }}
    >
      <Box sx={{ p: 4, pt: 5, textAlign: 'center' }}>
        <Avatar
          sx={{
            mx: 'auto',
            mb: 3,
            width: 80,
            height: 80,
            bgcolor: getBgColor(),
            border: '1px solid',
            borderColor: alpha(getPrimaryColor(), 0.2)
          }}
        >
          {getIcon()}
        </Avatar>

        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', px: 2, lineHeight: 1.6, mb: 4 }}>
          {message}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            onClick={onCancel}
            variant="outlined"
            sx={{
              borderRadius: '16px',
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'text.secondary'
              }
            }}
          >
            {cancelText}
          </Button>
          <Button
            fullWidth
            onClick={onConfirm}
            variant="contained"
            color={confirmColor}
            autoFocus
            sx={{
              borderRadius: '16px',
              py: 1.5,
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: `0 8px 16px ${alpha(getPrimaryColor(), 0.3)}`,
              '&:hover': {
                boxShadow: `0 12px 20px ${alpha(getPrimaryColor(), 0.4)}`,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {confirmText}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
