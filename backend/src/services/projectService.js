import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { errors } from '../utils/AppError.js';
import { requireProjectMember, requireProjectOwner } from './projectAccessService.js';

export function listProjects(userId) {
  return Project.find({ archived: false, 'members.userId': userId })
    .select('name description ownerId members createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .lean();
}

export async function createProject(input, userId) {
  return Project.create({ ...input, ownerId: userId, members: [{ userId, role: 'owner' }] });
}

export async function getProject(projectId, userId) {
  return requireProjectMember(projectId, userId);
}

export async function updateProject(projectId, input, userId) {
  const project = await requireProjectOwner(projectId, userId);
  Object.assign(project, input);
  return project.save();
}

export async function archiveProject(projectId, userId) {
  const project = await requireProjectOwner(projectId, userId);
  project.archived = true;
  await project.save();
  return project;
}

export async function upsertMember(projectId, input, userId) {
  const project = await requireProjectOwner(projectId, userId);
  const memberUser = await User.findOne({ email: input.email.toLowerCase(), active: true });
  if (!memberUser) throw errors.notFound('User');
  if (memberUser.id === project.ownerId.toString() && input.role !== 'owner') {
    throw errors.badRequest('The project owner role cannot be changed');
  }

  const member = project.members.find((item) => item.userId.toString() === memberUser.id);
  if (member) member.role = input.role;
  else project.members.push({ userId: memberUser.id, role: input.role });
  await project.save();
  return project;
}

export async function removeMember(projectId, memberUserId, userId) {
  const project = await requireProjectOwner(projectId, userId);
  if (project.ownerId.toString() === memberUserId) throw errors.badRequest('The project owner cannot be removed');
  const before = project.members.length;
  project.members = project.members.filter((item) => item.userId.toString() !== memberUserId);
  if (before === project.members.length) throw errors.notFound('Project member');
  await project.save();
  await Task.updateMany({ projectId, assigneeId: memberUserId }, { $set: { assigneeId: null } });
  return project;
}
