import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { errors } from '../utils/AppError.js';

export async function requireActiveProject(projectId) {
  const project = await Project.findOne({ _id: projectId, archived: false });
  if (!project) throw errors.notFound('Project');
  return project;
}

export async function requireProjectMember(projectId, userId) {
  const project = await Project.findOne({
    _id: projectId,
    archived: false,
    'members.userId': userId
  });
  if (!project) throw errors.notFound('Project');
  return project;
}

export async function requireProjectOwner(projectId, userId) {
  const project = await requireActiveProject(projectId);
  if (project.ownerId.toString() !== userId.toString()) throw errors.forbidden('Project owner access required');
  return project;
}

export async function ensureAssigneeIsActiveUser(assigneeId) {
  if (!assigneeId) return;
  const user = await User.exists({ _id: assigneeId, active: true });
  if (!user) throw errors.badRequest('Assignee must be an active user');
}
