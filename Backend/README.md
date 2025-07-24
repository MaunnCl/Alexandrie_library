npm run build      → Build the project  
npm start         → Start production build  
npm run migrate    → Run DB migrations  
npm test         → Run tests (if implemented)
docker-compose.yaml

# 🗂️ Backend Folder Structure & File Descriptions

The `Backend` folder contains all the source code and configuration for the Alexandra Library API. Here is a detailed overview of its structure and the purpose of each main part:

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


### 1. Schemas (`src/schemas/`)

Defines the structure of the database tables using Drizzle ORM. Each file corresponds to a table:

- **user.ts**: Users (id, firstname, lastname, email, password, etc.)
- **profile.ts**: User profiles (id, user_id, profilePicture, bio, preferences)
- **role.ts**: Roles (id, role_name, description)
- **userRole.ts**: User-role mapping (id, user_id, role_id)
- **orators.ts**: Orators (id, name, picture, content_ids, country, city)
- **session.ts**: Sessions (id, name, content_ids)
- **content.ts**: Content (id, title, orator_id, description, url, timeStamp)
- **congress.ts**: Congresses (id, name, key, session_ids, picture, date, city)
- **history.ts**: User history (id, userId, contentId, viewedAt, timeStamp, uniqueView)

These schemas are used by the ORM to generate SQL queries and ensure type safety.

---

### 2. Controllers (`src/controllers/`)

Controllers handle HTTP requests and responses. Each controller manages a specific resource and exposes CRUD and business endpoints. Example controllers:

- **UsersController**: Create, get, update, and delete users. Handles password hashing and delegates to UsersService.
- **SessionController**: Manage sessions (create, get, update, delete, add/remove content to session).
- **HistoryController**: Add to user history, get user history, delete history items.
- **OratorsController**: Manage orators (create, get, update, delete, add/remove content, update photo).
- **UsersRolesController**: Manage user-role assignments.
- **ContentController**: Manage content (create, get, update, delete).
- **RoleController**: Manage roles (create, get, update, delete).
- **UsersProfilesController**: Manage user profiles (create, get, update, delete).
- **CongressController**: Manage congresses (create, get, update, delete).

Controllers validate input, call the appropriate service, and return JSON responses or errors.

---

### 3. Services (`src/services/`)

Services contain the business logic and orchestrate complex operations. They are called by controllers and use repositories for data access. Example services:

- **UsersService**: User-related business logic (creation, retrieval, update, deletion, password hashing, etc.).
- **SessionService**: Session business logic (creation, update, content management).
- **HistoryService**: Logic for managing user history.
- **OratorsService**: Logic for orator management and content association.
- **UsersRolesService**: Logic for assigning/removing roles to users.
- **ContentService**: Logic for content CRUD and association.
- **RoleService**: Logic for role CRUD.
- **UsersProfilesService**: Logic for user profile CRUD.
- **CongressService**: Logic for congress CRUD and session association.

Services keep controllers thin and focused on HTTP logic.

---

### 4. Repositories (`src/repository/`)

Repositories abstract the data access layer and interact directly with the database via Drizzle ORM. Example repositories:

- **UsersRepository**: CRUD operations for users.
- **SessionRepository**: CRUD for sessions and content association.
- **HistoryRepository**: CRUD for user history.
- **OratorsRepository**: CRUD for orators and content association.
- **UsersRolesRepository**: CRUD for user-role assignments.
- **ContentRepository**: CRUD for content.
- **RoleRepository**: CRUD for roles.
- **UsersProfilesRepository**: CRUD for user profiles.
- **CongressRepository**: CRUD for congresses and session association.

Repositories allow you to change the data source with minimal changes to services/controllers.

---

### 5. Routes (`src/routes/`)

Routes define the API endpoints and map them to controller functions. They also apply middleware for authentication and validation. Example routes:

- **users.route.ts**: `/api/users` (POST, GET, GET by id, PUT, DELETE)
- **session.route.ts**: `/api/sessions` (POST, GET, GET by id, PUT, DELETE, add/remove content)
- **history.route.ts**: `/api/history` (POST, GET by user, DELETE)
- **orators.route.ts**: `/api/orators` (POST, GET, GET by id, PUT, DELETE, add/remove content, update photo)
- **usersRoles.route.ts**: `/api/users-roles` (POST, GET, GET by id, PUT, DELETE)
- **content.route.ts**: `/api/content` (POST, GET, GET by id, PUT, DELETE)
- **role.route.ts**: `/api/roles` (POST, GET, GET by id, PUT, DELETE)
- **usersProfiles.route.ts**: `/api/users-profiles` (POST, GET, GET by id, PUT, DELETE)
- **congress.route.ts**: `/api/congress` (POST, GET, GET by id, PUT, DELETE)

Routes are grouped by resource and follow RESTful conventions.

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

For more details on each file or folder, see the inline comments in the code or ask for a specific section!

---


---

## 📬 Example Requests & Responses

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

## 🔐 Authentication & Protected Routes

- Most routes require a valid JWT token in the `Authorization` header:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
- Obtain a token via the `/api/login` endpoint.
- Add the token to all requests to protected endpoints (e.g., `/api/users`, `/api/content`).
- If the token is missing or invalid, the API returns `403 Forbidden`.

---

## 🧪 Running Tests & Coverage

- To run all tests:
  ```sh
  npm test
  ```
- Tests are located in `src/tests/` (unit and integration).
- You can use tools like Jest to generate a coverage report:
  ```sh
  npm run test -- --coverage
  ```
- Aim for high coverage on controllers, services, and repositories.

---

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please write clear commit messages and add/maintain tests for new features.

---

## 🛠️ Troubleshooting & FAQ

**Q: I get a database connection error on startup.**
A: Check your `.env` file for correct `DATABASE_URL` and ensure PostgreSQL is running.

**Q: My JWT token is rejected.**
A: Make sure you use the token from `/api/login` and include it as `Bearer <token>` in the `Authorization` header.

**Q: Migrations fail or tables are missing.**
A: Run `npm run migrate` to apply all migrations.

**Q: File uploads fail.**
A: Check your Multer configuration and ensure the upload directory exists and is writable.

**Q: How do I reset the database?**
A: Drop and recreate the database, then re-run migrations.

For other issues, check the logs or open an issue on the repository.

---

✅ **Ready to build, run, and hack!**
