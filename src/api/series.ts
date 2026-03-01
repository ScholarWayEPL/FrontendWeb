import client from './client';

export interface SerieBac {
    id?: number;
    nomSerie: string;
    pays: string;
    description: string;
}

export const seriesApi = {
    // GET /api/series-bac/pays/{codePays}
    getByPays: async (codePays: string): Promise<SerieBac[]> => {
        const response = await client.get<{ success: boolean; data: SerieBac[] }>(
            `/series-bac/pays/${codePays}`
        );
        return response.data.data;
    },

    // POST /api/series-bac
    create: async (payload: SerieBac): Promise<SerieBac> => {
        const response = await client.post<{ success: boolean; data: SerieBac }>(
            '/series-bac',
            payload
        );
        return response.data.data;
    },

    // DELETE /api/series-bac/{id}
    delete: async (id: number): Promise<void> => {
        await client.delete(`/series-bac/${id}`);
    }
};
