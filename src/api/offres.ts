import client from './client';

export interface CreateParcoursPayload {
    idDomaine: number;
    nomParcours: string;
    description: string;
}

export interface ParcoursBackend {
    id: number;
    nomParcours: string;
    description: string;
    idDomaine: number;
}

export interface CreateOffrePayload {
    idParcours: number;
    fraisScolarite: number;
    conditionsAdmission: string;
    debouches: string;
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
  // GET /api/parcours/domaines/{domaineId}
  getParcoursByDomaine: async (domaineId: number): Promise<ParcoursBackend[]> => {
    const response = await client.get<{ success: boolean; data: { content: ParcoursBackend[] } }>(
      `/parcours/domaines/${domaineId}`,
      { params: { size: 100 } }
    );
    // Le backend semble renvoyer une structure paginée avec un champ 'content'
    return response.data.data.content || [];
  },

  // GET /api/etablissements/{etablissementId}/offres
  getOffres: async (etablissementId: number): Promise<OffreBackend[]> => {
    const response = await client.get<{ success: boolean; data: OffreBackend[] }>(
      `/etablissements/${etablissementId}/offres`
    );
    return response.data.data;
  },

  // POST /api/parcours/etablissements/{etablissementId}
  createParcours: async (etablissementId: number, payload: CreateParcoursPayload): Promise<{ id: number }> => {
    console.log('API createParcours - URL: /parcours/etablissements/' + etablissementId, 'Payload:', payload);
    const response = await client.post<{ success: boolean; data: { id: number } }>(
      `/parcours/etablissements/${etablissementId}`,
      payload
    );
    return response.data.data;
  },

  // POST /api/etablissements/{etablissementId}/offres
  createOffre: async (etablissementId: number, payload: CreateOffrePayload): Promise<OffreBackend> => {
    console.log('API createOffre - URL: /etablissements/' + etablissementId + '/offres', 'Payload:', payload);
    const response = await client.post<{ success: boolean; data: OffreBackend }>(
      `/etablissements/${etablissementId}/offres`,
      payload
    );
    return response.data.data;
  },

  // DELETE /api/etablissements/offres/{offreId}
  deleteOffre: async (etablissementId: number, offreId: number): Promise<void> => {
    // Le backend semble utiliser /api/etablissements/{etablissementId}/offres/{offreId} 
    // ou /api/etablissements/offres/{offreId} selon la discussion. 
    // Je garde la signature cohérente avec l'appelant actuel si possible.
    await client.delete(`/etablissements/${etablissementId}/offres/${offreId}`);
  },
};
