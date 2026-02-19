import { useState, useEffect } from "react";
import api from "../api";

function ActivityForm({ elderCode, userCode, onSuccess, onCancel }) {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    activity_name: "",
    schedule_time: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities/master');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/activities', {
        elder_code: elderCode,
        user_code: userCode,
        ...formData
      });
      alert('Activity scheduled successfully');
      onSuccess();
    } catch (err) {
      alert('Error scheduling activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
      <h4>Schedule Activity</h4>
      <form onSubmit={handleSubmit}>
        <select
          value={formData.activity_name}
          onChange={(e) => setFormData({...formData, activity_name: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        >
          <option value="">Select Activity</option>
          {activities.map((act) => (
            <option key={act.id} value={act.activity_name}>{act.activity_name}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={formData.schedule_time}
          onChange={(e) => setFormData({...formData, schedule_time: e.target.value})}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '8px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Scheduling...' : 'Schedule'}
          </button>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '8px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ActivityForm;
