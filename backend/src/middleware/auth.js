import { User } from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { errors } from '../utils/AppError.js';

export async function requireAuth(req, _res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) throw errors.unauthorized();

    const payload = verifyAccessToken(token);
    const user = await User.findOne({ _id: payload.sub, active: true }).select('_id name email');
    if (!user) throw errors.unauthorized('User is no longer active');

    req.user = user;
    next();
  } catch (error) {
    if (error.isOperational) return next(error);
    next(errors.unauthorized('Invalid or expired access token'));
  }
}
