import { z } from 'zod';

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
export const projectParams = z.object({ projectId: objectId });
export const taskParams = z.object({ projectId: objectId, taskId: objectId });

export const loginBody = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128)
});

export const registerBody = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  password: z.string().min(8).max(128)
});

export const projectCreateBody = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).default('')
});

export const projectUpdateBody = projectCreateBody.partial().refine((body) => Object.keys(body).length > 0, {
  message: 'At least one field is required'
});

export const memberBody = z.object({ email: z.email().max(254), role: z.enum(['owner', 'member']).default('member') });
export const memberParams = z.object({ projectId: objectId, userId: objectId });

const taskFields = {
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(3000),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: objectId.nullable()
};

export const taskCreateBody = z.object({
  title: taskFields.title,
  description: taskFields.description.default(''),
  status: taskFields.status.default('todo'),
  priority: taskFields.priority.default('medium'),
  assigneeId: taskFields.assigneeId.default(null)
});

export const taskUpdateBody = z
  .object({ ...Object.fromEntries(Object.entries(taskFields).map(([key, value]) => [key, value.optional()])), version: z.number().int().nonnegative().optional() })
  .refine((body) => Object.keys(body).some((key) => key !== 'version'), { message: 'At least one task field is required' });
