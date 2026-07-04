import { createServer } from 'node:http';
import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { initializeSockets } from './sockets/index.js';

const httpServer = createServer(app);

async function start() {
  await connectDatabase();
  await initializeSockets(httpServer);
  httpServer.listen(env.PORT, () => console.log(`API listening on port ${env.PORT}`));
}

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  httpServer.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((error) => {
  console.error('Failed to start API', error);
  process.exit(1);
});
