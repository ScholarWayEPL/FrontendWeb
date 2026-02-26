import type { EtablissementBackend } from './etablissement';

export type NiveauProgramme = 'Licence' | 'Master' | 'Doctorat';

// 📚 Programme
export interface Programme {
    idProgramme: number;
    nomProgramme: string;
    domaine: string;
    niveau: NiveauProgramme;
    fraisScolarite: number;
    conditionsAdmission: string;
    duree: number;
    debouchesProfessionnels: string;
    idEtablissement?: number;
    etablissementNom?: string;
}

// Filtres Programmes
export interface ProgrammeFilters {
    search: string;
    domaine: string;
    niveau: string;
}

// 🎯 Domaine (Backend model)
export interface DomaineBackend {
    id: number;
    nomDomaine: string;
    description?: string;
}

// 📖 Parcours (Backend model)
export interface ParcoursBackend {
    id: number;
    etablissement: EtablissementBackend;
    domaine: DomaineBackend;
    nomParcours: string;
    description?: string;
    fraisScolarite: number;
    conditionsAdmission?: string;
}
