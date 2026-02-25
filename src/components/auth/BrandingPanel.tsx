import React from 'react';
import { Box, Stack, Typography, Divider, useTheme, alpha } from '@mui/material';
import {
    School as SchoolIcon,
    AutoGraph,
    Groups,
    MenuBook,
} from '@mui/icons-material';

interface FeatureItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Stack direction="row" spacing={2.5} alignItems="flex-start" sx={{
            py: 2,
            pl: 0,
            pr: 2,
            borderRadius: 3,
            transition: 'all 0.2s ease',
        }}>
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    flexShrink: 0,
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(99, 102, 241, 0.1)' : alpha(theme.palette.primary.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.2)' : alpha(theme.palette.primary.main, 0.15),
                }}
            >
                {icon}
            </Box>
            <Box sx={{ pt: 0.5 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: isDark ? 'white' : 'text.primary', mb: 0.5, lineHeight: 1.2 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'text.secondary', lineHeight: 1.5, fontSize: '0.875rem' }}>
                    {description}
                </Typography>
            </Box>
        </Stack>
    );
};

const BrandingPanel: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                flex: 0.55,
                display: { xs: 'none', lg: 'flex' },
                py: 8,
                pl: 5,
                pr: 3,
                background: isDark
                    ? 'linear-gradient(165deg, rgba(30, 41, 59, 0.4) 0%, rgba(2, 6, 23, 0.6) 100%)'
                    : `linear-gradient(165deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRight: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }}
        >
            <Box>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 8 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)',
                        }}
                    >
                        <SchoolIcon sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={800} sx={{ color: isDark ? 'white' : 'primary.main', letterSpacing: '-0.02em' }}>
                        ScholarWay
                    </Typography>
                </Stack>

                <Stack spacing={1}>
                    <FeatureItem
                        icon={<AutoGraph sx={{ color: isDark ? 'white' : 'primary.main', fontSize: 20 }} />}
                        title="Analytique"
                        description="Suivi en temps réel des candidatures et des admissions."
                    />
                    <FeatureItem
                        icon={<Groups sx={{ color: isDark ? 'white' : 'primary.main', fontSize: 20 }} />}
                        title="Proximité"
                        description="Lien direct avec les futurs étudiants sans prospection."
                    />
                    <FeatureItem
                        icon={<MenuBook sx={{ color: isDark ? 'white' : 'primary.main', fontSize: 20 }} />}
                        title="Catalogue"
                        description="Visibilité nationale accrue et partage des catalogues."
                    />
                </Stack>
            </Box>

            <Box>
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', mb: 3 }} />
                <Stack direction="row" spacing={4}>
                    <Box>
                        <Typography variant="h5" color={isDark ? "white" : "primary.main"} fontWeight={800}>180+</Typography>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Filières</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" color={isDark ? "white" : "primary.main"} fontWeight={800}>50+</Typography>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Partenaires</Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default BrandingPanel;
