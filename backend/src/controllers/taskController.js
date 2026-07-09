import * as taskService from '../services/taskService.js';
import { emitToProject } from '../sockets/emitter.js';

export async function list(req, res) {
  res.json({ data: await taskService.listTasks(req.params.projectId) });
}

export async function get(req, res) {
  res.json({ data: await taskService.getTask(req.params.projectId, req.params.taskId) });
}

export async function create(req, res) {
  const task = await taskService.createTask(req.params.projectId, req.body, req.user.id);
  emitToProject(req.params.projectId, 'task:created', task.toJSON());
  res.status(201).json({ data: task });
}

export async function update(req, res) {
  const task = await taskService.updateTask(req.params.projectId, req.params.taskId, req.body);
  emitToProject(req.params.projectId, 'task:updated', task.toJSON());
  res.json({ data: task });
}

export async function remove(req, res) {
  const task = await taskService.deleteTask(req.params.projectId, req.params.taskId, req.user.id);
  emitToProject(req.params.projectId, 'task:deleted', { projectId: req.params.projectId, taskId: task.id });
  res.status(204).end();
}
