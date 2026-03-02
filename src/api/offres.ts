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
    try {
        const response = await client.get<{ success: boolean; data: any }>(
            `/parcours/domaines/${domaineId}`,
            { params: { size: 100 } }
        );
        
        // On récupère le tableau que ce soit dans .data ou .data.content
        const rawData = response.data.data;
        const list = Array.isArray(rawData) ? rawData : (rawData?.content || []);
        
        return list.map((p: any) => ({
            ...p,
            id: p.idParcours || p.id,
            nomParcours: p.nomParcours,
            description: p.description || '',
            idDomaine: p.idDomaine
        }));
    } catch (error) {
        console.error('API Error getParcoursByDomaine:', error);
        return [];
    }
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
    const response = await client.post<{ success: boolean; data: { idParcours: number; id: number } }>(
      `/parcours/etablissements/${etablissementId}`,
      payload
    );
    // On s'assure de récupérer l'ID que ce soit 'id' ou 'idParcours' selon ce que renvoie l'API
    const id = response.data.data.idParcours || response.data.data.id;
    return { id };
  },

  // POST /api/etablissements/{etablissementId}/offres
  createOffre: async (etablissementId: number, payload: CreateOffrePayload): Promise<OffreBackend> => {
    // Nettoyage du payload pour s'assurer que idParcours est présent et au bon format
    const cleanedPayload = {
      idParcours: Number(payload.idParcours),
      fraisScolarite: Number(payload.fraisScolarite),
      conditionsAdmission: payload.conditionsAdmission,
      debouches: payload.debouches,
      dureeAnnees: Number(payload.dureeAnnees),
      niveauRequis: payload.niveauRequis,
      seriesAcceptees: payload.seriesAcceptees || []
    };

    console.log('🚀 ENVOI OFFRE (Cleaned):', cleanedPayload);
    
    const response = await client.post<{ success: boolean; data: OffreBackend }>(
      `/etablissements/${etablissementId}/offres`,
      cleanedPayload
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
