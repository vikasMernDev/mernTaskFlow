import * as projectService from '../services/projectService.js';

export async function list(req, res) {
  res.json({ data: await projectService.listProjects(req.user.id) });
}

export async function create(req, res) {
  res.status(201).json({ data: await projectService.createProject(req.body, req.user.id) });
}

export async function get(req, res) {
  res.json({ data: await projectService.getProject(req.params.projectId, req.user.id) });
}

export async function update(req, res) {
  res.json({ data: await projectService.updateProject(req.params.projectId, req.body, req.user.id) });
}

export async function archive(req, res) {
  await projectService.archiveProject(req.params.projectId, req.user.id);
  res.status(204).end();
}

export async function upsertMember(req, res) {
  res.json({ data: await projectService.upsertMember(req.params.projectId, req.body, req.user.id) });
}

export async function removeMember(req, res) {
  res.json({ data: await projectService.removeMember(req.params.projectId, req.params.userId, req.user.id) });
}
