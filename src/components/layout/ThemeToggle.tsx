import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDarkMode } from '../../store/slices/uiSlice';

const ThemeToggle: React.FC = () => {
    const dispatch = useAppDispatch();
    const darkMode = useAppSelector((state) => state.ui.darkMode);

    return (
        <Tooltip title={darkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}>
            <IconButton
                onClick={() => dispatch(toggleDarkMode())}
                sx={{
                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: darkMode ? 'primary.light' : 'primary.main',
                    '&:hover': {
                        bgcolor: darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.1)',
                    }
                }}
            >
                {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
