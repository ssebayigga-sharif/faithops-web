# FaithOps

A React + Vite church management application.

## Getting Started

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks and creates a production build in `dist`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.

## Project Structure

- `src/main.tsx` mounts the React app.
- `src/App.tsx` wires providers, layout, and routes.
- `src/router.tsx` provides the small client-side router used by links and redirects.
- `app/` contains the existing pages, components, contexts, and global styles.

Member form submissions are validated in the browser and saved through `src/services/members.ts`.
