# Fastify E-commerce API (Demo)

A demo e-commerce REST API built with Fastify and TypeScript. It showcases common features like authentication with JWT, product catalog, shopping cart, and order creation, using Prisma as ORM and SQLite for persistence. Swagger UI is included for interactive API documentation.

## Tech Stack
- **Runtime/Language**: Node.js, TypeScript
- **Web Framework**: Fastify 5
- **Validation/Types**: Zod with `fastify-type-provider-zod`
- **Auth**: `@fastify/jwt` (access tokens) + HTTP-only refresh token cookie
- **ORM/DB**: Prisma + SQLite (configurable via `DATABASE_URL`)
- **Docs**: `@fastify/swagger` + `@fastify/swagger-ui`
- **Tooling**: ESLint, Prettier, Vitest, TSX, pnpm

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (project uses `packageManager: pnpm@10`)

### 1) Clone and install
```bash
pnpm install
```

### 2) Configure environment
Create a `.env` file at the project root if you want to override defaults:
```bash
# Database (defaults to SQLite file at ./database/database.sqlite)
DATABASE_URL="file:./database/database.sqlite"

# JWT secret (default: "supersecret")
JWT_SECRET="change_me"

# NODE_ENV can influence cookie security flags
NODE_ENV=development
```

### 3) Generate Prisma client and run migrations
```bash
pnpm db:generate
pnpm db:migrate
```

### 4) Seed sample data (users, products, categories)
```bash
pnpm db:seed
```

### 5) Start the server (development)
```bash
pnpm dev
```
The API listens on http://localhost:3000 with routes prefixed by `/api`.

- Swagger UI: http://localhost:3000/docs

## Useful Scripts
- `pnpm dev`: Run in watch mode
- `pnpm build`: TypeScript build
- `pnpm test`: Run tests with Vitest
- `pnpm db:generate`: Generate Prisma Client
- `pnpm db:migrate`: Apply dev migrations
- `pnpm db:reset`: Reset DB (destructive) and re-apply migrations
- `pnpm db:seed`: Seed demo data
- `pnpm lint` / `pnpm lint:fix`: Lint
- `pnpm format`: Prettier format

## Project Structure (high level)
- `src/app.ts`: Fastify instance and plugins registration
- `src/main.ts`: Server bootstrap (port 3000)
- `src/routes`: Route registration with `/api` prefix
- `src/controllers`: Request handlers
- `src/services`: Business logic
- `src/schemas`: Zod schemas for validation and OpenAPI
- `src/plugins`: JWT, Prisma, Swagger, error handler, utilities
- `prisma/schema.prisma`: Prisma models (User, Product, Category, Cart, Order)
- `database/seeders`: Seed scripts
- `tests`: Vitest test suite

## Notes
- Default JWT access token expiry is 15 minutes; refresh token is stored as an HTTP-only cookie named `refreshToken`.
- In production, set a strong `JWT_SECRET` and `NODE_ENV=production` to enable secure cookies.
