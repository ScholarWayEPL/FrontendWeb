import type { BachelierBackend } from './user';
import type { ParcoursBackend } from './programme';

export type StatutCampagne = 'OUVERTE' | 'FERMEE' | 'A_VENIR';
export type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE' | 'LISTE_ATTENTE';
export type TypeModification = 'CREATION' | 'MISE_A_JOUR' | 'SUPPRESSION' | 'VALIDATION' | 'REJET';
export type StatutChecklist = 'done' | 'pending';

// 📋 Checklist Admission
export interface ChecklistAdmission {
    id: number;
    item: string;
    statut: StatutChecklist;
}

// 💖 Favori
export interface Favori {
    idFavori: number;
    idProgramme: number;
    idBachelier: number;
}

// 🎯 Campagne d'Admission
export interface CampagneAdmission {
    id: number;
    parcours: ParcoursBackend;
    dateDebut: string;
    dateFin: string;
    statut: StatutCampagne;
    nombrePlaces: number;
}

// 📝 Candidature (Backend model)
export interface CandidatureBackend {
    id: number;
    bachelier: BachelierBackend;
    campagne: CampagneAdmission;
    dateCandidature: string;
    statut: StatutCandidature;
    scoreCandidat: number;
    messageMotivation?: string;
    documentVoeuUrl?: string;
}

// 📂 Dossier Académique
export interface DossierAcademique {
    id: number;
    bachelier: BachelierBackend;
    bulletinsUrl?: string[];
    releveNotesBacUrl?: string;
    autresDiplomesUrl?: string[];
    validiteDossier: boolean;
}

// ⭐ Favoris (Backend model)
export interface FavorisBackend {
    id: number;
    bachelier: BachelierBackend;
    parcours: ParcoursBackend;
    dateAjout: string;
}

// 📜 Historique de Modification du Dossier
export interface HistoriqueModificationDossier {
    id: number;
    bachelier: BachelierBackend;
    admin: { id: number; nomAdmin: string }; // Version simplifiée de AdministrateurBackend pour éviter les cycles complexes si nécessaire
    dateModification: string;
    typeModification: TypeModification;
    details?: string;
}
