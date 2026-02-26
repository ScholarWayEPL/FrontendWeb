import React from 'react';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Box,
    CircularProgress,
    Typography,
    Alert,
    alpha,
    useTheme,
} from '@mui/material';
import ValidationTableRow from './ValidationTableRow';
import type { EtablissementEnAttente } from '../../../../types';

interface ValidationTableProps {
    demandes: EtablissementEnAttente[];
    loading: boolean;
    error: string | null;
    totalElements: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onViewDetails: (demande: EtablissementEnAttente) => void;
    onQuickApprove: (demande: EtablissementEnAttente) => void;
    onQuickReject: (demande: EtablissementEnAttente) => void;
    getStatutLabel: (statut: string) => string;
    formatDate: (dateString: string) => string;
}

const ValidationTable: React.FC<ValidationTableProps> = ({
    demandes,
    loading,
    error,
    totalElements,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onViewDetails,
    onQuickApprove,
    onQuickReject,
    getStatutLabel,
    formatDate,
}) => {
    const theme = useTheme();

    return (
        <TableContainer component={Card} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative' }}>
            {loading && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.background.paper, 0.7), zIndex: 1 }}>
                    <CircularProgress />
                </Box>
            )}
            <Table>
                <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Etablissement</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>Localisation</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Statut</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {demandes.map((demande) => (
                        <ValidationTableRow
                            key={demande.idUtilisateur}
                            demande={demande}
                            onViewDetails={onViewDetails}
                            onQuickApprove={onQuickApprove}
                            onQuickReject={onQuickReject}
                            getStatutLabel={getStatutLabel}
                            formatDate={formatDate}
                        />
                    ))}
                    {!loading && demandes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Aucune demande d'inscription trouvée.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {error && !loading && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                <Alert severity="error" sx={{ mx: 'auto', width: 'fit-content' }}>{error}</Alert>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                labelRowsPerPage="Lignes par page"
                sx={{ borderTop: '1px solid', borderColor: 'divider' }}
            />
        </TableContainer>
    );
};

export default ValidationTable;
