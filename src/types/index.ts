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

// Enums basés sur le backend
export type Sexe = 'MASCULIN' | 'FEMININ';
export type Mention = 'PASSABLE' | 'ASSEZ_BIEN' | 'BIEN' | 'TRES_BIEN' | 'EXCELLENT';
export type StatutCompte = 'ACTIF' | 'INACTIF' | 'SUSPENDU' | 'EN_ATTENTE';
export type StatutCampagne = 'A_VENIR' | 'OUVERTE' | 'CLOTUREE';
export type StatutCandidature = 'SOUMISE' | 'EN_COURS' | 'ACCEPTEE' | 'REFUSEE' | 'EN_ATTENTE_CONCOURS';
export type TypeModification = 'CREATION' | 'MODIFICATION' | 'SUPPRESSION';
export type RoleUtilisateur = 'SUPER_ADMIN' | 'ADMIN_ETABLISSEMENT' | 'BACHELIER';

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

// 📚 SerieBac
export interface SerieBac {
  id: number;
  nomSerie: string;
  pays: string;
  description?: string;
  active: boolean;
}

// 🎓 Bachelier (Backend model)
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

// 🏫 Établissement (Backend model)
export interface EtablissementBackend {
  id?: number;
  nomEtablissement: string;
  description?: string;
  logoUrl?: string;
  localisation: string;
  siteWeb?: string;
  telephonePro: string;
  documentAccreditationUrl?: string;
  scolariteGlobale?: string;
  valide: boolean;
  utilisateur?: Utilisateur;
}

// 👨‍💼 Administrateur (Backend model)
export interface AdministrateurBackend {
  id?: number;
  nomAdmin: string;
  roleAdmin: string;
  utilisateur?: Utilisateur;
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

// 📅 CampagneAdmission (Backend model)
export interface CampagneAdmission {
  id: number;
  parcours: ParcoursBackend;
  anneeAcademique: string;
  dateOuverture: string;
  dateCloture: string;
  statut: StatutCampagne;
  dateConcoursEcrit?: string;
  fichierResultatsUrl?: string;
}

// 📝 Candidature (Backend model)
export interface CandidatureBackend {
  id: number;
  numeroCandidature: string;
  bachelier: BachelierBackend;
  campagneAdmission: CampagneAdmission;
  dateSoumission: string;
  statut: StatutCandidature;
}

// 📁 DossierAcademique (Backend model)
export interface DossierAcademique {
  id: number;
  bachelier: BachelierBackend;
  bulletinSecondeUrl?: string;
  bulletinPremiereUrl?: string;
  bulletinTerminaleUrl?: string;
  releveBac1Url?: string;
  releveBac2Url?: string;
  cvUrl?: string;
  preuveNationaliteUrl?: string;
}

// ⭐ Favoris (Backend model)
export interface FavorisBackend {
  id: number;
  bachelier: BachelierBackend;
  parcours: ParcoursBackend;
  dateAjout: string;
  notes?: string;
}

// 🔔 NotificationBackend (Backend model)
export interface NotificationBackend {
  id: number;
  utilisateur: Utilisateur;
  titre: string;
  contenu: string;
  type: TypeNotification;
  dateEnvoi: string;
  estLue: boolean;
  dateLecture?: string;
}

// 📜 HistoriqueModificationDossier
export interface HistoriqueModificationDossier {
  id: number;
  dossier: DossierAcademique;
  typeModification: TypeModification;
  donneesAvant?: Record<string, unknown>;
  donneesApres?: Record<string, unknown>;
}

// Legacy User type for auth (updated with new roles)
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleUtilisateur;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // Champs spécifiques pour admin_etablissement
  etablissementId?: number;
  etablissementNom?: string;
}
