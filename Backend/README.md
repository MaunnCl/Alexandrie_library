# Documentation Backend du projet Great Alexandria Library - Juillet 2025

réalisé par Mathis CHAMPIN

## Lancer le projet

```ssh
npm run build      → Build the project  
npm start         → Start production build  
npm run migrate    → Run DB migrations  
npm test         → Run tests (if implemented)
docker-compose.yaml
```

# 🗂️ Structure et Description du Backend

Le dossier `Backend` contient tout le code source et la configuration de l'API Alexandra Library. Voici un aperçu détaillé de sa structure et du rôle de chaque partie :

```
Backend/
├── app.ts / app.js                # Main Express app configuration
├── server.ts / server.js          # Server entry point
├── Dockerfile                     # Docker container definition
├── drizzle.config.ts / .js        # Drizzle ORM configuration
├── jest.config.ts / .js           # Jest test configuration
├── package.json                   # NPM dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── README.md                      # Backend documentation
│
├── config/
│   ├── database.ts / .js          # PostgreSQL connection via Drizzle
│   ├── multerConfig.ts / .js      # File upload configuration (Multer)
│   └── migration/                 # SQL migration scripts
│
├── docs/
│   └── swagger.ts / .js           # Swagger API documentation config
│
├── middlewares/
│   └── auth.middleware.ts / .js   # JWT authentication middleware
│
├── src/
│   ├── controllers/               # HTTP request logic for each resource
│   │   ├── user.controller.ts     # User endpoints
│   │   ├── ...                    # Other resources (congress, content, etc.)
│   ├── repository/                # Data access (Drizzle ORM)
│   │   ├── user.repository.ts     # User data access
│   │   ├── ...                    # Other entities
│   ├── routes/                    # Express route definitions
│   │   ├── user.route.ts          # User routes
│   │   ├── ...                    # Other routes
│   ├── schemas/                   # Drizzle ORM table schemas
│   │   ├── user.ts                # Users table
│   │   ├── ...                    # Other table
│   ├── services/                  # Business logic (auth, user, etc.)
│   │   ├── user.service.ts
│   │   ├── ...                    # Other service
│   ├── tests/                     # Unit and integration tests
│   ├── utils/                     # Utility functions (e.g., aws.utils.ts)
│
└── .env                           # Environment variables (not versioned)
```

### Main Folders & Files

- **app.ts / app.js**: Sets up the Express app, middleware, routes, and error handling.
- **server.ts / server.js**: Starts the HTTP server on the configured port.
- **config/**: Database connection, file upload config, and migration scripts.
- **docs/**: Swagger configuration for interactive API documentation.
- **middlewares/**: JWT authentication middleware for protected routes.
- **src/controllers/**: Handles HTTP requests for each resource (users, auth, congress, etc.).
- **src/repository/**: Data access logic for each entity using Drizzle ORM.
- **src/routes/**: Defines Express routes and applies security middleware.
- **src/schemas/**: Drizzle ORM schemas for PostgreSQL tables.
- **src/services/**: Business logic (e.g., JWT generation, password checks).
- **src/tests/**: Unit and integration tests (Jest).
- **src/utils/**: Utility functions (e.g., AWS S3 helpers, scripts).
- **.env**: Environment variables (not committed to version control).

---

## 📖 Detailed Backend Architecture



### 1. Schémas (`src/schemas/`)

Définit la structure des tables de la base de données avec Drizzle ORM. Chaque fichier correspond à une table :

- **user.ts** : Utilisateurs (id, prénom, nom, email, mot de passe, etc.)
- **profile.ts** : Profils utilisateurs (id, user_id, photo de profil, bio, préférences)
- **role.ts** : Rôles (id, nom du rôle, description)
- **userRole.ts** : Association utilisateur-rôle (id, user_id, role_id)
- **orators.ts** : Orateurs (id, nom, photo, content_ids, pays, ville)
- **session.ts** : Sessions (id, nom, content_ids)
- **content.ts** : Contenus (id, titre, orator_id, description, url, timeStamp)
- **congress.ts** : Congrès (id, nom, clé, session_ids, photo, date, ville)
- **history.ts** : Historique utilisateur (id, userId, contentId, viewedAt, timeStamp, uniqueView)

Ces schémas sont utilisés par l'ORM pour générer les requêtes SQL et garantir la sécurité des types.

---


### 2. Contrôleurs (`src/controllers/`)

Les contrôleurs gèrent les requêtes et réponses HTTP. Chaque contrôleur gère une ressource spécifique et expose des endpoints CRUD et métiers. Exemples :

- **UsersController** : Créer, récupérer, mettre à jour, supprimer des utilisateurs. Gère le hash du mot de passe et délègue à UsersService.
- **SessionController** : Gère les sessions (création, récupération, modification, suppression, ajout/retrait de contenu).
- **HistoryController** : Ajoute à l'historique utilisateur, récupère l'historique, supprime des éléments.
- **OratorsController** : Gère les orateurs (CRUD, gestion des contenus, mise à jour de la photo).
- **UsersRolesController** : Gère l'association des rôles aux utilisateurs.
- **ContentController** : Gère les contenus (CRUD).
- **RoleController** : Gère les rôles (CRUD).
- **UsersProfilesController** : Gère les profils utilisateurs (CRUD).
- **CongressController** : Gère les congrès (CRUD).

Les contrôleurs valident les entrées, appellent le service approprié et renvoient des réponses JSON ou des erreurs.

---


### 3. Services (`src/services/`)

Les services contiennent la logique métier et orchestrent les opérations complexes. Ils sont appelés par les contrôleurs et utilisent les repositories pour accéder aux données. Exemples :

- **UsersService** : Logique métier liée aux utilisateurs (création, récupération, mise à jour, suppression, hash du mot de passe, etc.)
- **SessionService** : Logique métier des sessions (création, modification, gestion des contenus)
- **HistoryService** : Logique de gestion de l'historique utilisateur
- **OratorsService** : Logique de gestion des orateurs et de leurs contenus
- **UsersRolesService** : Logique d'association/suppression de rôles aux utilisateurs
- **ContentService** : Logique CRUD des contenus et associations
- **RoleService** : Logique CRUD des rôles
- **UsersProfilesService** : Logique CRUD des profils utilisateurs
- **CongressService** : Logique CRUD des congrès et association de sessions

Les services permettent de garder les contrôleurs simples et centrés sur la logique HTTP.

---


### 4. Repositories (`src/repository/`)

Les repositories abstraient la couche d'accès aux données et interagissent directement avec la base via Drizzle ORM. Exemples :

- **UsersRepository** : Opérations CRUD sur les utilisateurs
- **SessionRepository** : CRUD sur les sessions et association de contenus
- **HistoryRepository** : CRUD sur l'historique utilisateur
- **OratorsRepository** : CRUD sur les orateurs et leurs contenus
- **UsersRolesRepository** : CRUD sur l'association utilisateur-rôle
- **ContentRepository** : CRUD sur les contenus
- **RoleRepository** : CRUD sur les rôles
- **UsersProfilesRepository** : CRUD sur les profils utilisateurs
- **CongressRepository** : CRUD sur les congrès et association de sessions

Les repositories permettent de changer la source de données avec un minimum de modifications dans les services/contrôleurs.

---


### 5. Routes (`src/routes/`)

Les routes définissent les endpoints de l'API et les associent aux fonctions des contrôleurs. Elles appliquent aussi les middlewares d'authentification et de validation. Exemples :

- **users.route.ts** : `/api/users` (POST, GET, GET by id, PUT, DELETE)
- **session.route.ts** : `/api/sessions` (POST, GET, GET by id, PUT, DELETE, ajout/retrait de contenu)
- **history.route.ts** : `/api/history` (POST, GET par utilisateur, DELETE)
- **orators.route.ts** : `/api/orators` (POST, GET, GET by id, PUT, DELETE, ajout/retrait de contenu, mise à jour photo)
- **usersRoles.route.ts** : `/api/users-roles` (POST, GET, GET by id, PUT, DELETE)
- **content.route.ts** : `/api/content` (POST, GET, GET by id, PUT, DELETE)
- **role.route.ts** : `/api/roles` (POST, GET, GET by id, PUT, DELETE)
- **usersProfiles.route.ts** : `/api/users-profiles` (POST, GET, GET by id, PUT, DELETE)
- **congress.route.ts** : `/api/congress` (POST, GET, GET by id, PUT, DELETE)

Les routes sont regroupées par ressource et suivent les conventions RESTful.

---

## 📝 Example Flow

1. **A request arrives at an endpoint** (e.g., `POST /api/users`).
2. **Route** matches the endpoint and calls the appropriate controller function.
3. **Controller** validates the request, then calls a service.
4. **Service** performs business logic and calls a repository for DB access.
5. **Repository** executes the DB operation using Drizzle ORM and returns the result.
6. **Service** returns the processed result to the controller.
7. **Controller** sends the HTTP response.

---


Pour plus de détails sur chaque fichier ou dossier, consultez les commentaires dans le code ou demandez une section spécifique !

---


---

## 📬 Exemples de Requêtes & Réponses

### Create User

**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "firstname": "Alice",
  "lastname": "Smith",
  "email": "alice@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "id": 1,
  "firstname": "Alice",
  "lastname": "Smith",
  "email": "alice@example.com",
  ...
}
```

### Login

**Request:**
```http
POST /api/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "email": "alice@example.com"
  }
}
```

---

## 🔐 Authentification & Routes Protégées

- La plupart des routes nécessitent un token JWT valide dans l'en-tête `Authorization` :
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
- Obtenez un token via l'endpoint `/api/login`.
- Ajoutez le token à toutes les requêtes vers les endpoints protégés (ex : `/api/users`, `/api/content`).
- Si le token est manquant ou invalide, l'API retourne `403 Forbidden`.

---

## 🧪 Lancer les Tests & Couverture

- Pour lancer tous les tests :
  ```sh
  npm test
  ```
- Les tests se trouvent dans `src/tests/` (unitaires et intégration).
- Vous pouvez utiliser des outils comme Jest pour générer un rapport de couverture :
  ```sh
  npm run test -- --coverage
  ```
- Essayez d'obtenir une couverture élevée sur les controllers, services et repositories.

---

## 🤝 Guide de Contribution

1. Forkez le dépôt
2. Créez une branche de fonctionnalité (`git checkout -b feature/votre-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Poussez la branche (`git push origin feature/votre-fonctionnalite`)
5. Ouvrez une Pull Request

Merci d'écrire des messages de commit clairs et d'ajouter/maintenir des tests pour chaque nouvelle fonctionnalité.

---

## 🛠️ Dépannage & FAQ

**Q : J'ai une erreur de connexion à la base de données au démarrage.**
A : Vérifiez votre fichier `.env` pour le bon `DATABASE_URL` et assurez-vous que PostgreSQL est démarré.

**Q : Mon token JWT est rejeté.**
A : Assurez-vous d'utiliser le token obtenu via `/api/login` et de l'inclure comme `Bearer <token>` dans l'en-tête `Authorization`.

**Q : Les migrations échouent ou des tables sont manquantes.**
A : Lancez `npm run migrate` pour appliquer toutes les migrations.

**Q : L'upload de fichiers échoue.**
A : Vérifiez la configuration Multer et que le dossier d'upload existe et est accessible en écriture.

**Q : Comment réinitialiser la base de données ?**
A : Supprimez et recréez la base, puis relancez les migrations.

Pour d'autres problèmes, consultez les logs ou ouvrez une issue sur le dépôt.

---

✅ **Prêt à builder, lancer !**
