import client from "./client";


export interface CreateCampagnePayload {
    idEtablissementParcours: number;
    anneeAcademique: string;
    dateOuverture: string;
    dateCloture: string;
    dateConcoursEcrit?: string;
}

export const campagnesApi = {
    createCampagne: async (etablissementId: number, data: CreateCampagnePayload) => {
        const response = await client.post(`/api/campagnes/etablissements/${etablissementId}`, data);
        return response.data;
    },
    // Future methods pour cloturer etc. 
    // ou tout autre actions liées aux campagnes.
};
