import apiClient from './client';
import type { Notification, NotificationBackend, NotificationPage } from '../types';

// Interface pour les paramètres de pagination
interface GetNotificationsParams {
    page?: number;
    size?: number;
    sort?: string;
}

// Interface pour la réponse API
interface NotificationsResponse {
    content: NotificationBackend[];
    page: NotificationPage;
}

// Transformer les données backend en format frontend
const transformNotification = (backend: NotificationBackend): Notification => ({
    idNotification: backend.idNotification,
    titre: backend.titre,
    contenu: backend.contenu,
    type: backend.type,
    dateEnvoi: backend.dateEnvoi,
    estLue: backend.estLue,
    dateLecture: backend.dateLecture,
    urlAction: backend.urlAction,
});

export const notificationsApi = {
    /**
     * Récupère les notifications d'un utilisateur avec pagination
     * GET /api/notifications/utilisateur/{userId}
     */
    getByUser: async (
        userId: number,
        params: GetNotificationsParams = {}
    ): Promise<{ data: Notification[]; pagination: NotificationPage }> => {
        const { page = 0, size = 20, sort = 'dateEnvoi,DESC' } = params;
        
        const response = await apiClient.get<{ data: NotificationsResponse }>(
            `/notifications/utilisateur/${userId}`,
            {
                params: { page, size, sort: [sort] },
                paramsSerializer: { indexes: null },
            }
        );

        const { content, page: pageData } = response.data.data;
        
        return {
            data: content.map(transformNotification),
            pagination: pageData,
        };
    },

    /**
     * Marquer une notification comme lue
     * PATCH /api/notifications/{id}/lire
     */
    markAsRead: async (notificationId: number): Promise<void> => {
        await apiClient.patch(`/notifications/${notificationId}/lire`);
    },

    /**
     * Marquer toutes les notifications comme lues
     * PATCH /api/notifications/utilisateur/{userId}/tout-lire
     */
    markAllAsRead: async (userId: number): Promise<void> => {
        await apiClient.patch(`/notifications/utilisateur/${userId}/tout-lire`);
    },

    /**
     * Supprimer une notification
     * DELETE /api/notifications/{notificationId}
     */
    delete: async (notificationId: number): Promise<void> => {
        await apiClient.delete(`/notifications/${notificationId}`);
    },

    /**
     * Récupérer les notifications non lues
     * GET /api/notifications/utilisateur/{userId}/non-lues
     */
    getUnread: async (
        userId: number,
        params: GetNotificationsParams = {}
    ): Promise<{ data: Notification[]; pagination: NotificationPage }> => {
        const { page = 0, size = 20, sort = 'dateEnvoi,DESC' } = params;
        
        const response = await apiClient.get<{ data: NotificationsResponse }>(
            `/notifications/utilisateur/${userId}/non-lues`,
            {
                params: { page, size, sort: [sort] },
                paramsSerializer: { indexes: null },
            }
        );

        const { content, page: pageData } = response.data.data;
        
        return {
            data: content.map(transformNotification),
            pagination: pageData,
        };
    },

    /**
     * Compter les notifications non lues
     * GET /api/notifications/utilisateur/{userId}/count
     */
    getUnreadCount: async (userId: number): Promise<number> => {
        try {
            const response = await apiClient.get<{ data: number }>(
                `/notifications/utilisateur/${userId}/count`
            );
            return response.data.data;
        } catch {
            // Fallback: compter manuellement
            const { data } = await notificationsApi.getByUser(userId, { size: 100 });
            return data.filter(n => !n.estLue).length;
        }
    },
};
