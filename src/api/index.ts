export * from './auth';
export * from './auth';
export * from './candidatures';
export { default as apiClient } from './client';
// API index - Export centralisé de toutes les APIs
export { dashboardApi } from './dashboard';
export { etablissementsApi } from './etablissements';
export { logsApi } from './logs';
export { notificationsApi } from './notifications';
export { programmesApi } from './programmes';
export { usersApi } from './users';

// Re-export mock data
export * from './mockData';
