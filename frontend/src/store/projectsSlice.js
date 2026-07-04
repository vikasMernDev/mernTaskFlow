import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/client.js';

export const fetchProjects = createAsyncThunk('projects/list', async () => (await api.get('/projects')).data.data);
export const createProject = createAsyncThunk('projects/create', async (input) => (await api.post('/projects', input)).data.data);
export const fetchProject = createAsyncThunk('projects/get', async (id) => (await api.get(`/projects/${id}`)).data.data);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { items: [], current: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchProjects.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(fetchProjects.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
    .addCase(fetchProjects.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
    .addCase(createProject.fulfilled, (state, action) => { state.items.unshift(action.payload); })
    .addCase(fetchProject.fulfilled, (state, action) => { state.current = action.payload; })
    .addCase(fetchProject.rejected, (state, action) => { state.error = action.error.message; })
});

export default projectsSlice.reducer;
