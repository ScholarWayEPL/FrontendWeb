import React from 'react';
import { Box, Card, CardContent, Typography, type SvgIconProps } from '@mui/material';
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

  const colorMap = {
    primary: { main: '#1565C0', light: '#E3F2FD' },
    secondary: { main: '#2E7D32', light: '#E8F5E9' },
    success: { main: '#2E7D32', light: '#E8F5E9' },
    warning: { main: '#ED6C02', light: '#FFF3E0' },
    error: { main: '#D32F2F', light: '#FFEBEE' },
    info: { main: '#0288D1', light: '#E1F5FE' },
  };

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
              borderRadius: BORDER_RADIUS.sm,
              bgcolor: colorMap[color].light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, {
              sx: { fontSize: 28, color: colorMap[color].main },
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
