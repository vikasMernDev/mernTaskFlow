export function Loading({ label = 'Loading' }) {
  return <div className="feedback"><span className="spinner" />{label}…</div>;
}

export function ErrorMessage({ message }) {
  return message ? <div className="error-banner" role="alert">{message}</div> : null;
}

export function EmptyState({ title, detail }) {
  return <div className="empty-state"><div className="empty-icon">✦</div><h3>{title}</h3><p>{detail}</p></div>;
}
