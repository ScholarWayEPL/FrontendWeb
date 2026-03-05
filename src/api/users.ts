import client from './client';
import type { Bachelier, ApiResponse, PaginatedBackendResponse } from '../types';
import { SERIES_BAC_TOGO } from '../constants';

export const usersApi = {
  // Récupérer tous les bacheliers avec pagination et filtres
  getAll: async (params: {
    page: number;
    limit: number;
    filters?: { search?: string; serieBac?: string };
  }): Promise<ApiResponse<Bachelier[]>> => {
    const response = await client.get<PaginatedBackendResponse<Bachelier>>('/bacheliers', {
      params: {
        page: params.page - 1, // API uses 0-based indexing
        size: params.limit,
        sort: 'dateCreation,DESC',
        // Note: The backend might not support search/serieBac as query params directly on /bacheliers 
        // without a specific search endpoint, but we pass them just in case.
        ...params.filters
      }
    });

    return {
      success: true,
      data: response.data.content,
      pagination: {
        page: response.data.page.number + 1,
        limit: response.data.page.size,
        total: response.data.page.totalElements,
        totalPages: response.data.page.totalPages
      }
    };
  },

  // Récupérer un bachelier par ID
  getById: async (id: number): Promise<ApiResponse<Bachelier>> => {
    const response = await client.get<ApiResponse<Bachelier>>(`/bacheliers/${id}`);
    return response.data;
  },

  // Créer un nouveau bachelier
  create: async (data: any): Promise<ApiResponse<Bachelier>> => {
    const response = await client.post<ApiResponse<Bachelier>>('/bacheliers', data);
    return response.data;
  },

  // Mettre à jour un bachelier
  update: async (id: number, data: Partial<Bachelier>): Promise<ApiResponse<Bachelier>> => {
    const response = await client.put<ApiResponse<Bachelier>>(`/bacheliers/${id}`, data);
    return response.data;
  },

  // Supprimer un bachelier
  delete: async (id: number): Promise<ApiResponse<null>> => {
    await client.delete(`/bacheliers/${id}`);
    return {
      data: null,
      success: true,
      message: 'Bachelier supprimé avec succès',
    };
  },

  // Récupérer les séries disponibles
  getSeries: async (): Promise<string[]> => {
    // Si l'API n'a pas d'endpoint pour les séries, on retourne les constantes
    return [...SERIES_BAC_TOGO];
  },
};
