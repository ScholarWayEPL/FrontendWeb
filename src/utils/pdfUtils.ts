/**
 * Utilitaires pour la génération de fichiers PDF
 * Utilise jsPDF et jspdf-autotable (à installer: npm install jspdf jspdf-autotable)
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadFile, MIME_TYPES, FILE_EXTENSIONS } from './fileUtils';

/**
 * Configuration par défaut pour les PDF
 */
const PDF_CONFIG = {
    orientation: 'portrait' as const,
    unit: 'mm' as const,
    format: 'a4' as const,
    margins: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 20,
    },
    colors: {
        primary: [25, 118, 210], // Bleu
        secondary: [156, 39, 176], // Violet
        success: [46, 125, 50], // Vert
        error: [211, 47, 47], // Rouge
        warning: [237, 108, 2], // Orange
        text: [33, 33, 33], // Noir
        lightGray: [240, 240, 240],
    },
};

/**
 * Ajoute un en-tête au PDF
 * @param doc - Document jsPDF
 * @param title - Titre du document
 * @param subtitle - Sous-titre optionnel
 * @param etablissementNom - Nom de l'établissement
 */
const addHeader = (
    doc: jsPDF,
    title: string,
    subtitle?: string,
    etablissementNom?: string
): number => {
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = PDF_CONFIG.margins.top;

    // Logo/Nom de l'établissement
    if (etablissementNom) {
        doc.setFontSize(12);
        doc.setTextColor(...PDF_CONFIG.colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text(etablissementNom, PDF_CONFIG.margins.left, currentY);
        currentY += 10;
    }

    // Titre principal
    doc.setFontSize(18);
    doc.setTextColor(...PDF_CONFIG.colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;

    // Sous-titre
    if (subtitle) {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitle, pageWidth / 2, currentY, { align: 'center' });
        currentY += 10;
    }

    // Ligne de séparation
    doc.setDrawColor(...PDF_CONFIG.colors.lightGray);
    doc.setLineWidth(0.5);
    doc.line(PDF_CONFIG.margins.left, currentY, pageWidth - PDF_CONFIG.margins.right, currentY);
    currentY += 5;

    return currentY;
};

/**
 * Ajoute un pied de page au PDF
 * @param doc - Document jsPDF
 */
const addFooter = (doc: jsPDF): void => {
    const pageCount = doc.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Ligne de séparation
        doc.setDrawColor(...PDF_CONFIG.colors.lightGray);
        doc.setLineWidth(0.5);
        doc.line(
            PDF_CONFIG.margins.left,
            pageHeight - 15,
            pageWidth - PDF_CONFIG.margins.right,
            pageHeight - 15
        );

        // Numéro de page
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(
            `Page ${i} sur ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );

        // Date de génération
        doc.text(
            `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
            PDF_CONFIG.margins.left,
            pageHeight - 10
        );
    }
};

/**
 * Génère un PDF de liste de candidatures
 * @param candidatures - Liste des candidatures
 * @param filename - Nom du fichier
 * @param etablissementNom - Nom de l'établissement
 */
export const generateCandidaturesPDF = (
    candidatures: any[],
    filename: string = 'candidatures',
    etablissementNom?: string
): void => {
    const doc = new jsPDF(PDF_CONFIG);

    // En-tête
    let currentY = addHeader(
        doc,
        'Liste des Candidatures',
        `Total: ${candidatures.length} candidature(s)`,
        etablissementNom
    );

    // Préparer les données du tableau
    const tableData = candidatures.map(c => [
        c.numeroCandidature,
        `${c.nomCandidat} ${c.prenomCandidat}`,
        c.parcours,
        c.serieBac,
        c.moyenneBac?.toFixed(2) || '-',
        new Date(c.dateSoumission).toLocaleDateString('fr-FR'),
        c.statut,
    ]);

    // Générer le tableau
    autoTable(doc, {
        startY: currentY,
        head: [['N° Candidature', 'Candidat', 'Parcours', 'Série', 'Moyenne', 'Date', 'Statut']],
        body: tableData,
        headStyles: {
            fillColor: PDF_CONFIG.colors.primary,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: PDF_CONFIG.colors.text,
        },
        alternateRowStyles: {
            fillColor: PDF_CONFIG.colors.lightGray,
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
        theme: 'grid',
    });

    // Pied de page
    addFooter(doc);

    // Télécharger le PDF
    const blob = doc.output('blob');
    downloadFile(blob, `${filename}${FILE_EXTENSIONS.PDF}`);
};

/**
 * Génère un PDF de résultats
 * @param resultats - Liste des résultats
 * @param phase - Phase des résultats (Phase 1, Phase 2, etc.)
 * @param filename - Nom du fichier
 * @param etablissementNom - Nom de l'établissement
 */
export const generateResultatsPDF = (
    resultats: any[],
    phase: string,
    filename: string = 'resultats',
    etablissementNom?: string
): void => {
    const doc = new jsPDF(PDF_CONFIG);

    // En-tête
    let currentY = addHeader(
        doc,
        `Résultats - ${phase}`,
        `Total: ${resultats.length} candidat(s)`,
        etablissementNom
    );

    // Préparer les données du tableau
    const tableData = resultats.map(r => [
        r.numeroCandidature,
        r.nomComplet,
        r.parcours,
        r.moyenne?.toFixed(2) || '-',
        r.resultat,
    ]);

    // Générer le tableau
    autoTable(doc, {
        startY: currentY,
        head: [['N° Candidature', 'Nom Complet', 'Parcours', 'Moyenne', 'Résultat']],
        body: tableData,
        headStyles: {
            fillColor: PDF_CONFIG.colors.primary,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 9,
            textColor: PDF_CONFIG.colors.text,
        },
        alternateRowStyles: {
            fillColor: PDF_CONFIG.colors.lightGray,
        },
        margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
        theme: 'grid',
        // Colorer les résultats
        didParseCell: (data) => {
            if (data.column.index === 4 && data.cell.section === 'body') {
                const resultat = data.cell.raw as string;
                if (resultat === 'ADMIS' || resultat === 'RETENU') {
                    data.cell.styles.textColor = PDF_CONFIG.colors.success;
                    data.cell.styles.fontStyle = 'bold';
                } else if (resultat === 'REFUSÉ' || resultat === 'NON RETENU') {
                    data.cell.styles.textColor = PDF_CONFIG.colors.error;
                }
            }
        },
    });

    // Pied de page
    addFooter(doc);

    // Télécharger le PDF
    const blob = doc.output('blob');
    downloadFile(blob, `${filename}${FILE_EXTENSIONS.PDF}`);
};

/**
 * Génère un PDF récapitulatif des statistiques
 * @param stats - Statistiques à afficher
 * @param filename - Nom du fichier
 * @param etablissementNom - Nom de l'établissement
 */
export const generateStatsPDF = (
    stats: Record<string, any>,
    filename: string = 'statistiques',
    etablissementNom?: string
): void => {
    const doc = new jsPDF(PDF_CONFIG);

    // En-tête
    let currentY = addHeader(
        doc,
        'Statistiques des Candidatures',
        undefined,
        etablissementNom
    );

    currentY += 10;

    // Afficher les statistiques
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    Object.entries(stats).forEach(([key, value]) => {
        doc.setTextColor(...PDF_CONFIG.colors.text);
        doc.text(`${key}:`, PDF_CONFIG.margins.left, currentY);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...PDF_CONFIG.colors.primary);
        doc.text(String(value), PDF_CONFIG.margins.left + 80, currentY);
        
        doc.setFont('helvetica', 'normal');
        currentY += 8;
    });

    // Pied de page
    addFooter(doc);

    // Télécharger le PDF
    const blob = doc.output('blob');
    downloadFile(blob, `${filename}${FILE_EXTENSIONS.PDF}`);
};

/**
 * Génère un PDF personnalisé avec du contenu libre
 * @param title - Titre du document
 * @param content - Contenu du document
 * @param filename - Nom du fichier
 * @param etablissementNom - Nom de l'établissement
 */
export const generateCustomPDF = (
    title: string,
    content: string,
    filename: string,
    etablissementNom?: string
): void => {
    const doc = new jsPDF(PDF_CONFIG);

    // En-tête
    let currentY = addHeader(doc, title, undefined, etablissementNom);

    currentY += 10;

    // Contenu
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_CONFIG.colors.text);

    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right;
    
    const lines = doc.splitTextToSize(content, maxWidth);
    doc.text(lines, PDF_CONFIG.margins.left, currentY);

    // Pied de page
    addFooter(doc);

    // Télécharger le PDF
    const blob = doc.output('blob');
    downloadFile(blob, `${filename}${FILE_EXTENSIONS.PDF}`);
};
