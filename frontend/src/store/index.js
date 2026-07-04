import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice.js';
import projects from './projectsSlice.js';
import tasks from './tasksSlice.js';

export const store = configureStore({ reducer: { auth, projects, tasks } });
