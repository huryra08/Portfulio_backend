# Portfulio API

Same structure as the GearUp demo: Node.js + TypeScript (strict, ESM) + Express 5 + PostgreSQL + Prisma 7 (multi-file schema, `PrismaPg` adapter, generated client in `generated/prisma`), JWT access/refresh tokens in cookies, bcrypt, role-based access, built with `tsup`, deployable on Vercel.

## Setup

```bash
npm install
cp .env.example .env              # fill DATABASE_URL, JWT secrets, ADMIN_* values
npx prisma generate               # (the generated client is already included in this zip)
npx prisma migrate dev --name init
npm run seed                      # creates the ADMIN user
npm run dev                       # http://localhost:5000
```

## Deploy to Vercel

Link the directory to the Vercel project once before deploying:

```bash
npx vercel link --project portfolio-backend --scope huryra-s-projects
npx vercel deploy
```

Set the backend's `APP_URL` environment variable to the frontend's origin (for example, `https://your-portfolio.vercel.app`). A trailing slash is allowed and is removed before applying CORS.

Import `Portfulio API.postman_collection.json`, run **Auth > Login** (it saves `adminToken`), then try the rest.

## Structure

```
prisma/
  schema/            schema.prisma (generator + datasource), enums, users, profile,
                     project, skill, experience, post, message  (.prisma files)
  seed.ts            creates the admin
prisma.config.ts
generated/prisma/    generated Prisma client
src/
  app.ts  server.ts
  config/index.ts    env values (snake_case, default export)
  lib/prisma.ts      PrismaClient + PrismaPg adapter
  middlewares/auth.ts
  utils/             apiError, catchAsync, jwt, sendResponse
  modules/
    auth/            auth.controller / auth.routes / auth.service
    Project/ Skill/ Profile/ Experience/ Message/   (.controller / .route / .service)
tsup.config.ts  vercel.json
```

## Endpoints (base: /api)

| Area | Public | Admin only |
|---|---|---|
| Auth | `POST /auth/register` (VISITOR), `POST /auth/login`, `POST /auth/logout` | `GET /auth/me` (any logged-in user) |
| Projects | `GET /projects?featured=&skill=`, `GET /projects/:slug` | `GET /projects/admin/all`, `POST`, `PUT /:id`, `DELETE /:id` |
| Skills | `GET /skills` | `POST`, `PUT /:id`, `DELETE /:id` |
| Profile | `GET /profile` | `PUT /profile` (creates on first call) |
| Experience | `GET /experience` | `POST`, `PUT /:id`, `DELETE /:id` |
| Messages | `POST /messages` (5 per 15 min per IP) | `GET ?isRead=`, `PATCH /:id/read`, `DELETE /:id` |

Notes
- Response shape (same as the demo): `{ success, statusCode, message, data, meta? }`.
- Sending `images` / `skillIds` on a project update, or `socialLinks` on the profile, replaces the existing ones.
- Public project endpoints only return `published: true` projects.
- The admin cannot be registered through the API; use `npm run seed`.
