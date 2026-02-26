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

// Backend Pagination Interface (Spring Data Page)
export interface PaginatedBackendResponse<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

export interface QuickStat {
    label: string;
    value: string | number;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    trend?: number;
}

// Common Backend Enums
export type Sexe = 'M' | 'F';
export type Mention = 'PASSABLE' | 'ASSEZ_BIEN' | 'BIEN' | 'TRES_BIEN' | 'EXCELLENT';
