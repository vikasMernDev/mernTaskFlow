import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell.jsx';
import { Loading } from './components/Feedback.jsx';
import { BoardPage } from './pages/BoardPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { connectSocket, disconnectSocket } from './socket/socketClient.js';
import { restoreSession } from './store/authSlice.js';

function SessionBoundary() {
  const dispatch = useDispatch(); const { token, user, status } = useSelector((state) => state.auth);
  useEffect(() => { if (token && !user && status === 'idle') dispatch(restoreSession()); }, [dispatch, token, user, status]);
  useEffect(() => { if (token && user) connectSocket(token, dispatch); return () => disconnectSocket(); }, [dispatch, token, user]);
  if (!token) return <Navigate to="/login" replace />;
  if (!user) return status === 'failed' ? <Navigate to="/login" replace /> : <div className="center-page"><Loading label="Restoring session" /></div>;
  return <Outlet />;
}

export default function App() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route element={<SessionBoundary />}><Route element={<AppShell />}><Route path="/projects" element={<ProjectsPage />} /><Route path="/projects/:projectId" element={<BoardPage />} /></Route></Route><Route path="*" element={<Navigate to="/projects" replace />} /></Routes>;
}
