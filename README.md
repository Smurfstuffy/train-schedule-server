# Train Schedule API (Backend)

Backend for the **Train Schedule** application: a NestJS REST API with JWT auth, schedule CRUD, favorites, and real-time updates via WebSocket. Administrators manage train schedules; users view and filter schedules and save favorites.

## Project overview

- **JWT authentication** — Register, login, refresh, logout; role-based access (Admin / User).
- **Schedule management** — Full CRUD for schedules; routes and stops; DTO validation with class-validator.
- **Favorites** — Users can add and remove favorite schedules.
- **Real-time updates** — WebSocket gateway broadcasts schedule create/update/delete to authenticated clients.
- **API documentation** — Swagger at `/api`.

## Tech stack

- **NestJS** (TypeScript)
- **PostgreSQL** + **Prisma**
- **JWT** (Passport, bcrypt)
- **Socket.IO** (WebSocket gateway, JWT guard)
- **Swagger** (OpenAPI)
- **class-validator** / **class-transformer**

## Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted, e.g. [Neon](https://neon.tech))
- npm

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable       | Description |
|----------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://USER:PASSWORD@HOST:5432/DB?schema=public`) |
| `JWT_SECRET`   | Secret used to sign JWT tokens (use a strong value in production) |

Example `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/train_schedule?schema=public"
JWT_SECRET="your-secret-key"
```

## Setup

```bash
npm install
npx prisma migrate deploy
npm run prisma:seed
```

- **migrate deploy** — Applies migrations to the database.
- **prisma:seed** — Seeds roles, demo users (admin + user), train types, trains, and sample schedules.

## Run

```bash
# Development (watch mode)
npm run start:dev

# Production build and run
npm run build
npm run start:prod
```

API listens on `http://localhost:3000` (or `PORT` from env). Swagger UI: **http://localhost:3000/api**.

## Demo credentials

After seeding, you can sign in via **POST /auth/login** with:

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | `admin@example.com` | `admin123` |
| User  | `user@example.com`  | `user123`  |

Response includes `accessToken` and `refreshToken`. Use `Authorization: Bearer <accessToken>` for protected endpoints.

## Main endpoints

- **Auth:** `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- **Schedules:** `GET/POST /schedules`, `GET/PATCH/DELETE /schedules/:id` (filter by date, route, trainTypeId)
- **Favorites:** `GET/POST /favorites`, `DELETE /favorites/schedule/:scheduleId`
- **Trains:** `GET /trains`, `GET /train-types`

## WebSocket

- **Namespace:** `/schedules`
- **Auth:** Send JWT in handshake: `auth: { token: "<accessToken>" }` or `Authorization: Bearer <accessToken>`
- **Events (server → client):** `schedule:created`, `schedule:updated`, `schedule:deleted` for real-time list updates.

## Deployment (e.g. Render)

1. Create a **Web Service**; connect the repo.
2. **Build command:** `npm install && npx prisma generate && npm run build`
3. **Start command:** `npm run start:prod` (or `node dist/src/main.js` if needed)
4. **Environment:** Set `DATABASE_URL` (e.g. Neon) and `JWT_SECRET`. Render sets `PORT` automatically.
5. After deploy, run migrations and seed against the production DB (once), e.g. locally with production `DATABASE_URL`.

**Public API (example):** `https://train-schedule-server-ztop.onrender.com` — Swagger at `/api`.

## Scripts

| Script            | Description |
|-------------------|-------------|
| `npm run start:dev`  | Start with watch |
| `npm run start:prod` | Run production build |
| `npm run build`      | Compile to `dist/` |
| `npm run lint`       | ESLint |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run test`       | Unit tests |

## License

UNLICENSED (private).
