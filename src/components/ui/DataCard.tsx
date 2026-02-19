import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, Divider } from '@mui/material';
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
            <CardHeader
                title={
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                }
                subheader={subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
                action={action}
                sx={{ pb: headerDivider ? 2 : 0 }}
            />
            {headerDivider && <Divider />}
            {noPadding ? (
                <Box>{children}</Box>
            ) : (
                <CardContent sx={{ pt: headerDivider ? 2 : 0 }}>
                    {children}
                </CardContent>
            )}
        </Card>
    );
};

export default DataCard;
