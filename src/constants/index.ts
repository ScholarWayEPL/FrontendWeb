// Constantes pour ScholarWay - Togo

// ============================================
// CONSTANTES DE STYLE UI
// ============================================

// Border radius standardisés (en pixels pour cohérence visuelle)
export const BORDER_RADIUS = {
  xs: '4px',      // Petits éléments (chips, badges)
  sm: '8px',      // Boutons
  md: '12px',     // Cards, modals, papers (moyennement arrondi)
  lg: '16px',     // Grandes sections
  xl: '20px',     // Éléments spéciaux
  input: '10px',  // Champs et inputs (doux et moderne)
  table: '10px',  // Tableaux
  full: '9999px', // Cercles parfaits
} as const;

// Espacements standardisés
export const SPACING = {
  page: { xs: 2, sm: 3 },           // Padding des pages
  card: { xs: 2, sm: 3 },           // Padding intérieur des cards
  section: { xs: 2, sm: 4 },        // Espacement entre sections
  grid: { xs: 2, sm: 3 },           // Espacement des grids
} as const;

// Ombres personnalisées
export const SHADOWS = {
  card: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  cardHover: '0px 8px 24px rgba(0, 0, 0, 0.12)',
  button: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  modal: '0px 24px 48px rgba(0, 0, 0, 0.2)',
} as const;

// Transitions
export const TRANSITIONS = {
  fast: '0.15s ease-in-out',
  normal: '0.25s ease-in-out',
  slow: '0.35s ease-in-out',
} as const;

// Tailles d'avatar
export const AVATAR_SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

// Statuts avec couleurs
export const STATUS_COLORS = {
  active: 'success',
  inactive: 'error',
  pending: 'warning',
  draft: 'default',
  published: 'info',
  closed: 'error',
  open: 'success',
} as const;

// ============================================
// CONSTANTES MÉTIER - TOGO
// ============================================

// Régions du Togo
export const REGIONS_TOGO = [
  'Maritime',
  'Plateaux',
  'Centrale',
  'Kara',
  'Savanes',
] as const;

export type RegionTogo = (typeof REGIONS_TOGO)[number];

// Options pour les filtres
export const REGION_OPTIONS = [
  { value: '', label: 'Toutes les régions' },
  { value: 'Maritime', label: 'Région Maritime' },
  { value: 'Plateaux', label: 'Région des Plateaux' },
  { value: 'Centrale', label: 'Région Centrale' },
  { value: 'Kara', label: 'Région de la Kara' },
  { value: 'Savanes', label: 'Région des Savanes' },
];

// Villes principales par région
export const VILLES_TOGO = {
  Maritime: ['Lomé', 'Aného', 'Tsévié', 'Tabligbo', 'Vogan'],
  Plateaux: ['Atakpamé', 'Kpalimé', 'Notsé', 'Badou', 'Amlamé'],
  Centrale: ['Sokodé', 'Tchamba', 'Sotouboua', 'Blitta'],
  Kara: ['Kara', 'Bassar', 'Niamtougou', 'Pagouda', 'Kantè'],
  Savanes: ['Dapaong', 'Mango', 'Tandjoaré', 'Cinkassé'],
} as const;

// Devise
export const DEVISE = {
  code: 'XOF',
  symbole: 'F CFA',
  locale: 'fr-TG',
};

// Formater un montant en F CFA
export const formatCFA = (montant: number): string => {
  if (montant === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(montant) + ' F CFA';
};

// Séries de bac au Togo
export const SERIES_BAC_TOGO = [
  'A1', 'A2', 'A4',  // Lettres
  'B',              // Économie
  'C', 'D',         // Sciences
  'E', 'F1', 'F2', 'F3', 'F4', // Techniques
  'G1', 'G2',       // Gestion
] as const;

export const SERIE_OPTIONS = [
  { value: '', label: 'Toutes les séries' },
  { value: 'A1', label: 'A1 - Lettres-Langues' },
  { value: 'A2', label: 'A2 - Lettres-Sciences Humaines' },
  { value: 'A4', label: 'A4 - Lettres-Langues' },
  { value: 'B', label: 'B - Économie' },
  { value: 'C', label: 'C - Mathématiques-Physique' },
  { value: 'D', label: 'D - Sciences Naturelles' },
  { value: 'E', label: 'E - Mathématiques-Techniques' },
  { value: 'F1', label: 'F1 - Fabrication Mécanique' },
  { value: 'F2', label: 'F2 - Électronique' },
  { value: 'F3', label: 'F3 - Électrotechnique' },
  { value: 'F4', label: 'F4 - Génie Civil' },
  { value: 'G1', label: 'G1 - Techniques Administratives' },
  { value: 'G2', label: 'G2 - Techniques Quantitatives de Gestion' },
];

// Types de notifications système (pour admin)
export const NOTIFICATION_TYPES_ADMIN = {
  CONNEXION: 'connexion',
  DECONNEXION: 'deconnexion',
  CREATION: 'creation',
  MODIFICATION: 'modification',
  SUPPRESSION: 'suppression',
  ALERTE: 'alerte',
  SYSTEME: 'systeme',
} as const;

// Indicatif téléphonique
export const INDICATIF_TOGO = '+228';
