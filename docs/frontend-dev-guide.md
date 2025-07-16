# Alexandria Frontend - Developer Guide

This guide provides detailed instructions for developers who want to build, extend or contribute to the Alexandria React application. It expands upon the short overview in `frontend.md`.

## 1. Requirements

- **Node.js** 20 or higher
- **npm** (comes with Node)
- **Git** for version control
- Optional: **Docker** for containerized builds

## 2. Getting the Source

Clone the repository and install dependencies:

```bash
git clone https://github.com/example/alexandria.git
cd alexandria/Frontend
npm install
```

If you are using Bun you can run `bun install` instead. A `bun.lock` file is ignored by git.

## 3. Directory Overview

```
Frontend/
├─ public/          # Static files copied directly into the build output
├─ src/
│  ├─ assets/       # Images and other resources bundled by Vite
│  ├─ components/   # Reusable React components (Navbar, VideoPlayer…)
│  ├─ pages/        # Route-level components used by react-router
│  ├─ lib/          # Helpers such as the Axios API wrapper
│  ├─ styles/       # CSS modules and global styles
│  ├─ App.tsx       # Main router configuration
│  └─ main.tsx      # Application entry point
├─ tests/           # (optional) place for unit tests
├─ package.json     # Project metadata and scripts
└─ vite.config.ts   # Build and dev-server configuration
```

## 4. Environment Variables

Create a `.env` file in the `Frontend` directory to override defaults used in development:

```
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=Alexandria
```

During production builds the variables from your shell environment or `.env` file are injected via Vite.

## 5. Useful NPM Scripts

- `npm run dev` – Start the Vite development server on port 5173.
- `npm run build` – Generate a production build in `dist/`.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run ESLint over all TypeScript files.

If ESLint reports errors, fix them before committing changes. The project uses the `@typescript-eslint` ruleset with `prettier` integration.

## 6. Working with the API

All HTTP requests go through `src/lib/api.ts`. The Axios instance automatically appends the JWT token from `localStorage` to the `Authorization` header:

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

Use this helper whenever you call the backend API. Example:

```ts
await api.post('/login', { email, password });
```

## 7. Routing

Routes are defined in `App.tsx` using `react-router-dom`. Each entry in the array corresponds to a page component in `src/pages`.

```
<Route path="/login" element={<Login />} />
```

When adding pages, ensure the path is added to the router and that any CSS modules are created under `src/styles`.

## 8. Styling

The application primarily uses CSS modules. Global styles are imported in `src/styles/Global.css` which is referenced in `main.tsx`. You can introduce additional CSS frameworks if needed, but keep the naming conventions consistent.

## 9. Testing

Unit tests can be written with **Vitest**. Create a file ending with `.test.tsx` under the `tests` directory and run:

```bash
npm run test
```

Currently the project contains no tests, but the configuration is ready for future contributions.

## 10. Docker Build

A `dockerfile` is provided to create a lightweight production container. Build and run it as follows:

```bash
docker build -t alexandria-frontend .
docker run -p 3000:3000 alexandria-frontend
```

Inside the container, `serve` hosts the static `dist` directory on port 3000. You can mount a volume for logs or host configuration if required.

## 11. Contributing Guidelines

1. Fork the repository and create a feature branch.
2. Make your changes and ensure `npm run lint` passes.
3. Submit a pull request with a clear description of the feature or bug fix.

For major changes, open an issue first to discuss what you would like to change.

## 12. Additional Resources

- [React documentation](https://react.dev/)
- [Vite documentation](https://vitejs.dev/)
- [Axios documentation](https://axios-http.com/)

Feel free to reach out to the maintainers if you need help getting started!

