/**
 * Utilitaires pour la génération et manipulation de fichiers Excel
 * Utilise la bibliothèque xlsx (à installer: npm install xlsx)
 */

import * as XLSX from 'xlsx';
import { downloadFile, MIME_TYPES, FILE_EXTENSIONS } from './fileUtils';

/**
 * Interface pour les données d'une feuille Excel
 */
export interface ExcelSheetData {
    sheetName: string;
    data: any[];
    columns?: string[];
}

/**
 * Génère un fichier Excel à partir de données
 * @param sheets - Tableau de feuilles avec leurs données
 * @param filename - Nom du fichier (sans extension)
 */
export const generateExcel = (sheets: ExcelSheetData[], filename: string): void => {
    // Créer un nouveau workbook
    const workbook = XLSX.utils.book_new();

    // Ajouter chaque feuille
    sheets.forEach(({ sheetName, data, columns }) => {
        let worksheet: XLSX.WorkSheet;

        if (columns && columns.length > 0) {
            // Si des colonnes sont spécifiées, les utiliser
            worksheet = XLSX.utils.json_to_sheet(data, { header: columns });
        } else {
            // Sinon, utiliser les clés des objets
            worksheet = XLSX.utils.json_to_sheet(data);
        }

        // Ajouter la feuille au workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: MIME_TYPES.EXCEL });

    // Télécharger le fichier
    downloadFile(blob, `${filename}${FILE_EXTENSIONS.EXCEL}`);
};

/**
 * Lit un fichier Excel et retourne les données
 * @param file - Le fichier Excel à lire
 * @returns Promise avec les données de toutes les feuilles
 */
export const readExcel = async (file: File): Promise<Record<string, any[]>> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e && e.target && e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });

                const result: Record<string, any[]> = {};

                // Lire chaque feuille
                workbook.SheetNames.forEach((sheetName) => {
                    const worksheet = workbook.Sheets[sheetName];
                    result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
                });

                resolve(result);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Exporte une liste de candidatures en Excel
 * @param candidatures - Liste des candidatures
 * @param filename - Nom du fichier
 */
export const exportCandidaturesToExcel = (candidatures: any[], filename: string = 'candidatures'): void => {
    const data = candidatures.map(c => ({
        'N° Candidature': c.numeroCandidature,
        'Nom': c.nomCandidat,
        'Prénom': c.prenomCandidat,
        'Email': c.emailCandidat,
        'Domaine': c.domaine || '',
        'Parcours': c.parcours,
        'Filière': c.filiere || '',
        'Série Bac': c.serieBac,
        'Moyenne': c.moyenneBac,
        'Date': new Date(c.dateSoumission).toLocaleDateString('fr-FR'),
        'Statut': c.statut,
    }));

    generateExcel([{ sheetName: 'Candidatures', data }], filename);
};

/**
 * Exporte les candidatures groupées par filière dans un fichier Excel avec un onglet par filière
 * @param candidatures - Liste des candidatures avec domaine, parcours et filiere
 * @param filename - Nom du fichier
 */
export const exportCandidaturesGroupedExcel = (candidatures: any[], filename: string = 'candidatures_groupees'): void => {
    // Grouper par filière
    const grouped: Record<string, any[]> = {};

    candidatures.forEach(c => {
        const key = c.filiere || c.parcours || 'Sans filière';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(c);
    });

    // Créer une feuille par filière
    const sheets: ExcelSheetData[] = Object.entries(grouped).map(([filiere, items]) => ({
        sheetName: filiere.substring(0, 31), // Max 31 caractères pour le nom de feuille Excel
        data: items.map(c => ({
            'N° Candidature': c.numeroCandidature,
            'Nom': c.nomCandidat,
            'Prénom': c.prenomCandidat,
            'Email': c.emailCandidat,
            'Domaine': c.domaine || '',
            'Parcours': c.parcours,
            'Série Bac': c.serieBac,
            'Moyenne': c.moyenneBac,
            'Date': new Date(c.dateSoumission).toLocaleDateString('fr-FR'),
            'Statut': c.statut,
        })),
    }));

    // Ajouter un onglet récapitulatif en premier
    const recap = Object.entries(grouped).map(([filiere, items]) => ({
        'Filière': filiere,
        'Nombre de candidatures': items.length,
        'Moyenne générale': items.length > 0
            ? (items.reduce((sum: number, c: any) => sum + (c.moyenneBac || 0), 0) / items.length).toFixed(2)
            : '-',
    }));

    sheets.unshift({
        sheetName: 'Récapitulatif',
        data: recap,
    });

    generateExcel(sheets, filename);
};

/**
 * Exporte la liste des résultats en Excel
 * @param resultats - Liste des résultats
 * @param filename - Nom du fichier
 */
export const exportResultatsToExcel = (resultats: any[], filename: string = 'resultats'): void => {
    const data = resultats.map(r => ({
        'N° Candidature': r.numeroCandidature,
        'Nom Complet': r.nomComplet,
        'Parcours': r.parcours,
        'Moyenne': r.moyenne,
        'Résultat': r.resultat,
        'Remarques': r.remarques || '',
    }));

    generateExcel([{ sheetName: 'Résultats', data }], filename);
};

/**
 * Génère un template Excel pour l'import de résultats
 * @param filename - Nom du fichier
 */
export const generateResultatsTemplate = (filename: string = 'template_resultats'): void => {
    const data = [
        {
            'N° Candidature': 'CAND-2024-001',
            'Résultat': 'ADMIS',
            'Remarques': 'Remarque optionnelle',
        },
        {
            'N° Candidature': 'CAND-2024-002',
            'Résultat': 'REFUSÉ',
            'Remarques': '',
        },
    ];

    generateExcel([{
        sheetName: 'Résultats',
        data,
        columns: ['N° Candidature', 'Résultat', 'Remarques']
    }], filename);
};
