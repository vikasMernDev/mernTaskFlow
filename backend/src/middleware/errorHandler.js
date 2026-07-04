import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, _res, next) {
  next(new AppError(404, 'ROUTE_NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(error, _req, res, _next) {
  let normalized = error;

  if (error instanceof mongoose.Error.CastError) {
    normalized = new AppError(400, 'INVALID_ID', 'Invalid resource identifier');
  } else if (error?.code === 11000) {
    normalized = new AppError(409, 'DUPLICATE_VALUE', 'A record with that value already exists');
  }

  const operational = normalized.isOperational;
  const status = operational ? normalized.status : 500;
  if (!operational) console.error(normalized);

  res.status(status).json({
    error: {
      code: operational ? normalized.code : 'INTERNAL_ERROR',
      message: operational ? normalized.message : 'An unexpected error occurred',
      ...(operational && normalized.details ? { details: normalized.details } : {})
    }
  });
}
