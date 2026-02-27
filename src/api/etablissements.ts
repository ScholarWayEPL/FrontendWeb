import client from './client';
import type {
  Etablissement,
  ApiResponse,
  EtablissementFilters,
  EtablissementEnAttente,
  EtablissementLoginData,
  PaginatedBackendResponse
} from '../types';
import { mockEtablissements } from './mockData';
import { delay } from '../utils/helpers';
import { REGIONS_TOGO } from '../constants';

// Copie locale pour les mutations
const etablissements = [...mockEtablissements];

// Fonction pour générer un nouvel ID
let maxId = Math.max(...etablissements.map((e) => e.idEtablissement));

export const etablissementsApi = {
  // Récupérer les établissements (filtrables par statut de validation)
  getPending: async (params: {
    page: number;
    size: number;
    sort?: string;
    valide?: string;
  }): Promise<ApiResponse<EtablissementEnAttente[]>> => {
    const response = await client.get<PaginatedBackendResponse<EtablissementEnAttente>>('/etablissements', {
      params
    });

    return {
      success: true,
      data: response.data.content,
      pagination: {
        page: response.data.page.number,
        limit: response.data.page.size,
        total: response.data.page.totalElements,
        totalPages: response.data.page.totalPages
      }
    };
  },

  // Récupérer les établissements validés avec pagination et filtres
  getValides: async (params: {
    page: number;
    size: number;
    sort?: string;
  }): Promise<ApiResponse<EtablissementLoginData[]>> => {
    const response = await client.get<PaginatedBackendResponse<EtablissementLoginData>>('/etablissements/valides', {
      params
    });

    return {
      success: true,
      data: response.data.content,
      pagination: {
        page: response.data.page.number,
        limit: response.data.page.size,
        total: response.data.page.totalElements,
        totalPages: response.data.page.totalPages
      }
    };
  },

  // Récupérer tous les établissements avec pagination et filtres
  getAll: async (params: {
    page: number;
    limit: number;
    filters?: EtablissementFilters;
  }): Promise<ApiResponse<Etablissement[]>> => {
    await delay(500);

    let filteredData = [...etablissements];

    if (params.filters) {
      const { search, type, localisation } = params.filters;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (e) =>
            e.nom.toLowerCase().includes(searchLower) ||
            e.description.toLowerCase().includes(searchLower)
        );
      }

      if (type) {
        filteredData = filteredData.filter((e) => e.type === type);
      }

      if (localisation) {
        filteredData = filteredData.filter((e) => e.localisation === localisation);
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

  // Récupérer un établissement par ID
  getById: async (id: number): Promise<ApiResponse<Etablissement>> => {
    await delay(300);
    const etablissement = etablissements.find((e) => e.idEtablissement === id);

    if (!etablissement) {
      throw new Error('Établissement non trouvé');
    }

    return {
      data: etablissement,
      success: true,
    };
  },

  // Créer un nouvel établissement
  create: async (data: Omit<Etablissement, 'idEtablissement'>): Promise<ApiResponse<Etablissement>> => {
    await delay(500);
    maxId++;
    const newEtablissement: Etablissement = {
      ...data,
      idEtablissement: maxId,
    };
    etablissements.unshift(newEtablissement);
    return {
      data: newEtablissement,
      success: true,
      message: 'Établissement créé avec succès',
    };
  },

  // Mettre à jour un établissement
  update: async (id: number, data: Partial<Etablissement>): Promise<ApiResponse<Etablissement>> => {
    await delay(500);
    const index = etablissements.findIndex((e) => e.idEtablissement === id);
    if (index === -1) {
      throw new Error('Établissement non trouvé');
    }
    etablissements[index] = { ...etablissements[index], ...data };
    return {
      data: etablissements[index],
      success: true,
      message: 'Établissement modifié avec succès',
    };
  },

  // Supprimer un établissement
  delete: async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    const index = etablissements.findIndex((e) => e.idEtablissement === id);
    if (index === -1) {
      throw new Error('Établissement non trouvé');
    }
    etablissements.splice(index, 1);
    return {
      data: null,
      success: true,
      message: 'Établissement supprimé avec succès',
    };
  },

  // Récupérer les régions disponibles
  getRegions: async (): Promise<string[]> => {
    await delay(200);
    return [...REGIONS_TOGO];
  },

  // Récupérer les types disponibles
  getTypes: async (): Promise<string[]> => {
    await delay(200);
    return ['Université', 'École', 'Institut'];
  },

  // Valider un établissement
  validate: async (id: number): Promise<ApiResponse<null>> => {
    const response = await client.patch<null>(`/admin/etablissements/${id}/valider`);
    return {
      success: true,
      data: response.data,
      message: 'Établissement validé avec succès'
    };
  },

  // Rejeter un établissement
  reject: async (id: number): Promise<ApiResponse<null>> => {
    const response = await client.patch<null>(`/admin/etablissements/${id}/rejeter`);
    return {
      success: true,
      data: response.data,
      message: 'Établissement rejeté avec succès'
    };
  },
};
