import React from 'react';
import { Chip, alpha } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { BORDER_RADIUS } from '../../constants';

type StatusType =
    | 'active' | 'inactive' | 'pending' | 'draft'
    | 'published' | 'closed' | 'open' | 'approved' | 'rejected'
    | 'ouverte' | 'a_venir' | 'cloturee' | 'en_attente'
    | 'soumise' | 'en_cours' | 'en_attente_concours';

interface StatusChipProps {
    status: StatusType | string;
    label?: string;
    size?: 'small' | 'medium';
}

const getStatusConfig = (status: string): { color: ChipProps['color']; label: string } => {
    const statusLower = (status && status.toLowerCase()) || '';

    switch (statusLower) {
        case 'active':
        case 'open':
        case 'ouverte':
        case 'approved':
        case 'validé':
        case 'validée':
        case 'acceptee':
        case 'acceptée':
            return { color: 'success', label: status };

        case 'inactive':
        case 'closed':
        case 'cloturee':
        case 'clôturée':
        case 'rejected':
        case 'rejeté':
        case 'rejetée':
        case 'refusee':
        case 'refusée':
            return { color: 'error', label: status };

        case 'pending':
        case 'en_attente':
        case 'en attente':
        case 'a_venir':
        case 'à venir':
        case 'en_liste_attente':
        case 'en_attente_concours':
            return { color: 'warning', label: status };

        case 'soumise':
        case 'en_cours':
        case 'en cours':
            return { color: 'info', label: status };

        case 'draft':
        case 'brouillon':
            return { color: 'default', label: status };

        case 'published':
        case 'publié':
        case 'publiée':
        case 'info':
            return { color: 'info', label: status };

        default:
            return { color: 'default', label: status };
    }
};

const formatLabel = (label: string): string => {
    return label
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const StatusChip: React.FC<StatusChipProps> = ({ status, label, size = 'small' }) => {
    const config = getStatusConfig(status || '');

    return (
        <Chip
            label={formatLabel(label || config.label)}
            sx={{
                minWidth: 100,
                borderRadius: BORDER_RADIUS.xs,
                fontWeight: 700,
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                bgcolor: alpha(
                    config.color === 'default' ? '#9e9e9e' :
                        config.color === 'primary' ? '#1976d2' :
                            config.color === 'success' ? '#2e7d32' :
                                config.color === 'error' ? '#d32f2f' :
                                    config.color === 'warning' ? '#ed6c02' :
                                        config.color === 'info' ? '#0288d1' : '#9e9e9e',
                    0.12
                ),
                color: (theme) => {
                    if (config.color === 'default' || config.color === undefined) return theme.palette.text.secondary;
                    const colorKey = config.color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
                    return theme.palette[colorKey].main;
                },
                border: '1px solid',
                borderColor: (theme) => {
                    if (config.color === 'default' || config.color === undefined) return alpha(theme.palette.divider, 0.5);
                    const colorKey = config.color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
                    const mainColor = theme.palette[colorKey].main;
                    return alpha(mainColor, 0.3);
                },
                '& .MuiChip-label': {
                    px: 1,
                    width: '100%',
                    textAlign: 'center',
                }
            }}
            size={size}
        />
    );
};

export default StatusChip;
