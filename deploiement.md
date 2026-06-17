 DEPLOYMENT.md — O'Pokedex

> Procédure de déploiement de l'application O'Pokedex  
> Stack : Node.js 20 / Express · React / Vite · PostgreSQL 15 · Docker Compose

***

## Prérequis

| Outil | Version minimale | Vérification |
|-------|-----------------|--------------|
| Docker Desktop | 24.x | `docker --version` |
| Docker Compose | 2.x (intégré) | `docker compose version` |
| Git | 2.x | `git --version` |

***

## 1. Cloner le dépôt

```bash
git clone https://github.com/Julienmimouni1/Pokedex.git
cd Pokedex
```

***

## 2. Configurer les variables d'environnement

Créer le fichier `.env` à la racine du dossier `api/` à partir du modèle fourni :

```bash
cp api/.env.example api/.env
```

Ouvrir `api/.env` et renseigner les valeurs :

```env
# Base de données
POSTGRES_USER=admin_pokedex
POSTGRES_PASSWORD=votre_mot_de_passe_securise
POSTGRES_DB=pokedex_db
PG_URL=postgres://admin_pokedex:votre_mot_de_passe_securise@db:5432/pokedex_db

# Authentification
JWT_SECRET=votre_cle_secrete_jwt_longue_et_aleatoire

# Environnement
NODE_ENV=development
PORT=3000
```

> ⚠️ **Sécurité** : Le fichier `.env` est exclu du dépôt Git via `.gitignore`. Ne jamais le committer. Les valeurs ci-dessus sont des exemples — utiliser des secrets forts en production.

***

## 3. Construire et démarrer les services

```bash
docker compose up --build
```

Cette commande :
1. Construit l'image Docker de l'API à partir de `api/Dockerfile.api`
2. Construit l'image Docker du client à partir de `client/Dockerfile.client`
3. Télécharge l'image officielle `postgres:15-alpine`
4. Démarre les trois conteneurs dans le bon ordre : `db` → `api` → `client`

> 💡 **Premier démarrage** : la construction des images prend 2 à 5 minutes (compilation d'argon2 incluse). Les démarrages suivants sont quasi-instantanés grâce au cache Docker.

Pour démarrer en arrière-plan (mode détaché) :

```bash
docker compose up --build -d
```

***

## 4. Initialiser la base de données (premier démarrage uniquement)

Une fois les conteneurs actifs, exécuter les migrations Sequelize dans le conteneur `api` :

```bash
# Créer les tables
docker compose exec api npm run db:create

# Peupler avec les données de référence (types, Pokémons, etc.)
docker compose exec api npm run db:seed
```

> ⚠️ Ces commandes ne doivent être lancées qu'une seule fois. Les données sont persistées dans le volume Docker `db_data` entre les redémarrages.

***

## 5. Vérifier que les services sont actifs

| Service | URL | Description |
|---------|-----|-------------|
| API REST | http://localhost:3002 | Point d'entrée de l'API |
| Documentation Swagger | http://localhost:3002/api-docs | Documentation interactive des routes |
| Client React | http://localhost:5174 | Interface utilisateur |
| Base de données | localhost:5433 | Accès direct PostgreSQL (outil externe) |

Pour vérifier l'état des conteneurs :

```bash
docker compose ps
```

Pour consulter les logs en temps réel :

```bash
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f api
```

***

## 6. Lancer les tests (optionnel)

```bash
# Dans le conteneur api
docker compose exec api npm test

# Ou directement depuis le dossier api/ (avec Docker démarré pour la BDD)
cd api && npm test
```

Résultat attendu : 8 tests passés en vert (cf. plan de tests CP9).

***

## 7. Arrêter les services

```bash
# Arrêter les conteneurs (les données sont conservées)
docker compose down

# Arrêter et supprimer toutes les données (reset complet)
docker compose down -v
```

> ⚠️ `docker compose down -v` supprime le volume `db_data` — toutes les données PostgreSQL sont perdues. À n'utiliser qu'en cas de reset complet voulu.

***

## Architecture des services Docker

```
┌─────────────────────────────────────────────────┐
│                 docker-compose.yaml             │
│                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  client  │───▶│   api    │───▶│    db    │  │
│  │  :5174   │    │  :3002   │    │  :5433   │  │
│  │  React   │    │  Node.js │    │ Postgres │  │
│  │  /Vite   │    │  /Express│    │    15    │  │
│  └──────────┘    └──────────┘    └──────────┘  │
│                                       │         │
│                               ┌───────▼──────┐  │
│                               │  db_data     │  │
│                               │  (volume)    │  │
│                               └──────────────┘  │
└─────────────────────────────────────────────────┘
```

***

## Choix techniques justifiés

### Image `node:20-alpine`
L'image `alpine` est une distribution Linux minimaliste (~5 Mo contre ~300 Mo pour l'image standard). Elle réduit la taille de l'image finale et la surface d'attaque. La bibliothèque `argon2` (hachage des mots de passe) nécessite une compilation C++ absente par défaut — les paquets `build-base` et `python3` sont donc installés via `apk`.

### `npm i --omit=dev`
En production, les dépendances de développement (Jest, nodemon, etc.) sont inutiles. `--omit=dev` n'embarque que les dépendances strictement nécessaires à l'exécution, réduisant la taille et la surface d'attaque de l'image.

### Optimisation du cache Docker
Dans le `Dockerfile.api`, `package.json` est copié **avant** le reste du code source. Docker met en cache la couche `RUN npm i` et ne la réexécute que si les dépendances changent — accélérant significativement les builds lors des modifications de code.

### Volume nommé `db_data`
Sans volume, les données PostgreSQL sont stockées dans le conteneur et effacées à chaque `docker compose down`. Le volume nommé persiste les données sur le système de fichiers de l'hôte, indépendamment du cycle de vie des conteneurs.

***

## Dépannage

| Symptôme | Cause probable | Solution |
|----------|---------------|----------|
| `ECONNREFUSED` au démarrage de l'API | PostgreSQL pas encore prêt | Attendre 5-10s, l'API retry automatiquement |
| Port déjà utilisé | Conflit avec un service local | Modifier les ports hôtes dans `docker-compose.yaml` |
| Erreur `JWT_SECRET not defined` | Fichier `.env` manquant ou incomplet | Vérifier `api/.env` |
| Données manquantes après redémarrage | Seeds non exécutés | Relancer `docker compose exec api npm run db:seed` |
| Image non mise à jour | Cache Docker | Forcer le rebuild : `docker compose up --build --force-recreate` |