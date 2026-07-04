import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from './env.js';

let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (env.DNS_SERVERS) {
    dns.setServers(env.DNS_SERVERS.split(',').map((server) => server.trim()));
  }

  mongoose.set('strictQuery', true);
  connectionPromise ??= mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 })
    .then((connection) => {
      console.log('Database connected');
      return connection;
    })
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  connectionPromise = undefined;
  console.log('Database disconnected');
}
