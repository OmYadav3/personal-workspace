# Development Guidelines

## 1. Project Overview

Personal Workspace is a full-stack application built using a TypeScript monorepo.

**Technology Stack**

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- Shared Package: Reusable TypeScript types and utilities
- Testing: Vitest
- Code Quality: ESLint and Prettier
- Package Manager: npm workspaces

The architecture follows a **modular monolith** approach. The React website and future React Native mobile application will share the same backend APIs and business logic.

## 2. Monorepo Structure

```text
personal-workspace/
├── apps/
│   ├── api/             # Express backend
│   ├── web/             # React website
│   └── mobile/          # Future Expo application
├── packages/
│   └── shared/          # Shared types and utilities
├── docs/                # Project documentation
├── .gitignore
├── .prettierrc.json
├── .prettierignore
├── package.json
└── README.md
```

## 3. Workspace Responsibilities

### apps/api

- Handle HTTP requests and responses.
- Implement business logic, authentication and authorization.
- Manage database access.
- Validate incoming requests.
- Keep controllers lightweight.
- Organize features into independent modules.

### apps/web

- Build reusable React components.
- Implement pages, layouts and client-side routing.
- Communicate with the backend through APIs.
- Keep business logic on the backend.
- Use Tailwind CSS for styling.

### packages/shared

- Store reusable TypeScript types and interfaces.
- Store shared constants and validation schemas when appropriate.
- Export public functionality through `src/index.ts`.
- Never import backend-only or frontend-only dependencies into shared code.

## 4. Naming Conventions

| Item                 | Convention       | Example              |
| -------------------- | ---------------- | -------------------- |
| Folders              | kebab-case       | `user-profile/`      |
| General files        | kebab-case       | `user.service.ts`    |
| React components     | PascalCase       | `ProfileCard.tsx`    |
| Functions            | camelCase        | `getUserById()`      |
| Variables            | camelCase        | `userEmail`          |
| Constants            | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS` |
| Types and interfaces | PascalCase       | `UserProfile`        |

## 5. TypeScript Rules

- Use TypeScript for application source code.
- Avoid `any`; prefer explicit types or `unknown`.
- Use `import type` for type-only imports.
- Define reusable cross-workspace types in `packages/shared`.
- Avoid unnecessary type assertions.
- Keep functions small and focused.
- Handle asynchronous errors appropriately.

## 6. Backend Development Rules

- Follow the route → controller → service → repository flow where appropriate.
- Controllers handle HTTP-specific concerns.
- Services contain business logic.
- Repositories handle database operations.
- Validate request data before processing.
- Use consistent API response and error formats.
- Never expose passwords, tokens or sensitive information in API responses.
- Organize related functionality into feature modules.

## 7. Frontend Development Rules

- Use functional React components and hooks.
- Keep components reusable and focused.
- Separate API communication from presentation components.
- Avoid hardcoding API URLs.
- Use environment variables for frontend configuration.
- Follow consistent loading, error and empty-state patterns.
- Do not store secrets in frontend environment variables.

## 8. Environment Variables

- Keep local configuration in `.env` files.
- Never commit real `.env` files or credentials.
- Maintain `.env.example` files with placeholder values.
- Use `VITE_` prefixes only for environment variables intended to be exposed to the frontend.
- Validate required backend environment variables at startup.

## 9. ESLint and Prettier

Run these commands from the project root:

```bash
npm run lint
npm run format
npm run format:check
```

- ESLint checks code quality.
- Prettier maintains consistent formatting.
- Fix linting errors before committing.
- Run `format:check` before pushing code.

## 10. Testing Rules

- Use Vitest for unit tests.
- Store tests in the relevant workspace's `tests/` directory.
- Write tests for important business rules and utilities.
- Use integration tests for API and database interactions.
- Avoid depending on external services in unit tests.

Run all workspace tests:

```bash
npm test
```

## 11. Git and Commit Conventions

Use meaningful commit messages following Conventional Commits.

Examples:

```text
feat: add user registration API
fix: resolve authentication validation issue
refactor: simplify user service
test: add registration unit tests
docs: update development guidelines
chore: configure linting and formatting
```

- `main` should contain stable code.
- Use feature branches for substantial changes.
- Do not commit secrets or generated build files.
- Keep commits focused on one logical change.

## 12. Definition of Done

A feature is complete when:

- The implementation follows the project architecture.
- TypeScript checks and relevant builds pass.
- ESLint passes.
- Prettier formatting passes.
- Relevant tests pass.
- Environment variable examples are updated if needed.
- Documentation is updated.
- Changes are committed to Git.

## 13. Development Workflow

1. Understand and document the feature requirements.
2. Define data models, validation and API contracts.
3. Implement backend functionality.
4. Write relevant tests.
5. Implement frontend integration.
6. Run linting, formatting and tests.
7. Update documentation.
8. Commit and push the changes.

These guidelines should evolve as the project grows.
