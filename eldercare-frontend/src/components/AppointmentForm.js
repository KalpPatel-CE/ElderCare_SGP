import { useState } from "react";
import api from "../api";

function AppointmentForm({ elderCode, userCode, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    doctor_name: "",
    department: "",
    hospital: "",
    appointment_time: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments', {
        elder_code: elderCode,
        user_code: userCode,
        ...formData
      });
      alert('Appointment added successfully');
      onSuccess();
    } catch (err) {
      alert('Error adding appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
      <h4>Add Appointment</h4>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Doctor Name"
          value={formData.doctor_name}
          onChange={(e) => setFormData({...formData, doctor_name: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <input
          placeholder="Department"
          value={formData.department}
          onChange={(e) => setFormData({...formData, department: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <input
          placeholder="Hospital"
          value={formData.hospital}
          onChange={(e) => setFormData({...formData, hospital: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <input
          type="datetime-local"
          value={formData.appointment_time}
          onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '8px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Adding...' : 'Add'}
          </button>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '8px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
