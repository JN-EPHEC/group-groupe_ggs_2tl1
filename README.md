# GGS

GGS est une application web e-commerce avec un frontend React et une API Express. Le projet permet de consulter un catalogue de produits, gerer un panier, se connecter, passer une commande et acceder a une interface admin.

## Stack

- Frontend : React, TypeScript, Vite
- Backend : Node.js, Express, TypeScript
- ORM : Prisma
- Base de donnees : PostgreSQL
- Paiement : Stripe
- Tests : Jest, Vitest

## Prerequis

Avant de lancer le projet, il faut avoir :

- Node.js installe
- npm installe
- une base de donnees PostgreSQL disponible
- un fichier `.env` configure a la racine du projet

## Installation

Depuis la racine du projet :

```bash
npm run setup
```

Cette commande installe les dependances du client et du serveur, puis genere le client Prisma.

## Configuration

Creer un fichier `.env` a la racine du projet.

Exemple :

```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
CORS_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3000
JWT_SECRET=secret_dev
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_xxx
```

Les valeurs sensibles comme `DATABASE_URL`, `JWT_SECRET` et `STRIPE_SECRET_KEY` ne doivent pas etre envoyees sur GitHub.

## Lancement en developpement

Pour lancer le frontend et le backend en meme temps :

```bash
npm run dev
```

Par defaut :

- frontend : `http://localhost:5173`
- backend : `http://localhost:3000`

## Lancer les services separement

Backend seulement :

```bash
npm run dev:server
```

Frontend seulement :

```bash
npm run dev:client
```

## Prisma

Generer le client Prisma :

```bash
npm run prisma:generate:dev
```

Appliquer les migrations en developpement :

```bash
npm run prisma:migrate:dev
```

Verifier l'etat des migrations :

```bash
npm run prisma:status:dev
```

## Tests

Lancer les tests :

```bash
npm test
```

Lancer les tests du backend avec la couverture :

```bash
npm --prefix server run test:coverage
```

Ouvrir le rapport HTML de couverture :

```bash
open server/coverage/lcov-report/index.html
```

## Build

Compiler le backend et le frontend :

```bash
npm run build
```

Lancer le serveur compile :

```bash
npm run start:prod
```

## Structure du depot

```txt
.
├── client/              # Application React
├── server/              # API Express
├── prisma/              # Schema, migrations et seed
├── REPORT.md            # Rapport du projet
├── CONFIG_ENV.md        # Details sur les variables d'environnement
└── README.md
```

## Organisation backend

Le backend est organise en couches :

```txt
routes -> controllers -> services -> prisma
```

- `routes/` : declaration des endpoints
- `controllers/` : gestion des requetes et des reponses HTTP
- `services/` : logique metier
- `middlewares/` : authentification, validation, gestion des erreurs
- `config/` : configuration Prisma, Swagger, etc.

## Notes

- Les cookies d'authentification sont envoyes en HTTP only.
- L'interface admin necessite un utilisateur avec le role admin.
- Stripe necessite une cle de test valide dans `STRIPE_SECRET_KEY`.
- La documentation Swagger est disponible en developpement sur `/api-docs`.
