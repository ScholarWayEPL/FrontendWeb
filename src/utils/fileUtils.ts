/**
 * Utilitaires pour la gestion des fichiers (téléchargement, upload, génération)
 */

/**
 * Télécharge un fichier côté client
 * @param blob - Le blob du fichier à télécharger
 * @param filename - Le nom du fichier
 */
export const downloadFile = (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Lit un fichier et retourne son contenu
 * @param file - Le fichier à lire
 * @returns Promise avec le contenu du fichier
 */
export const readFile = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result || null);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Valide le type MIME d'un fichier
 * @param file - Le fichier à valider
 * @param allowedTypes - Liste des types MIME autorisés
 * @returns true si le type est valide
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
};

/**
 * Valide la taille d'un fichier
 * @param file - Le fichier à valider
 * @param maxSizeMB - Taille maximale en MB
 * @returns true si la taille est valide
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * Formate la taille d'un fichier pour l'affichage
 * @param bytes - Taille en bytes
 * @returns Taille formatée (ex: "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Types MIME constants
 */
export const MIME_TYPES = {
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    EXCEL_OLD: 'application/vnd.ms-excel',
    PDF: 'application/pdf',
    CSV: 'text/csv',
    JSON: 'application/json',
} as const;

/**
 * Extensions de fichiers
 */
export const FILE_EXTENSIONS = {
    EXCEL: '.xlsx',
    EXCEL_OLD: '.xls',
    PDF: '.pdf',
    CSV: '.csv',
    JSON: '.json',
} as const;
