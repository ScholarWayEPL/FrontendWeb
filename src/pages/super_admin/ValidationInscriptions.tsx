import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import {
    VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { SearchField } from '../../components/ui';
import { ConfirmDialog } from '../../components';
import { etablissementsApi } from '../../api/etablissements';
import type { EtablissementEnAttente, StatutValidationEtablissement } from '../../types';
import {
    Tabs,
    Tab,
    Stack,
} from '@mui/material';

// Modular components
import {
    ValidationStats,
    ValidationTable,
    ValidationDetailsDialog,
} from './validation/components';

const ValidationInscriptions: React.FC = () => {
    const [demandes, setDemandes] = useState<EtablissementEnAttente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedDemande, setSelectedDemande] = useState<EtablissementEnAttente | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatutValidationEtablissement>('EN_ATTENTE');

    const fetchDemandes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await etablissementsApi.getPending({
                page: page,
                size: rowsPerPage,
                sort: 'dateCreation,DESC',
                valide: statusFilter
            });
            if (response.success) {
                setDemandes(response.data);
                if (response.pagination) {
                    setTotalElements(response.pagination.total);
                }
                setError(null);
            }
        } catch (err) {
            console.error('Erreur lors du chargement des demandes:', err);
            setError('Impossible de charger les demandes d\'inscription.');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, statusFilter]);

    useEffect(() => {
        fetchDemandes();
    }, [fetchDemandes]);

    const handleStatusChange = (_event: React.SyntheticEvent, newValue: StatutValidationEtablissement) => {
        setStatusFilter(newValue);
        setPage(0);
    };

    const filteredDemandes = demandes.filter((demande) =>
        demande.nomEtablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.localisation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: totalElements,
        enAttente: statusFilter === 'EN_ATTENTE' ? totalElements : 0, // Simplified for now as we don't have total counts for all statuses at once
        approuvees: statusFilter === 'ACTIF' ? totalElements : 0,
        rejetees: statusFilter === 'REJETE' ? totalElements : 0,
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (demande: EtablissementEnAttente) => {
        setSelectedDemande(demande);
        setDetailDialogOpen(true);
    };

    const handleOpenConfirmDialog = (demande: EtablissementEnAttente, action: 'approve' | 'reject') => {
        setSelectedDemande(demande);
        setConfirmAction(action);
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (selectedDemande && confirmAction) {
            try {
                setLoading(true);
                const action = confirmAction === 'approve'
                    ? etablissementsApi.validate(selectedDemande.idUtilisateur)
                    : etablissementsApi.reject(selectedDemande.idUtilisateur);

                const response = await action;

                if (response.success) {
                    // Mettre à jour la liste locale
                    setDemandes((prev) => prev.filter((d) => d.idUtilisateur !== selectedDemande.idUtilisateur));
                    setTotalElements((prev) => prev - 1);
                    // On pourrait aussi afficher un message de succès ici si on avait un snackbar
                }
            } catch (err) {
                console.error(`Erreur lors de l'action ${confirmAction}:`, err);
                setError(`Impossible de ${confirmAction === 'approve' ? 'valider' : 'rejeter'} l'établissement.`);
            } finally {
                setLoading(false);
            }
        }
        setConfirmDialogOpen(false);
        setSelectedDemande(null);
        setConfirmAction(null);
    };

    const getStatutLabel = (statut: string) => {
        switch (statut) {
            case 'EN_ATTENTE': return 'En attente';
            case 'ACTIF': return 'Approuvé';
            case 'REJETE': return 'Rejeté';
            case 'SUSPENDU': return 'Suspendu';
            default: return statut;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUserIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    Validation des Inscriptions
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Examinez et validez les demandes d'accès des nouveaux établissements ScholarWay.
                </Typography>
            </Box>

            {/* Stats */}
            <ValidationStats
                total={stats.total}
                pending={stats.enAttente}
                approved={stats.approuvees}
                rejected={stats.rejetees}
            />

            {/* Filters */}
            <Card sx={{ mb: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Tabs
                            value={statusFilter}
                            onChange={handleStatusChange}
                            sx={{
                                minHeight: 48,
                                '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                flexShrink: 0
                            }}
                        >
                            <Tab label="En attente" value="EN_ATTENTE" sx={{ fontWeight: 700, textTransform: 'none' }} />
                            <Tab label="Approuvés" value="ACTIF" sx={{ fontWeight: 700, textTransform: 'none' }} />
                            <Tab label="Rejetés" value="REJETE" sx={{ fontWeight: 700, textTransform: 'none' }} />
                            <Tab label="Suspendus" value="SUSPENDU" sx={{ fontWeight: 700, textTransform: 'none' }} />
                        </Tabs>
                        <SearchField
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Rechercher un établissement, une ville ou un email..."
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Stack>
                </CardContent>
            </Card>

            {/* Table */}
            <ValidationTable
                demandes={filteredDemandes}
                loading={loading}
                error={error}
                totalElements={totalElements}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onViewDetails={handleViewDetails}
                onApprove={(d) => handleOpenConfirmDialog(d, 'approve')}
                onReject={(d) => handleOpenConfirmDialog(d, 'reject')}
                getStatutLabel={getStatutLabel}
                formatDate={formatDate}
            />

            {/* Details Dialog */}
            <ValidationDetailsDialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                selectedDemande={selectedDemande}
                getStatutLabel={getStatutLabel}
                formatDate={formatDate}
                onApprove={(d) => { setDetailDialogOpen(false); handleOpenConfirmDialog(d, 'approve'); }}
                onReject={(d) => { setDetailDialogOpen(false); handleOpenConfirmDialog(d, 'reject'); }}
            />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                title={confirmAction === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le rejet'}
                message={confirmAction === 'approve'
                    ? `Souhaitez-vous valider l'entrée de "${selectedDemande ? selectedDemande.nomEtablissement : ''}" sur ScholarWay ? Un email d'activation sera envoyé.`
                    : `Confirmez-vous le rejet de cette demande ? L'établissement sera informé par email.`
                }
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmDialogOpen(false)}
            />
        </Box>
    );
};

export default ValidationInscriptions;
