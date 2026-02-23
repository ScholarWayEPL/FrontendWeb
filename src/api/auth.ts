import client from './client';
import type { ApiResponse, User, RoleUtilisateur } from '../types';

export interface LoginResponse {
    token: string;
    tokenType: string;
    userId: number;
    email: string;
    role: RoleUtilisateur;
    expiresAt: string;
}

export interface RegisterEtablissementRequest {
    nomEtablissement: string;
    email: string;
    motDePasse: string;
    description: string;
    localisation: string;
    siteWeb: string;
    telephonePro: string;
    typeEtablissement: string;
}

export const authApi = {
    /**
     * Authentifie un utilisateur et renvoie un token JWT
     * @param email Email de l'utilisateur
     * @param motDePasse Mot de passe de l'utilisateur
     */
    login: async (email: string, motDePasse: string): Promise<ApiResponse<LoginResponse>> => {
        const response = await client.post<ApiResponse<LoginResponse>>('/auth/login', {
            email,
            motDePasse,
        });
        return response.data;
    },

    /**
     * Enregistre un nouvel établissement
     * @param data Données de l'établissement
     */
    registerEtablissement: async (data: RegisterEtablissementRequest): Promise<ApiResponse<any>> => {
        const response = await client.post<ApiResponse<any>>('/auth/register/etablissement', data);
        return response.data;
    },

    /**
     * Vérifie le token actuel et récupère les infos de l'utilisateur
     */
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await client.get<ApiResponse<User>>('/auth/me');
        return response.data;
    },
};
