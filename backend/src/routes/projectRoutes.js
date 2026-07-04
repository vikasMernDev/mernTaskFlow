import { Router } from 'express';
import * as projects from '../controllers/projectController.js';
import * as tasks from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  memberBody, memberParams, projectCreateBody, projectParams, projectUpdateBody,
  taskCreateBody, taskParams, taskUpdateBody
} from '../validation/schemas.js';

export const projectRouter = Router();

projectRouter.route('/').get(asyncHandler(projects.list)).post(validate({ body: projectCreateBody }), asyncHandler(projects.create));
projectRouter
  .route('/:projectId')
  .get(validate({ params: projectParams }), asyncHandler(projects.get))
  .patch(validate({ params: projectParams, body: projectUpdateBody }), asyncHandler(projects.update))
  .delete(validate({ params: projectParams }), asyncHandler(projects.archive));
projectRouter.post('/:projectId/members', validate({ params: projectParams, body: memberBody }), asyncHandler(projects.upsertMember));
projectRouter.delete('/:projectId/members/:userId', validate({ params: memberParams }), asyncHandler(projects.removeMember));

projectRouter
  .route('/:projectId/tasks')
  .get(validate({ params: projectParams }), asyncHandler(tasks.list))
  .post(validate({ params: projectParams, body: taskCreateBody }), asyncHandler(tasks.create));
projectRouter
  .route('/:projectId/tasks/:taskId')
  .get(validate({ params: taskParams }), asyncHandler(tasks.get))
  .patch(validate({ params: taskParams, body: taskUpdateBody }), asyncHandler(tasks.update))
  .delete(validate({ params: taskParams }), asyncHandler(tasks.remove));
