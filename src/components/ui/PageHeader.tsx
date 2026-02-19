import React from 'react';
import { Box, Typography, Stack, Avatar, Chip, alpha, useTheme } from '@mui/material';
import { BORDER_RADIUS, AVATAR_SIZES } from '../../constants';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    iconColor?: string;
    badge?: {
        label: string;
        color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';
    };
    action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    icon,
    iconColor,
    badge,
    action,
}) => {
    const theme = useTheme();
    const color = iconColor || theme.palette.primary.main;

    return (
        <Box sx={{ mb: 4 }}>
            <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    {icon && (
                        <Avatar
                            sx={{
                                bgcolor: alpha(color, 0.1),
                                width: AVATAR_SIZES.lg,
                                height: AVATAR_SIZES.lg,
                                borderRadius: BORDER_RADIUS.sm,
                                '& .MuiSvgIcon-root': {
                                    color: color,
                                    fontSize: 28,
                                },
                            }}
                        >
                            {icon}
                        </Avatar>
                    )}
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Typography variant="h4" fontWeight={700}>
                                {title}
                            </Typography>
                            {badge && (
                                <Chip
                                    label={badge.label}
                                    color={badge.color || 'primary'}
                                    size="small"
                                    sx={{ borderRadius: BORDER_RADIUS.xs }}
                                />
                            )}
                        </Stack>
                        {subtitle && (
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Stack>
                {action && <Box>{action}</Box>}
            </Stack>
        </Box>
    );
};

export default PageHeader;
