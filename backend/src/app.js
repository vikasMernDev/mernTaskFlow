import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/authRoutes.js';
import { projectRouter } from './routes/projectRoutes.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use('/api/v1/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8' }));

app.get('/api/v1/health', (_req, res) => res.json({ data: { status: 'ok' } }));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', requireAuth, projectRouter);
app.use(notFoundHandler);
app.use(errorHandler);

