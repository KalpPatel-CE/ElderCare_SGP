import './AppointmentEntry.css';

function AppointmentEntry({ appointment, onChange, onRemove }) {
  const handleChange = (field, value) => {
    onChange({ ...appointment, [field]: value });
  };

  return (
    <div className="appointment-entry">
      <div className="appointment-fields">
        <input
          type="text"
          className="form-input"
          placeholder="Title"
          value={appointment.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Doctor name"
          value={appointment.doctor_name || ''}
          onChange={(e) => handleChange('doctor_name', e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Hospital"
          value={appointment.hospital || ''}
          onChange={(e) => handleChange('hospital', e.target.value)}
        />
        <input
          type="datetime-local"
          className="form-input"
          value={appointment.appointment_time || ''}
          onChange={(e) => handleChange('appointment_time', e.target.value)}
        />
      </div>
      <button type="button" className="appointment-remove" onClick={onRemove}>×</button>
    </div>
  );
}

export default AppointmentEntry;
