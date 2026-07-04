import assert from 'node:assert/strict';
import test from 'node:test';
import { loginBody, registerBody, taskCreateBody, taskUpdateBody } from '../src/validation/schemas.js';

test('login validation accepts a valid credential payload', () => {
  assert.equal(loginBody.safeParse({ email: 'owner@example.com', password: 'ChangeMe123!' }).success, true);
});

test('registration validation trims a valid user and rejects short passwords', () => {
  const result = registerBody.parse({ name: '  User B  ', email: 'userb@example.com', password: 'UserB123!' });
  assert.equal(result.name, 'User B');
  assert.equal(registerBody.safeParse({ name: 'User B', email: 'userb@example.com', password: 'short' }).success, false);
});

test('task creation supplies board defaults', () => {
  const result = taskCreateBody.parse({ title: 'Design API' });
  assert.deepEqual(result, {
    title: 'Design API', description: '', status: 'todo', priority: 'medium', assigneeId: null
  });
});

test('task update rejects a version without a field change', () => {
  assert.equal(taskUpdateBody.safeParse({ version: 2 }).success, false);
});
