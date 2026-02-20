import mockCandidatures, { mockParcours, mockFilieres } from './mockData/candidatures';

// Service for candidatures. Currently uses mocks; swap to real endpoints later.
export const fetchCandidatures = async (): Promise<any[]> => {
  // Example of future real call:
  // const { data } = await client.get('/candidatures');
  // return data;

  // For now return mocks to keep UI working
  return Promise.resolve(mockCandidatures);
};

export const fetchParcours = async (): Promise<string[]> => Promise.resolve(mockParcours);
export const fetchFilieres = async (): Promise<string[]> => Promise.resolve(mockFilieres);

export default {
  fetchCandidatures,
  fetchParcours,
  fetchFilieres,
};
