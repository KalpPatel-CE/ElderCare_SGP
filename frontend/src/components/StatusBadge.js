import './StatusBadge.css';

function StatusBadge({ status, children }) {
  const statusMap = {
    completed: 'completed',
    pending: 'pending',
    missed: 'missed',
    alert: 'alert',
    info: 'info',
    active: 'completed',
    confirmed: 'completed',
    rejected: 'missed',
    verified: 'completed',
    available: 'completed',
    assigned: 'assigned',
    unavailable: 'pending',
    unverified: 'alert'
  };

  const badgeClass = statusMap[status?.toLowerCase()] || 'pending';

  return (
    <span className={`status-badge status-badge-${badgeClass}`}>
      {children || status}
    </span>
  );
}

export default StatusBadge;
