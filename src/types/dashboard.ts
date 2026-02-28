// 📊 Dashboard Stats
export interface DashboardStats {
    totalUsers: number;
    usersGrowth: number;
    totalEtablissements: number;
    etablissementsGrowth: number;
    totalDossiersValides: number;
    dossiersGrowth: number;
    totalNotifications: number;
    inscriptionsParMois: ChartDataPoint[];
    repartitionParStatut: PieChartDataPoint[];
    recentActivity: ActivityItem[];
    topProgrammes: TopProgrammeData[];
    statsRapides: Array<{ value: number | string; label: string }>;
}

export interface ActivityItem {
    id: number;
    type: 'user_created' | 'etablissement_added' | 'programme_updated' | 'notification_sent';
    description: string;
    timestamp: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
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

// 🧠 Chatbot IA
export interface ChatbotIA {
    idSession: number;
    historiqueMessages: string;
}

// ⚙️ Moteur de Matching
export interface MoteurMatching {
    idMatching: number;
    scoreMatching: number;
}

// 💡 Recommandations
export interface Recommandation {
    idRecommandation: number;
    texteRecommandation: string;
}
