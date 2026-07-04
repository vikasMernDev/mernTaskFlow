import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { requireProjectMember } from '../services/projectAccessService.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { setSocketServer } from './emitter.js';

function socketError(code, message) {
  return { ok: false, error: { code, message } };
}

export async function initializeSockets(httpServer) {
  const io = new Server(httpServer, { cors: { origin: env.CLIENT_ORIGIN, credentials: true } });

  if (env.REDIS_URL) {
    const pubClient = createClient({ url: env.REDIS_URL });
    const subClient = pubClient.duplicate();
    pubClient.on('error', (error) => console.error('Redis publisher error', error));
    subClient.on('error', (error) => console.error('Redis subscriber error', error));
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use(async (socket, next) => {
    try {
      const payload = verifyAccessToken(socket.handshake.auth?.token);
      const user = await User.findOne({ _id: payload.sub, active: true }).select('_id name email');
      if (!user) return next(new Error('UNAUTHORIZED'));
      socket.user = user;
      next();
    } catch {
      next(new Error('UNAUTHORIZED'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('project:join', async ({ projectId } = {}, acknowledge = () => {}) => {
      try {
        await requireProjectMember(projectId, socket.user.id);
        await socket.join(`project:${projectId}`);
        acknowledge({ ok: true });
      } catch (error) {
        acknowledge(socketError(error.code || 'JOIN_FAILED', error.message || 'Unable to join project'));
      }
    });

    socket.on('project:leave', async ({ projectId } = {}, acknowledge = () => {}) => {
      await socket.leave(`project:${projectId}`);
      acknowledge({ ok: true });
    });
  });

  setSocketServer(io);
  return io;
}
