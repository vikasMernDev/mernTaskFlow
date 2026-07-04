import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/client.js';

const tasksAdapter = createEntityAdapter({ selectId: (task) => task._id, sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt) });
export const fetchTasks = createAsyncThunk('tasks/list', async (projectId) => (await api.get(`/projects/${projectId}/tasks`)).data.data);
export const createTask = createAsyncThunk('tasks/create', async ({ projectId, input }) => (await api.post(`/projects/${projectId}/tasks`, input)).data.data);
export const updateTask = createAsyncThunk('tasks/update', async ({ projectId, taskId, input }) => (await api.patch(`/projects/${projectId}/tasks/${taskId}`, input)).data.data);
export const deleteTask = createAsyncThunk('tasks/delete', async ({ projectId, taskId }) => { await api.delete(`/projects/${projectId}/tasks/${taskId}`); return taskId; });

const initialState = tasksAdapter.getInitialState({ status: 'idle', error: null });
const tasksSlice = createSlice({
  name: 'tasks', initialState,
  reducers: {
    taskReceived(state, action) {
      const current = state.entities[action.payload._id];
      if (!current || action.payload.version >= current.version) tasksAdapter.upsertOne(state, action.payload);
    },
    taskRemoved: tasksAdapter.removeOne,
    clearTasks: tasksAdapter.removeAll
  },
  extraReducers: (builder) => builder
    .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(fetchTasks.fulfilled, (state, action) => { state.status = 'succeeded'; tasksAdapter.setAll(state, action.payload); })
    .addCase(fetchTasks.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
    .addCase(createTask.fulfilled, tasksAdapter.upsertOne)
    .addCase(createTask.rejected, (state, action) => { state.error = action.error.message; })
    .addCase(updateTask.fulfilled, tasksAdapter.upsertOne)
    .addCase(updateTask.rejected, (state, action) => { state.error = action.error.message; })
    .addCase(deleteTask.fulfilled, tasksAdapter.removeOne)
    .addCase(deleteTask.rejected, (state, action) => { state.error = action.error.message; })
});

export const { taskReceived, taskRemoved, clearTasks } = tasksSlice.actions;
export const taskSelectors = tasksAdapter.getSelectors((state) => state.tasks);
export default tasksSlice.reducer;
