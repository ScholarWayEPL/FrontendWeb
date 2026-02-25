import React from 'react';
import { Box, Card, CardContent, Typography, type SvgIconProps, useTheme, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

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

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: theme.palette.mode === 'dark'
            ? `0 20px 40px -12px ${alpha(theme.palette[color].main, 0.25)}`
            : `0 20px 40px -12px ${alpha(theme.palette[color].main, 0.15)}`,
          borderColor: alpha(theme.palette[color].main, 0.3),
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary', mt: 0.5 }}>
              {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            </Typography>
            {growth !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.2,
                    borderRadius: '12px',
                    bgcolor: isPositiveGrowth ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                    color: isPositiveGrowth ? 'success.main' : 'error.main'
                  }}
                >
                  {isPositiveGrowth ? (
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                  )}
                  <Typography variant="caption" fontWeight={700}>
                    {isPositiveGrowth ? '+' : ''}{growth}%
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ ml: 1, color: 'text.disabled', fontWeight: 500 }}>
                  vs mois dernier
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: alpha(theme.palette[color].main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.main`,
              boxShadow: `inset 0 0 12px ${alpha(theme.palette[color].main, 0.1)}`,
            }}
          >
            {React.cloneElement(icon, {
              sx: { fontSize: 28 },
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
