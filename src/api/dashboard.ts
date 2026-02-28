import type { DashboardStats } from '../types';
import { delay } from '../utils/helpers';
import { REGIONS_TOGO } from '../constants';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(500);
    
    return {
      totalUsers: 1250,
      totalEtablissements: 45,
      totalDossiersValides: 312,
      totalNotifications: 23,
      usersGrowth: 12.5,
      etablissementsGrowth: 8.3,
      dossiersGrowth: 22.4,
      recentActivity: [
        {
          id: '1',
          type: 'user_created',
          description: 'Nouvel utilisateur inscrit: Komlan Agbéko',
          timestamp: '2026-02-04T10:30:00Z',
        },
        {
          id: '2',
          type: 'etablissement_added',
          description: 'Nouvel établissement ajouté: Université de Lomé',
          timestamp: '2026-02-04T09:15:00Z',
        },
        {
          id: '3',
          type: 'programme_updated',
          description: 'Programme mis à jour: Master Informatique',
          timestamp: '2026-02-04T08:45:00Z',
        },
        {
          id: '4',
          type: 'notification_sent',
          description: 'Notification envoyée à tous les bacheliers',
          timestamp: '2026-02-03T16:00:00Z',
        },
        {
          id: '5',
          type: 'user_created',
          description: 'Nouvelle inscription: Afi Mensah',
          timestamp: '2026-02-03T14:20:00Z',
        },
      ],
      // Inscriptions par mois (6 derniers mois)
      inscriptionsParMois: [
        { name: 'Sept', value: 145, value2: 120 },
        { name: 'Oct', value: 198, value2: 145 },
        { name: 'Nov', value: 220, value2: 178 },
        { name: 'Déc', value: 175, value2: 160 },
        { name: 'Jan', value: 280, value2: 210 },
        { name: 'Fév', value: 320, value2: 245 },
      ],
      // Répartition par région
      repartitionParRegion: REGIONS_TOGO.map((region, index) => ({
        name: region,
        value: [450, 180, 220, 160, 240][index] || 100,
        color: ['#1976d2', '#9c27b0', '#2e7d32', '#ed6c02', '#0288d1'][index] || '#757575',
      })),
      // Répartition par statut de dossier
      repartitionParStatut: [
        { name: 'En attente', value: 320, color: '#f59e0b' },
        { name: 'Validés', value: 480, color: '#10b981' },
        { name: 'En cours', value: 250, color: '#4f46e5' },
        { name: 'Rejetés', value: 85, color: '#ef4444' },
      ],
      // Performance hebdomadaire
      performanceHebdo: [
        { name: 'Lun', value: 45 },
        { name: 'Mar', value: 62 },
        { name: 'Mer', value: 58 },
        { name: 'Jeu', value: 71 },
        { name: 'Ven', value: 89 },
        { name: 'Sam', value: 34 },
        { name: 'Dim', value: 22 },
      ],
      // Top programmes
      topProgrammes: [
        { nom: 'Licence Informatique', etablissement: 'Université de Lomé', candidatures: 245, taux: 78 },
        { nom: 'Master Gestion', etablissement: 'ESG Business School', candidatures: 198, taux: 65 },
        { nom: 'Licence Médecine', etablissement: 'Faculté des Sciences de la Santé', candidatures: 187, taux: 42 },
        { nom: 'Master Droit', etablissement: 'Université de Kara', candidatures: 156, taux: 71 },
        { nom: 'Licence Économie', etablissement: 'Université de Lomé', candidatures: 134, taux: 82 },
      ],
      // Stats rapides
      statsRapides: [
        { label: 'Inscriptions ce mois', value: '+156', color: 'primary', trend: 12 },
        { label: 'Dossiers en attente', value: 320, color: 'warning' },
        { label: 'En attente de validation', value: 12, color: 'secondary' },
        { label: 'Taux de conversion', value: '68%', color: 'success', trend: 5 },
        { label: 'Dossiers complets', value: '89%', color: 'info' },
        { label: 'Demandes bourses', value: 45, color: 'error' },
      ],
    };
  },
};
