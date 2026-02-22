import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { BORDER_RADIUS, SHADOWS, TRANSITIONS } from '../../constants';

interface DataCardProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    noPadding?: boolean;
    headerDivider?: boolean;
    elevation?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({
    title,
    subtitle,
    action,
    children,
    noPadding = false,
    headerDivider = false,
    elevation = true,
}) => {
    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: BORDER_RADIUS.md,
                boxShadow: elevation ? SHADOWS.card : 'none',
                border: elevation ? 'none' : '1px solid',
                borderColor: 'grey.200',
                transition: `box-shadow ${TRANSITIONS.normal}`,
                '&:hover': {
                    boxShadow: elevation ? SHADOWS.cardHover : 'none',
                },
            }}
        >
            <Box sx={{ px: 3, pt: 3, pb: headerDivider ? 2 : 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: '0.2px' }}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {action}
                </Box>
            </Box>
            {headerDivider && <Divider sx={{ borderColor: 'divider', opacity: 0.6 }} />}
            {noPadding ? (
                <Box>{children}</Box>
            ) : (
                <CardContent sx={{ pt: headerDivider ? 2 : 0, px: 3, pb: 3 }}>
                    {children}
                </CardContent>
            )}
        </Card>
    );
};

export default DataCard;
