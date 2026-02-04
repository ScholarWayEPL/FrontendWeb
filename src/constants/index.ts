// Constantes pour ScholarWay - Togo

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
