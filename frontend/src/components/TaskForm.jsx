import { useState } from 'react';
import { ErrorMessage } from './Feedback.jsx';

const initial = { title: '', description: '', priority: 'medium', status: 'todo' };

export function TaskForm({ onSubmit, onClose }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(null);
    try { await onSubmit(form); onClose(); } catch (reason) { setError(reason.message); setSaving(false); }
  };

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="modal" onSubmit={submit}>
      <div className="modal-header"><div><span className="eyebrow">New work item</span><h2>Create task</h2></div><button type="button" className="icon-button large" onClick={onClose}>×</button></div>
      <ErrorMessage message={error} />
      <label>Title<input autoFocus required maxLength="160" name="title" value={form.title} onChange={change} placeholder="What needs to be done?" /></label>
      <label>Description<textarea maxLength="3000" name="description" value={form.description} onChange={change} placeholder="Add useful context" rows="4" /></label>
      <div className="form-row"><label>Priority<select name="priority" value={form.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label>Status<select name="status" value={form.status} onChange={change}><option value="todo">Todo</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label></div>
      <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button" disabled={saving}>{saving ? 'Creating…' : 'Create task'}</button></div>
    </form>
  </div>;
}
