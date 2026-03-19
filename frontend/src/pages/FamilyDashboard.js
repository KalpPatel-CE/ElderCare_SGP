import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './FamilyDashboard.css';

function FamilyDashboard() {
  const [elders, setElders] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(user);
    fetchElders();
  }, []);

  const fetchElders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await api.get(`/elders/user/${user.user_code}`);
      setElders(res.data);
    } catch (err) {
      console.error('Error fetching elders:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const addMedication = async (elderCode, data) => {
    await api.post(`/medications/${elderCode}`, data);
    fetchElders();
  };

  const updateMedicationStatus = async (id, status) => {
    await api.put(`/medications/${id}`, { status });
    fetchElders();
  };

  const addActivity = async (elderCode, data) => {
    await api.post(`/activities/${elderCode}`, data);
    fetchElders();
  };

  const addAppointment = async (elderCode, data) => {
    await api.post(`/appointments/${elderCode}`, data);
    fetchElders();
  };

  return (
    <div className="family-dashboard page-fade-in">
      <nav className="family-navbar">
        <div className="nav-content">
          <Link to="/" className="nav-home">← Elder Care Home</Link>
          <div className="nav-tabs">
            <span className="nav-tab active">Dashboard</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="family-content">
        <div className="welcome-banner">
          <h1>Hello, {user?.full_name || user?.user_code} 👋</h1>
          <p>Your loved ones are being cared for</p>
        </div>

        {(elders || []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>📋 No elders assigned yet</p>
          </div>
        ) : (
          (elders || []).map(elder => (
            <ElderSection
              key={elder.elder_code}
              elder={elder}
              onAddMedication={addMedication}
              onUpdateMedStatus={updateMedicationStatus}
              onAddActivity={addActivity}
              onAddAppointment={addAppointment}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ElderSection({ elder, onAddMedication, onUpdateMedStatus, onAddActivity, onAddAppointment }) {
  const [showMedForm, setShowMedForm] = useState(false);
  const [showActForm, setShowActForm] = useState(false);
  const [showApptForm, setShowApptForm] = useState(false);
  const [medications, setMedications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchData();
  }, [elder.elder_code]);

  const fetchData = async () => {
    try {
      const [medRes, actRes, apptRes] = await Promise.all([
        api.get(`/medications/elder/${elder.elder_code}`),
        api.get(`/activities/elder/${elder.elder_code}`),
        api.get(`/appointments/elder/${elder.elder_code}`)
      ]);
      setMedications(medRes.data);
      setActivities(actRes.data);
      setAppointments(apptRes.data);
    } catch (err) {}
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EL';
  };

  return (
    <div className="elder-section">
      <div className="elder-profile-card card">
        <div className="elder-avatar">{getInitials(elder.name)}</div>
        <div className="elder-info">
          <h2>{elder.name}</h2>
          <p>{elder.age} years • {elder.gender}</p>
        </div>
      </div>

      <div className="section-grid">
        <div className="section-card card">
          <div className="section-header">
            <h3>💊 Medications</h3>
            <button className="btn-accent btn-sm" onClick={() => setShowMedForm(!showMedForm)}>+ Add</button>
          </div>
          {showMedForm && <MedicationForm elderCode={elder.elder_code} onSubmit={(d) => { onAddMedication(elder.elder_code, d); setShowMedForm(false); fetchData(); }} />}
          <div className="pill-cards">
            {(medications || []).map(med => (
              <div key={med.id} className="pill-card">
                <div className="pill-info">
                  <strong>{med.medicine_name}</strong>
                  <span>{med.dosage} • {med.frequency}</span>
                </div>
                <div className="pill-actions">
                  <button className="btn-taken" onClick={() => { onUpdateMedStatus(med.id, 'taken'); fetchData(); }}>✅ Taken</button>
                  <button className="btn-missed" onClick={() => { onUpdateMedStatus(med.id, 'missed'); fetchData(); }}>❌ Missed</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card card">
          <div className="section-header">
            <h3>🏃 Activities</h3>
            <button className="btn-accent btn-sm" onClick={() => setShowActForm(!showActForm)}>+ Add</button>
          </div>
          {showActForm && <ActivityForm elderCode={elder.elder_code} onSubmit={(d) => { onAddActivity(elder.elder_code, d); setShowActForm(false); fetchData(); }} />}
          <div className="activity-timeline">
            {(activities || []).map(act => (
              <div key={act.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <strong>{act.activity_type}</strong>
                  <span>{new Date(act.scheduled_time).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card card">
          <div className="section-header">
            <h3>📅 Appointments</h3>
            <button className="btn-accent btn-sm" onClick={() => setShowApptForm(!showApptForm)}>+ Add</button>
          </div>
          {showApptForm && <AppointmentForm elderCode={elder.elder_code} onSubmit={(d) => { onAddAppointment(elder.elder_code, d); setShowApptForm(false); fetchData(); }} />}
          <div className="appointment-list">
            {(appointments || []).map(appt => (
              <div key={appt.id} className="appointment-card">
                <div className="appt-date">{new Date(appt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <div className="appt-details">
                  <strong>{appt.doctor_name}</strong>
                  <span>{appt.hospital_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicationForm({ elderCode, onSubmit }) {
  const [data, setData] = useState({ medicine_name: '', dosage: '', frequency: '' });
  return (
    <form className="inline-form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <input placeholder="Medicine" value={data.medicine_name} onChange={(e) => setData({ ...data, medicine_name: e.target.value })} required />
      <input placeholder="Dosage" value={data.dosage} onChange={(e) => setData({ ...data, dosage: e.target.value })} required />
      <input placeholder="Frequency" value={data.frequency} onChange={(e) => setData({ ...data, frequency: e.target.value })} required />
      <button type="submit" className="btn-accent btn-sm">Save</button>
    </form>
  );
}

function ActivityForm({ elderCode, onSubmit }) {
  const [data, setData] = useState({ activity_type: '', scheduled_time: '' });
  return (
    <form className="inline-form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <input placeholder="Activity Type" value={data.activity_type} onChange={(e) => setData({ ...data, activity_type: e.target.value })} required />
      <input type="datetime-local" value={data.scheduled_time} onChange={(e) => setData({ ...data, scheduled_time: e.target.value })} required />
      <button type="submit" className="btn-accent btn-sm">Save</button>
    </form>
  );
}

function AppointmentForm({ elderCode, onSubmit }) {
  const [data, setData] = useState({ doctor_name: '', hospital_name: '', appointment_date: '' });
  return (
    <form className="inline-form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <input placeholder="Doctor Name" value={data.doctor_name} onChange={(e) => setData({ ...data, doctor_name: e.target.value })} required />
      <input placeholder="Hospital" value={data.hospital_name} onChange={(e) => setData({ ...data, hospital_name: e.target.value })} required />
      <input type="datetime-local" value={data.appointment_date} onChange={(e) => setData({ ...data, appointment_date: e.target.value })} required />
      <button type="submit" className="btn-accent btn-sm">Save</button>
    </form>
  );
}

export default FamilyDashboard;
