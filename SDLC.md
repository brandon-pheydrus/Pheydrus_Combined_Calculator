# Software Development Lifecycle (SDLC) Setup

This project follows modern SDLC best practices with automated testing, code quality checks, and CI/CD pipelines.

## Testing

### Unit Tests

Tests are written using **Vitest** with **React Testing Library**. Vitest is 4x faster than Jest and integrates seamlessly with Vite.

**Run tests:**

```bash
npm test
```

**Run tests in UI mode:**

```bash
npm run test:ui
```

**Run tests with coverage:**

```bash
npm run test:coverage
```

### Test Structure

- Place tests next to the files they test
- Use `.test.ts` or `.test.tsx` extension
- Follow the pattern: Describe → Act → Assert

Example test file: `src/services/calculatorService.test.ts`

## Code Quality

### Linting

ESLint ensures code follows consistent patterns and catches common errors.

```bash
npm run lint
```

### Formatting

Prettier automatically formats code for consistency.

```bash
npm run format
```

### Pre-commit Hooks

Husky + lint-staged runs linting and formatting automatically before commits:

- Lints staged TypeScript/JavaScript files
- Formats all modified files (JS, TS, JSON, MD)
- Prevents commits with style violations

No manual action needed—hooks run automatically.

## CI/CD Pipelines

### GitHub Actions Workflows

**Location:** `.github/workflows/`

#### 1. CI Pipeline (`ci.yml`)

Runs on every push and pull request:

1. **Lint** - Checks code quality
2. **Test** - Runs all tests
3. **Build** - Ensures production build succeeds

**Branches:** `main`, `master`

#### 2. Deploy Pipeline (`deploy.yml`)

Runs on pushes to main/master after CI passes:

1. Builds the project
2. Deploys to Vercel (requires secrets)

**Required Secrets:**

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

[Get Vercel tokens here](https://vercel.com/account/tokens)

## Writing Specifications (BDD)

When starting a new feature, use the spec-driven approach:

### 1. Write a Test First

```typescript
describe('CalculatorService', () => {
  it('should calculate sum of two numbers', async () => {
    const inputs = { a: 10, b: 20 };
    const result = await calculatorService.calculate(inputs);

    expect(result.success).toBe(true);
    expect(result.data?.[0].value).toBe(30);
  });
});
```

### 2. Watch Tests Fail

```bash
npm test
```

### 3. Implement Feature

Write code to make the test pass.

### 4. Run Tests Again

Verify your implementation is correct.

### 5. Commit

Only commit working code that passes tests.

## Development Workflow

1. Create a feature branch
2. Write failing tests
3. Implement feature to pass tests
4. Run `npm run lint` and `npm run format`
5. Commit (hooks will auto-lint/format)
6. Push and create PR
7. GitHub Actions runs CI pipeline
8. After merge, Deploy pipeline runs

## Architecture Patterns

### Models (`src/models/`)

TypeScript interfaces and types for data structures.

### Services (`src/services/`)

Business logic and data processing. Testable and reusable.

### Controllers (`src/controllers/`)

Custom React hooks that manage state and orchestrate between views and services.

### Views (`src/views/`)

Page components that display UI and handle user interaction.

### Components (`src/components/`)

Reusable UI components (Layout, buttons, etc.).

## Deployment

### Local Testing

```bash
npm run build
npm run preview
```

### Vercel Deployment

After setting up GitHub secrets:

1. Push to `main` or `master` branch
2. GitHub Actions runs CI
3. If CI passes, Deploy pipeline runs
4. Vercel automatically deploys your app

Visit your Vercel dashboard to see deployment status.

## Useful Commands

| Command                 | Purpose                       |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start dev server with HMR     |
| `npm run build`         | Production build              |
| `npm run preview`       | Test production build locally |
| `npm test`              | Run tests in watch mode       |
| `npm run test:ui`       | Interactive test UI           |
| `npm run test:coverage` | Coverage report               |
| `npm run lint`          | Check code quality            |
| `npm run format`        | Auto-format code              |

## Next Steps

1. **Configure Vercel Secrets** - Add tokens to GitHub for auto-deploy
2. **Write Specifications** - Plan calculator features with tests
3. **Implement Features** - Use TDD to build confidently
4. **Monitor Builds** - Check GitHub Actions and Vercel dashboards
