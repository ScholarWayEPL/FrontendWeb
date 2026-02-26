import { Utilisateur } from './user';

export type TypeNotification = 'admission' | 'info' | 'rappel' | 'alerte';

// 🔔 Notification
export interface Notification {
    idNotification: number;
    idUtilisateur: number;
    titre: string;
    message: string;
    type: TypeNotification;
    lu: boolean;
    dateCreation: string;
}

// 🔔 Notification (Backend model)
export interface NotificationBackend {
    id: number;
    titre: string;
    message: string;
    type: string;
    lu: boolean;
    dateCreation: string;
    utilisateur: Utilisateur;
}
