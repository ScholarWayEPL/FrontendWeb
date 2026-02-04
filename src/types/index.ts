// Types pour ScholarWay Admin

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationParams;
}

// Enums
export type TypeEtablissement = 'Université' | 'École' | 'Institut';
export type NiveauProgramme = 'Licence' | 'Master' | 'Doctorat';
export type TypeNotification = 'Rappel' | 'Information';
export type StatutChecklist = 'EnCours' | 'Complete';

// 👨‍💼 Administrateur
export interface Administrateur {
  idAdmin: number;
  nom: string;
  email: string;
  motDePasse?: string;
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

// 🔔 Notification
export interface Notification {
  idNotification: number;
  idChecklist: number;
  contenu: string;
  dateEnvoi: string;
  type: TypeNotification;
}

// 📋 ChecklistAdmission
export interface ChecklistAdmission {
  idChecklist: number;
  documentsRequis: string;
  statut: StatutChecklist;
}

// ⭐ Favori
export interface Favori {
  idFavori: number;
  idBachelier: number;
  idProgramme: number;
  dateAjout: string;
}

// 🤖 ChatbotIA
export interface ChatbotIA {
  idChatbot: number;
  modeleIA: string;
  langue: string;
}

// 🔎 MoteurMatching
export interface MoteurMatching {
  idMatching: number;
  scorePertinence: number;
}

// 💡 Recommandation
export interface Recommandation {
  idRecommandation: number;
  idBachelier: number;
  idProgramme: number;
  score: number;
  dateGeneration: string;
}

// Stats Dashboard
export interface DashboardStats {
  totalUsers: number;
  totalEtablissements: number;
  totalProgrammes: number;
  totalNotifications: number;
  usersGrowth: number;
  etablissementsGrowth: number;
  programmesGrowth: number;
  recentActivity: ActivityItem[];
  // Données pour les graphiques
  inscriptionsParMois: ChartDataPoint[];
  repartitionParRegion: PieChartDataPoint[];
  repartitionParNiveau: PieChartDataPoint[];
  performanceHebdo: ChartDataPoint[];
  topProgrammes: TopProgrammeData[];
  statsRapides: QuickStat[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number; // Pour les graphiques avec 2 séries
}

export interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface TopProgrammeData {
  nom: string;
  etablissement: string;
  candidatures: number;
  taux: number;
}

export interface QuickStat {
  label: string;
  value: string | number;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: number;
}

export interface ActivityItem {
  id: string;
  type: 'user_created' | 'etablissement_added' | 'programme_updated' | 'notification_sent';
  description: string;
  timestamp: string;
}

// Legacy User type for auth
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'student' | 'teacher';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
