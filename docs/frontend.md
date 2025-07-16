# Frontend Documentation

## Overview

This directory contains the React frontend for the Alexandria project. It is built with **React**, **TypeScript**, and **Vite**. The application communicates with the backend API via Axios and provides pages for authentication, video browsing, and user profile management.

For a more thorough explanation of how to use the website see **frontend-user-guide.md**. Developers looking to contribute should read **frontend-dev-guide.md** in the same folder.

## Project Structure

```
Frontend/
├─ public/            # Static assets served as-is
├─ src/
│  ├─ components/     # Reusable UI components
│  ├─ pages/          # Top-level pages used in the router
│  ├─ styles/         # CSS files organized by page/component
│  ├─ assets/         # Images or other bundled assets
│  ├─ lib/            # Helper libraries (e.g. API client)
│  ├─ App.tsx         # Route definitions
│  └─ main.tsx        # Application entry point
├─ package.json       # NPM dependencies and scripts
├─ vite.config.ts     # Vite configuration
└─ dockerfile         # Container setup for production
```

## Installation

1. Install Node.js (version 20 is used in the dockerfile).
2. Navigate to the `Frontend` directory.
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the development server with Vite:

```bash
npm run dev
```

The app will start on port **5173** by default. The Vite config also proxies `/api` requests to the backend. Adjust `vite.config.ts` if your backend runs elsewhere.

## Environment Variables

API requests use the `VITE_API_URL` variable defined in your environment. Create a `.env` file or set the variable when starting Vite:

```
VITE_API_URL=http://localhost:8080
```

## Building for Production

To generate a production build:

```bash
npm run build
```

The bundled files are placed in the `dist/` directory. You can preview the production build locally using:

```bash
npm run preview
```

## Docker

A `dockerfile` is provided to build a production container:

```Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run the image:

```bash
docker build -t alexandria-frontend .
docker run -p 3000:3000 alexandria-frontend
```

## Available Pages

- `/` – Home page introducing Alexandria.
- `/login` – Sign in form using `api.post('/api/login')`.
- `/register` – Multi-step registration form.
- `/profile` – View and edit user profile data.
- `/plans` – Subscription plans.
- `/checkout` – Payment flow.
- `/congress` – Directory of congress events.
- `/congress/:id` – Details for a specific congress.
- `/speaker/:id` – Speaker information.
- `/categories` – Browse videos by category.
- `/watch/:id` – Watch a selected video.

## Components

Common components are located in `src/components/`:

- **Navbar** and **Footer** – Site navigation and footer.
- **SearchBar** – Search input used on several pages.
- **VideoPlayer** – Wrapper around the HTML5 player for video playback.
- **EventModal** – Modal dialog for event details.
- **StepIndicator** – Progress indicator used in multi-step forms.

## Styling

Styles are plain CSS modules stored under `src/styles/` and imported by the corresponding pages or components. Global styles live in `styles/Global.css` and are imported in `main.tsx`.

## API Helper

`src/lib/api.ts` exports an Axios instance configured with the base URL from `VITE_API_URL`. An interceptor injects the `Authorization` header when a JWT token is stored in `localStorage`.

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## Running Tests

No automated tests are provided. You can run ESLint for basic checks:

```bash
npm run lint
```

## Conclusion

This documentation covers the basic usage and structure of the Alexandria frontend. For additional information, examine the source code in the `src/` directory and the configuration files in the project root.

You can also consult `frontend-user-guide.md` for end‑user instructions and `frontend-dev-guide.md` for development details.

