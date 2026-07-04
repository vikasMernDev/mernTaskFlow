import { errors } from '../utils/AppError.js';

export const validate = (schemas) => (req, _res, next) => {
  for (const [location, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(req[location]);
    if (!result.success) {
      return next(errors.badRequest('Validation failed', result.error.flatten()));
    }
    req[location] = result.data;
  }
  next();
};
