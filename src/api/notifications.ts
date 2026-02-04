import type { Notification, ApiResponse, TypeNotification } from '../types';

// Données fictives pour les notifications
const mockNotifications: Notification[] = [
  {
    idNotification: 1,
    idChecklist: 1,
    contenu: 'Votre dossier d\'inscription est complet. Vous recevrez une réponse sous 48h.',
    dateEnvoi: '2024-01-15T10:00:00Z',
    type: 'Information',
  },
  {
    idNotification: 2,
    idChecklist: 2,
    contenu: 'Rappel: La date limite pour soumettre votre lettre de motivation est dans 3 jours.',
    dateEnvoi: '2024-01-14T09:00:00Z',
    type: 'Rappel',
  },
  {
    idNotification: 3,
    idChecklist: 3,
    contenu: 'Nouveau programme disponible: Master en Intelligence Artificielle à l\'Université Paris-Saclay.',
    dateEnvoi: '2024-01-13T14:00:00Z',
    type: 'Information',
  },
  {
    idNotification: 4,
    idChecklist: 1,
    contenu: 'Rappel: N\'oubliez pas de compléter votre profil pour améliorer vos recommandations.',
    dateEnvoi: '2024-01-12T11:00:00Z',
    type: 'Rappel',
  },
  {
    idNotification: 5,
    idChecklist: 4,
    contenu: 'Félicitations! Votre candidature a été acceptée par ESCP Business School.',
    dateEnvoi: '2024-01-11T08:00:00Z',
    type: 'Information',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notificationsApi = {
  getAll: async (params: { page: number; limit: number }): Promise<ApiResponse<Notification[]>> => {
    await delay(500);
    
    const total = mockNotifications.length;
    const totalPages = Math.ceil(total / params.limit);
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedData = mockNotifications.slice(start, end);

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

  getStats: async (): Promise<{ total: number; parType: Record<TypeNotification, number> }> => {
    await delay(200);
    const parType: Record<TypeNotification, number> = {
      'Rappel': mockNotifications.filter((n) => n.type === 'Rappel').length,
      'Information': mockNotifications.filter((n) => n.type === 'Information').length,
    };
    return {
      total: mockNotifications.length,
      parType,
    };
  },

  create: async (data: Omit<Notification, 'idNotification'>): Promise<ApiResponse<Notification>> => {
    await delay(500);
    const newNotification: Notification = {
      ...data,
      idNotification: Math.max(...mockNotifications.map((n) => n.idNotification)) + 1,
    };
    mockNotifications.unshift(newNotification);
    return {
      data: newNotification,
      success: true,
      message: 'Notification créée avec succès',
    };
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    const index = mockNotifications.findIndex((n) => n.idNotification === id);
    if (index === -1) {
      throw new Error('Notification non trouvée');
    }
    mockNotifications.splice(index, 1);
    return {
      data: null,
      success: true,
      message: 'Notification supprimée avec succès',
    };
  },
};
