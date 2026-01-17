# Playwright API Testing

API testing framework using Playwright for automated testing.

## Prerequisites

- Node.js (LTS version)
- npm
- Git

## Dependencies

### Production

- `dotenv` - Environment variables management
- `zod` - Schema validation library

### Development

- `@playwright/test` - Playwright testing framework
- `@types/node` - TypeScript types for Node.js
- `cross-env` - Cross-platform environment variables
- `husky` - Git hooks (pre-commit, post-commit)
- `lint-staged` - Run linters on staged files
- `prettier` - Code formatter

## Installation

```bash
npm install
npx playwright install --with-deps
```

## Configuration

Environment variables are stored in `configs/.env`:

```env
ENV_URL=https://api.escuelajs.co
V1_USER=/api/v1/users
V1_USER_ID=/api/v1/users/{{:userId}}
```

## Running Tests

### All Tests

```bash
npm test
```

### API Tests

```bash
npm run playwright:api
```

### Regression Tests

```bash
npm run playwright:regression
```

### Functional Tests

```bash
npm run playwright:functional
```

### E2E Tests

```bash
npm run playwright:E2E
```

### Custom Workers

```bash
# Windows
set WORKERS=4 && npm run playwright:api

# Unix/Linux/Mac
WORKERS=4 npm run playwright:api
```

## Code Formatting

### Format All Files

```bash
npm run format
```

### Check Formatting

```bash
npm run format:check
```

## Project Structure

```
playwright-api/
├── .github/workflows/     # CI/CD workflows
├── configs/              # Environment configurations
├── plugins/              # HTTP request plugins
├── resources/            # Test data and expected results
│   ├── dataTest/
│   └── expectedResults/
├── support/              # Support utilities
│   ├── models/
│   ├── services/
│   └── utils/
├── testCases/            # Test cases
│   └── api/
├── playwright.config.ts  # Playwright configuration
└── globalVariables.ts    # Global variables
```

## Test Tags

- `@high` - High priority tests
- `@regression` - Regression tests
- `@functional` - Functional tests
- `@E2E` - End-to-end tests

## CI/CD

Tests run automatically on push/PR to `main` or `master` branches via GitHub Actions.

## Reports

HTML reports are generated in `playwright-report/` directory.

```bash
npx playwright show-report
```
