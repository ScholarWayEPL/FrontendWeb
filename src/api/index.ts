export * from './auth';
export * from './candidatures';
export * from './domaines';
export { default as apiClient } from './client';
// API index - Export centralisé de toutes les APIs
export { dashboardApi } from './dashboard';
export { domainesApi } from './domaines';
export { etablissementsApi } from './etablissements';
export { logsApi } from './logs';
export { notificationsApi } from './notifications';
export { offresApi } from './offres';
export type { OffreBackend, CreateOffrePayload } from './offres';
export { programmesApi } from './programmes';
export { usersApi } from './users';

// Re-export mock data
export * from './mockData';
