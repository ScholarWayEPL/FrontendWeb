export interface Log {
  id: number;
  action: string;
  description: string;
  utilisateur: string;
  date: string;
  ip?: string;
  type: 'creation' | 'modification' | 'suppression' | 'connexion' | 'deconnexion' | 'consultation' | 'validation' | 'rejet' | 'export' | 'import';
  entite?: string; // utilisateur, etablissement, programme, etc.
  entiteId?: number;
  details?: Record<string, unknown>;
}

// Données mock des logs
let mockLogs: Log[] = [
  {
    id: 1,
    action: 'Connexion admin',
    description: 'Connexion réussie au tableau de bord administrateur',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T09:15:00',
    ip: '192.168.1.100',
    type: 'connexion',
  },
  {
    id: 2,
    action: 'Création utilisateur',
    description: 'Nouvel utilisateur créé: Kofi Mensah',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T09:30:00',
    ip: '192.168.1.100',
    type: 'creation',
    entite: 'utilisateur',
    entiteId: 15,
  },
  {
    id: 3,
    action: 'Validation inscription',
    description: 'Inscription validée pour Ama Kouassi - Licence Informatique',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T10:00:00',
    ip: '192.168.1.100',
    type: 'validation',
    entite: 'inscription',
    entiteId: 234,
  },
  {
    id: 4,
    action: 'Modification établissement',
    description: 'Mise à jour des informations de l\'Université de Lomé',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T10:30:00',
    ip: '192.168.1.100',
    type: 'modification',
    entite: 'etablissement',
    entiteId: 1,
  },
  {
    id: 5,
    action: 'Rejet candidature',
    description: 'Candidature rejetée: Yao Agbeko - dossier incomplet',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T11:00:00',
    ip: '192.168.1.100',
    type: 'rejet',
    entite: 'candidature',
    entiteId: 89,
  },
  {
    id: 6,
    action: 'Export données',
    description: 'Export Excel de la liste des étudiants inscrits',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T11:30:00',
    ip: '192.168.1.100',
    type: 'export',
    details: { format: 'xlsx', count: 156 },
  },
  {
    id: 7,
    action: 'Création programme',
    description: 'Nouveau programme ajouté: Master en IA - Université de Lomé',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T14:00:00',
    ip: '192.168.1.100',
    type: 'creation',
    entite: 'programme',
    entiteId: 12,
  },
  {
    id: 8,
    action: 'Suppression notification',
    description: 'Notification système supprimée (ID: 45)',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T14:30:00',
    ip: '192.168.1.100',
    type: 'suppression',
    entite: 'notification',
    entiteId: 45,
  },
  {
    id: 9,
    action: 'Consultation rapport',
    description: 'Consultation du rapport statistique mensuel',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T15:00:00',
    ip: '192.168.1.100',
    type: 'consultation',
    entite: 'rapport',
  },
  {
    id: 10,
    action: 'Modification paramètres',
    description: 'Paramètres de notification modifiés',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-21T15:30:00',
    ip: '192.168.1.100',
    type: 'modification',
    entite: 'parametres',
  },
  {
    id: 11,
    action: 'Import utilisateurs',
    description: 'Import CSV de 50 nouveaux étudiants',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-20T09:00:00',
    ip: '192.168.1.100',
    type: 'import',
    details: { format: 'csv', count: 50 },
  },
  {
    id: 12,
    action: 'Validation paiement',
    description: 'Paiement confirmé: Mensah Kodjo - 350 000 F CFA',
    utilisateur: 'finance@scholarway.tg',
    date: '2025-01-20T10:30:00',
    ip: '192.168.1.105',
    type: 'validation',
    entite: 'paiement',
    entiteId: 567,
  },
  {
    id: 13,
    action: 'Déconnexion',
    description: 'Déconnexion du système',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-20T18:00:00',
    ip: '192.168.1.100',
    type: 'deconnexion',
  },
  {
    id: 14,
    action: 'Création établissement',
    description: 'Nouvel établissement ajouté: Institut Polytechnique de Kara',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-19T11:00:00',
    ip: '192.168.1.100',
    type: 'creation',
    entite: 'etablissement',
    entiteId: 11,
  },
  {
    id: 15,
    action: 'Suppression utilisateur',
    description: 'Utilisateur supprimé: compte test (ID: 99)',
    utilisateur: 'admin@scholarway.tg',
    date: '2025-01-19T16:00:00',
    ip: '192.168.1.100',
    type: 'suppression',
    entite: 'utilisateur',
    entiteId: 99,
  },
];

import { delay } from '../utils/helpers';

let logIdCounter = mockLogs.length + 1;

export const logsApi = {
  getAll: async (params: {
    page: number;
    limit: number;
    filters?: {
      search?: string;
      type?: string;
      dateDebut?: string;
      dateFin?: string;
      utilisateur?: string;
    };
  }) => {
    await delay(400);

    let filteredData = [...mockLogs];

    if (params.filters) {
      const { search, type, dateDebut, dateFin, utilisateur } = params.filters;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (log) =>
            log.action.toLowerCase().includes(searchLower) ||
            log.description.toLowerCase().includes(searchLower) ||
            log.utilisateur.toLowerCase().includes(searchLower)
        );
      }

      if (type) {
        filteredData = filteredData.filter((log) => log.type === type);
      }

      if (utilisateur) {
        filteredData = filteredData.filter((log) =>
          log.utilisateur.toLowerCase().includes(utilisateur.toLowerCase())
        );
      }

      if (dateDebut) {
        filteredData = filteredData.filter(
          (log) => new Date(log.date) >= new Date(dateDebut)
        );
      }

      if (dateFin) {
        filteredData = filteredData.filter(
          (log) => new Date(log.date) <= new Date(dateFin)
        );
      }
    }

    // Trier par date décroissante
    filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  create: async (logData: Omit<Log, 'id' | 'date'>) => {
    await delay(200);
    const newLog: Log = {
      ...logData,
      id: logIdCounter++,
      date: new Date().toISOString(),
    };
    mockLogs.unshift(newLog);
    return {
      data: newLog,
      success: true,
    };
  },

  clear: async (olderThanDays?: number) => {
    await delay(500);
    if (olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      const initialCount = mockLogs.length;
      mockLogs = mockLogs.filter((log) => new Date(log.date) >= cutoffDate);
      return {
        success: true,
        message: `${initialCount - mockLogs.length} logs supprimés`,
      };
    }
    const count = mockLogs.length;
    mockLogs = [];
    return {
      success: true,
      message: `${count} logs supprimés`,
    };
  },

  export: async (format: 'csv' | 'json' = 'json') => {
    await delay(300);
    // Simulation d'export
    return {
      success: true,
      data: format === 'json' ? JSON.stringify(mockLogs, null, 2) : 'CSV data...',
      message: `Export ${format.toUpperCase()} généré avec succès`,
    };
  },

  getStats: async () => {
    await delay(300);
    const stats = {
      total: mockLogs.length,
      parType: {} as Record<string, number>,
      parJour: {} as Record<string, number>,
    };

    mockLogs.forEach((log) => {
      // Stats par type
      stats.parType[log.type] = (stats.parType[log.type] || 0) + 1;

      // Stats par jour
      const jour = log.date.split('T')[0];
      stats.parJour[jour] = (stats.parJour[jour] || 0) + 1;
    });

    return {
      success: true,
      data: stats,
    };
  },
};

// Fonction utilitaire pour créer un log depuis n'importe où dans l'app
export const createLog = async (
  action: string,
  description: string,
  type: Log['type'],
  entite?: string,
  entiteId?: number,
  details?: Record<string, unknown>
) => {
  return logsApi.create({
    action,
    description,
    type,
    utilisateur: 'admin@scholarway.tg', // En production, récupérer depuis le contexte auth
    ip: '192.168.1.100',
    entite,
    entiteId,
    details,
  });
};
