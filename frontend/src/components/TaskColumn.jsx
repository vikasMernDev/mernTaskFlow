import { TaskCard } from './TaskCard.jsx';

export function TaskColumn({ title, status, tasks, onDropTask, onDelete }) {
  return <section className="task-column" onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDropTask(event.dataTransfer.getData('text/task-id'), status)}>
    <header><div><span className={`status-dot ${status}`} />{title}</div><span className="count">{tasks.length}</span></header>
    <div className="task-stack">
      {tasks.map((task) => <TaskCard key={task._id} task={task} onDelete={onDelete} />)}
      {tasks.length === 0 && <div className="column-empty">Drop tasks here</div>}
    </div>
  </section>;
}
