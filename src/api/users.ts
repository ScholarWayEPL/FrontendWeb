import type { Bachelier, ApiResponse } from '../types';
import { mockBacheliers } from './mockData';
import { delay } from '../utils/helpers';
import { SERIES_BAC_TOGO } from '../constants';

// Copie locale pour les mutations
const bacheliers = [...mockBacheliers];

// Fonction pour générer un nouvel ID
let maxId = Math.max(...bacheliers.map((b) => b.idBachelier));

export const usersApi = {
  // Récupérer tous les bacheliers avec pagination et filtres
  getAll: async (params: {
    page: number;
    limit: number;
    filters?: { search?: string; serieBac?: string };
  }): Promise<ApiResponse<Bachelier[]>> => {
    await delay(500);

    let filteredData = [...bacheliers];

    if (params.filters) {
      const { search, serieBac } = params.filters;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (b) =>
            b.nom.toLowerCase().includes(searchLower) ||
            b.prenom.toLowerCase().includes(searchLower) ||
            b.email.toLowerCase().includes(searchLower)
        );
      }

      if (serieBac) {
        filteredData = filteredData.filter((b) => b.serieBac === serieBac);
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

  // Récupérer un bachelier par ID
  getById: async (id: number): Promise<ApiResponse<Bachelier>> => {
    await delay(300);
    const bachelier = bacheliers.find((b) => b.idBachelier === id);

    if (!bachelier) {
      throw new Error('Bachelier non trouvé');
    }

    return {
      data: bachelier,
      success: true,
    };
  },

  // Créer un nouveau bachelier
  create: async (data: Omit<Bachelier, 'idBachelier' | 'dateInscription'>): Promise<ApiResponse<Bachelier>> => {
    await delay(500);
    maxId++;
    const newBachelier: Bachelier = {
      ...data,
      idBachelier: maxId,
      dateInscription: new Date().toISOString(),
    };
    bacheliers.unshift(newBachelier);
    return {
      data: newBachelier,
      success: true,
      message: 'Bachelier créé avec succès',
    };
  },

  // Mettre à jour un bachelier
  update: async (id: number, data: Partial<Bachelier>): Promise<ApiResponse<Bachelier>> => {
    await delay(500);
    const index = bacheliers.findIndex((b) => b.idBachelier === id);
    if (index === -1) {
      throw new Error('Bachelier non trouvé');
    }
    bacheliers[index] = { ...bacheliers[index], ...data };
    return {
      data: bacheliers[index],
      success: true,
      message: 'Bachelier modifié avec succès',
    };
  },

  // Supprimer un bachelier
  delete: async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    const index = bacheliers.findIndex((b) => b.idBachelier === id);
    if (index === -1) {
      throw new Error('Bachelier non trouvé');
    }
    bacheliers.splice(index, 1);
    return {
      data: null,
      success: true,
      message: 'Bachelier supprimé avec succès',
    };
  },

  // Récupérer les séries disponibles
  getSeries: async (): Promise<string[]> => {
    await delay(200);
    return [...SERIES_BAC_TOGO];
  },
};
