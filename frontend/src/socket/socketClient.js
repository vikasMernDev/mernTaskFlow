import { io } from 'socket.io-client';
import { taskReceived, taskRemoved } from '../store/tasksSlice.js';

let socket;

export function connectSocket(token, dispatch) {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  if (!socketUrl) return undefined;

  if (socket) socket.disconnect();
  socket = io(socketUrl, { auth: { token } });
  socket.on('task:created', (task) => dispatch(taskReceived(task)));
  socket.on('task:updated', (task) => dispatch(taskReceived(task)));
  socket.on('task:deleted', ({ taskId }) => dispatch(taskRemoved(taskId)));
  return socket;
}

export function joinProject(projectId) {
  socket?.emit('project:join', { projectId }, (result) => {
    if (!result?.ok) console.error(result?.error?.message || 'Unable to join project updates');
  });
}

export function leaveProject(projectId) { socket?.emit('project:leave', { projectId }); }
export function disconnectSocket() { socket?.disconnect(); socket = undefined; }
