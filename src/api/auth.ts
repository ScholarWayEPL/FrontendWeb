import client from './client';
import type { ApiResponse, User, RoleUtilisateur, RegisterEtablissementRequest, BachelierDTO, EtablissementLoginData } from '../types';

// Re-export pour compatibilité des imports depuis `../api`
export type { RegisterEtablissementRequest, BachelierDTO } from '../types';

// ─── Auth response types ───────────────────────────────────────────

export interface LoginResponse {
    token: string;
    tokenType: string;
    userId: number;
    email: string;
    nom: string;
    role: RoleUtilisateur;
    expiresAt: string;
    etablissement?: EtablissementLoginData;
}

// ─── Auth API ─────────────────────────────────────────────────────

export const authApi = {
    /**
     * Authentifie un utilisateur et renvoie un token JWT.
     */
    login: async (email: string, motDePasse: string): Promise<ApiResponse<LoginResponse>> => {
        const response = await client.post<ApiResponse<LoginResponse>>('/auth/login', {
            email,
            motDePasse,
        });
        return response.data;
    },

    /**
     * Enregistre un nouvel établissement via multipart/form-data.
     * Le champ `request` contient les données JSON et `documentAccreditation`
     * le fichier PDF d'accréditation (optionnel).
     */
    registerEtablissement: async (
        data: RegisterEtablissementRequest,
        documentAccreditation?: File,
    ): Promise<ApiResponse<any>> => {
        const formData = new FormData();

        // Sérialiser les données sous forme de Blob JSON (attendu côté Spring)
        formData.append(
            'request',
            new Blob([JSON.stringify(data)], { type: 'application/json' }),
        );

        if (documentAccreditation) {
            formData.append('documentAccreditation', documentAccreditation);
        }

        const response = await client.post<ApiResponse<any>>(
            '/auth/register/etablissement',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    },

    /**
     * Récupère les informations du bachelier connecté.
     */
    getCurrentBachelier: async (): Promise<ApiResponse<BachelierDTO>> => {
        const response = await client.get<ApiResponse<BachelierDTO>>('/auth/me/bachelier');
        return response.data;
    },

    /**
     * Vérifie le token actuel et récupère les infos génériques de l'utilisateur.
     */
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await client.get<ApiResponse<User>>('/auth/me');
        return response.data;
    },
};
