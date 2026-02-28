import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Avatar,
    IconButton,
    Chip,
    Divider,
    Paper,
    Tab,
    Tabs,
    Badge,
    Pagination,
    Skeleton,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Delete as DeleteIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    AccessTime as TimeIcon,
} from '@mui/icons-material';
import type { Notification, TypeNotificationBackend } from '../../types';
import { formatRelativeTime } from '../../utils/helpers';

interface NotificationListProps {
    notifications: Notification[];
    loading?: boolean;
    activeTab: number;
    onTabChange: (tab: number) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onMarkAsRead: (id: number) => void;
    onDelete: (id: number) => void;
    unreadCount: number;
    criticalCount?: number;
}

const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    loading = false,
    activeTab,
    onTabChange,
    currentPage,
    totalPages,
    onPageChange,
    onMarkAsRead,
    onDelete,
    unreadCount,
    criticalCount = 0,
}) => {
    const theme = useTheme();

    const getTypeConfig = (type: TypeNotificationBackend) => {
        const configs: Record<TypeNotificationBackend, { icon: typeof InfoIcon; color: string; label: string }> = {
            SYSTEME: { icon: InfoIcon, color: theme.palette.info.main, label: 'Système' },
            UTILISATEUR: { icon: PersonIcon, color: theme.palette.primary.main, label: 'Utilisateur' },
            ETABLISSEMENT: { icon: BusinessIcon, color: theme.palette.secondary.main, label: 'Établissement' },
            CANDIDATURE: { icon: WarningIcon, color: theme.palette.warning.main, label: 'Candidature' },
        };
        return configs[type] || configs.SYSTEME;
    };

    const renderSkeleton = () => (
        <Stack spacing={0} divider={<Divider />}>
            {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ p: 3 }}>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="40%" height={24} />
                            <Skeleton variant="text" width="80%" height={20} sx={{ my: 1 }} />
                            <Skeleton variant="text" width="30%" height={16} />
                        </Box>
                    </Stack>
                </Box>
            ))}
        </Stack>
    );

    return (
        <Paper
            sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                boxShadow: 'none',
            }}
        >
            <Tabs
                value={activeTab}
                onChange={(_, v) => onTabChange(v)}
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '& .MuiTab-root': { fontWeight: 700, px: 3, py: 2.5 },
                }}
            >
                <Tab
                    label={
                        <Stack direction="row" spacing={1} alignItems="center">
                            <span>Toutes</span>
                            <Chip
                                label={notifications.length}
                                size="small"
                                sx={{ height: 20, bgcolor: 'action.hover', fontWeight: 700 }}
                            />
                        </Stack>
                    }
                />
                <Tab
                    label={
                        <Stack direction="row" spacing={1} alignItems="center">
                            <span>Non lues</span>
                            <Badge
                                badgeContent={unreadCount}
                                color="primary"
                                sx={{ '& .MuiBadge-badge': { top: -2, right: -4 } }}
                            >
                                <Box sx={{ width: 4 }} />
                            </Badge>
                        </Stack>
                    }
                />
                {criticalCount > 0 && (
                    <Tab
                        label={
                            <Stack direction="row" spacing={1} alignItems="center">
                                <span>Critiques</span>
                                <Badge
                                    badgeContent={criticalCount}
                                    color="error"
                                    sx={{ '& .MuiBadge-badge': { top: -2, right: -4 } }}
                                >
                                    <Box sx={{ width: 4 }} />
                                </Badge>
                            </Stack>
                        }
                    />
                )}
            </Tabs>

            {loading ? (
                renderSkeleton()
            ) : (
                <Stack spacing={0} divider={<Divider />}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 10, textAlign: 'center' }}>
                            <NotificationsIcon
                                sx={{ fontSize: 64, color: 'text.disabled', opacity: 0.2, mb: 2 }}
                            />
                            <Typography variant="h6" color="text.secondary">
                                Aucune notification à afficher
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((n) => {
                            const typeConfig = getTypeConfig(n.type);
                            const TypeIcon = typeConfig.icon;
                            return (
                                <Box
                                    key={n.idNotification}
                                    onClick={() => !n.estLue && onMarkAsRead(n.idNotification)}
                                    sx={{
                                        p: 3,
                                        transition: 'all 0.2s',
                                        cursor: n.estLue ? 'default' : 'pointer',
                                        bgcolor: n.estLue ? 'transparent' : alpha(typeConfig.color, 0.03),
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                                        position: 'relative',
                                    }}
                                >
                                    {!n.estLue && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: 4,
                                                bgcolor: typeConfig.color,
                                            }}
                                        />
                                    )}
                                    <Stack direction="row" spacing={3} alignItems="flex-start">
                                        <Avatar
                                            sx={{
                                                bgcolor: alpha(typeConfig.color, 0.1),
                                                color: typeConfig.color,
                                                width: 48,
                                                height: 48,
                                                border: `1px solid ${alpha(typeConfig.color, 0.1)}`,
                                            }}
                                        >
                                            <TypeIcon />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1.5}
                                                sx={{ mb: 0.5 }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={n.estLue ? 600 : 800}
                                                    sx={{ color: 'text.primary' }}
                                                >
                                                    {n.titre}
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 2, maxWidth: 800 }}
                                            >
                                                {n.contenu}
                                            </Typography>
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <Chip
                                                    icon={
                                                        <TypeIcon sx={{ fontSize: '14px !important' }} />
                                                    }
                                                    label={typeConfig.label}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        height: 24,
                                                        fontWeight: 700,
                                                        borderRadius: '6px',
                                                    }}
                                                />
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={0.5}
                                                    sx={{ color: 'text.disabled' }}
                                                >
                                                    <TimeIcon sx={{ fontSize: 14 }} />
                                                    <Typography variant="caption" fontWeight={500}>
                                                        {formatRelativeTime(n.dateEnvoi)}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(n.idNotification);
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            );
                        })
                    )}
                </Stack>
            )}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, p) => onPageChange(p)}
                        color="primary"
                        sx={{ '& .MuiPaginationItem-root': { fontWeight: 700 } }}
                    />
                </Box>
            )}
        </Paper>
    );
};

export default NotificationList;
