function AlertCard({ alert }) {
  return (
    <div className="alert-card">
      <div className="alert-message">⚠️ {alert.message}</div>
      <div className="alert-time">{new Date(alert.created_at).toLocaleString()}</div>
    </div>
  );
}

export default AlertCard;
