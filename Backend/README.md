# 📦 Alex Backend

Backend API for Alex Project, managing users, profiles, roles, orators, congresses, sessions, contents, and histories.

---

## 🚀 Tech Stack

- TypeScript (Node.js)
- Express.js
- Drizzle ORM (PostgreSQL)
- Multer (for file uploads)
- Docker & Docker Compose

---

## ⚙️ Prerequisites

- Node.js >= 20.x
- PostgreSQL >= 15 (if running locally without Docker)
- Docker & Docker Compose (recommended)

---

## 🔧 Installation (Local)

```sh
git clone <repository-url>  
cd Backend  
npm install  
cp .env.example .env  
# Edit .env with your database and secrets
```

To run database migrations:
```sh
npm run migrate
```
To start locally:
```
npm run start
```
---

## 🐳 Using Docker

### Build and run with Docker Compose

```sh
docker-compose up --build
```
- Backend exposed at http://localhost:5863 (mapped to port 8080 inside container)
- Frontend exposed at http://localhost:3000

The `.env` file is loaded from `Backend/.env`.

---

## 📦 Available Scripts

npm run dev        → Run in development (nodemon)  
npm run build      → Build the project  
npm start         → Start production build  
npm run migrate    → Run DB migrations  
npm test         → Run tests (if implemented)

---

## 📁 Project Structure

/migrations  
    database.ts  
    multerConfig.ts  
/src  
    /controllers  
    /services  
    /repositories  
    /routes  
    /schemas  
    app.ts  
    server.ts  
Dockerfile  
docker-compose.yaml

---

## 📚 API Endpoints (Overview)

| Entity         | Base Route          |
|---------------|---------------------|
| Congress      | /api/congress       |
| Content       | /api/content        |
| History       | /api/history        |
| Orators       | /api/orators        |
| Role          | /api/role           |
| Session       | /api/session        |
| Users         | /api/users          |
| UsersProfiles | /api/usersProfiles  |
| UsersRoles    | /api/usersRoles     |

(See routes folder for details on each endpoint)

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request

---

## 📬 Contact

Author: Mathis Champin 
Email: <mathis.champin@epitech.eu>  

---

✅ **Ready to build, run, and hack!**
