import type { EtablissementLoginData } from './etablissement';

export type StatutCompte = 'ACTIF' | 'INACTIF' | 'SUSPENDU' | 'EN_ATTENTE';

export type RoleUtilisateur =
    | 'ROLE_SUPER_ADMIN'
    | 'ROLE_ADMINISTRATEUR'
    | 'ROLE_ETABLISSEMENT'
    | 'ROLE_BACHELIER';

// Legacy User type for auth (updated with new roles)
export interface User {
    id: string; // Legacy ID (idUtilisateur as string)
    idUtilisateur: number;
    nom: string;
    firstName: string;
    lastName: string;
    email: string;
    role: RoleUtilisateur;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    // Champs spécifiques pour admin_etablissement
    etablissementId?: number;
    etablissementNom?: string;
    etablissement?: EtablissementLoginData; // Full establishment object from login
}
