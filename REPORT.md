# Rapport de Projet — Groupe GGS 2TL1

---

## 1. Pitch de l'application

> **[GGS]** est une plateforme e-commerce de vente de vetements permettant aux utilisateurs de parcourir un catalogue de produits, de les ajouter à un panier et de passer des commandes en ligne.

L'application propose :
- Un catalogue de produits filtrable par catégorie
- Un système de panier persistant
- Une gestion des commandes
- Un back-office pour l'administration des produits
- Une inscription pour l'utilisateur
- Un login sécurisé
- Un moyen de paiement sécurisé

Stack technique :
- **Frontend** : React + TypeScript (Vite)
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : MySQL via Prisma ORM
- **Déploiement** : Docker, Nginx, GitHub Actions

---

## 2. Refactoring initial

### Quel code a été choisi ?

> *Code de base : Projet de Gregory*

Nous avons retenu le code de **Gregory Ly**, car il avait une structure claire, refactorée et avec le moins de code smells.Il y avauit une séparation des couches métiers (Controllers/Services/Routes) dés le départ.


### Difficultés d'adaptation des autres membres

> *(À compléter par les deux autres membres)*

**Membre 2 — [Troch Stéfan]** :
- Gregory Travaille sur mac, j'ai donc eu pas mal de soucis avec certaines dépendances spéficiques pour mac.
- L'utilisation de fichier .env a été généralisée dans le projet, mais nous avons parfois eu un manque de communication sur ce qu'elle contenait.

**Membre 3 — [Prénom NOM]** :
- ...

---

## 3. Infrastructure de déploiement

```
┌─────────────────────────────────────────────────────┐
│                    GitHub Repository                │
│                                                     │
│  push / PR  →  GitHub Actions CI/CD Pipeline        │
│                        │                            │
│              ┌─────────▼──────────┐                 │
│              │   Build & Tests    │                 │
│              │  (npm test, lint)  │                 │
│              └─────────┬──────────┘                 │
│                        │ (si succès)                │
│              ┌─────────▼──────────┐                 │
│              │   Docker Build     │                 │
│              │ image client       │                 │
│              │ image server       │                 │
│              └─────────┬──────────┘                 │
└────────────────────────┼────────────────────────────┘
                         │ deploy
                         ▼
┌───────────────────────────────────────────────────────┐
│                    Serveur VPS                        │
│                                                       │
│   ┌─────────────────────────────────────────────────┐ │
│   │              Docker Compose                     │ │
│   │                                                 │ │
│   │  ┌──────────┐   ┌──────────┐   ┌─────────┐      │ │
│   │  │  Nginx   │   │ Client   │   │ Server  │      │ │
│   │  │ :80/:443 │── │ React    │   │ Node.js │      │ │
│   │  │ (reverse │   │ :5173    │   │ :3000   │      │ │
│   │  │  proxy)  │── │          │   │         │      │ │
│   │  └──────────┘   └──────────┘   └────┬────┘      │ │
│   │                                     │           │ │
│   │                          ┌──────────▼─────────┐ │ │
│   │                          │   Redis (cache)    │ │ │
│   │                          │   [optionnel]      │ │ │
│   │                          └──────────┬─────────┘ │ │
│   └─────────────────────────────────────┼───────────┘ │
└─────────────────────────────────────────┼─────────────┘
                                          │ (si cache miss)
                                          ▼
                         ┌─────────────────────────────┐
                         │         Supabase            │
                         │   (PostgreSQL managé +      │
                         │    Auth + Storage)          │
                         │   accessible via Internet   │
                         └─────────────────────────────┘
```

**Rôle de chaque composant :**

- **GitHub Actions** : pipeline CI/CD qui lance les tests, build les images Docker et déploie sur le serveur à chaque push sur `main`
- **Docker / Docker Compose** : conteneurisation de chaque service (client, server) pour garantir un environnement reproductible. Il y a une petite gestion de micro service (juste pour le chemin des paiements)
- **Nginx** : reverse proxy qui redirige les requêtes HTTP/HTTPS vers le bon conteneur (frontend ou API) + limit_req qui limite les attaques DDOS
- **Supabase** : base de données PostgreSQL hébergée externement (hors VPS), remplace le MySQL local. Le serveur Node.js s'y connecte via Prisma avec l'URL de connexion Supabase
- **Redis (optionnel)** : couche de cache en mémoire pour éviter des requêtes répétées vers Supabase. Si une donnée est en cache, le serveur la retourne directement sans interroger la DB

---

## 4. Design Patterns utilisés

### Repository / Service Pattern

**Où** : `server/src/services/productCatalogServices.ts`, et l'ensemble du dossier `services/`

**Pourquoi** : séparer la logique métier (services) de la couche d'accès aux données (Prisma) et des routes HTTP (controllers). Cela facilite les tests unitaires et l'évolution du code.

```
Route → Controller → Service → Prisma (DB)
```

### MVC (Model-View-Controller)

**Où** : structure globale du backend (`routes/`, `controllers/`, `services/`)

**Pourquoi** : organiser le code de façon lisible et maintenable, chaque couche ayant une responsabilité unique.

### Singleton

**Où** : instance Prisma Client (`prisma/client.ts`)

**Pourquoi** : éviter de créer plusieurs connexions à la base de données, Prisma Client est instancié une seule fois et réutilisé dans toute l'application.

> *(À compléter selon les patterns réellement présents dans votre code)*

---

## 5. Couverture de tests (Coverage)

> *(Insérer ici une capture d'écran du rapport de couverture)*

![Coverage Report](./coverage-screenshot.png)

> *(À compléter avec un commentaire sur les résultats : taux de couverture global, fichiers bien/mal couverts, etc.)*