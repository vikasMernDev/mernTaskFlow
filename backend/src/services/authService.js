import { User } from '../models/User.js';
import { errors } from '../utils/AppError.js';
import { signAccessToken } from '../utils/jwt.js';

function authResult(user) {
  return {
    accessToken: signAccessToken(user.id),
    user: { id: user.id, name: user.name, email: user.email }
  };
}

export async function register({ name, email, password }) {
  const normalizedEmail = email.toLowerCase();
  if (await User.exists({ email: normalizedEmail })) throw errors.conflict('An account with this email already exists');
  const user = await User.create({ name, email: normalizedEmail, passwordHash: await User.hashPassword(password) });
  return authResult(user);
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase(), active: true }).select('+passwordHash');
  if (!user || !(await user.verifyPassword(password))) throw errors.unauthorized('Invalid email or password');

  return authResult(user);
}
