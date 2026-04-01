import './EmptyState.css';

function EmptyState({ icon, message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="var(--teal-600)" strokeWidth="2"/>
            <path d="M12 16L14 18L20 14" stroke="var(--teal-600)" strokeWidth="2"/>
          </svg>
        )}
      </div>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}

export default EmptyState;
