# Vercel deployment

The repository deploys as two Vercel projects: one rooted at `backend` and one rooted at `frontend`.

## Before deployment

1. In MongoDB Atlas, create a database user with read/write access.
2. In Atlas Network Access, allow `0.0.0.0/0` for Vercel's dynamic outbound addresses.
3. Keep `.env`, `.env.local`, and all credentials out of Git.

## Backend project

Import the repository into Vercel and select `backend` as the Root Directory. Add these variables to Production and Preview as appropriate:

```text
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/project_management?retryWrites=true&w=majority
JWT_SECRET=<random-secret-at-least-32-characters>
JWT_EXPIRES_IN=1h
JWT_ISSUER=project-management-api
CLIENT_ORIGIN=https://<frontend-project>.vercel.app
```

Do not set `DNS_SERVERS` on Vercel. Leave `REDIS_URL` unset because the Vercel entry point serves REST requests without the persistent Socket.IO server.

After deployment, verify:

```text
https://<backend-project>.vercel.app/api/v1/health
```

## Frontend project

Import the same repository a second time and select `frontend` as the Root Directory. Vercel should detect Vite. Add:

```text
VITE_API_URL=https://<backend-project>.vercel.app/api/v1
```

Do not set `VITE_SOCKET_URL` while the backend is hosted on Vercel. The UI will continue to use REST without realtime cross-client events.

After deploying the frontend, update the backend's `CLIENT_ORIGIN` to the exact frontend production URL and redeploy the backend.

## Realtime deployment option

For persistent Socket.IO events, deploy the backend container to a long-running host such as Render, Railway, Fly.io, or a VPS, provision Redis, and set `VITE_SOCKET_URL` to that backend origin. The frontend can remain on Vercel.
