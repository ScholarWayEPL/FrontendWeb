import type { Programme, ApiResponse, ProgrammeFilters } from '../types';
import { mockProgrammes } from './mockData';
import { delay } from '../utils/helpers';

// Copie locale pour les mutations
const programmes = [...mockProgrammes];

// Fonction pour générer un nouvel ID
let maxId = Math.max(...programmes.map((p) => p.idProgramme));

export const programmesApi = {
    // Récupérer tous les programmes avec pagination et filtres
    getAll: async (params: {
        page: number;
        limit: number;
        filters?: ProgrammeFilters;
    }): Promise<ApiResponse<Programme[]>> => {
        await delay(500);

        let filteredData = [...programmes];

        if (params.filters) {
            const { search, niveau, domaine } = params.filters;

            if (search) {
                const searchLower = search.toLowerCase();
                filteredData = filteredData.filter(
                    (p) =>
                        p.nomProgramme.toLowerCase().includes(searchLower) ||
                        p.domaine.toLowerCase().includes(searchLower) ||
                        p.etablissementNom && p.etablissementNom.toLowerCase().includes(searchLower)
                );
            }

            if (niveau) {
                filteredData = filteredData.filter((p) => p.niveau === niveau);
            }

            if (domaine) {
                filteredData = filteredData.filter((p) => p.domaine === domaine);
            }

        }

        const total = filteredData.length;
        const totalPages = Math.ceil(total / params.limit);
        const start = (params.page - 1) * params.limit;
        const end = start + params.limit;
        const paginatedData = filteredData.slice(start, end);

        return {
            data: paginatedData,
            success: true,
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages,
            },
        };
    },

    // Récupérer un programme par ID
    getById: async (id: number): Promise<ApiResponse<Programme>> => {
        await delay(300);
        const programme = programmes.find((p) => p.idProgramme === id);

        if (!programme) {
            throw new Error('Programme non trouvé');
        }

        return {
            data: programme,
            success: true,
        };
    },

    // Créer un nouveau programme
    create: async (data: Omit<Programme, 'idProgramme'>): Promise<ApiResponse<Programme>> => {
        await delay(500);
        maxId++;
        const newProgramme: Programme = {
            ...data,
            idProgramme: maxId,
        };
        programmes.unshift(newProgramme);
        return {
            data: newProgramme,
            success: true,
            message: 'Programme créé avec succès',
        };
    },

    // Mettre à jour un programme
    update: async (id: number, data: Partial<Programme>): Promise<ApiResponse<Programme>> => {
        await delay(500);
        const index = programmes.findIndex((p) => p.idProgramme === id);
        if (index === -1) {
            throw new Error('Programme non trouvé');
        }
        programmes[index] = { ...programmes[index], ...data };
        return {
            data: programmes[index],
            success: true,
            message: 'Programme modifié avec succès',
        };
    },

    // Supprimer un programme
    delete: async (id: number): Promise<ApiResponse<null>> => {
        await delay(500);
        const index = programmes.findIndex((p) => p.idProgramme === id);
        if (index === -1) {
            throw new Error('Programme non trouvé');
        }
        programmes.splice(index, 1);
        return {
            data: null,
            success: true,
            message: 'Programme supprimé avec succès',
        };
    },

    // Récupérer les niveaux disponibles
    getNiveaux: async (): Promise<string[]> => {
        await delay(200);
        return ['Licence', 'Master', 'Doctorat', 'BTS', 'DUT'];
    },

    // Récupérer les domaines disponibles
    getDomaines: async (): Promise<string[]> => {
        await delay(200);
        const domaines = [...new Set(programmes.map((p) => p.domaine))];
        return domaines.sort();
    },
};
