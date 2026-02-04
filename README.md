# 🎓 ScholarWay Admin

Plateforme d'administration pour la gestion des orientations académiques au Togo.

## 📋 Description

ScholarWay Admin est une application web moderne et modulaire construite avec **React 19**, **TypeScript 5.9** et **Vite 7**. Elle permet aux administrateurs de gérer :

- 👥 Les bacheliers et leurs candidatures
- 🏫 Les établissements d'enseignement
- 📚 Les programmes d'études
- 🔔 Les notifications système
- 📊 Les statistiques et analytiques
- 📝 Le journal d'activité

## 🚀 Stack Technique

### Frontend
- **React 19.2.0** - Framework UI
- **TypeScript 5.9** - Typage statique
- **Vite 7.2** - Build tool
- **MUI 5.15** - Composants UI
- **Redux Toolkit 2.11** - State management
- **Recharts** - Graphiques interactifs
- **React Router 6.21** - Navigation

### Fonctionnalités Clés
- ✅ Authentification avec login/logout
- ✅ Dashboard avec graphiques Recharts
- ✅ CRUD pour bacheliers, établissements, programmes
- ✅ Notifications système admin
- ✅ Profil utilisateur et paramètres
- ✅ Journal d'activité avec timeline
- ✅ Design responsive et modulaire

## 📁 Structure du Projet

```
src/
├── api/              # Services API mockés
├── components/       # Composants réutilisables
├── constants/        # Constantes (régions, devise)
├── layouts/          # Layouts de page
├── pages/            # Pages de l'application
├── store/            # Redux state management
├── theme/            # Thème MUI personnalisé
├── types/            # Types TypeScript
├── utils/            # Fonctions utilitaires
├── App.tsx           # Composant racine
└── main.tsx          # Point d'entrée
```

## 🔐 Authentification

### Identifiants de Démo
- **Utilisateur** : `admin`
- **Mot de passe** : `admin`

### Contexte Togo
- Devise : F CFA (XOF)
- Régions : Maritime, Plateaux, Centrale, Kara, Savanes
- Préfixe téléphone : +228

## 🛠️ Installation

```bash
# Cloner le repository
git clone <repository-url>

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Vérifier les types TypeScript
npm run type-check
```

## 📊 Pages Disponibles

| Page | URL | Description |
|------|-----|-------------|
| Login | `/login` | Authentification |
| Dashboard | `/` | Tableau de bord principal |
| Utilisateurs | `/utilisateurs` | Gestion des bacheliers |
| Établissements | `/etablissements` | Gestion des établissements |
| Programmes | `/programmes` | Gestion des programmes |
| Notifications | `/notifications` | Centre de notifications |
| Paramètres | `/parametres` | Profil et paramètres |
| Logs | `/logs` | Journal d'activité |

## 🎨 Design System

### Thème
- **Primaire** : Bleu `#1565C0`
- **Secondaire** : Vert `#2E7D32`
- **Background** : Gris clair `#F5F7FA`

### Composants Réutilisables
- `StatCard` - Cartes de statistiques
- `ConfirmDialog` - Dialogs de confirmation
- `GlobalSnackbar` - Notifications toast
- `ProtectedRoute` - Protections des routes

## 🔗 Exports Centralisés

Pour une meilleure organisation du code :

```tsx
// Pages
import { Login, Dashboard, Utilisateurs, ... } from './pages';

// Composants
import { GlobalSnackbar, ProtectedRoute, ... } from './components';

// APIs
import { dashboardApi, utilisatorsApi, ... } from './api';

// Store
import { useAppDispatch, useAppSelector } from './store/hooks';
```

## 📝 License

Propriétaire - ScholarWay 2026

## 👨‍💻 Support

Besoin d'aide ? Contactez le support techniques.
