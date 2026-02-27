import client from './client';
import type { ApiResponse } from '../types';

export interface CreateDomaineRequest {
    nomDomaine: string;
    description?: string;
}

// Shape réelle retournée par GET /api/domaines
export interface DomaineListItem {
    idDomaine: number | null;
    nomDomaine: string;
    description: string | null;
    nombreParcours: number;
}

export const domainesApi = {
    /**
     * Crée un nouveau domaine de formation.
     * POST /api/domaines (ADMIN uniquement)
     */
    createDomaine: async (data: CreateDomaineRequest): Promise<DomaineListItem> => {
        const response = await client.post<ApiResponse<DomaineListItem>>('/domaines', data);
        return response.data.data;
    },

    /**
     * Récupère la liste de tous les domaines.
     * GET /api/domaines (accès public)
     */
    getDomaines: async (): Promise<DomaineListItem[]> => {
        const response = await client.get<ApiResponse<DomaineListItem[]>>('/domaines');
        return response.data.data;
    },

    /**
     * Supprime un domaine de formation.
     * DELETE /api/domaines/{id} (ADMIN uniquement)
     */
    deleteDomaine: async (id: number): Promise<void> => {
        await client.delete(`/domaines/${id}`);
    },
};
