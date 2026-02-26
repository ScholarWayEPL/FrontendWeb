import React from 'react';
import { Grid } from '@mui/material';
import {
    Business as BusinessIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import StatCard from '../../../../components/StatCard';

interface ValidationStatsProps {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

const ValidationStats: React.FC<ValidationStatsProps> = ({ total, pending, approved, rejected }) => {
    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard title="Total Demandes" value={total} icon={<BusinessIcon />} color="info" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard title="En attente" value={pending} icon={<DescriptionIcon />} color="warning" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard title="Approuvées" value={approved} icon={<CheckCircleIcon />} color="success" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard title="Rejetées" value={rejected} icon={<CancelIcon />} color="error" />
            </Grid>
        </Grid>
    );
};

export default ValidationStats;
