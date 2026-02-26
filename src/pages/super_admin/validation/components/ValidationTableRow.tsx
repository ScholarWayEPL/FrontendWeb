import React from 'react';
import {
    Box,
    TableRow,
    TableCell,
    Stack,
    Avatar,
    Typography,
    Tooltip,
    IconButton,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { StatusChip } from '../../../../components/ui';
import type { EtablissementEnAttente } from '../../../../types';

interface ValidationTableRowProps {
    demande: EtablissementEnAttente;
    onViewDetails: (demande: EtablissementEnAttente) => void;
    onApprove: (demande: EtablissementEnAttente) => void;
    onReject: (demande: EtablissementEnAttente) => void;
    getStatutLabel: (statut: string) => string;
    formatDate: (dateString: string) => string;
}

const ValidationTableRow: React.FC<ValidationTableRowProps> = ({
    demande,
    onViewDetails,
    onApprove,
    onReject,
    getStatutLabel,
    formatDate,
}) => {
    const theme = useTheme();

    return (
        <TableRow key={demande.idUtilisateur} hover sx={{ '&:last-child td': { border: 0 } }}>
            <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        src={demande.logoUrl ? `https://scholarway.pepit.cloud/api/files/${demande.logoUrl}` : undefined}
                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}
                    >
                        {demande.nomEtablissement.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={700}>
                            {demande.nomEtablissement}
                        </Typography>
                        {demande.siteWeb && (
                            <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} component="a" href={demande.siteWeb} target="_blank">
                                {demande.siteWeb.replace(/^https?:\/\//, '')}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </TableCell>
            <TableCell>
                <Typography variant="body2" fontWeight={500}>{demande.email}</Typography>
                <Typography variant="caption" color="text.secondary">{demande.telephonePro}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{demande.localisation}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{formatDate(demande.dateCreation)}</Typography>
            </TableCell>
            <TableCell>
                <StatusChip status={demande.statut.toLowerCase()} label={getStatutLabel(demande.statut)} />
            </TableCell>
            <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Examiner le dossier">
                        <IconButton size="small" sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }} onClick={() => onViewDetails(demande)}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Approuver">
                        <IconButton size="small" sx={{ color: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.05) }} onClick={() => onApprove(demande)}>
                            <CheckCircleIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Rejeter">
                        <IconButton size="small" sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }} onClick={() => onReject(demande)}>
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
};

export default ValidationTableRow;
