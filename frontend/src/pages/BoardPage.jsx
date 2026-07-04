import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage, Loading } from '../components/Feedback.jsx';
import { TaskColumn } from '../components/TaskColumn.jsx';
import { TaskForm } from '../components/TaskForm.jsx';
import { joinProject, leaveProject } from '../socket/socketClient.js';
import { fetchProject } from '../store/projectsSlice.js';
import { createTask, deleteTask, fetchTasks, taskSelectors, updateTask } from '../store/tasksSlice.js';

const columns = [{ status: 'todo', title: 'Todo' }, { status: 'in_progress', title: 'In progress' }, { status: 'done', title: 'Done' }];

export function BoardPage() {
  const { projectId } = useParams(); const dispatch = useDispatch(); const [showForm, setShowForm] = useState(false);
  const project = useSelector((state) => state.projects.current); const tasks = useSelector(taskSelectors.selectAll);
  const { status, error } = useSelector((state) => state.tasks);
  useEffect(() => { dispatch(fetchProject(projectId)); dispatch(fetchTasks(projectId)).then(() => joinProject(projectId)); return () => leaveProject(projectId); }, [dispatch, projectId]);

  const moveTask = (taskId, nextStatus) => { const task = tasks.find((item) => item._id === taskId); if (task && task.status !== nextStatus) dispatch(updateTask({ projectId, taskId, input: { status: nextStatus, version: task.version } })); };
  const remove = (task) => { if (window.confirm(`Delete “${task.title}”?`)) dispatch(deleteTask({ projectId, taskId: task._id })); };

  return <><Link className="back-link" to="/projects">← All projects</Link><div className="page-heading board-heading"><div><span className="eyebrow">Live task board</span><h1>{project?._id === projectId ? project.name : 'Project'}</h1><p>{project?._id === projectId ? project.description : 'Loading project details…'}</p></div><div className="board-actions"><span className="live-pill"><span />Live</span><button className="button" onClick={() => setShowForm(true)}>+ Add task</button></div></div><ErrorMessage message={error} />
    {status === 'loading' ? <Loading label="Loading board" /> : <div className="board">{columns.map((column) => <TaskColumn key={column.status} {...column} tasks={tasks.filter((task) => task.status === column.status)} onDropTask={moveTask} onDelete={remove} />)}</div>}
    {showForm && <TaskForm onClose={() => setShowForm(false)} onSubmit={(input) => dispatch(createTask({ projectId, input })).unwrap()} />}
  </>;
}
