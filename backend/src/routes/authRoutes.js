import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginBody, registerBody } from '../validation/schemas.js';

export const authRouter = Router();
authRouter.post('/register', validate({ body: registerBody }), asyncHandler(controller.register));
authRouter.post('/login', validate({ body: loginBody }), asyncHandler(controller.login));
authRouter.get('/me', requireAuth, controller.me);
