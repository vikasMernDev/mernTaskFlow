# Internal Project Management System

Real-time MERN project-management assignment.

## Current phase

Phase 1 planning and the primary Phase 2/3 implementation are complete. The backend provides JWT authentication, project/task CRUD, authorization, validation, error handling, Socket.IO rooms, and Redis fan-out. The responsive React client provides registration, login, project creation/listing, and a live drag-and-drop task board using Redux Toolkit.

- [Functional Requirements](docs/FRD.md)
- [System Design](docs/SYSTEM_DESIGN.md)

The design covers architecture, permissions, REST endpoints, collections/indexes, authenticated Socket.IO rooms/events, Redis scaling, Redux Toolkit state management, consistency, security, CI/CD, and VM deployment.

## Planned implementation order

1. ~~Backend foundation, authentication, validation, errors, and test harness~~
2. ~~Project/member and task services plus REST APIs~~
3. ~~Authenticated Socket.IO rooms and Redis adapter~~
4. ~~React login, project list, and real-time task board using Redux Toolkit~~
5. CI, Docker, Nginx, deployment documentation, and final README/API examples

## Architecture overview

The browser uses REST for durable mutations and an authenticated Socket.IO connection for live task events. Express delegates authorization and business rules to services, MongoDB remains the source of truth, and Redis distributes socket events across API instances. In production, host Nginx terminates TLS and forwards to the loopback-only Docker web proxy; MongoDB, Redis, and the API remain on a private Docker network.

Detailed endpoint, collection, event, consistency, and trade-off documentation lives in [System Design](docs/SYSTEM_DESIGN.md). The REST API table is under **REST API**, and the socket contract is under **Real-time communication → Events**.

## Backend local setup

Prerequisites: Node.js 20+, MongoDB, and Redis.

```bash
cd backend
cp .env.example .env
npm install
npm run seed

npm run dev
```

Before seeding, replace `JWT_SECRET` and `SEED_USER_PASSWORD` in `.env`. The API runs at `http://localhost:4000/api/v1` by default. Use the seeded email/password with `POST /auth/login`.

```bash
npm run lint
npm test
```

## Frontend local setup

Start the backend first, then open another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The web app runs at `http://localhost:5173`. Its API and socket URLs are configured independently through `VITE_API_URL` and `VITE_SOCKET_URL`.

Frontend state is divided into `auth`, `projects`, and normalized `tasks` Redux Toolkit slices. REST requests use async thunks. The isolated Socket.IO client dispatches the same task reducer actions used by HTTP responses, preventing the UI from maintaining a second real-time state model.

## Docker and deployment

Copy `.env.production.example` to `.env.production`, replace all secrets, and run:

```bash
docker compose --env-file .env.production up --build -d
```

See [Docker and VM Deployment](docs/DEPLOYMENT.md) for local containers, non-AWS/GCP VM setup, Nginx, DNS, Let's Encrypt SSL, GitHub Actions secrets, deployment, and rollback.

## Deployment URLs

- Frontend: pending infrastructure provisioning
- Backend health: pending infrastructure provisioning (`/api/v1/health`)
- Loom walkthrough: pending recording

For the two-project Vercel setup and required environment variables, see [Vercel deployment](VERCEL_DEPLOYMENT.md).

## AI usage declaration

AI assistance is being used for requirements analysis, architecture drafting, implementation, and test review. The repository owner must review and be able to explain every submitted design and code path; AI output is not treated as an authority or a substitute for engineering judgement.
