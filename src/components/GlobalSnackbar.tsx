import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { hideSnackbar } from '../store/slices/uiSlice';

const GlobalSnackbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { snackbar } = useAppSelector((state) => state.ui);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
