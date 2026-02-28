import client from './client';

export interface CreateOffrePayload {
    idParcours: number;
    nomParcours: string;
    descriptionParcours?: string;
    idDomaine: number;
    fraisScolarite: number;
    conditionsAdmission?: string;
    debouches?: string;
    dureeAnnees: number;
    niveauRequis: string;
    seriesAcceptees: string[];
}

export interface OffreBackend {
    id: number;
    idParcours: number;
    nomParcours: string;
    descriptionParcours: string;
    idDomaine: number;
    nomDomaine: string;
    idEtablissement: number;
    nomEtablissement: string;
    localisationEtablissement: string;
    emailEtablissement: string;
    fraisScolarite: number;
    conditionsAdmission: string;
    debouches: string;
    dureeAnnees: number;
    niveauRequis: string;
    seriesAcceptees: string[];
    dateCreation: string;
    nombreCampagnesActives: number;
    campagneOuverte: boolean;
}

export const offresApi = {
    // GET /api/etablissements/{etablissementId}/offres
    getOffres: async (etablissementId: number): Promise<OffreBackend[]> => {
        const response = await client.get<{ success: boolean; data: OffreBackend[] }>(
            `/etablissements/${etablissementId}/offres`
        );
        return response.data.data;
    },

    // POST /api/etablissements/{etablissementId}/offres
    createOffre: async (etablissementId: number, payload: CreateOffrePayload): Promise<OffreBackend> => {
        const response = await client.post<{ success: boolean; data: OffreBackend }>(
            `/etablissements/${etablissementId}/offres`,
            payload
        );
        return response.data.data;
    },

    // DELETE /api/etablissements/{etablissementId}/offres/{offreId}
    deleteOffre: async (etablissementId: number, offreId: number): Promise<void> => {
        await client.delete(`/etablissements/${etablissementId}/offres/${offreId}`);
    },
};
