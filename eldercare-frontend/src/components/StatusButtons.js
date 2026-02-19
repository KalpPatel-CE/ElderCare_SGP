import { useState } from "react";
import api from "../api";

function StatusButtons({ elderCode, medication, onStatusUpdate }) {
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState(false);

  const handleStatus = async (status) => {
    setLoading(true);
    try {
      await api.post('/events', {
        elder_code: elderCode,
        event_type: 'medicine',
        ref_id: medication.id,
        status: status,
        notes: `${medication.medicine_name} - ${medication.dosage}`
      });
      setMarked(true);
      alert(`Marked as ${status}`);
      onStatusUpdate();
    } catch (err) {
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-buttons">
      <button
        onClick={() => handleStatus('taken')}
        disabled={loading || marked}
        className="btn-status taken"
      >
        {loading ? '...' : '✓ Mark Taken'}
      </button>
      <button
        onClick={() => handleStatus('missed')}
        disabled={loading || marked}
        className="btn-status missed"
      >
        {loading ? '...' : '✗ Mark Missed'}
      </button>
    </div>
  );
}

export default StatusButtons;
