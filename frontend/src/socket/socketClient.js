import { io } from 'socket.io-client';
import { taskReceived, taskRemoved } from '../store/tasksSlice.js';

let socket;

export function connectSocket(token, dispatch) {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  if (!socketUrl && !import.meta.env.DEV) return undefined;

  if (socket) socket.disconnect();
  socket = socketUrl ? io(socketUrl, { auth: { token } }) : io({ auth: { token } });
  socket.on('connect_error', (error) => console.error('Socket connection failed:', error.message));
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
