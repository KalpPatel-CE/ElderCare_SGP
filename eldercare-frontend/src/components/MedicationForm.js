import { useState } from "react";
import api from "../api";

function MedicationForm({ elderCode, userCode, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    medicine_name: "",
    dosage: "",
    frequency: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/medications', {
        elder_code: elderCode,
        user_code: userCode,
        ...formData
      });
      alert('Medication added successfully');
      onSuccess();
    } catch (err) {
      alert('Error adding medication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
      <h4>Add Medication</h4>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Medicine Name"
          value={formData.medicine_name}
          onChange={(e) => setFormData({...formData, medicine_name: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <input
          placeholder="Dosage (e.g., 500mg)"
          value={formData.dosage}
          onChange={(e) => setFormData({...formData, dosage: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <input
          placeholder="Frequency (e.g., Twice daily)"
          value={formData.frequency}
          onChange={(e) => setFormData({...formData, frequency: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <input
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({...formData, start_date: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <input
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({...formData, end_date: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '8px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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

export default MedicationForm;
