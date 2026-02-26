import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { exportCandidaturesToExcel, exportCandidaturesGroupedExcel } from '../utils/excelUtils';
import { generateCandidaturesPDF, generateCandidaturesGroupedPDF } from '../utils/pdfUtils';
import { fetchCandidatures as fetchCandidaturesService } from '../api/candidatures';
import { mockParcours, mockFilieres } from '../api/mockData/candidatures';

export const useCandidatures = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [initialData, setInitialData] = useState<any[]>([]);
    const [selectedParcours, setSelectedParcours] = useState('Tous les parcours');
    const [selectedFiliere, setSelectedFiliere] = useState('Toutes les filières');
    const [selectedStatut, setSelectedStatut] = useState('Tous');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCandidat, setSelectedCandidat] = useState<any | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const filteredCandidatures = useMemo(() => {
        return initialData.filter((c) => {
            const term = searchTerm.toLowerCase();
            const matchSearch =
                c.nom.toLowerCase().includes(term) ||
                c.prenom.toLowerCase().includes(term) ||
                c.numeroCandidature.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term);
            const matchParcours = selectedParcours === 'Tous les parcours' || c.parcours === selectedParcours;
            const matchFiliere = selectedFiliere === 'Toutes les filières' || c.filiere === selectedFiliere;
            const matchStatut = selectedStatut === 'Tous' || c.statut === selectedStatut;
            return matchSearch && matchParcours && matchFiliere && matchStatut;
        });
    }, [initialData, searchTerm, selectedParcours, selectedFiliere, selectedStatut]);

    const stats = useMemo(() => ({
        total: initialData.length,
        enAttente: initialData.filter(c => c.statut === 'SOUMISE' || c.statut === 'EN_COURS').length,
        acceptees: initialData.filter(c => c.statut === 'ACCEPTEE').length,
        refusees: initialData.filter(c => c.statut === 'REFUSEE').length,
    }), [initialData]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await fetchCandidaturesService();
                if (mounted) setInitialData(data);
            } catch (err) {
                // fallback to empty
                if (mounted) setInitialData([]);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

    const calculateAge = (dateNaissance: string) => {
        const today = new Date();
        const birthDate = new Date(dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const handleExport = (format: 'excel' | 'pdf', grouped: boolean = false) => {
        const dataToExport = filteredCandidatures.map(c => ({
            numeroCandidature: c.numeroCandidature,
            nomCandidat: c.nom,
            prenomCandidat: c.prenom,
            emailCandidat: c.email,
            parcours: c.parcours,
            serieBac: c.serieBac,
            moyenneBac: c.moyenneBac,
            dateSoumission: c.dateSoumission,
            statut: getStatutLabel(c.statut),
        }));

        const filename = `candidatures_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}`;

        if (format === 'excel') {
            if (grouped) exportCandidaturesGroupedExcel(dataToExport, filename + '_grouped');
            else exportCandidaturesToExcel(dataToExport, filename);
        } else {
            if (grouped) generateCandidaturesGroupedPDF(dataToExport, filename + '_grouped', user ? user.etablissementNom : undefined);
            else generateCandidaturesPDF(dataToExport, filename, user ? user.etablissementNom : undefined);
        }
    };

    const getStatutLabel = (statut: string) => {
        switch (statut) {
            case 'SOUMISE': return 'Soumise';
            case 'EN_COURS': return 'En cours';
            case 'ACCEPTEE': return 'Acceptée';
            case 'REFUSEE': return 'Refusée';
            case 'EN_ATTENTE_CONCOURS': return 'Attente concours';
            default: return statut;
        }
    };

    return {
        user,
        searchTerm,
        setSearchTerm,
        selectedParcours,
        setSelectedParcours,
        selectedStatut,
        setSelectedStatut,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        selectedCandidat,
        setSelectedCandidat,
        detailsOpen,
        setDetailsOpen,
        filteredCandidatures,
        stats,
        formatDate,
        calculateAge,
        handleExport,
        getStatutLabel,
        mockParcours,
        mockFilieres,
        selectedFiliere,
        setSelectedFiliere,
    } as const;
};

export default useCandidatures;
