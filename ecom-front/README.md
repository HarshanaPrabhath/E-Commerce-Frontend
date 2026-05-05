# E-Commerce Frontend

Frontend app built with React + Vite + Redux Toolkit.

## Project Structure

```text
src/
  app/                  # App shell, layouts, router
  features/             # Feature modules (auth, cart, home, info, products, not-found)
  shared/               # Reusable UI, guards, utils, constants
  services/             # External services (api clients)
  store/                # Redux store, reducers, actions
  assets/               # Static assets
```

## Structure Rules

1. Route-level screens go under `features/<feature>/pages`.
2. Feature-specific UI/hooks stay inside that feature module.
3. Shared and reusable UI goes to `shared/components`.
4. Shared pure helpers go to `shared/utils`.
5. API integrations go to `services/api`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Import Alias

`@/` points to `src/` (configured in `vite.config.js` and `jsconfig.json`).
