import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice.js';
import { disconnectSocket } from '../socket/socketClient.js';

export function AppShell() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    disconnectSocket();
    dispatch(logout());
    navigate('/login');
  };

  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/projects"><span className="brand-mark">N</span><span>Northstar</span></Link>
      <div className="user-menu"><span className="avatar">{user?.name?.[0]?.toUpperCase()}</span><span>{user?.name}</span><button className="text-button" onClick={signOut}>Sign out</button></div>
    </header>
    <main className="page"><Outlet /></main>
  </div>;
}
