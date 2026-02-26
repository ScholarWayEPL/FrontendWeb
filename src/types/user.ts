import type { StatutCompte, RoleUtilisateur } from './auth';
import type { Sexe, Mention } from './common';
import type { DomaineBackend } from './programme';

// 👨‍💼 Administrateur
export interface Administrateur {
    idAdmin: number;
    nom: string;
    email: string;
    motDePasse?: string;
}

// 👨‍💼 Administrateur (Backend model)
export interface AdministrateurBackend {
    id?: number;
    nomAdmin: string;
    roleAdmin: string;
    utilisateur?: Utilisateur;
}

// 🎓 Bachelier
export interface Bachelier {
    idBachelier: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    serieBac: string;
    moyenneBac: number;
    matieresPrincipales: string;
    budgetMax: number;
    objectifsProfessionnels: string;
    dateInscription: string;
}

// 📚 SerieBac
export interface SerieBac {
    id: number;
    nomSerie: string;
    pays: string;
    description?: string;
    active: boolean;
}

// 🎓 Bachelier (Backend model – entité interne)
export interface BachelierBackend {
    id?: number;
    nom: string;
    prenom: string;
    dateNaissance: string;
    sexe: Sexe;
    telephone: string;
    serieBac: string;
    serieBacEntity?: SerieBac;
    moyenneBac: number;
    mention?: Mention;
    matieresPrincipales?: string;
    objectifsProfessionnels?: string;
    budgetMax?: number;
    domainePreference?: DomaineBackend;
    utilisateur?: Utilisateur;
}

// 🎓 BachelierDTO – réponse complète de l'API (GET /bacheliers/:id, /me, etc.)
export interface BachelierDTO {
    idUtilisateur: number;
    nom: string;
    prenom: string;
    email: string;
    dateNaissance: string;
    age: number;
    sexe: Sexe;
    telephone: string;
    serieBac: string;
    moyenneBac: number;
    mention: Mention;
    matieresPrincipales?: string;
    objectifsProfessionnels?: string;
    budgetMax?: number;
    role: RoleUtilisateur;
    domainePreferenceId?: number;
    domainePreferenceNom?: string;
    parcoursPreferenceId?: number;
    parcoursPreferenceNom?: string;
    statut: StatutCompte;
    dateCreation: string;
    derniereConnexion?: string;
    profilComplet: boolean;
}

// 👤 Utilisateur (Backend model)
export interface Utilisateur {
    id: number;
    email: string;
    motDePasseHash?: string;
    dateCreation: string;
    statut: StatutCompte;
    derniereConnexion?: string;
    role: RoleUtilisateur;
    dateModification?: string;
    version?: number;
}
