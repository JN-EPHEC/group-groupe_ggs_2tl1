# Configuration des Variables d'Environnement

## Structure

Le projet utilise une seule source de configuration à la racine : `.env` (locale) et `.env.production` (pour prod).

### Fichiers

- **`.env`** : Configuration locale pour développement (à ne jamais commiter)
- **`.env.example`** : Template pour le développement
- **`.env.production`** : Template pour la production
- **`.github/workflows/build.yml`** : CI/CD avec injection de `VITE_API_URL`

## Variables Requises

### Development

```bash
NODE_ENV=development
DATABASE_URL=file:./prisma/dev.db
PORT=3000
CORS_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3000/api
JWT_SECRET=your_secret_key_here
```

### Production

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/dbname
PORT=3000
CORS_ORIGIN=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api
JWT_SECRET=use_a_real_secure_key_here
```

## CI/CD Frontend

La variable `VITE_API_URL` est injectée au build via `.github/workflows/build.yml` :

```yaml
env:
  VITE_API_URL: ${{ vars.VITE_API_URL || 'https://api.yourdomain.com/api' }}
```

### Configurer en GitHub Actions

1. Allez dans **Settings > Secrets and variables > Variables**
2. Créez `VITE_API_URL` avec votre URL d'API

## Scripts

### Développement

```bash
npm run dev              # Client + Server (watch mode)
npm --prefix server run start  # Server seulement
npm --prefix client run dev    # Client seulement
```

### Production

```bash
npm run build           # Compiler client + server
npm run start:prod      # Lancer server compilé
npm run start:prod:all  # Build + lancer
```

## Notes de Sécurité

- ✅ Swagger et CORS permissif uniquement si `NODE_ENV !== "production"`
- ✅ `.env` dans `.gitignore` - jamais commiter les secrets
- ✅ `.env.example` commité pour documentation

