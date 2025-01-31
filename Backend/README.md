# 🚀 API Documentation

Ce projet est une API REST pour gérer des utilisateurs avec **Express.js**, **PostgreSQL** et **Drizzle ORM**.  
Elle inclut également l'**authentification avec JWT**, le **hachage des mots de passe** avec bcrypt, et une **documentation Swagger**.

---

## 📂 **1. Structure du projet**
┣ 📂 config/ # Configuration de la BDD
┃ ┣ 📜 db.ts # Connexion à PostgreSQL avec Drizzle ORM
┣ 📂 docs/ # Dossier pour Swagger
┃ ┗ 📜 swagger.ts # Configuration Swagger
┣ 📂 repository/ # Requêtes SQL via Drizzle ORM
┃ ┗ 📜 user.repository.ts
┣ 📂 services/ # Logique métier
┃ ┣ 📜 auth.service.ts # Authentification et JWT
┃ ┗ 📜 user.service.ts
┣ 📂 controllers/ # Gestion des requêtes HTTP
┃ ┣ 📜 auth.controller.ts
┃ ┗ 📜 user.controller.ts
┣ 📂 middlewares/ # Middleware pour protéger les routes avec JWT
┃ ┗ 📜 auth.middleware.ts
┣ 📂 routes/ # Définition des endpoints Express
┃ ┣ 📜 auth.routes.ts
┃ ┗ 📜 user.routes.ts
┣ 📂 schemas/ # Schémas Drizzle ORM pour PostgreSQL
┃ ┗ 📜 user.ts
┃ ┗ 📜 subscription.ts
┃ ┗ 📜 payment.ts
┣ 📜 server.ts # Point d'entrée du serveur Express
┗ 📜 .env # Fichier de configuration environnementale

---

## 🛠 **2. Installation & Configuration**
### ✅ **1. Cloner le projet**
```sh
git clone https://github.com/ton-repo.git
cd ton-repo
```

### ✅ **2. Installer les dépendances**
```sh
npm install
```

### ✅ **3. Configurer l’environnement**

Crée un fichier .env à la racine du projet :
```ini
PORT=port
DATABASE_URL=postgres://user:password@localhost:port/mydatabase
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1h
```

### ✅ **4. Démarrer le serveur**
```sh
npm run dev
```
L'API est maintenant disponible sur http://localhost:port/api

---

## 🔑 **3. Authentification avec JWT**

L'API utilise JSON Web Tokens (JWT) pour sécuriser l'accès aux routes protégées.

### ✅ **Créer un utilisateur**

- Méthode : POST /api/users
- Body :
  ```json
  {
  "firstname": "Alex",
  "lastname": "Doe",
  "email": "alex@example.com",
  "password": "securepassword"
  }
  ```

### ✅ **Se connecter et récupérer un token**

- Méthode : POST /api/login
- Body :
  ```json
  {
    "email": "alex@example.com",
    "password": "securepassword"
  }
  ```

- Réponse :
  ```json
  {
    "token": "eyJhbGciOiJI...",
    "user": {
      "id": 1,
      "email": "alex@example.com"
    }
  }
  ```
Ce token JWT doit être ajouté dans les requêtes protégées via Authorization: Bearer <TOKEN>.

---

## 🔗 **4. Endpoints de l'API**
### 🟢 Utilisateurs
| Méthode        | Route      | Description     | Protection    |
| ------|-----|-----|-----|
| POST  	| `/api/users` 	| Créer un utilisateur 	| ❌    |
| GET  	| `/api/users` 	| Récupérer tous les utilisateurs 	| 	✅ JWT    |
| GET  	| `/api/users/:id` 	| Récupérer un utilisateur par ID 	| 	✅ JWT    |
| PUT  	| `/api/users/:id` 	| Mettre à jour un utilisateur 	| 	✅ JWT    |
| DELETE  	| `/api/users/:id` 	| Supprime un utilisateur 	| 	✅ JWT    |

### 🔐 Authentification

| Méthode        | Route      | Description     |
| ------|-----|-----|
| POST  	| `/api/login` 	| 	Connexion utilisateur (retourne un token) 	|

---

## 📖 **5. Documentation Swagger**
### 🔍 **Accéder à Swagger UI**

Une documentation interactive est disponible via Swagger UI :
```sh
http://localhost:port/api-docs
```
Elle permet de tester directement les endpoints via une interface web.

### ✍ **Exemple d’annotation Swagger**

Les routes sont documentées directement dans le code :
```ts
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/users", authenticateJWT, UserController.getAllUsers);
```

---
## 🏗 **6. Structure de la base de données**

L'API utilise PostgreSQL avec Drizzle ORM.
### 🛠 **Table `users`**
| Champ        | Type      | Contraintes     |
| ------|-----|-----|
| `id`  	| `SERIAL` 	|PRIMARY KEY, UNIQUE	|
| `firstname`  	| `VARCHAR(255)` 	|	|
| `lastname`  	| `VARCHAR(255)` 	|	|
| `email`  	| `VARCHAR(255)` 	|UNIQUE, NOT NULL	|
| `password`  	| `VARCHAR(255)` 	|NOT NULL	|
| `date_of_birth`  	| `DATE` 	|	|
| `address`  	| `VARCHAR(255)` 	|	|
| `country`  	| `VARCHAR(255)` 	|	|
| `zipcode`  	| `VARCHAR(10)` 	|	|
| `createdat`  	| `DATE` 	|DEFAULT NOW()	|

---

## ✅ **7. Sécurité**
### 🔒 **Hachage des mots de passe avec Bcrypt**

Avant d'enregistrer un utilisateur, son mot de passe est hashé :
```ts
const hashedPassword = await bcrypt.hash(userData.password, 10);
```

### 🔐 **Protection des routes avec JWT**

Les routes protégées nécessitent un token JWT :
```ts
import jwt from "jsonwebtoken";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Accès interdit" });

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalide" });
        (req as any).user = user;
        next();
    });
};
```

---