// 📊 Dashboard Stats
export interface DashboardStats {
    totalBacheliers: number;
    totalEtablissements: number;
    totalProgrammes: number;
    totalAdmissions: number;
    newCandidatures: number;
    growthRate: number;
}

export interface ActivityItem {
    id: number;
    type: 'candidature' | 'inscription' | 'paiement';
    user: string;
    action: string;
    time: string;
    status: 'info' | 'success' | 'warning';
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
    name: string;
    admissions: number;
    capacity: number;
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
