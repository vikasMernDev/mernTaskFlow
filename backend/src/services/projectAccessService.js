import { Project } from '../models/Project.js';
import { errors } from '../utils/AppError.js';

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
  const project = await requireProjectMember(projectId, userId);
  if (project.ownerId.toString() !== userId.toString()) throw errors.forbidden('Project owner access required');
  return project;
}

export function ensureAssigneeIsMember(project, assigneeId) {
  if (!assigneeId) return;
  const isMember = project.members.some((member) => member.userId.toString() === assigneeId.toString());
  if (!isMember) throw errors.badRequest('Assignee must be a project member');
}
