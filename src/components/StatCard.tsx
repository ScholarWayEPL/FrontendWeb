import React from 'react';
import { Box, Card, CardContent, Typography, type SvgIconProps, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { BORDER_RADIUS, SHADOWS } from '../constants';

interface StatCardProps {
  title: string;
  value: number | string;
  growth?: number;
  icon: React.ReactElement<SvgIconProps>;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon, color }) => {
  const isPositiveGrowth = growth !== undefined && growth >= 0;

  const theme = useTheme();

  const colorMap = {
    primary: { main: theme.palette.primary.main, light: 'rgba(21,101,192,0.08)' },
    secondary: { main: theme.palette.secondary.main, light: 'rgba(46,125,50,0.08)' },
    success: { main: theme.palette.success.main, light: 'rgba(46,125,50,0.08)' },
    warning: { main: theme.palette.warning.main, light: 'rgba(237,108,2,0.06)' },
    error: { main: theme.palette.error.main, light: 'rgba(211,47,47,0.06)' },
    info: { main: theme.palette.info.main, light: 'rgba(2,136,209,0.06)' },
  } as const;

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: BORDER_RADIUS.md,
        boxShadow: SHADOWS.card,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: SHADOWS.cardHover,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            </Typography>
            {growth !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {isPositiveGrowth ? (
                  <TrendingUp sx={{ fontSize: 18, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 18, color: 'error.main', mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: isPositiveGrowth ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {isPositiveGrowth ? '+' : ''}{growth}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  ce mois
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: BORDER_RADIUS.full,
              bgcolor: colorMap[color].light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {React.cloneElement(icon, {
              sx: { fontSize: 26, color: colorMap[color].main },
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
