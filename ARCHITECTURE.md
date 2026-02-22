# Architecture - ScholarWay Admin

But bref guide décrivant l'organisation et les conventions du projet.

## Structure principale

- `src/`
  - `api/` : client HTTP et services (ex: `candidatures.ts`). Services doivent exposer des fonctions asynchrones retournant des données neutres (DTOs). Actuellement services retournent des mocks pour faciliter le développement.
  - `components/` : composants UI réutilisables. `components/index.ts` exporte tous les composants.
  - `pages/` : pages de l'application (une page = route). La logique métier complexe doit être extraite en hooks.
  - `hooks/` : hooks réutilisables (ex: `useCandidatures`). Favoriser tests unitaires pour les hooks.
  - `utils/` : fonctions utilitaires (Excel, PDF, fichiers). Fournir des fonctions pures et testables.
  - `store/` : Redux slices et configuration du store.
  - `theme/`, `constants/`, `types/` : thèmes, constantes partagées, types/alias.

## Conventions

- Barrels (`index.ts`) pour `api`, `hooks`, `utils`, `components` et `types` pour réduire les chemins relatifs.
- Services (`src/api/*.ts`) utilisés par les hooks pour séparer l'accès aux données et la logique UI.
- Hooks contiennent la logique : filtrage, pagination, appels services, états locaux. Les composants captent uniquement l'affichage.
- Les utils exportent des fonctions pures sans effets secondaires (excepté helpers de téléchargement qui interagissent avec le navigateur).
- Auth token : stocké en `localStorage` sous la clé `authToken`. Le client axios (src/api/client.ts) ajoute automatiquement l'en-tête `Authorization`.

## Tests

- Écrire des tests unitaires pour `utils/*` et `hooks/*`.
- Mocker `src/api/*` dans les tests pour simuler réponses backend.

## Déploiement / Build

- `npm run build` assemble l'application via `vite`.
- Attention aux gros chunks ; envisager `React.lazy` + `Suspense` pour routage et pages lourdes.

## Prochaines améliorations

- Ajouter interceptors d'auth plus complets (refresh token).
- Remplacer les mocks par de vraies routes backend, migrer DTOs si nécessaire.
- Ajouter CI (lint, tests, build) et pré-commit hooks.

