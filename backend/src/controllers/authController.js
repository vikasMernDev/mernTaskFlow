import * as authService from '../services/authService.js';

export async function login(req, res) {
  res.json({ data: await authService.login(req.body) });
}

export async function register(req, res) {
  res.status(201).json({ data: await authService.register(req.body) });
}

export function me(req, res) {
  res.json({ data: { id: req.user.id, name: req.user.name, email: req.user.email } });
}
