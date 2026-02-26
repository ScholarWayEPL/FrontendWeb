import type { StatutCompte } from './auth';
import type { Utilisateur } from './user';

export type TypeEtablissement = 'Université' | 'École' | 'Institut';

export type TypeEtablissementBackend =
    | 'UNIVERSITE_PUBLIQUE'
    | 'UNIVERSITE_PRIVEE'
    | 'ECOLE_PUBLIQUE'
    | 'ECOLE_PRIVEE'
    | 'INSTITUT_SUPERIEUR'
    | 'GRANDE_ECOLE'
    | 'CENTRE_FORMATION';

export type StatutValidationEtablissement = 'ACTIF' | 'EN_ATTENTE' | 'REJETE' | 'SUSPENDU';

// 🏫 Établissement
export interface Etablissement {
    idEtablissement: number;
    nom: string;
    type: TypeEtablissement;
    localisation: string;
    description: string;
    contact: string;
    email: string;
    telephone: string;
    siteWeb?: string;
}

// Filtres Établissements
export interface EtablissementFilters {
    search: string;
    type: string;
    localisation: string;
}

// 🏫 Établissement (Backend model)
export interface EtablissementBackend {
    id?: number;
    nomEtablissement: string;
    email?: string;
    typeEtablissement?: TypeEtablissementBackend;
    description?: string;
    logoUrl?: string;
    localisation: string;
    siteWeb?: string;
    telephonePro: string;
    documentAccreditationUrl?: string;
    scolariteGlobale?: string;
    valide: StatutValidationEtablissement;
    utilisateur?: Utilisateur;
}

// 🏫 RegisterEtablissementRequest – payload POST /api/auth/register/etablissement
export interface RegisterEtablissementRequest {
    nomEtablissement: string;
    email: string;
    motDePasse: string;
    description?: string;
    localisation: string;
    siteWeb?: string;
    telephonePro: string;
    typeEtablissement: TypeEtablissementBackend;
}

// 🏫 Établissement en attente (Backend response for /api/admin/etablissements/en-attente)
export interface EtablissementEnAttente {
    idUtilisateur: number;
    nomEtablissement: string;
    description: string | null;
    email: string;
    logoUrl: string | null;
    localisation: string;
    siteWeb: string | null;
    telephonePro: string;
    scolariteGlobale: string | null;
    documentAccreditationUrl: string | null;
    typeEtablissement: TypeEtablissementBackend;
    valide: StatutValidationEtablissement;
    dateValidationAdmin: string | null;
    statut: StatutCompte;
    dateCreation: string;
    derniereConnexion: string | null;
    nombreParcours: number | null;
    nombreCampagnesActives: number | null;
}
