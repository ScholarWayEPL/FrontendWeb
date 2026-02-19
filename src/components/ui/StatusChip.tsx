import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { BORDER_RADIUS } from '../../constants';

type StatusType = 
    | 'active' | 'inactive' | 'pending' | 'draft' 
    | 'published' | 'closed' | 'open' | 'approved' | 'rejected'
    | 'ouverte' | 'a_venir' | 'cloturee' | 'en_attente';

interface StatusChipProps {
    status: StatusType | string;
    label?: string;
    size?: 'small' | 'medium';
}

const getStatusConfig = (status: string): { color: ChipProps['color']; label: string } => {
    const statusLower = status?.toLowerCase() || '';
    
    switch (statusLower) {
        case 'active':
        case 'open':
        case 'ouverte':
        case 'approved':
        case 'validé':
        case 'validée':
            return { color: 'success', label: status };
        
        case 'inactive':
        case 'closed':
        case 'cloturee':
        case 'clôturée':
        case 'rejected':
        case 'rejeté':
        case 'rejetée':
            return { color: 'error', label: status };
        
        case 'pending':
        case 'en_attente':
        case 'en attente':
        case 'a_venir':
        case 'à venir':
            return { color: 'warning', label: status };
        
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
            color={config.color}
            size={size}
            sx={{ 
                borderRadius: BORDER_RADIUS.xs,
                fontWeight: 500,
            }}
        />
    );
};

export default StatusChip;
