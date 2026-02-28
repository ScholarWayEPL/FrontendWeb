import type { Utilisateur } from './user';

// Types de notification backend
export type TypeNotificationBackend = 'SYSTEME' | 'UTILISATEUR' | 'ETABLISSEMENT' | 'CANDIDATURE';

// Mapping pour affichage
export type TypeNotificationDisplay = 'info' | 'success' | 'warning' | 'error';

// 🔔 Notification (Backend response)
export interface NotificationBackend {
    idNotification: number;
    titre: string;
    contenu: string;
    type: TypeNotificationBackend;
    dateEnvoi: string;
    estLue: boolean;
    dateLecture: string | null;
    urlAction: string | null;
}

// 🔔 Notification (Frontend model)
export interface Notification {
    idNotification: number;
    titre: string;
    contenu: string;
    type: TypeNotificationBackend;
    dateEnvoi: string;
    estLue: boolean;
    dateLecture: string | null;
    urlAction: string | null;
}

// Pagination response
export interface NotificationPage {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

// API Response wrapper
export interface NotificationApiResponse {
    success: boolean;
    message: string;
    data: {
        content: NotificationBackend[];
        page: NotificationPage;
    };
    timestamp: string;
    errorCode: string | null;
}
