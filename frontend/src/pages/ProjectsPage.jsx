import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback.jsx';
import { createProject, fetchProjects } from '../store/projectsSlice.js';

export function ProjectsPage() {
  const dispatch = useDispatch(); const { items, status, error } = useSelector((state) => state.projects);
  const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ name: '', description: '' });
  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);
  const submit = async (event) => { event.preventDefault(); await dispatch(createProject(form)).unwrap(); setForm({ name: '', description: '' }); setShowForm(false); };

  return <><div className="page-heading"><div><span className="eyebrow">Workspace</span><h1>Projects</h1><p>Everything your team is moving forward.</p></div><button className="button" onClick={() => setShowForm(!showForm)}>+ New project</button></div>
    <ErrorMessage message={error} />
    {showForm && <form className="inline-form" onSubmit={submit}><input required minLength="2" maxLength="100" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input maxLength="1000" placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><button className="button">Create</button></form>}
    {status === 'loading' ? <Loading label="Loading projects" /> : items.length === 0 ? <EmptyState title="No projects yet" detail="Create your first project and invite the team." /> : <div className="project-grid">{items.map((project) => <Link className="project-card" to={`/projects/${project._id}`} key={project._id}><div className="project-symbol">{project.name[0].toUpperCase()}</div><div><h2>{project.name}</h2><p>{project.description || 'No description yet'}</p></div><footer><span>{project.members.length} member{project.members.length !== 1 && 's'}</span><span>Open board →</span></footer></Link>)}</div>}
  </>;
}
