function EventCard({ event }) {
  const statusClass = event.status === 'missed' ? 'missed' : 'taken';

  return (
    <div className={`event-card ${statusClass}`}>
      <div className="event-header">
        <div className="event-type">{event.event_type}</div>
        <span className={`event-badge ${statusClass}`}>{event.status}</span>
      </div>
      <div className="event-time">
        {new Date(event.event_time).toLocaleTimeString()}
      </div>
      {event.notes && <div style={{ fontSize: '13px', marginTop: '8px', color: '#6b7280' }}>{event.notes}</div>}
    </div>
  );
}

export default EventCard;
