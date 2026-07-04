const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' };

export function TaskCard({ task, onDelete }) {
  return <article className="task-card" draggable onDragStart={(event) => event.dataTransfer.setData('text/task-id', task._id)}>
    <div className="task-meta"><span className={`priority priority-${task.priority}`}>{priorityLabels[task.priority]}</span><button className="icon-button" title="Delete task" onClick={() => onDelete(task)}>×</button></div>
    <h3>{task.title}</h3>
    {task.description && <p>{task.description}</p>}
    <div className="task-footer"><span className="mini-avatar">{task.assigneeId ? 'A' : '–'}</span><span>#{task._id.slice(-5).toUpperCase()}</span></div>
  </article>;
}
