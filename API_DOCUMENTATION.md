# 📘 Guide d'Intégration API - ScholarWay Backend

> **Version**: 1.0  
> **Dernière mise à jour**: 19 février 2026  
> **Base URL**: `https://scholarway.pepit.cloud/api`

---

## 📋 Table des Matières

1. [Introduction](#1-introduction)
2. [Authentification](#2-authentification)
3. [Endpoints par Module](#3-endpoints-par-module)
4. [Structures de Données (DTOs)](#4-structures-de-données-dtos)
5. [Énumérations](#5-énumérations)
6. [Upload de Fichiers](#6-upload-de-fichiers)
7. [Pagination](#7-pagination)
8. [Gestion des Erreurs](#8-gestion-des-erreurs)
9. [Exemples de Workflows](#9-exemples-de-workflows)
10. [Notes de Sécurité](#10-notes-de-sécurité)
11. [Fonctionnalités IA](#11-fonctionnalités-ia)

---

## 1. INTRODUCTION

### 🎯 Vue d'Ensemble du Projet

**ScholarWay** est une plateforme de gestion des candidatures pour l'enseignement supérieur, mettant en relation les bacheliers et les établissements d'enseignement.

**Technologies utilisées**:
- Spring Boot 3.x
- PostgreSQL
- JWT pour l'authentification
- IA pour l'extraction automatique de données

### 🌐 Configuration de Base

**URL de Base**: `https://scholarway.pepit.cloud/api`

**Environnements**:
- **Production**: `https://scholarway.pepit.cloud/api`
- **Développement Local**: `http://localhost:8080/api`

### 📦 Versionnage de l'API

Actuellement **v1** (non versionné dans l'URL). Les futures versions utiliseront `/api/v2/...`

### 📄 Format de Réponse Standard

Toutes les réponses de l'API sont encapsulées dans l'objet `ApiResponse` :

```json
{
  "success": true,
  "message": "Opération réussie",
  "data": { ... },
  "timestamp": "2026-02-19T10:30:00",
  "errorCode": null
}
```

**En cas d'erreur** :

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "data": null,
  "timestamp": "2026-02-19T10:30:00",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

## 2. AUTHENTIFICATION

### 🔐 Système JWT Bearer Token

L'API utilise des **tokens JWT (JSON Web Token)** avec une validité de **24 heures**.

### 🔑 Endpoints d'Authentification

#### **POST** `/api/auth/login`
**Connexion d'un utilisateur**

**Authentification requise**: Non  
**Rôle requis**: Aucun

**Corps de la requête**:
```json
{
  "email": "etudiant@example.com",
  "motDePasse": "MotDePasse123!"
}
```

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "userId": 42,
    "email": "etudiant@example.com",
    "role": "ROLE_BACHELIER",
    "expiresAt": "2026-02-20T10:30:00"
  }
}
```

**Erreurs possibles**:
- `401 Unauthorized`: Email ou mot de passe incorrect
- `403 Forbidden`: Compte désactivé ou en attente de validation

---

#### **POST** `/api/auth/register/bachelier`
**Inscription d'un bachelier**

**Authentification requise**: Non

**Corps de la requête**:
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "motDePasse": "SecurePass123!",
  "dateNaissance": "2005-03-15",
  "sexe": "M",
  "telephone": "+228 90 12 34 56"
}
```

**Réponse** (201 Created):
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "userId": 43,
    "email": "jean.dupont@example.com",
    "role": "ROLE_BACHELIER",
    "expiresAt": "2026-02-20T10:30:00"
  }
}
```

**Contraintes de validation**:
- Email : format valide
- Mot de passe : minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
- Téléphone : format valide

---

#### **POST** `/api/auth/register/etablissement`
**Inscription d'un établissement (en attente de validation)**

**Authentification requise**: Non

**Corps de la requête**:
```json
{
  "nomEtablissement": "Université de Lomé",
  "email": "admission@univ-lome.tg",
  "motDePasse": "AdminPass123!",
  "description": "Université publique...",
  "localisation": "Lomé, Togo",
  "siteWeb": "https://www.univ-lome.tg",
  "telephonePro": "+228 22 25 50 10"
}
```

**Réponse** (201 Created):
```json
{
  "success": true,
  "message": "Inscription enregistrée. Votre compte sera activé après validation par un administrateur.",
  "data": {
    "token": null,
    "userId": 15,
    "email": "admission@univ-lome.tg",
    "role": "ROLE_ETABLISSEMENT",
    "expiresAt": null
  }
}
```

⚠️ **Note**: Aucun token n'est fourni. Le compte doit être validé par un administrateur avant activation.

---

### 🎫 Format du Token JWT

**Structure du token**:
```json
{
  "sub": "etudiant@example.com",
  "role": "ROLE_BACHELIER",
  "iat": 1708344600,
  "exp": 1708431000
}
```

**Utilisation dans les requêtes**:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     https://scholarway.pepit.cloud/api/bacheliers/42
```

**En-tête HTTP**:
```
Authorization: Bearer {votre_token_jwt}
```

---

### 👤 Rôles et Permissions

| Rôle | Description | Permissions |
|------|-------------|-------------|
| `ROLE_BACHELIER` | Étudiant bachelier | Gérer son profil, soumettre candidatures, favoris |
| `ROLE_ETABLISSEMENT` | Établissement d'enseignement | Gérer parcours, campagnes, consulter candidatures |
| `ROLE_ADMINISTRATEUR` | Administrateur plateforme | Accès complet, validation établissements, statistiques |

---

## 3. ENDPOINTS PAR MODULE

### 🔹 A. Authentification (`/api/auth`)

| Méthode | URL | Auth | Rôle | Description |
|---------|-----|------|------|-------------|
| POST | `/api/auth/login` | ❌ | - | Connexion utilisateur |
| POST | `/api/auth/register/bachelier` | ❌ | - | Inscription bachelier |
| POST | `/api/auth/register/etablissement` | ❌ | - | Inscription établissement |

---

### 🔹 B. Bacheliers (`/api/bacheliers`)

#### **GET** `/api/bacheliers`
**Liste tous les bacheliers (paginé)**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Paramètres de requête**:
- `page` (défaut: 0)
- `size` (défaut: 20)
- `sort` (défaut: "dateCreation")

**Réponse** (200 OK):
```json
{
  "content": [
    {
      "idUtilisateur": 42,
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@example.com",
      "dateNaissance": "2005-03-15",
      "age": 20,
      "sexe": "M",
      "telephone": "+228 90 12 34 56",
      "serieBac": "C",
      "moyenneBac": 14.5,
      "mention": "BIEN",
      "matieresPrincipales": "Mathématiques, Physique",
      "objectifsProfessionnels": "Ingénieur informatique",
      "budgetMax": 2000000.0,
      "statut": "ACTIF",
      "dateCreation": "2026-01-10T08:00:00",
      "derniereConnexion": "2026-02-19T10:00:00",
      "profilComplet": true
    }
  ],
  "pageable": {},
  "totalPages": 5,
  "totalElements": 100,
  "size": 20,
  "number": 0
}
```

---

#### **GET** `/api/bacheliers/{id}`
**Récupérer un bachelier par ID**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

**Paramètres de chemin**:
- `id` (Long): ID du bachelier

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "idUtilisateur": 42,
    "nom": "Dupont",
    "prenom": "Jean"
  }
}
```

---

#### **GET** `/api/bacheliers/by-email/{email}`
**Récupérer un bachelier par email**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

**Exemple**:
```bash
GET /api/bacheliers/by-email/jean.dupont@example.com
```

---

#### **GET** `/api/bacheliers/search`
**Rechercher des bacheliers**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Paramètres de requête**:
- `query` (String): Terme de recherche (nom ou prénom)

**Exemple**:
```bash
GET /api/bacheliers/search?query=Dupont
```

---

#### **PUT** `/api/bacheliers/{id}/profile`
**Mettre à jour le profil**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "dateNaissance": "2005-03-15",
  "sexe": "M",
  "telephone": "+228 90 12 34 56",
  "serieBac": "C",
  "moyenneBac": 15.2,
  "matieresPrincipales": "Mathématiques, Physique, Chimie",
  "objectifsProfessionnels": "Devenir ingénieur en intelligence artificielle",
  "budgetMax": 2500000.0
}
```

---

### 🔹 C. Campagnes (`/api/campagnes`)

#### **GET** `/api/campagnes`
**Liste toutes les campagnes (paginé)**

**Authentification requise**: ❌ (accès public)

**Réponse** (200 OK):
```json
{
  "content": [
    {
      "idCampagne": 1,
      "titre": "Admission Licence 1 - 2026",
      "description": "Campagne d'admission pour la rentrée 2026",
      "dateDebut": "2026-03-01T00:00:00",
      "dateFin": "2026-06-30T23:59:59",
      "statut": "OUVERTE",
      "nombrePlacesDisponibles": 50,
      "parcours": {
        "idParcours": 5,
        "nomParcours": "Licence Informatique"
      },
      "etablissement": {
        "idUtilisateur": 10,
        "nomEtablissement": "Université de Lomé"
      },
      "dateCreation": "2026-01-15T10:00:00"
    }
  ],
  "totalElements": 25
}
```

---

#### **GET** `/api/campagnes/ouvertes`
**Liste des campagnes ouvertes**

**Authentification requise**: ❌

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "idCampagne": 1,
      "titre": "Admission Licence 1 - 2026",
      "statut": "OUVERTE"
    }
  ]
}
```

---

#### **GET** `/api/campagnes/{id}`
**Récupérer une campagne par ID**

**Authentification requise**: ❌

**Paramètres de chemin**:
- `id` (Long): ID de la campagne

---

#### **GET** `/api/campagnes/etablissements/{etablissementId}`
**Campagnes d'un établissement**

**Authentification requise**: ❌

**Paramètres de chemin**:
- `etablissementId` (Long): ID de l'établissement

**Paramètres de requête**:
- `page`, `size`, `sort`

---

#### **GET** `/api/campagnes/parcours/{parcoursId}`
**Campagnes d'un parcours**

**Authentification requise**: ❌

---

#### **POST** `/api/campagnes/etablissements/{etablissementId}`
**Créer une campagne**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "idParcours": 5,
  "titre": "Admission Master 1 - 2026",
  "description": "Campagne pour Master en IA",
  "dateDebut": "2026-04-01T00:00:00",
  "dateFin": "2026-07-31T23:59:59",
  "nombrePlacesDisponibles": 30
}
```

**Réponse** (201 Created):
```json
{
  "success": true,
  "message": "Campagne créée avec succès",
  "data": {
    "idCampagne": 26,
    "titre": "Admission Master 1 - 2026",
    "statut": "A_VENIR"
  }
}
```

---

#### **PUT** `/api/campagnes/{id}`
**Mettre à jour une campagne**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` (propriétaire) ou `ADMINISTRATEUR`

---

#### **DELETE** `/api/campagnes/{id}`
**Supprimer une campagne**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` (propriétaire) ou `ADMINISTRATEUR`

---

### 🔹 D. Candidatures (`/api/candidatures`)

#### **POST** `/api/candidatures`
**Soumettre une candidature**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`

**Corps de la requête**:
```json
{
  "idCampagne": 1,
  "lettreMotivation": "Je suis très motivé pour intégrer votre établissement car..."
}
```

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "Candidature soumise avec succès",
  "data": {
    "idCandidature": 150,
    "numeroCandidature": "CAND-2026-150",
    "statut": "SOUMISE",
    "dateCreation": "2026-02-19T10:30:00",
    "bachelier": {
      "idUtilisateur": 42,
      "nom": "Dupont",
      "prenom": "Jean"
    },
    "campagne": {
      "idCampagne": 1,
      "titre": "Admission Licence 1 - 2026"
    },
    "lettreMotivation": "Je suis très motivé...",
    "peutModifier": true,
    "statutFinal": false
  }
}
```

⚠️ **Sécurité**: L'email du bachelier est extrait du JWT, pas du corps de la requête.

---

#### **GET** `/api/candidatures/bachelier/{bachelerId}`
**Liste des candidatures d'un bachelier**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "idCandidature": 150,
      "numeroCandidature": "CAND-2026-150",
      "statut": "EN_TRAITEMENT"
    }
  ]
}
```

---

#### **GET** `/api/candidatures/numero/{numeroCandidature}`
**Récupérer une candidature par numéro unique**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Exemple**:
```bash
GET /api/candidatures/numero/CAND-2026-150
```

---

#### **GET** `/api/candidatures/{id}`
**Récupérer une candidature par ID**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR`

---

#### **GET** `/api/candidatures/campagne/{campagneId}`
**Liste des candidatures d'une campagne**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Réponse** (200 OK):
```json
{
  "content": [
    {
      "idCandidature": 150,
      "numeroCandidature": "CAND-2026-150",
      "statut": "SOUMISE",
      "bachelier": {
        "nom": "Dupont",
        "prenom": "Jean",
        "moyenneBac": 14.5
      }
    }
  ],
  "totalElements": 45
}
```

---

#### **PATCH** `/api/candidatures/{id}/statut`
**Modifier le statut d'une candidature**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` (propriétaire de la campagne) ou `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "nouveauStatut": "RETENU_PHASE_1",
  "commentaire": "Dossier excellent, convoqué pour l'entretien"
}
```

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "Statut mis à jour avec succès",
  "data": {
    "idCandidature": 150,
    "statut": "RETENU_PHASE_1"
  }
}
```

---

### 🔹 E. Dossiers Académiques (`/api/dossiers`)

#### **POST** `/api/dossiers/{bachelerId}/documents`
**Upload un document**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

**Paramètres de chemin**:
- `bachelerId` (Long): ID du bachelier

**Paramètres de requête**:
- `documentType` (String): `bulletin_seconde`, `bulletin_premiere`, `bulletin_terminale`, `releve_bac1`, `releve_bac2`, `cv`, `preuve_nationalite`

**Corps de la requête** (multipart/form-data):
- `file` (MultipartFile): Fichier PDF (max 10 MB)

**Exemple cURL**:
```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "file=@bulletin_terminale.pdf" \
  "https://scholarway.pepit.cloud/api/dossiers/42/documents?documentType=bulletin_terminale"
```

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "Document uploadé avec succès",
  "data": "https://scholarway.pepit.cloud/uploads/documents/bacheliers/42/bulletin_terminale.pdf"
}
```

**Erreurs possibles**:
- `400 Bad Request`: Type de fichier invalide ou fichier trop volumineux
- `404 Not Found`: Bachelier non trouvé

---

#### **GET** `/api/dossiers/{bachelerId}/status`
**Statut du dossier**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "Dossier complet",
  "data": true
}
```

---

#### **GET** `/api/dossiers/{bachelerId}/documents/{documentType}`
**Télécharger un document**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire), `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Réponse**: Flux PDF (application/pdf)

---

#### **GET** `/api/dossiers/{bachelerId}`
**Récupérer le dossier académique**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire), `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "idDossier": 42,
    "idBachelier": 42,
    "bulletinSecondeUrl": "https://...",
    "bulletinPremiereUrl": "https://...",
    "bulletinTerminale1Url": "https://...",
    "bulletinTerminale2Url": "https://...",
    "cvUrl": "https://...",
    "preuveNationaliteUrl": "https://...",
    "dateDerniereMiseAJour": "2026-02-19T10:00:00",
    "dossierComplet": true,
    "documentsFournis": 6,
    "documentsManquants": 0
  }
}
```

---

#### **POST** `/api/dossiers/{dossierId}/lancer-extraction`
**Lancer l'extraction IA**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

**Réponse** (202 Accepted):
```json
{
  "success": true,
  "message": "Extraction IA lancée avec succès",
  "data": {
    "idDossier": 42,
    "statutExtraction": "EN_TRAITEMENT"
  }
}
```

---

#### **GET** `/api/dossiers/{dossierId}/statut-extraction`
**Vérifier le statut de l'extraction**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire), `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "statutExtraction": "TERMINE",
    "donneesExtraites": {
      "moyenneGenerale": 14.5,
      "mention": "BIEN",
      "notes": {}
    }
  }
}
```

---

#### **POST** `/api/dossiers/{dossierId}/signaler-erreur`
**Signaler une erreur d'extraction**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire)

**Corps de la requête**:
```json
{
  "description": "La moyenne de mathématiques est incorrecte : 15 au lieu de 17",
  "champsConcernes": ["mathematiques"]
}
```

---

### 🔹 F. Domaines (`/api/domaines`)

#### **GET** `/api/domaines`
**Liste tous les domaines**

**Authentification requise**: ❌ (accès public)

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "idDomaine": 1,
      "nomDomaine": "Technologies de l'Information",
      "description": "Informatique, IA, Cybersécurité...",
      "nombreParcours": 15
    },
    {
      "idDomaine": 2,
      "nomDomaine": "Ingénierie",
      "description": "Génie civil, mécanique...",
      "nombreParcours": 12
    }
  ]
}
```

---

#### **GET** `/api/domaines/{id}`
**Récupérer un domaine par ID**

**Authentification requise**: ❌

---

#### **POST** `/api/domaines`
**Créer un domaine**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "nomDomaine": "Sciences de la Santé",
  "description": "Médecine, pharmacie, sciences infirmières..."
}
```

---

#### **PUT** `/api/domaines/{id}`
**Mettre à jour un domaine**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

#### **DELETE** `/api/domaines/{id}`
**Supprimer un domaine**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

### 🔹 G. Établissements (`/api/etablissements`)

#### **GET** `/api/etablissements`
**Liste tous les établissements (paginé)**

**Authentification requise**: ❌

---

#### **GET** `/api/etablissements/valides`
**Liste les établissements validés**

**Authentification requise**: ❌

---

#### **GET** `/api/etablissements/en-attente`
**Liste les établissements en attente de validation**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

#### **GET** `/api/etablissements/{id}`
**Récupérer un établissement par ID**

**Authentification requise**: ❌

**Réponse** (200 OK):
```json
{
  "idUtilisateur": 10,
  "nomEtablissement": "Université de Lomé",
  "description": "Université publique...",
  "email": "admission@univ-lome.tg",
  "logoUrl": "https://...",
  "localisation": "Lomé, Togo",
  "siteWeb": "https://www.univ-lome.tg",
  "telephonePro": "+228 22 25 50 10",
  "scolariteGlobale": "500000 - 2000000 FCFA",
  "valide": true,
  "dateValidationAdmin": "2026-01-20T10:00:00",
  "statut": "ACTIF",
  "dateCreation": "2026-01-15T10:00:00",
  "nombreParcours": 8,
  "nombreCampagnesActives": 3
}
```

---

#### **GET** `/api/etablissements/rechercher`
**Rechercher des établissements**

**Authentification requise**: ❌

**Paramètres de requête**:
- `q` (String): Terme de recherche (nom ou localisation)

**Exemple**:
```bash
GET /api/etablissements/rechercher?q=Lomé
```

---

#### **GET** `/api/etablissements/localisation/{localisation}`
**Rechercher par localisation**

**Authentification requise**: ❌

---

#### **PUT** `/api/etablissements/{id}/profile`
**Mettre à jour le profil**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` (propriétaire) ou `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "nomEtablissement": "Université de Lomé",
  "description": "Description mise à jour...",
  "localisation": "Lomé, Togo",
  "siteWeb": "https://www.univ-lome.tg",
  "telephonePro": "+228 22 25 50 10",
  "scolariteGlobale": "600000 - 2500000 FCFA"
}
```

---

#### **PATCH** `/api/etablissements/{id}/valider`
**Valider un établissement**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

#### **PATCH** `/api/etablissements/{id}/rejeter`
**Rejeter un établissement**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

### 🔹 H. Excel (`/api/excel`)

#### **GET** `/api/excel/campagne/{campagneId}/candidatures`
**Générer et télécharger le fichier Excel des candidatures**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Réponse**: Fichier Excel (.xlsx)

**Exemple**:
```bash
curl -H "Authorization: Bearer {token}" \
     -o candidatures.xlsx \
     https://scholarway.pepit.cloud/api/excel/campagne/1/candidatures
```

---

#### **POST** `/api/excel/synchroniser-resultats`
**Upload et synchroniser les résultats depuis un fichier Excel**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Corps de la requête** (multipart/form-data):
- `file` (MultipartFile): Fichier Excel (.xlsx)

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "25 candidature(s) mise(s) à jour",
  "data": 25
}
```

---

### 🔹 I. Favoris (`/api/favoris`)

#### **POST** `/api/favoris/bachelier/{bachelerId}`
**Ajouter un parcours aux favoris**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`

**Corps de la requête**:
```json
{
  "idParcours": 5,
  "notes": "Parcours intéressant, campus moderne"
}
```

**Réponse** (201 Created):
```json
{
  "success": true,
  "message": "Parcours ajouté aux favoris avec succès",
  "data": {
    "idFavori": 10,
    "idBachelier": 42,
    "parcours": {
      "idParcours": 5,
      "nomParcours": "Licence Informatique"
    },
    "notes": "Parcours intéressant...",
    "dateAjout": "2026-02-19T10:30:00"
  }
}
```

---

#### **DELETE** `/api/favoris/bachelier/{bachelerId}/parcours/{parcoursId}`
**Supprimer un parcours des favoris**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`

---

#### **PUT** `/api/favoris/bachelier/{bachelerId}/parcours/{parcoursId}/notes`
**Mettre à jour les notes d'un favori**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`

**Corps de la requête**:
```json
{
  "notes": "Notes mises à jour après visite du campus"
}
```

---

#### **GET** `/api/favoris/bachelier/{bachelerId}`
**Récupérer tous les favoris**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

---

#### **GET** `/api/favoris/bachelier/{bachelerId}/page`
**Récupérer les favoris (paginé)**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER` (propriétaire) ou `ADMINISTRATEUR`

**Paramètres de requête**:
- `page` (défaut: 0)
- `size` (défaut: 10)

---

#### **GET** `/api/favoris/bachelier/{bachelerId}/parcours/{parcoursId}/check`
**Vérifier si un parcours est en favori**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "estFavori": true
  }
}
```

---

#### **GET** `/api/favoris/bachelier/{bachelerId}/count`
**Compter le nombre de favoris**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

### 🔹 J. Notifications (`/api/notifications`)

#### **GET** `/api/notifications/utilisateur/{userId}`
**Liste des notifications d'un utilisateur (paginé)**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR` (propriétaire)

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "idNotification": 100,
        "titre": "Candidature acceptée",
        "contenu": "Votre candidature à Licence Informatique a été acceptée !",
        "type": "CANDIDATURE",
        "dateEnvoi": "2026-02-19T10:00:00",
        "estLue": false,
        "dateLecture": null,
        "urlAction": "/candidatures/150"
      }
    ],
    "totalElements": 12
  }
}
```

---

#### **GET** `/api/notifications/utilisateur/{userId}/non-lues`
**Liste des notifications non lues**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR` (propriétaire)

---

#### **GET** `/api/notifications/utilisateur/{userId}/count`
**Compter les notifications non lues**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR` (propriétaire)

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "count": 3
  }
}
```

---

#### **PATCH** `/api/notifications/{id}/lire`
**Marquer une notification comme lue**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR` (propriétaire)

---

#### **PATCH** `/api/notifications/utilisateur/{userId}/lire-toutes`
**Marquer toutes les notifications comme lues**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR` (propriétaire)

---

#### **DELETE** `/api/notifications/{id}`
**Supprimer une notification**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`, `ETABLISSEMENT` ou `ADMINISTRATEUR` (propriétaire)

---

### 🔹 K. Orientation (`/api/orientation`)

#### **POST** `/api/orientation/bachelier/{bachelerId}/recommandations`
**Obtenir des recommandations personnalisées**

**Authentification requise**: ✅  
**Rôle requis**: `BACHELIER`

**Corps de la requête** (optionnel):
```json
{
  "nombreRecommandations": 10,
  "filtreDomaineId": 1,
  "budgetMax": 2000000.0
}
```

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "Recommandations générées avec succès",
  "data": [
    {
      "parcours": {
        "idParcours": 5,
        "nomParcours": "Licence Informatique",
        "etablissement": "Université de Lomé"
      },
      "scoreCompatibilite": 92.5,
      "raisonsRecommandation": [
        "Correspond à votre série (C)",
        "Budget compatible",
        "Domaine d'intérêt : Technologies de l'Information"
      ]
    }
  ]
}
```

---

### 🔹 L. Parcours (`/api/parcours`)

#### **GET** `/api/parcours/{id}`
**Récupérer un parcours par ID**

**Authentification requise**: ❌ (accès public)

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": {
    "idParcours": 5,
    "nomParcours": "Licence Informatique",
    "description": "Formation en développement logiciel...",
    "niveauEtude": "Licence",
    "dureeAnnees": 3,
    "criteresMoyenneBac": 12.0,
    "seriesAcceptees": ["C", "D", "E"],
    "scolariteMin": 500000.0,
    "scolariteMax": 1500000.0,
    "etablissement": {
      "idUtilisateur": 10,
      "nomEtablissement": "Université de Lomé"
    },
    "domaine": {
      "idDomaine": 1,
      "nomDomaine": "Technologies de l'Information"
    },
    "nombreCampagnesOuvertes": 1
  }
}
```

---

#### **GET** `/api/parcours/search`
**Rechercher des parcours**

**Authentification requise**: ❌

**Paramètres de requête**:
- `domaineId` (Long, optionnel): ID du domaine
- `budgetMax` (Double, optionnel): Budget maximum

**Exemple**:
```bash
GET /api/parcours/search?domaineId=1&budgetMax=2000000
```

---

#### **GET** `/api/parcours/domaines/{domaineId}`
**Parcours par domaine**

**Authentification requise**: ❌

---

#### **GET** `/api/parcours/etablissements/{etablissementId}`
**Parcours par établissement**

**Authentification requise**: ❌

---

#### **POST** `/api/parcours/etablissements/{etablissementId}`
**Créer un parcours**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` (propriétaire) ou `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "nomParcours": "Master Intelligence Artificielle",
  "description": "Formation avancée en IA...",
  "niveauEtude": "Master",
  "dureeAnnees": 2,
  "idDomaine": 1,
  "criteresMoyenneBac": 14.0,
  "seriesAcceptees": ["C", "D"],
  "scolariteMin": 1000000.0,
  "scolariteMax": 3000000.0,
  "competencesRequises": "Mathématiques, Programmation",
  "debouches": "Data Scientist, Ingénieur IA..."
}
```

---

#### **PUT** `/api/parcours/{id}`
**Mettre à jour un parcours**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` (propriétaire) ou `ADMINISTRATEUR`

---

#### **DELETE** `/api/parcours/{id}`
**Supprimer un parcours**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` (propriétaire) ou `ADMINISTRATEUR`

---

### 🔹 M. Documents Sécurisés (`/api/secure-documents`)

#### **POST** `/api/secure-documents/generate-token`
**Générer un token d'accès document**

**Authentification requise**: ✅  
**Rôle requis**: `ETABLISSEMENT` ou `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "dossierId": 42,
  "documentType": "bulletin_terminale",
  "etablissementId": 10
}
```

**Réponse** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Token généré avec succès. Valide 48h, usage unique.",
  "expiresIn": 172800
}
```

⚠️ **Usage unique**: Le token est invalidé après utilisation.

---

#### **GET** `/api/secure-documents/download?token={jwt}`
**Télécharger un document avec token**

**Authentification requise**: ❌ (token unique requis)

**Paramètres de requête**:
- `token` (String): Token JWT single-use

**Réponse**: Flux PDF (application/pdf)

**Exemple**:
```bash
curl -o document.pdf \
     "https://scholarway.pepit.cloud/api/secure-documents/download?token={jwt}"
```

---

#### **GET** `/api/secure-documents/preview?token={jwt}`
**Prévisualiser un document**

**Authentification requise**: ❌ (token unique requis)

**Réponse**: PDF affiché inline (navigateur)

---

### 🔹 N. Séries Bac (`/api/series-bac`)

#### **GET** `/api/series-bac`
**Liste toutes les séries actives**

**Authentification requise**: ❌

**Réponse** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nomSerie": "C",
      "pays": "TG",
      "description": "Sciences Exactes",
      "active": true,
      "dateCreation": "2026-01-01T00:00:00",
      "nombreBacheliers": 120,
      "nombreParcours": 25
    },
    {
      "id": 2,
      "nomSerie": "D",
      "pays": "TG",
      "description": "Sciences de la Vie",
      "active": true,
      "dateCreation": "2026-01-01T00:00:00",
      "nombreBacheliers": 95,
      "nombreParcours": 18
    }
  ]
}
```

---

#### **GET** `/api/series-bac/pays/{codePays}`
**Liste les séries d'un pays**

**Authentification requise**: ❌

**Exemple**:
```bash
GET /api/series-bac/pays/TG
```

---

#### **GET** `/api/series-bac/recherche`
**Rechercher des séries**

**Authentification requise**: ❌

**Paramètres de requête**:
- `nom` (String): Nom partiel de la série
- `pays` (String, optionnel): Code ISO du pays

**Exemple**:
```bash
GET /api/series-bac/recherche?nom=C&pays=TG
```

---

#### **GET** `/api/series-bac/{id}`
**Récupérer une série par ID**

**Authentification requise**: ❌

---

#### **POST** `/api/series-bac`
**Créer une série**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "nomSerie": "F4",
  "pays": "TG",
  "description": "Électronique et Électrotechnique",
  "active": true
}
```

---

#### **PUT** `/api/series-bac/{id}`
**Mettre à jour une série**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

#### **DELETE** `/api/series-bac/{id}`
**Supprimer (désactiver) une série**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

### 🔹 O. Administration (`/api/admin`)

#### **GET** `/api/admin/etablissements/en-attente`
**Liste des établissements en attente de validation**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

---

#### **PATCH** `/api/admin/etablissements/{id}/valider`
**Valider un établissement**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Réponse** (200 OK):
```json
{
  "idUtilisateur": 10,
  "nomEtablissement": "Université de Lomé",
  "valide": true,
  "statut": "ACTIF",
  "dateValidationAdmin": "2026-02-19T10:30:00"
}
```

---

#### **PATCH** `/api/admin/etablissements/{id}/rejeter`
**Rejeter un établissement**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "motif": "Documents incomplets ou invalides"
}
```

**Réponse** (200 OK):
```json
{
  "message": "Etablissement rejeté avec succès",
  "motif": "Documents incomplets ou invalides"
}
```

---

#### **PATCH** `/api/admin/utilisateurs/{id}/statut`
**Modifier le statut d'un compte**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Corps de la requête**:
```json
{
  "nouveauStatut": "SUSPENDU",
  "motif": "Violation des conditions d'utilisation"
}
```

**Réponse** (200 OK):
```json
{
  "message": "Statut du compte modifié avec succès",
  "nouveauStatut": "SUSPENDU"
}
```

---

#### **GET** `/api/admin/statistiques`
**Statistiques globales de la plateforme**

**Authentification requise**: ✅  
**Rôle requis**: `ADMINISTRATEUR`

**Réponse** (200 OK):
```json
{
  "nombreBacheliers": 1250,
  "nombreEtablissements": 45,
  "nombreEtablissementsEnAttente": 8,
  "nombreParcours": 320,
  "nombreCampagnesOuvertes": 75,
  "nombreCandidatures": 5600,
  "nombreCandidaturesEnCours": 1200,
  "tauxReussiteGlobal": 42.5
}
```

---

## 4. STRUCTURES DE DONNÉES (DTOs)

### 📦 AuthResponse

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 42,
  "email": "etudiant@example.com",
  "role": "ROLE_BACHELIER",
  "expiresAt": "2026-02-20T10:30:00"
}
```

**Champs**:
- `token` (String): Token JWT
- `tokenType` (String): Toujours "Bearer"
- `userId` (Long): ID de l'utilisateur
- `email` (String): Email de l'utilisateur
- `role` (Role): Rôle de l'utilisateur
- `expiresAt` (LocalDateTime): Date d'expiration du token

---

### 📦 BachelierResponse

```json
{
  "idUtilisateur": 42,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "dateNaissance": "2005-03-15",
  "age": 20,
  "sexe": "M",
  "telephone": "+228 90 12 34 56",
  "serieBac": "C",
  "moyenneBac": 14.5,
  "mention": "BIEN",
  "matieresPrincipales": "Mathématiques, Physique",
  "objectifsProfessionnels": "Ingénieur informatique",
  "budgetMax": 2000000.0,
  "statut": "ACTIF",
  "dateCreation": "2026-01-10T08:00:00",
  "derniereConnexion": "2026-02-19T10:00:00",
  "profilComplet": true
}
```

**Champs**:
- `idUtilisateur` (Long): ID unique
- `nom` (String): Nom de famille
- `prenom` (String): Prénom
- `email` (String): Adresse email
- `dateNaissance` (LocalDate): Date de naissance
- `age` (Integer): Âge calculé
- `sexe` (Sexe): Sexe (M/F)
- `telephone` (String): Numéro de téléphone
- `serieBac` (String): Série du baccalauréat (C, D, A...)
- `moyenneBac` (Double): Moyenne obtenue au bac
- `mention` (Mention): Mention obtenue
- `matieresPrincipales` (String): Matières fortes
- `objectifsProfessionnels` (String): Objectifs de carrière
- `budgetMax` (Double): Budget maximum (FCFA)
- `statut` (StatutCompte): Statut du compte
- `dateCreation` (LocalDateTime): Date de création du compte
- `derniereConnexion` (LocalDateTime): Dernière connexion
- `profilComplet` (boolean): Indique si le profil est complet

---

### 📦 CampagneResponse

```json
{
  "idCampagne": 1,
  "titre": "Admission Licence 1 - 2026",
  "description": "Campagne d'admission pour la rentrée 2026",
  "dateDebut": "2026-03-01T00:00:00",
  "dateFin": "2026-06-30T23:59:59",
  "statut": "OUVERTE",
  "nombrePlacesDisponibles": 50,
  "parcours": {
    "idParcours": 5,
    "nomParcours": "Licence Informatique"
  },
  "etablissement": {
    "idUtilisateur": 10,
    "nomEtablissement": "Université de Lomé"
  },
  "nombreCandidatures": 45,
  "dateCreation": "2026-01-15T10:00:00"
}
```

**Champs**:
- `idCampagne` (Long): ID unique
- `titre` (String): Titre de la campagne
- `description` (String): Description
- `dateDebut` (LocalDateTime): Date de début
- `dateFin` (LocalDateTime): Date de fin
- `statut` (StatutCampagne): Statut (A_VENIR, OUVERTE, CLOTUREE)
- `nombrePlacesDisponibles` (Integer): Places disponibles
- `parcours` (ParcoursResponse): Parcours concerné
- `etablissement` (EtablissementResponse): Établissement organisateur
- `nombreCandidatures` (Long): Nombre de candidatures reçues
- `dateCreation` (LocalDateTime): Date de création

---

### 📦 CandidatureResponse

```json
{
  "idCandidature": 150,
  "numeroCandidature": "CAND-2026-150",
  "statut": "EN_TRAITEMENT",
  "dateCreation": "2026-02-19T10:30:00",
  "bachelier": {
    "idUtilisateur": 42,
    "nom": "Dupont",
    "prenom": "Jean",
    "moyenneBac": 14.5
  },
  "campagne": {
    "idCampagne": 1,
    "titre": "Admission Licence 1 - 2026"
  },
  "lettreMotivation": "Je suis très motivé...",
  "commentaireEtablissement": "Dossier solide",
  "peutModifier": false,
  "statutFinal": false
}
```

**Champs**:
- `idCandidature` (Long): ID unique
- `numeroCandidature` (String): Numéro unique (format: CAND-YYYY-XXXX)
- `statut` (StatutCandidature): Statut actuel
- `dateCreation` (LocalDateTime): Date de soumission
- `bachelier` (BachelierResponse): Candidat
- `campagne` (CampagneResponse): Campagne concernée
- `lettreMotivation` (String): Lettre de motivation
- `commentaireEtablissement` (String): Commentaire de l'établissement
- `peutModifier` (boolean): Indique si modifiable
- `statutFinal` (boolean): Indique si statut terminal

---

### 📦 DossierAcademiqueResponse

```json
{
  "idDossier": 42,
  "idBachelier": 42,
  "bulletinSecondeUrl": "https://...",
  "bulletinPremiereUrl": "https://...",
  "bulletinTerminale1Url": "https://...",
  "bulletinTerminale2Url": "https://...",
  "cvUrl": "https://...",
  "preuveNationaliteUrl": "https://...",
  "dateDerniereMiseAJour": "2026-02-19T10:00:00",
  "dossierComplet": true,
  "documentsFournis": 6,
  "documentsManquants": 0
}
```

**Champs**:
- `idDossier` (Long): ID unique
- `idBachelier` (Long): ID du bachelier propriétaire
- `bulletinSecondeUrl` (String): URL du bulletin de Seconde
- `bulletinPremiereUrl` (String): URL du bulletin de Première
- `bulletinTerminale1Url` (String): URL du 1er bulletin de Terminale
- `bulletinTerminale2Url` (String): URL du 2e bulletin de Terminale
- `cvUrl` (String): URL du CV
- `preuveNationaliteUrl` (String): URL de la preuve de nationalité
- `dateDerniereMiseAJour` (LocalDateTime): Dernière mise à jour
- `dossierComplet` (boolean): Indique si complet
- `documentsFournis` (int): Nombre de documents fournis
- `documentsManquants` (int): Nombre de documents manquants

---

### 📦 ParcoursResponse

```json
{
  "idParcours": 5,
  "nomParcours": "Licence Informatique",
  "description": "Formation en développement logiciel...",
  "niveauEtude": "Licence",
  "dureeAnnees": 3,
  "criteresMoyenneBac": 12.0,
  "seriesAcceptees": ["C", "D", "E"],
  "scolariteMin": 500000.0,
  "scolariteMax": 1500000.0,
  "etablissement": {
    "idUtilisateur": 10,
    "nomEtablissement": "Université de Lomé"
  },
  "domaine": {
    "idDomaine": 1,
    "nomDomaine": "Technologies de l'Information"
  },
  "nombreCampagnesOuvertes": 1,
  "competencesRequises": "Mathématiques, Logique",
  "debouches": "Développeur, Architecte logiciel..."
}
```

**Champs**:
- `idParcours` (Long): ID unique
- `nomParcours` (String): Nom du parcours
- `description` (String): Description détaillée
- `niveauEtude` (String): Niveau (Licence, Master, Doctorat...)
- `dureeAnnees` (Integer): Durée en années
- `criteresMoyenneBac` (Double): Moyenne minimale requise
- `seriesAcceptees` (List\<String\>): Séries acceptées
- `scolariteMin` (Double): Scolarité minimale (FCFA)
- `scolariteMax` (Double): Scolarité maximale (FCFA)
- `etablissement` (EtablissementResponse): Établissement proposant
- `domaine` (DomaineResponse): Domaine de formation
- `nombreCampagnesOuvertes` (Long): Campagnes ouvertes
- `competencesRequises` (String): Compétences requises
- `debouches` (String): Débouchés professionnels

---

### 📦 EtablissementResponse

```json
{
  "idUtilisateur": 10,
  "nomEtablissement": "Université de Lomé",
  "description": "Université publique...",
  "email": "admission@univ-lome.tg",
  "logoUrl": "https://...",
  "localisation": "Lomé, Togo",
  "siteWeb": "https://www.univ-lome.tg",
  "telephonePro": "+228 22 25 50 10",
  "scolariteGlobale": "500000 - 2000000 FCFA",
  "valide": true,
  "dateValidationAdmin": "2026-01-20T10:00:00",
  "statut": "ACTIF",
  "dateCreation": "2026-01-15T10:00:00",
  "derniereConnexion": "2026-02-19T09:00:00",
  "nombreParcours": 8,
  "nombreCampagnesActives": 3
}
```

**Champs**:
- `idUtilisateur` (Long): ID unique
- `nomEtablissement` (String): Nom de l'établissement
- `description` (String): Description
- `email` (String): Email de contact
- `logoUrl` (String): URL du logo
- `localisation` (String): Localisation
- `siteWeb` (String): Site web officiel
- `telephonePro` (String): Téléphone professionnel
- `scolariteGlobale` (String): Fourchette de scolarité
- `valide` (Boolean): Indique si validé par admin
- `dateValidationAdmin` (LocalDateTime): Date de validation
- `statut` (StatutCompte): Statut du compte
- `dateCreation` (LocalDateTime): Date de création
- `derniereConnexion` (LocalDateTime): Dernière connexion
- `nombreParcours` (Integer): Nombre de parcours proposés
- `nombreCampagnesActives` (Integer): Nombre de campagnes actives

---

### 📦 NotificationResponse

```json
{
  "idNotification": 100,
  "titre": "Candidature acceptée",
  "contenu": "Votre candidature à Licence Informatique a été acceptée !",
  "type": "CANDIDATURE",
  "dateEnvoi": "2026-02-19T10:00:00",
  "estLue": false,
  "dateLecture": null,
  "urlAction": "/candidatures/150"
}
```

**Champs**:
- `idNotification` (Long): ID unique
- `titre` (String): Titre de la notification
- `contenu` (String): Contenu détaillé
- `type` (TypeNotification): Type de notification
- `dateEnvoi` (LocalDateTime): Date d'envoi
- `estLue` (Boolean): Indique si lue
- `dateLecture` (LocalDateTime): Date de lecture (nullable)
- `urlAction` (String): URL de l'action associée

---

### 📦 FavorisResponse

```json
{
  "idFavori": 10,
  "idBachelier": 42,
  "parcours": {
    "idParcours": 5,
    "nomParcours": "Licence Informatique",
    "etablissement": {
      "nomEtablissement": "Université de Lomé"
    }
  },
  "notes": "Parcours intéressant, campus moderne",
  "dateAjout": "2026-02-19T10:30:00"
}
```

**Champs**:
- `idFavori` (Long): ID unique
- `idBachelier` (Long): ID du bachelier
- `parcours` (ParcoursResponse): Parcours favori
- `notes` (String): Notes personnelles
- `dateAjout` (LocalDateTime): Date d'ajout

---

### 📦 SerieBacResponse

```json
{
  "id": 1,
  "nomSerie": "C",
  "pays": "TG",
  "description": "Sciences Exactes",
  "active": true,
  "dateCreation": "2026-01-01T00:00:00",
  "nombreBacheliers": 120,
  "nombreParcours": 25
}
```

**Champs**:
- `id` (Long): ID unique
- `nomSerie` (String): Nom de la série (C, D, A...)
- `pays` (String): Code ISO du pays (TG, BJ, CI...)
- `description` (String): Description
- `active` (Boolean): Indique si active
- `dateCreation` (LocalDateTime): Date de création
- `nombreBacheliers` (Long): Nombre de bacheliers (calculé)
- `nombreParcours` (Long): Nombre de parcours acceptant (calculé)

---

## 5. ÉNUMÉRATIONS

### 🔸 Role

```java
ROLE_BACHELIER         // Étudiant bachelier
ROLE_ETABLISSEMENT     // Établissement d'enseignement
ROLE_ADMINISTRATEUR    // Administrateur de la plateforme
```

**Utilisation**: Contrôle d'accès et permissions

---

### 🔸 StatutCompte

```java
EN_ATTENTE    // Compte en attente de validation (établissements)
ACTIF         // Compte actif et validé
REJETE        // Compte rejeté (après examen)
SUSPENDU      // Compte suspendu temporairement
```

**Utilisation**: Gestion du cycle de vie des comptes utilisateurs

---

### 🔸 StatutCandidature

```java
SOUMISE            // Candidature soumise, en attente
EN_TRAITEMENT      // En cours de traitement par l'établissement
RETENU_PHASE_1     // Retenu pour la première phase
ADMIS_DEFINITIF    // Candidat définitivement admis
REFUSE             // Candidature refusée
LISTE_ATTENTE      // Candidat en liste d'attente
```

**Workflow**:
```
SOUMISE → EN_TRAITEMENT → RETENU_PHASE_1 → ADMIS_DEFINITIF
                       ↘ REFUSE
                       ↘ LISTE_ATTENTE
```

---

### 🔸 StatutCampagne

```java
A_VENIR    // Campagne programmée, pas encore ouverte
OUVERTE    // Campagne ouverte, candidatures acceptées
CLOTUREE   // Campagne clôturée, plus de candidatures
```

**Lifecycle**:
```
A_VENIR → OUVERTE → CLOTUREE
```

---

### 🔸 StatutExtraction

```java
EN_ATTENTE       // Extraction pas encore lancée
EN_TRAITEMENT    // Extraction IA en cours
TERMINE          // Extraction réussie
EN_LITIGE        // Erreur signalée par l'étudiant
VALIDE_PAR_ECOLE // École a validé les données corrigées
ERREUR_IA        // Échec technique de l'extraction
```

**Workflow AI**:
```
EN_ATTENTE → EN_TRAITEMENT → TERMINE
                          ↘ ERREUR_IA
                          ↘ EN_LITIGE → VALIDE_PAR_ECOLE
```

---

### 🔸 TypeDocument

```java
bulletin_seconde       // Bulletin de notes de Seconde
bulletin_premiere      // Bulletin de notes de Première
bulletin_terminale     // Bulletin de notes de Terminale
releve_bac1            // Relevé de notes BAC 1ère session
releve_bac2            // Relevé de notes BAC 2ème session
cv                     // Curriculum Vitae
preuve_nationalite     // Preuve de nationalité (CNI, passeport...)
```

**Formats acceptés**:
- Bulletins, relevés, preuve de nationalité : **PDF uniquement**
- CV : **PDF** ou **DOCX**

**Taille maximale**: **10 MB**

---

### 🔸 Mention

```java
PASSABLE      // Mention Passable (10-12)
ASSEZ_BIEN    // Mention Assez Bien (12-14)
BIEN          // Mention Bien (14-16)
TRES_BIEN     // Mention Très Bien (16-20)
```

**Calcul automatique** à partir de la moyenne :
```java
moyenne >= 16.0 → TRES_BIEN
moyenne >= 14.0 → BIEN
moyenne >= 12.0 → ASSEZ_BIEN
moyenne >= 10.0 → PASSABLE
```

---

### 🔸 Sexe

```java
M    // Masculin
F    // Féminin
```

---

### 🔸 TypeNotification

```java
CANDIDATURE          // Notification relative à une candidature
RAPPEL               // Rappel (date limite, concours...)
SYSTEME              // Notification système (maintenance...)
INFO_ETABLISSEMENT   // Information d'un établissement
```

---

## 6. UPLOAD DE FICHIERS

### 📤 Upload de Documents Académiques

**Endpoint**: `POST /api/dossiers/{bachelerId}/documents`

**Format**: `multipart/form-data`

**Paramètres**:
- `file` (MultipartFile): Fichier à uploader
- `documentType` (String): Type de document

**Types acceptés**:
- `bulletin_seconde`
- `bulletin_premiere`
- `bulletin_terminale`
- `releve_bac1`
- `releve_bac2`
- `cv`
- `preuve_nationalite`

---

### 📋 Contraintes

| Contrainte | Valeur |
|------------|--------|
| **Taille maximale** | 10 MB |
| **Formats (bulletins/relevés)** | PDF uniquement |
| **Formats (CV)** | PDF, DOCX |
| **Nombre max par type** | 1 fichier |

---

### 💻 Exemple cURL

```bash
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "file=@bulletin_terminale.pdf" \
  "https://scholarway.pepit.cloud/api/dossiers/42/documents?documentType=bulletin_terminale"
```

---

### 🌐 Exemple JavaScript (Fetch API)

```javascript
const file = document.getElementById('fileInput').files[0];
const bachelerId = 42;
const documentType = 'bulletin_terminale';

const formData = new FormData();
formData.append('file', file);

fetch(`https://scholarway.pepit.cloud/api/dossiers/${bachelerId}/documents?documentType=${documentType}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Upload réussi:', data);
})
.catch(error => {
  console.error('Erreur:', error);
});
```

---

### ⚙️ Exemple React (Axios)

```jsx
import axios from 'axios';

const uploadDocument = async (bachelerId, documentType, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `https://scholarway.pepit.cloud/api/dossiers/${bachelerId}/documents`,
      formData,
      {
        params: { documentType },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('Document uploadé:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur upload:', error.response?.data);
    throw error;
  }
};
```

---

### ❌ Gestion des Erreurs

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Type de fichier invalide | Vérifier l'extension (PDF, DOCX) |
| 400 | Fichier trop volumineux | Réduire la taille (max 10 MB) |
| 400 | Type de document invalide | Utiliser un type valide |
| 403 | Non autorisé | Vérifier le token et les permissions |
| 404 | Bachelier non trouvé | Vérifier l'ID du bachelier |

---

## 7. PAGINATION

### 📄 Fonctionnement

La pagination utilise **Spring Data Pageable** pour tous les endpoints retournant des listes.

### 🔧 Paramètres de Requête

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | Integer | 0 | Numéro de page (0-indexed) |
| `size` | Integer | 20 | Nombre d'éléments par page |
| `sort` | String | varies | Critère de tri (ex: `dateCreation,desc`) |

---

### 📊 Structure de Réponse Paginée

```json
{
  "content": [ ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 0,
    "pageSize": 20,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 100,
  "last": false,
  "first": true,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 20,
  "empty": false
}
```

**Champs importants**:
- `content`: Tableau des éléments de la page
- `totalPages`: Nombre total de pages
- `totalElements`: Nombre total d'éléments
- `number`: Numéro de la page actuelle (0-indexed)
- `size`: Taille de la page
- `first`: Indique si première page
- `last`: Indique si dernière page

---

### 💡 Exemples d'Utilisation

#### **Page 1 (20 éléments par défaut)**
```bash
GET /api/bacheliers
```

#### **Page 3, 50 éléments par page**
```bash
GET /api/bacheliers?page=2&size=50
```

#### **Tri par date de création décroissante**
```bash
GET /api/bacheliers?sort=dateCreation,desc
```

#### **Tri multiple**
```bash
GET /api/bacheliers?sort=nom,asc&sort=prenom,asc
```

#### **Combinaison complète**
```bash
GET /api/bacheliers?page=1&size=30&sort=moyenneBac,desc
```

---

### 🧮 Calcul de Pagination

```javascript
// Calculer le nombre total de pages
const totalPages = Math.ceil(totalElements / size);

// Avoir des éléments restants
const hasNext = (page + 1) < totalPages;
const hasPrevious = page > 0;

// Index de début et fin
const startIndex = page * size;
const endIndex = Math.min(startIndex + size, totalElements);
```

---

### 🎯 Bonnes Pratiques

1. **Limiter la taille de page**: Ne pas dépasser 100 éléments
2. **Toujours prévoir une valeur par défaut** pour `page` et `size`
3. **Afficher le nombre total** d'éléments à l'utilisateur
4. **Gérer les pages vides** (totalElements = 0)
5. **Utiliser le tri** pour une expérience cohérente

---

## 8. GESTION DES ERREURS

### ❌ Format de Réponse d'Erreur

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "data": null,
  "timestamp": "2026-02-19T10:30:00",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```

---

### 📋 Codes HTTP Utilisés

| Code | Signification | Quand | Exemple |
|------|---------------|-------|---------|
| **200** | OK | Succès | Récupération de données |
| **201** | Created | Ressource créée | Inscription, création campagne |
| **400** | Bad Request | Données invalides | Validation échouée |
| **401** | Unauthorized | Non authentifié | Token absent ou invalide |
| **403** | Forbidden | Non autorisé | Pas le bon rôle |
| **404** | Not Found | Ressource introuvable | ID inexistant |
| **409** | Conflict | Conflit | Email déjà utilisé |
| **500** | Internal Server Error | Erreur serveur | Exception non gérée |

---

### 🔍 Codes d'Erreur Métier

| Code | Description | Solution |
|------|-------------|----------|
| `RESOURCE_NOT_FOUND` | Ressource introuvable | Vérifier l'ID |
| `DUPLICATE_EMAIL` | Email déjà utilisé | Utiliser un autre email |
| `AUTHENTICATION_FAILED` | Authentification échouée | Vérifier credentials |
| `ACCESS_DENIED` | Accès refusé | Vérifier les permissions |
| `INVALID_TOKEN` | Token invalide | Se reconnecter |
| `TOKEN_EXPIRED` | Token expiré | Se reconnecter |
| `VALIDATION_ERROR` | Erreur de validation | Corriger les données |
| `BUSINESS_RULE_VIOLATION` | Règle métier violée | Vérifier les contraintes |
| `FILE_TOO_LARGE` | Fichier trop volumineux | Réduire la taille |
| `INVALID_FILE_TYPE` | Type de fichier invalide | Utiliser PDF/DOCX |

---

### 🛠️ Erreurs Courantes et Solutions

#### **401 Unauthorized - Token manquant**
```json
{
  "success": false,
  "message": "Token JWT manquant",
  "errorCode": "AUTHENTICATION_FAILED"
}
```
**Solution**: Ajouter l'en-tête `Authorization: Bearer {token}`

---

#### **401 Unauthorized - Token invalide**
```json
{
  "success": false,
  "message": "Token JWT invalide ou expiré",
  "errorCode": "INVALID_TOKEN"
}
```
**Solution**: Se reconnecter pour obtenir un nouveau token

---

#### **403 Forbidden - Rôle insuffisant**
```json
{
  "success": false,
  "message": "Accès refusé - Rôle ADMINISTRATEUR requis",
  "errorCode": "ACCESS_DENIED"
}
```
**Solution**: Utiliser un compte avec le rôle approprié

---

#### **404 Not Found**
```json
{
  "success": false,
  "message": "Bachelier non trouvé avec l'ID: 999",
  "errorCode": "RESOURCE_NOT_FOUND"
}
```
**Solution**: Vérifier que l'ID existe

---

#### **400 Bad Request - Validation**
```json
{
  "success": false,
  "message": "Erreur de validation",
  "data": {
    "email": "Format d'email invalide",
    "motDePasse": "Le mot de passe doit contenir au moins 8 caractères"
  },
  "errorCode": "VALIDATION_ERROR"
}
```
**Solution**: Corriger les champs indiqués

---

#### **409 Conflict - Email dupliqué**
```json
{
  "success": false,
  "message": "Un compte avec cet email existe déjà",
  "errorCode": "DUPLICATE_EMAIL"
}
```
**Solution**: Utiliser un email différent

---

#### **400 Bad Request - Fichier trop volumineux**
```json
{
  "success": false,
  "message": "Le fichier dépasse la taille maximale de 10 MB",
  "errorCode": "FILE_TOO_LARGE"
}
```
**Solution**: Compresser ou réduire le fichier

---

### 💻 Gestion des Erreurs en JavaScript

```javascript
async function appelAPI(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      // Erreur HTTP
      throw new Error(data.message || 'Erreur inconnue');
    }
    
    if (!data.success) {
      // Erreur métier
      throw new Error(data.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Erreur API:', error);
    
    // Gestion selon le code d'erreur
    if (error.message.includes('Token')) {
      // Rediriger vers login
      window.location.href = '/login';
    }
    
    throw error;
  }
}
```

---

### 🎯 Bonnes Pratiques

1. **Toujours vérifier `response.ok`** avant de traiter les données
2. **Logger les erreurs** pour le débogage
3. **Afficher des messages clairs** à l'utilisateur
4. **Gérer les tokens expirés** en redirigeant vers login
5. **Valider les données côté client** avant envoi
6. **Prévoir des fallbacks** pour les erreurs réseau

---

## 9. EXEMPLES DE WORKFLOWS

### 🔄 A. Workflow Complet d'Inscription Bachelier

#### **Étape 1 : Inscription**
```bash
POST /api/auth/register/bachelier
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "motDePasse": "SecurePass123!",
  "dateNaissance": "2005-03-15",
  "sexe": "M",
  "telephone": "+228 90 12 34 56"
}
```

**Réponse**:
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "userId": 42,
    "email": "jean.dupont@example.com",
    "role": "ROLE_BACHELIER"
  }
}
```

---

#### **Étape 2 : Compléter le profil**
```bash
PUT /api/bacheliers/42/profile
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "serieBac": "C",
  "moyenneBac": 14.5,
  "matieresPrincipales": "Mathématiques, Physique",
  "objectifsProfessionnels": "Ingénieur informatique",
  "budgetMax": 2000000.0
}
```

---

#### **Étape 3 : Upload des documents**

**Upload bulletin de Terminale**:
```bash
POST /api/dossiers/42/documents?documentType=bulletin_terminale
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: multipart/form-data

file=@bulletin_terminale.pdf
```

**Upload relevé BAC 1**:
```bash
POST /api/dossiers/42/documents?documentType=releve_bac1
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: multipart/form-data

file=@releve_bac1.pdf
```

**Upload CV**:
```bash
POST /api/dossiers/42/documents?documentType=cv
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: multipart/form-data

file=@cv.pdf
```

**Upload preuve de nationalité**:
```bash
POST /api/dossiers/42/documents?documentType=preuve_nationalite
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: multipart/form-data

file=@cni.pdf
```

---

#### **Étape 4 : Vérifier le statut du dossier**
```bash
GET /api/dossiers/42/status
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Réponse**:
```json
{
  "success": true,
  "message": "Dossier complet",
  "data": true
}
```

---

#### **Étape 5 : Lancer l'extraction IA**
```bash
POST /api/dossiers/42/lancer-extraction
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Réponse**:
```json
{
  "success": true,
  "message": "Extraction IA lancée avec succès",
  "data": {
    "idDossier": 42,
    "statutExtraction": "EN_TRAITEMENT"
  }
}
```

---

### 🔄 B. Workflow de Soumission de Candidature

#### **Étape 1 : Rechercher des parcours**
```bash
GET /api/parcours/search?domaineId=1&budgetMax=2000000
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

#### **Étape 2 : Consulter les détails d'un parcours**
```bash
GET /api/parcours/5
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

#### **Étape 3 : Ajouter aux favoris (optionnel)**
```bash
POST /api/favoris/bachelier/42
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "idParcours": 5,
  "notes": "À étudier en priorité"
}
```

---

#### **Étape 4 : Consulter les campagnes ouvertes**
```bash
GET /api/campagnes/ouvertes
```

---

#### **Étape 5 : Soumettre une candidature**
```bash
POST /api/candidatures
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "idCampagne": 1,
  "lettreMotivation": "Je suis très motivé pour intégrer votre établissement..."
}
```

**Réponse**:
```json
{
  "success": true,
  "message": "Candidature soumise avec succès",
  "data": {
    "idCandidature": 150,
    "numeroCandidature": "CAND-2026-150",
    "statut": "SOUMISE",
    "dateCreation": "2026-02-19T10:30:00"
  }
}
```

---

#### **Étape 6 : Suivre le statut de la candidature**
```bash
GET /api/candidatures/numero/CAND-2026-150
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

### 🔄 C. Workflow d'Extraction IA et Validation

#### **Étape 1 : Upload des documents (déjà fait)**

---

#### **Étape 2 : Lancer l'extraction**
```bash
POST /api/dossiers/42/lancer-extraction
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

#### **Étape 3 : Vérifier le statut (polling)**
```bash
GET /api/dossiers/42/statut-extraction
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Réponse (en cours)**:
```json
{
  "success": true,
  "data": {
    "statutExtraction": "EN_TRAITEMENT"
  }
}
```

**Réponse (terminé)**:
```json
{
  "success": true,
  "data": {
    "statutExtraction": "TERMINE",
    "donneesExtraites": {
      "moyenneGenerale": 14.5,
      "mention": "BIEN",
      "notes": {
        "mathematiques": 15,
        "physique": 14,
        "francais": 13
      }
    }
  }
}
```

---

#### **Étape 4 : Signaler une erreur (si nécessaire)**
```bash
POST /api/dossiers/42/signaler-erreur
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "description": "La moyenne de mathématiques est incorrecte",
  "champsConcernes": ["mathematiques"]
}
```

**Réponse**:
```json
{
  "success": true,
  "message": "Erreur signalée avec succès. L'établissement sera notifié.",
  "data": {
    "statutExtraction": "EN_LITIGE"
  }
}
```

---

### 🔄 D. Workflow de Gestion de Campagne (Établissement)

#### **Étape 1 : Créer un parcours**
```bash
POST /api/parcours/etablissements/10
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "nomParcours": "Licence Informatique",
  "description": "Formation en développement...",
  "niveauEtude": "Licence",
  "dureeAnnees": 3,
  "idDomaine": 1,
  "criteresMoyenneBac": 12.0,
  "seriesAcceptees": ["C", "D"],
  "scolariteMin": 500000.0,
  "scolariteMax": 1500000.0
}
```

---

#### **Étape 2 : Créer une campagne**
```bash
POST /api/campagnes/etablissements/10
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: application/json

{
  "idParcours": 5,
  "titre": "Admission Licence 1 - 2026",
  "description": "Campagne pour la rentrée 2026",
  "dateDebut": "2026-03-01T00:00:00",
  "dateFin": "2026-06-30T23:59:59",
  "nombrePlacesDisponibles": 50
}
```

---

#### **Étape 3 : Consulter les candidatures**
```bash
GET /api/candidatures/campagne/1?page=0&size=20&sort=dateCreation,desc
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

#### **Étape 4 : Exporter en Excel**
```bash
GET /api/excel/campagne/1/candidatures
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Réponse**: Fichier Excel téléchargé

---

#### **Étape 5 : Modifier les statuts dans Excel et synchroniser**

Après modification manuelle du fichier Excel :

```bash
POST /api/excel/synchroniser-resultats
Authorization: Bearer eyJhbGciOiJIUzI1...
Content-Type: multipart/form-data

file=@candidatures_mises_a_jour.xlsx
```

**Réponse**:
```json
{
  "success": true,
  "message": "25 candidature(s) mise(s) à jour",
  "data": 25
}
```

---

## 10. NOTES DE SÉCURITÉ

### 🔒 Extraction de l'Email depuis le JWT

**Principe**: L'email de l'utilisateur est **toujours extrait du token JWT**, jamais du corps de la requête.

**Raison**: Empêcher un utilisateur de modifier les données d'un autre utilisateur.

**Exemple (Backend Java)**:
```java
@PostMapping("/candidatures")
@PreAuthorize("hasRole('BACHELIER')")
public ResponseEntity<ApiResponse<CandidatureResponse>> soumettreCandidature(
        @Valid @RequestBody SoumettreCandiatureRequest request,
        Authentication authentication) {
    
    // ✅ SÉCURISÉ : Email extrait du JWT
    String email = authentication.getName();
    
    // ❌ JAMAIS : Email du corps de la requête
    // String email = request.getEmail(); // VULNÉRABLE !
    
    return candidatureService.soumettreCandidature(email, request);
}
```

---

### 🔐 Vérification de Propriété

Avant toute modification, le backend vérifie que l'utilisateur a le droit d'accéder à la ressource.

**Exemple**:
```java
public void verifyOwnership(Long bachelerId, String email) {
    Bachelier bachelier = bachelierRepository.findById(bachelerId)
        .orElseThrow(() -> new ResourceNotFoundException("Bachelier non trouvé"));
    
    if (!bachelier.getEmail().equals(email)) {
        throw new AccessDeniedException("Vous n'êtes pas autorisé à modifier ce profil");
    }
}
```

---

### 🎫 Tokens d'Accès Documents (Single-Use)

Les documents sensibles (bulletins, relevés) utilisent des **tokens JWT single-use** avec :

- **Validité**: 48 heures
- **Usage unique**: Le token est invalidé après téléchargement
- **Champs JWT**:
  ```json
  {
    "dossierId": 42,
    "documentType": "bulletin_terminale",
    "etablissementId": 10,
    "exp": 1708518600
  }
  ```

**Workflow**:
1. L'établissement demande un token : `POST /api/secure-documents/generate-token`
2. Backend génère un JWT avec les infos du document
3. Établissement utilise le token : `GET /api/secure-documents/download?token={jwt}`
4. Backend valide le token, stream le fichier, **invalide le token**

**Avantages**:
- Pas de lien permanent vers les documents
- Contrôle d'accès granulaire
- Traçabilité des accès

---

### 🌐 Configuration CORS

Le backend accepte les requêtes cross-origin de n'importe quelle origine en développement.

**En production**, restreindre aux domaines autorisés :

```java
@CrossOrigin(origins = "https://scholarway.pepit.cloud")
```

---

### 🔑 Mot de Passe

**Contraintes de validation**:
- Minimum **8 caractères**
- Au moins **1 majuscule**
- Au moins **1 minuscule**
- Au moins **1 chiffre**
- Au moins **1 caractère spécial** (@$!%*?&)

**Hachage**: BCrypt avec force 12

**Exemple de validation (Regex)**:
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

---

### 🛡️ Protection contre les Attaques

#### **Injection SQL**
✅ Utilisation de **JPA/Hibernate** avec requêtes paramétrées

#### **XSS (Cross-Site Scripting)**
✅ Validation et échappement des entrées utilisateur

#### **CSRF (Cross-Site Request Forgery)**
✅ Tokens JWT stateless (pas de cookies de session)

#### **Brute Force**
⚠️ **À implémenter**: Rate limiting sur `/api/auth/login`

---

### 📝 Bonnes Pratiques

1. **TOUJOURS** utiliser HTTPS en production
2. **Ne JAMAIS** logger les tokens ou mots de passe
3. **Valider** toutes les entrées utilisateur
4. **Limiter** les tentatives de connexion
5. **Expirer** les tokens après 24h
6. **Exiger** des mots de passe forts
7. **Auditer** les accès aux documents sensibles

---

## 11. FONCTIONNALITÉS IA

### 🤖 Service d'Extraction IA

**URL du service**: `https://hordricjr-scholarway.hf.space` (Hugging Face Space)

**Fonction**: Extraction automatique des données académiques depuis les bulletins PDF.

---

### ⚙️ Configuration

**Fichier**: `application.properties`

```properties
# URL du service IA
ai.service.base-url=https://hordricjr-scholarway.hf.space

# Timeouts (en secondes)
ai.service.timeout.connection=30
ai.service.timeout.read=120

# Warm-up préventif
ai.service.warmup.enabled=true
ai.service.warmup.interval=600000  # 10 minutes
```

---

### 🔄 Warm-up Mechanism

**Problème**: Les Hugging Face Spaces peuvent avoir des "cold starts" (15-60s).

**Solution**: Le backend effectue des appels de warm-up périodiques pour maintenir le service actif.

**Configuration**:
- `ai.service.warmup.enabled=true` : Active le warm-up
- `ai.service.warmup.interval=600000` : Intervalle en ms (10 min)

**Fonctionnement**:
```java
@Scheduled(fixedDelayString = "${ai.service.warmup.interval}")
public void warmupAIService() {
    try {
        aiExtractionService.ping();
        log.info("✅ AI Service warm-up success");
    } catch (Exception e) {
        log.warn("⚠️ AI Service warm-up failed: {}", e.getMessage());
    }
}
```

---

### 🔗 Circuit Breaker Pattern

**Problème**: Si le service IA est indisponible, ne pas bloquer l'application.

**Solution**: Utilisation de **Resilience4j Circuit Breaker**.

**Configuration**:
```properties
# Circuit Breaker
resilience4j.circuitbreaker.instances.aiService.failure-rate-threshold=50
resilience4j.circuitbreaker.instances.aiService.wait-duration-in-open-state=30s
resilience4j.circuitbreaker.instances.aiService.sliding-window-size=10
resilience4j.circuitbreaker.instances.aiService.minimum-number-of-calls=5

# Retry
resilience4j.retry.instances.aiService.max-attempts=3
resilience4j.retry.instances.aiService.wait-duration=2s
resilience4j.retry.instances.aiService.exponential-backoff-multiplier=2
```

**États du Circuit Breaker**:
- **CLOSED** (normal): Les appels passent normalement
- **OPEN** (erreur): Les appels échouent immédiatement (fallback)
- **HALF_OPEN** (test): Teste si le service est revenu

---

### 📊 Suivi du Statut d'Extraction

**Workflow**:
```
EN_ATTENTE → EN_TRAITEMENT → TERMINE
                          ↘ ERREUR_IA
```

**Polling recommandé**:
```javascript
async function attendreExtraction(dossierId) {
  const maxAttempts = 30; // 30 tentatives
  const interval = 2000;   // 2 secondes
  
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `/api/dossiers/${dossierId}/statut-extraction`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const data = await response.json();
    const statut = data.data.statutExtraction;
    
    if (statut === 'TERMINE') {
      console.log('✅ Extraction terminée !');
      return data.data.donneesExtraites;
    }
    
    if (statut === 'ERREUR_IA') {
      throw new Error('❌ Erreur lors de l\'extraction IA');
    }
    
    // Attendre avant la prochaine tentative
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('⏱️ Timeout: Extraction trop longue');
}
```

---

### 🚨 Gestion des Erreurs IA

#### **ERREUR_IA**
**Causes**:
- Service IA indisponible
- Timeout
- Erreur de parsing PDF

**Solution**:
1. Vérifier le statut du service : `https://hordricjr-scholarway.hf.space`
2. Relancer l'extraction : `POST /api/dossiers/{id}/lancer-extraction`
3. Si échec récurrent : Traitement manuel via Excel

---

#### **EN_LITIGE**
**Cause**: Bachelier a signalé une erreur d'extraction

**Workflow**:
1. Bachelier : `POST /api/dossiers/{id}/signaler-erreur`
2. Statut passe à `EN_LITIGE`
3. Établissement est notifié
4. Établissement corrige manuellement via Excel
5. Import Excel : `POST /api/excel/synchroniser-resultats`
6. Statut passe à `VALIDE_PAR_ECOLE`

---

### 📈 Métriques et Monitoring

**Endpoints de monitoring** (à implémenter):
- `GET /actuator/health/ai-service` : Santé du service IA
- `GET /actuator/metrics/ai.extraction.duration` : Durée moyenne
- `GET /actuator/metrics/ai.extraction.success.rate` : Taux de succès

---

### 🎯 Bonnes Pratiques

1. **Toujours vérifier le statut** avant de lancer une nouvelle extraction
2. **Implémenter un timeout côté frontend** (max 60s)
3. **Prévoir un fallback** en cas d'échec (saisie manuelle)
4. **Logger les erreurs** pour analyse
5. **Éviter les appels simultanés** pour le même dossier
6. **Afficher une barre de progression** à l'utilisateur

---

## 📚 Ressources Complémentaires

### 📖 Documentation Swagger

**URL**: `https://scholarway.pepit.cloud/swagger-ui.html`

Interface interactive pour tester les endpoints directement depuis le navigateur.

---

### 🔧 Configuration Requise

**Navigateurs supportés**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Versions API clients recommandées**:
- **JavaScript**: Axios 1.x, Fetch API
- **Java**: RestTemplate, WebClient
- **Python**: Requests 2.x

---

### 📞 Support

**Contact**: Pour toute question technique, contacter l'équipe de développement ScholarWay.

---

## 🎉 Conclusion

Ce guide couvre l'ensemble de l'API ScholarWay. Pour des cas d'usage spécifiques non documentés, n'hésitez pas à consulter la documentation Swagger ou à contacter l'équipe technique.

**Bonne intégration ! 🚀**
