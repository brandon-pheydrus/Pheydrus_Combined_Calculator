# Pheydrus Combined Calculator

A modern web application for professional calculations, built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Vercel** - Deployment platform

## Project Structure

```text
src/
├── components/     # Reusable UI components
├── controllers/    # Business logic hooks (state management)
├── models/         # TypeScript interfaces and types
├── services/       # API calls and data processing
├── views/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── styles/         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

Tests are written using **Vitest** with **React Testing Library**. Tests are fast, reliable, and focus on user behavior.

```bash
npm test              # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

See [SDLC.md](./SDLC.md) for detailed testing and SDLC practices.

## Code Quality

Automated linting, formatting, and pre-commit hooks ensure consistent code quality:

```bash
npm run lint      # Check code quality
npm run format    # Auto-format code
```

Pre-commit hooks automatically lint and format staged changes.

## CI/CD

GitHub Actions automatically:

- Runs linting on all PRs
- Runs tests on all PRs
- Builds on all PRs
- Deploys to Vercel on main/master

See `.github/workflows/` for pipeline configurations.

## Documentation

- **[SDLC.md](./SDLC.md)** - Testing, code quality, and deployment workflows
- **[README.md](./README.md)** - This file

## Deployment

This project is configured for deployment on Vercel with automatic CI/CD. Simply push to `main` or `master` and GitHub Actions will run tests and deploy.

After initial setup, configure these secrets in GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## License

Proprietary - Pheydrus
