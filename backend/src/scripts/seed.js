import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { User } from '../models/User.js';

const name = process.env.SEED_USER_NAME || 'Demo Owner';
const email = (process.env.SEED_USER_EMAIL || 'owner@example.com').toLowerCase();
const password = process.env.SEED_USER_PASSWORD;

if (!password || password.length < 8) {
  console.error('SEED_USER_PASSWORD must contain at least 8 characters');
  process.exit(1);
}

await connectDatabase();
const passwordHash = await User.hashPassword(password);
await User.findOneAndUpdate({ email }, { name, email, passwordHash, active: true }, { upsert: true, new: true });
console.log(`Seeded ${email}`);
await disconnectDatabase();
