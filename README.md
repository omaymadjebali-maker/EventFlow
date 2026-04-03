# EventFlow

Application full-stack de gestion d'evenements avec :
- frontend `Vue 3 + Pinia + Vue Router + Vite`
- backend `Node.js + Express + MongoDB + Mongoose`
- authentification `JWT`

Le projet permet de :
- creer un compte utilisateur public en `PARTICIPANT`
- se connecter avec JWT
- consulter les evenements
- creer, modifier et supprimer un evenement en tant que `ORGANIZER` ou `ADMIN`
- s'inscrire a un evenement
- consulter ses evenements et ses inscriptions
- afficher les participants d'un evenement pour son proprietaire organizer ou un admin

## Structure

```text
EventFlow/
├── client/   # Frontend Vue 3
└── server/   # API Express + MongoDB
```

## Prerequis

- `Node.js` 18+ recommande
- `npm`
- `MongoDB` accessible localement ou a distance

## Installation

### 1. Installer les dependances

Dans un premier terminal :

```bash
cd server
npm install
```

Dans un second terminal :

```bash
cd client
npm install
```

## Configuration

### Backend

Copier le fichier d'exemple :

```bash
cd server
cp .env.example .env
```

Variables disponibles dans `server/.env.example` :

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/eventflow?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Configuration recommandee en local :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventflow
JWT_SECRET=change_me_with_a_strong_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend

Copier le fichier d'exemple :

```bash
cd client
cp .env.example .env
```

Variable disponible dans `client/.env.example` :

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Lancement en developpement

### Demarrer l'API

```bash
cd server
npm run dev
```

Le serveur demarre par defaut sur :

```text
http://localhost:5000
```

Point de sante :

```text
GET /health
```

### Demarrer le frontend

```bash
cd client
npm run dev
```

Le frontend Vite demarre en general sur :

```text
http://localhost:5173
```

## Build production

### Frontend

```bash
cd client
npm run build
```

Preview local :

```bash
npm run preview
```

### Backend

```bash
cd server
npm start
```

## Scripts disponibles

### Client

```bash
npm run dev
npm run build
npm run preview
```

### Server

```bash
npm run dev
npm start
```

## Fonctionnalites implementees

### Authentification

- `POST /api/auth/register`
  - inscription publique
  - cree toujours un compte `PARTICIPANT`
- `POST /api/auth/login`
  - retourne un JWT et l'utilisateur connecte
- `GET /api/users/me`
  - retourne le profil de l'utilisateur authentifie

### Evenements

- `GET /api/events`
  - liste publique des evenements
- `POST /api/events`
  - creation d'evenement pour `ADMIN` ou `ORGANIZER`
- `PUT /api/events/:id`
  - modification par `ADMIN` ou organizer proprietaire
- `DELETE /api/events/:id`
  - suppression par `ADMIN` ou organizer proprietaire
- `POST /api/events/:id/register`
  - inscription a un evenement
- `GET /api/events/mine`
  - evenements crees par l'utilisateur connecte
- `GET /api/events/registered`
  - evenements auxquels l'utilisateur est inscrit
- `GET /api/events/:id/participants`
  - liste des participants
  - accessible a `ADMIN` ou a l'organizer proprietaire

## Roles

Le backend gere 3 roles :

- `PARTICIPANT`
- `ORGANIZER`
- `ADMIN`

Important :
- l'inscription publique via `/api/auth/register` ne cree pas de compte organizer ni admin
- pour avoir un `ORGANIZER` ou un `ADMIN`, il faut le definir en base ou via un script interne si vous en ajoutez un plus tard

## Pages frontend

Pages presentes dans `client/src/pages` :

- `Dashboard.vue`
- `Login.vue`
- `Register.vue`
- `CreateEvent.vue`
- `EditEvent.vue`
- `MyEvents.vue`
- `Profile.vue`

Routes frontend principales :

- `/`
- `/login`
- `/register`
- `/create`
- `/events/:id/edit`
- `/my-events`
- `/profile`

## Comportement principal

### Participant

- peut consulter les evenements
- peut s'inscrire a un evenement
- peut voir son profil
- peut voir ses inscriptions dans `/my-events`

### Organizer

- peut creer ses evenements
- peut modifier et supprimer ses propres evenements
- peut voir les participants de ses propres evenements
- peut voir ses evenements et ses inscriptions

### Admin

- peut creer, modifier et supprimer tous les evenements
- peut voir les participants des evenements

## Arborescence utile

### Frontend

```text
client/src/
├── api/http.js
├── components/NavBar.vue
├── pages/
├── router/index.js
└── stores/
    ├── auth.js
    └── events.js
```

### Backend

```text
server/src/
├── app.js
├── server.js
├── config/
├── middlewares/
├── models/
└── routes/
```

## Flux technique

### Frontend

- le frontend appelle l'API via `client/src/api/http.js`
- le token JWT est stocke dans le store auth
- les routes protegees sont gerees dans `client/src/router/index.js`
- les appels evenements sont centralises dans `client/src/stores/events.js`

### Backend

- l'application Express est creee dans `server/src/app.js`
- le bootstrap serveur est dans `server/src/server.js`
- le middleware `requireAuth` lit le token JWT
- le middleware RBAC controle les roles sur les routes sensibles

## Exemples d'utilisation API

### Healthcheck

```bash
curl http://localhost:5000/health
```

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

### Liste des evenements

```bash
curl http://localhost:5000/api/events
```

## Comptes organizer et admin

L'interface d'inscription ne cree que des participants.

Si vous avez besoin d'un compte `ADMIN` ou `ORGANIZER`, mettez a jour le role en base MongoDB.

Exemple avec `mongosh` :

```js
use eventflow

db.users.updateOne(
  { email: "admin@eventflow.com" },
  { $set: { role: "ADMIN" } }
)
```

Ou pour un organizer :

```js
use eventflow

db.users.updateOne(
  { email: "organizer@eventflow.com" },
  { $set: { role: "ORGANIZER" } }
)
```

## Verification rapide

### Frontend

```bash
cd client
npm run build
```

### Backend

Verifier au minimum :
- que MongoDB est accessible
- que `JWT_SECRET` est defini
- que `CORS_ORIGIN` correspond bien a l'URL du frontend

## Limites actuelles

- pas de tests automatiques configures dans les `package.json`
- pas de script de seed admin/organizer fourni
- pas de modification de profil

## Depannage

### Le frontend ne parle pas au backend

Verifier :
- `client/.env`
- `server/.env`
- que le backend tourne sur le bon port
- que `VITE_API_URL` pointe bien vers `/api`
- que `CORS_ORIGIN` autorise l'URL du frontend

### Erreur JWT

Verifier :
- que vous etes bien connecte
- que le token est encore valide
- que `JWT_SECRET` n'a pas change entre deux lancements

### Erreur MongoDB

Verifier :
- que MongoDB est demarre
- que `MONGO_URI` est correcte
- que la base cible est accessible

## Etat actuel

Le frontend compile actuellement avec :

```bash
cd client
npm run build
```
