import client from './client';
import type { DomaineBackend } from '../types';

export interface CreateDomaineRequest {
    nomDomaine: string;
    description?: string;
}

export const domainesApi = {
    /**
     * Crée un nouveau domaine de formation.
     * POST /api/domaines (ADMIN uniquement)
     */
    createDomaine: async (data: CreateDomaineRequest): Promise<DomaineBackend> => {
        const response = await client.post<DomaineBackend>('/domaines', data);
        return response.data;
    },

    /**
     * Récupère la liste de tous les domaines.
     * GET /api/domaines
     */
    getDomaines: async (): Promise<DomaineBackend[]> => {
        const response = await client.get<DomaineBackend[]>('/domaines');
        return response.data;
    },
};
