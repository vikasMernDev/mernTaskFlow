import { Task } from '../models/Task.js';
import { errors } from '../utils/AppError.js';
import { ensureAssigneeIsMember, requireProjectMember } from './projectAccessService.js';

export async function listTasks(projectId, userId) {
  await requireProjectMember(projectId, userId);
  return Task.find({ projectId }).sort({ updatedAt: -1 }).lean();
}

export async function getTask(projectId, taskId, userId) {
  await requireProjectMember(projectId, userId);
  const task = await Task.findOne({ _id: taskId, projectId });
  if (!task) throw errors.notFound('Task');
  return task;
}

export async function createTask(projectId, input, userId) {
  const project = await requireProjectMember(projectId, userId);
  ensureAssigneeIsMember(project, input.assigneeId);
  return Task.create({ ...input, projectId, createdBy: userId });
}

export async function updateTask(projectId, taskId, input, userId) {
  const project = await requireProjectMember(projectId, userId);
  ensureAssigneeIsMember(project, input.assigneeId);
  const task = await Task.findOne({ _id: taskId, projectId });
  if (!task) throw errors.notFound('Task');
  if (input.version !== undefined && input.version !== task.version) throw errors.conflict('Task changed; refresh and try again');
  const changes = { ...input };
  delete changes.version;
  Object.assign(task, changes);
  return task.save();
}

export async function deleteTask(projectId, taskId, userId) {
  const project = await requireProjectMember(projectId, userId);
  const task = await Task.findOne({ _id: taskId, projectId });
  if (!task) throw errors.notFound('Task');
  const isOwner = project.ownerId.toString() === userId.toString();
  const isCreator = task.createdBy.toString() === userId.toString();
  if (!isOwner && !isCreator) throw errors.forbidden('Only the task creator or project owner can delete this task');
  await task.deleteOne();
  return task;
}
