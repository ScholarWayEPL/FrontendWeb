import client from './client';
import type { ApiResponse, User } from '../types';

export interface LoginResponse {
    user: User;
    token: string;
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
     * Vérifie le token actuel et récupère les infos de l'utilisateur
     */
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await client.get<ApiResponse<User>>('/auth/me');
        return response.data;
    },
};
